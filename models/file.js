const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  file: Buffer,
  originalname: {
    required: true,
    type: String,
  },
  mimetype: {
    required: true,
    type: String,
  },
  size: {
    required: true,
    type: Number,
  },
  type: {
    required: true,
    type: String,
    default: "additional",
    enum: ["certificate", "additional"],  
  },
  orderId: { type: Schema.Types.ObjectId, required: true, ref: "Order" },
});

module.exports = mongoose.model("File", fileSchema);
