import Admin from "../models/Admin.js";
import transporter from "../config/mailer.js";
import jwt from "jsonwebtoken";
import { resend } from "../config/resend.js";


export const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    let admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Unauthorized email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.otp = otp;
    admin.otpExpiry = Date.now() + 5 * 60 * 1000;

    await admin.save();

   await resend.emails.send({
  from: "onboarding@resend.dev",
  to: email,
  subject: "Your Admin OTP",
  html: `
    <div style="font-family:sans-serif;">
      <h2>Your OTP</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    </div>
  `,
});
 

    res.json({ message: "OTP sent" });

  } catch (err) {
    console.error("OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

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

    admin.otp = null;
    admin.otpExpiry = null;
    await admin.save();

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    res.json({ token });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};