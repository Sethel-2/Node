const RequestError = require("../utils/error");
const File = require("../models/file");
const Order = require("../models/order");

class FileService {
  _files;
  _orders;

  constructor() {
    this._files = File;
    this._orders = Order;
  }

  async getAll(query) {
    const { orderId, type } = query;
    const files = await this._files.find({
      orderId,
      type: type ? type : "additional",
    });
    return files;
  }

  async getById(id) {
    const file = await this._files.findById(id);
    if (!file) throw new RequestError("Failas nerastas", 404);
    return file;
  }

  async post(files, data) {
    const createdFiles = await Promise.all(
      files.map(async (file) => {
        const createdFile = new this._files({
          file: file.buffer,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          orderId: data.orderId,
          type: data.type,
        });
        await createdFile.save();
        return createdFile._id;
      })
    );

    if (data.type === "certificate") {
      await this._orders.updateOne({
        _id: data.orderId,
        certificateFile: createdFiles[0],
      });
    } else {
      await this._orders.updateOne(
        { _id: data.orderId },
        {
          $push: { additionalFiles: createdFiles },
        }
      );
    }

    return createdFiles;
  }

  async put(id, file) {
    const oldFile = await this._files.findById(id);
    if (oldFile === null) throw new RequestError("Failas nerastas", 404);

    Object.assign(oldFile, file);
    await oldFile.save();

    return oldFile;
  }

  async delete(id) {
    const deletedFile = await this._files.findByIdAndDelete(id);
    if (!deletedFile) throw new RequestError("Failas nerastas", 404);

    if (deletedFile.type === "certificate") {
      await this._orders.updateOne({
        _id: deletedFile.orderId,
        certificateFile: null,
      });
    } else {
      await this._orders.updateOne(
        { _id: deletedFile.orderId },
        {
          $pull: { additionalFiles: deletedFile._id },
        }
      );
    }

    return deletedFile;
  }
}

module.exports = FileService;
