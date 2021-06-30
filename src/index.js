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

app.get("/", (req, res) => {
    res.json({
        success: true,
        payload: [],
        message: "Cassasoft API",
    });
});

app.get("/api", (req, res) => {
    res.json({
        success: true,
        payload: [],
        message: "Cassasoft API",
    });
});

app.use('/api', ingredientRoutes);

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        success: false,
        payload: null,
        message: `CASSASOFT API SAYS: ${error.message} for path: ${req.path}`,
    });
    next();
});

module.exports = app;
