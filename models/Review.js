import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: String,
    message: String,
    approved: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);