const { Router } = require("express");
const FileService = require("../services/fileService");
const authenticateAccess = require("../utils/auth");
const { uploadFiles, uploadFile } = require("../services/multer");

const fileRouter = Router();
const fileService = new FileService();

fileRouter.get("/", authenticateAccess, async (req, res) => {
  try {
    const files = await fileService.getAll(req.query);
    res.json(files);
  } catch (error) {
    res
      .status(error.statusCode ? error.statusCode : 500)
      .json({ message: error.message });
  }
});

fileRouter.post("/", authenticateAccess, uploadFiles, async (req, res) => {
  try {
    const files = req.files;
    console.log(files)
    fileService.post(files, req.body);
    res.json({ message: "files stored" });
  } catch (error) {
    res
      .status(error.statusCode ? error.statusCode : 500)
      .json({ message: error.message });
  }
});

fileRouter.get("/:id", authenticateAccess, async (req, res) => {
  try {
    const file = await fileService.getById(req.params.id);
    res.json(file);
  } catch (error) {
    res
      .status(error.statusCode ? error.statusCode : 500)
      .json({ message: error.message });
  }
});

fileRouter.put("/:id", authenticateAccess, uploadFile, async (req, res) => {
  try {
    const file = req.file;
    const updatedFile = await fileService.put(req.params.id, file);
    res.json(updatedFile);
  } catch (error) {
    res
      .status(error.statusCode ? error.statusCode : 500)
      .json({ message: error.message });
  }
});

fileRouter.delete("/:id", authenticateAccess, async (req, res) => {
  try {
    const deletedFile = await fileService.delete(req.params.id);
    res.json(deletedFile);
  } catch (error) {
    res
      .status(error.statusCode ? error.statusCode : 500)
      .json({ message: error.message });
  }
});

module.exports = fileRouter;
