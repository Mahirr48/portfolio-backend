import express from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getProjects);
router.get("/:id", getProjectById);

// ADMIN
router.post("/", protect, upload.single("image"), createProject);
router.put("/:id", protect, upload.single("image"), updateProject); // 🔥 FIXED
router.delete("/:id", protect, deleteProject);

export default router;