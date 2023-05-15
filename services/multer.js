const multer = require("multer");
const uploadFiles = multer().array("files");
const uploadFile = multer().single("file");

module.exports = { uploadFiles, uploadFile };
