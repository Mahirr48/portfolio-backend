import nodemailer from "nodemailer";
import dns from "dns";

// ✅ FORCE NODE TO USE IPv4 FIRST (CRITICAL)
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  service: "gmail", // simpler + more stable than manual host
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4, // ✅ FORCE IPv4
});

transporter.verify((err) => {
  if (err) {
    console.error("SMTP ERROR:", err);
  } else {
    console.log("SMTP READY");
  }
});

export default transporter;