import mongoose, { Schema } from "mongoose";
const fileSchema = new Schema({
  originalname: {
    required: true,
    type: String,
  },
  mimetype: {
    required: true,
    type: String,
  },
  type: {
    required: true,
    type: String,
    default: "additional",
    enum: ["certificate", "additional"],  
  },
  filePath: {
    required: true,
    type: String,
  },
  url: {
    required: true,
    type: String,
  },
  orderId: { type: Schema.Types.ObjectId, required: true, ref: "Order" },
});

export const File = mongoose.model("File", fileSchema);
