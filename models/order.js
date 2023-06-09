import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  number: {
    required: true,
    type: Number,
  },
  notes: {
    required: false,
    type: String,
  },
  state: {
    required: false,
    default: "Nepradėta",
    type: String,
    enum: ["Nepradėta", "Vykdoma", "Užbaigta"],
  },
  certificateFile: { type: Schema.Types.ObjectId, ref: "File", default: null },
  additionalFiles: [{ type: Schema.Types.ObjectId, ref: "File", default: [] }],
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: new Date() },
});

export const Order = mongoose.model("Order", orderSchema);
