import Contact from "../models/Contact.js";
import transporter from "../config/mailer.js";
// CREATE MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const { name, email, message, projectType, timeline } = req.body;

    if (!name || !email || !message || !projectType || !timeline) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ Save to DB
    await Contact.create({
      name,
      email,
      projectType,
      timeline,
      message,
    });

    // ✅ Send email to YOU
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: "New Client Message 🚀",
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Project:</strong> ${projectType}</p>
        <p><strong>Timeline:</strong> ${timeline}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    res.status(201).json({
      message: "Message sent successfully",
    });

  } catch (error) {
    console.error("CONTACT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const replyToMessage = async (req, res) => {
  try {
    const { id, email, name } = req.body;

    const mailOptions = {
      from: `"Mahir.dev" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thanks for reaching out!",
      html: `
        <p>Hi ${name},</p>
        <p>Thanks for reaching out. I’ve received your message and will get back to you shortly.</p>
        <br/>
        <p>— Mahir</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    await Contact.findByIdAndUpdate(id, {
      replied: true,
    });

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send reply" });
  }
};