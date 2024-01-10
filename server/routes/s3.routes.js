//s3 routes
const express = require('express')
const multer  = require('multer')
const controller = require("../controllers/s3.controller");

//const storage = multer({ dest: 'uploads/' })
const storage = multer.memoryStorage(); // Use memoryStorage so the file will be available as a buffer in the 'file' object


module.exports = function (app) {
    // Upload a image file
    app.post("/api/s3/uploadImage", multer({ storage: storage }).single('avatar'), controller.uploadFile); 

    // Upload a document file
    app.post("/api/s3/uploadDoc", multer({ storage: storage }).single('doc'), controller.uploadFile);

    // Download a file
    app.get("/api/s3/download/:name", controller.downloadFile);
}