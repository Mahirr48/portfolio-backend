import express from "express";
import { sendOTP, verifyOTP } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

router.get("/verify", protect, (req, res) => {
  res.json({ success: true });
});

export default router;