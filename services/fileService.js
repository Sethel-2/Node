import { RequestError } from "../utils/error.js";
import { File } from "../models/file.js";
import { Order } from "../models/order.js";
import { firebaseStorage } from "../utils/firebase.js";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export class FileService {
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

  async post(files, { type, orderId }) {
    const createdFiles = await Promise.all(
      files.map(async (file) => {
        const createdFile = new this._files({
          originalname: file.originalname,
          mimetype: file.mimetype,
          type,
          orderId,
        });
        const { filePath, url } = await this.uploadFileToFirestore({
          id: createdFile._id,
          file,
          orderId,
          type,
        });
        createdFile.filePath = filePath;
        createdFile.url = url;
        await createdFile.save();
        return createdFile;
      })
    );
    
    if (type === "certificate") {
      await this._orders.updateOne(
        { _id: orderId },
        {
          certificateFile: createdFiles[0]._id,
        }
      );
    } else {
      await this._orders.updateOne(
        { _id: orderId },
        {
          $push: { additionalFiles: createdFiles.map(createdFile => createdFile._id) },
        }
      );
    }

    return createdFiles;
  }

 

  async delete(id) {
    const fileToDelete = await this._files.findById(id);
    if (!fileToDelete) throw new RequestError("Failas nerastas", 404);

    await this.deleteFileFromFirestore(fileToDelete.filePath);
    await fileToDelete.deleteOne();

    if (fileToDelete.type === "certificate") {
      await this._orders.updateOne(
        {
          _id: fileToDelete.orderId,
        },
        {
          certificateFile: null,
        }
      );
    } else {
      await this._orders.updateOne(
        { _id: fileToDelete.orderId },
        {
          $pull: { additionalFiles: fileToDelete._id },
        }
      );
    }

    return fileToDelete;
  }

  async deleteMany(ids) {
    return await Promise.all(ids.map(async id => {
      return await this.delete(id)
    }))
  }

  async uploadFileToFirestore(data) {
    const { id, file, orderId, type } = data;
    const filePath = `order_${orderId}/${type}/${id}_${file.originalname}`;
    const fileRef = ref(firebaseStorage, filePath);
    await uploadBytesResumable(fileRef, file.buffer);
    const url = await getDownloadURL(fileRef);
    return { filePath, url };
  }

  async deleteFileFromFirestore(filePath) {
    const fileRef = ref(firebaseStorage, filePath);
    await deleteObject(fileRef);
  }
}
