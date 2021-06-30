const AWS = require('aws-sdk');
const uuid =  require('uuid');
const { schemaCreate, schemaUpdate } = require('./model');
const { success, fail } = require('../utils')

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

            return success(res, 200, data.Items, 'Ingredient retrieved successfully');
        });
    } catch (e) {
        return fail(res, 500, `Error creating record. ${e.message}`);
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
        return fail(res, 500, `Error creating record. ${e.message}`);
    }
}

async function createRecords(req, res) {
    try {
        const data = req.body;
        const  { error } = schemaCreate.validate(data);
        if (error) {
            return fail(res, 422, `Error validating data. ${error.message}`);
        }

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
            UpdateExpression: "set title = :t, fat = :f, calories = :c, carbohydrates = :ca, updatedAt = :u",
            ExpressionAttributeValues: {
                ':t': data.title,
                ':f': data.fat ?? null,
                ':c': data.calories ?? null,
                ':ca': data.carbohydrates ?? null,
                ':u': new Date().toISOString()
            }
        }

        dynamoDb.update(params, (error, data) => {
            if (error) {
                console.log(error);
                return fail(res, 422, error.message);
            }

            return success(res, 200, data, 'Ingredient updated successfully');
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
