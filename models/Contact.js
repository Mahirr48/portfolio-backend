import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },

    // 🔥 NEW FIELDS
    projectType: {
      type: String,
      enum: ["Website", "Web App", "Portfolio", "Other"],
      required: true,
    },


    timeline: {
      type: String,
      enum: ["ASAP", "1-2 weeks", "Flexible"],
      required: true,
    },

    message: { type: String, required: true },

    replied: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);