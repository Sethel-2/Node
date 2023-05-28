import { Router } from 'express'
import { FileService } from '../services/fileService.js'
import { authenticateAccess } from '../utils/auth.js';
import { uploadFiles } from '../utils/multer.js';

export const fileRouter = Router();
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
    const createdFiles = await fileService.post(files, req.body);
    res.json({ files: createdFiles });
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

fileRouter.delete("/delete/:id", authenticateAccess, async (req, res) => {
  try {
    const deletedFile = await fileService.delete(req.params.id);
    res.json(deletedFile);
  } catch (error) {
    res
      .status(error.statusCode ? error.statusCode : 500)
      .json({ message: error.message });
  }
});

fileRouter.delete("/delete-files", authenticateAccess, async (req, res) => {
  try {
    const ids = req.query.fileIds.split(',')
    await fileService.deleteMany(ids);
    res.json({ message: "success" });
  } catch (error) {
    res
      .status(error.statusCode ? error.statusCode : 500)
      .json({ message: error.message });
  }
});