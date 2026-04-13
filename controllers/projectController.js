import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js";

// helper for upload
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "portfolio_projects" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// helper to delete old image
const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    const publicId = imageUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`portfolio_projects/${publicId}`);
  } catch (err) {
    console.log("Cloudinary delete failed:", err.message);
  }
};

// GET ALL
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// GET ONE
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE
export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title & description required" });
    }

    let imageUrl = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const project = new Project({
      ...req.body,
      image: imageUrl,
    });

    const saved = await project.save();
    res.status(201).json(saved);

  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateProject = async (req, res) => {
  try {
    const existing = await Project.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "Project not found" });
    }

    let imageUrl = existing.image;

    if (req.file) {
      // delete old image
      await deleteFromCloudinary(existing.image);

      // upload new
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: imageUrl,
      },
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // delete image from cloudinary
    await deleteFromCloudinary(project.image);

    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};