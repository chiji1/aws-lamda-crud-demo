const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const ingredientRoutes = require('./ingredient')

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('./public'));

app.get("/", (req, res) => {
    res.json({
        statusCode: 200,
        body: null,
        success: true,
        payload: [],
        message: "Cassasoft API",
    });
});

app.get("/api", (req, res) => {
    res.json({
        statusCode: 200,
        body: null,
        success: true,
        payload: [],
        message: "Cassasoft API",
    });
});

app.use('/api', ingredientRoutes);

app.use((error, req, res, next) => {
    res.status(500);
    res.json({
        statusCode: 500,
        body: null,
        success: false,
        payload: null,
        message: `CASSASOFT API SAYS: ${error.message} for path: ${req.path}`,
    });
    next();
});

module.exports = app;
