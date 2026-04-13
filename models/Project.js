import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [{ type: String }],
    githubLink: String,
    liveLink: String,
    image: String,
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;