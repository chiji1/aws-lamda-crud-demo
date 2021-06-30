const express = require("express");
const { createRecords, fetchRecords, fetchSingleRecord, updateRecords, deleteRecords } = require('./controller');

const multer = require('multer');
const upload = multer();
const router = express.Router();

router.get("/ingredients", [], fetchRecords); // checkAuth

router.get("/ingredients/:recordId", [], fetchSingleRecord);

router.post("/ingredients", [upload.none()], createRecords);

router.put("/ingredients/:recordId", [], updateRecords); // checkAuth, isValidStaff

router.delete("/ingredients/:recordId", [], deleteRecords);


module.exports = router;
