import express from "express";
import { sendMessage,
  
  replyToMessage } from "../controllers/contactController.js";
import Contact from "../models/Contact.js"; // ✅ IMPORTANT
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ SEND MESSAGE
router.post("/", sendMessage);
router.post("/reply", protect, replyToMessage);

router.get("/", protect, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

export default router;