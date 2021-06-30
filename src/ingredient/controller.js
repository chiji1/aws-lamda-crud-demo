const AWS = require('aws-sdk');
const uuid =  require('uuid');
const { schemaCreate, schemaUpdate } = require('./model');
const { success, fail } = require('../utils')
const fs = require('fs');
// const Buffer = require('buffer');
const dotenv = require('dotenv');
dotenv.config();

const config = {
    accessKeyId: String(process.env.AWS_ACCESS_KEY_ID).trim(),
    secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY).trim(),
    region: 'us-east-2'
}
AWS.config.update(config);
const s3Bucket = new AWS.S3( { params: {Bucket: 'chiji-rest-bucket'} } );

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function fetchRecords(req, res) {
    try {
        console.log('in fetch');
        const params = {
            TableName: 'ingredients'
        }
        dynamoDb.scan(params, (error, data) => {
            if (error) {
                console.log(error);
                return fail(res, 422, error.message);
            }
            const response =  {
                statusCode: 200,
                body: data.Items
            }

            return success(res, 200, data.Items, 'Ingredient retrieved successfully');
        });
    } catch (e) {
        res.status(500).json({
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not fetch the user.'
        });
    }
}

async function fetchSingleRecord(req, res) {
    try {
        let { recordId }  = req.params;
        console.log('in fetch');
        const params = {
            TableName: 'ingredients',
            Key: {
                id: recordId
            }
        }
        dynamoDb.get(params, (error, data) => {
            if (error) {
                console.log(error);
                return fail(res, 422, error.message);
            }

            return success(res, 200, data.Item, 'Ingredient retrieved successfully');
        });
    } catch (e) {
        res.status(500).json({
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not fetch the user.'
        });
    }
}

async function createRecords(req, res) {
    try {
        const data = req.body;
        const  { error } = schemaCreate.validate(data);
        if (error) {
            return fail(res, 422, `Error validating data. ${error.message}`);
        }
        const buf = new Buffer(data.image.replace(/^data:image\/\w+;base64,/, ""),'base64');
        const imageData = {
            Key: `images/${new Date().getTime()}.jpeg`,
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
        };
        s3Bucket.putObject(imageData, function(err, data){
            if (err) {
                console.log(err);
                console.log('Error uploading data: ', data);
            } else {
                console.log('Image response data -> ', data.location);
                console.log('successfully uploaded the image!');
            }
        });
        // data.image = await uploadFileToS3(path);

        const params = {
            TableName: 'ingredients',
            Item: {
                id: uuid.v1(),
                title: data.title,
                image: data.image,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        }

        dynamoDb.put(params, (error, data) => {
            if (error) {
                console.log(error);
                return fail(res, 422, error.message);
            }

            return success(res, 200, data.Item, 'Ingredient created successfully');
        });
    } catch (e) {
        return fail(res, 500, `Error creating record. ${e.message}`);
    }
}

const uploadFileToS3 = async (
    filePath,
    deleteAfterUpload = false,
) => {
    try {
        const awsConfigOptions = {
            accessKeyId: String(process.env.AWS_ACCESS_KEY_ID).trim(),
            secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY).trim(),
        };
        const s3 = new AWS.S3(awsConfigOptions);
        //Create a readstream for the uploaded files
        const createdReadStream = fs.createReadStream(filePath);

        //Create AWS Params object
        const awsBucketParams = {
            Bucket: String(process.env.AWS_BUCKET_NAME).trim(),
            Key: `${String(process.env.AWS_KEY_NAME).trim()}/${filePath}`,
            Body: createdReadStream,
        };

        //Upload file to AWS storage bucket
        const result = await s3.upload(awsBucketParams).promise();

        if (result && deleteAfterUpload) {
            fs.unlinkSync(filePath);
        }
        return result.Location;
    } catch (ex) {
        throw ex;
    }
};

async function updateRecords(req, res) {
    try {
        const { recordId } = req.params;
        const data = req.body;
        const  { error } = schemaUpdate.validate(data);
        if (error) {
            return fail(res, 422, `Error validating data. ${error.message}`);
        }

        const params = {
            TableName: 'ingredients',
            Key: {
              id: recordId
            },
            UpdateExpression: "set title = :t, image = :i, fat = :f, calories = :c, carbohydrates = :ca, updatedAt = :u",
            ExpressionAttributeValues: {
                ':t': data.title,
                ':i': data.image,
                ':f': data.fat || null,
                ':c': data.calories || null,
                ':ca': data.carbohydrates || null,
                ':u': new Date().toISOString()
            }
        }

        dynamoDb.update(params, (error, data) => {
            if (error) {
                console.log(error);
                return fail(res, 422, error.message);
            }

            return callback(success(res, 200, data, 'Ingredient updated successfully'));
        });
    } catch (e) {
        return fail(res, 500, `Error creating record. ${e.message}`);
    }
}

async function deleteRecords(req, res) {
    try {
        let { recordId }  = req.params;
        console.log('in fetch');
        const params = {
            TableName: 'ingredients',
            Key: {
                id: recordId
            }
        }
        dynamoDb.delete(params, (error, data) => {
            if (error) {
                console.log(error);
                return fail(res, 422, error.message);
            }

            return success(res, 200, data.Item, 'Ingredient deleted successfully');
        });
    } catch (e) {
        return fail(res, 500, `Error creating record. ${e.message}`);
    }
}

module.exports = {
    fetchRecords,
    fetchSingleRecord,
    createRecords,
    updateRecords,
    deleteRecords
}
