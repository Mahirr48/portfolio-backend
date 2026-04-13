import Admin from "../models/Admin.js";
import nodemailer from "nodemailer";

export const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    let admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Unauthorized email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.otp = otp;
    admin.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min

    await admin.save();

    // ⚡ Nodemailer setup (use your own email)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your Admin OTP",
      text: `Your OTP is ${otp}`,
    });

    res.json({ message: "OTP sent" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
  
};
import jwt from "jsonwebtoken";



export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin || admin.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (admin.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // clear OTP after use
    admin.otp = null;
    admin.otpExpiry = null;
    await admin.save();

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "5m" } // short session (important)
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};