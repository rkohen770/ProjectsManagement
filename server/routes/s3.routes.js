//s3 routes
const controller = require("../controllers/s3.controller");

module.exports = function (app) {
    // Upload a file
    app.post("/api/s3/upload", controller.uploadFile);

    // Download a file
    app.get("/api/s3/download/:name", controller.downloadFile);
}