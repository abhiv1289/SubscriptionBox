import mongoose from "mongoose";

const boxSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    priceMonthlyUSD: { type: Number, required: true },
    items: [String],
    imageUrl: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Box = mongoose.model("Box", boxSchema);
