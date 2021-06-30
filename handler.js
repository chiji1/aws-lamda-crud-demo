const awsServerlessExpress = require('aws-serverless-express');
const app = require('./src/index');

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context, callback) => {
    return awsServerlessExpress.proxy(server, event, context);
};
