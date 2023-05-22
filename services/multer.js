import multer from "multer";

const uploadFiles = multer().array("files");
const uploadFile = multer().single("file");

export { uploadFiles, uploadFile };
