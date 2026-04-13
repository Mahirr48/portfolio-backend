import Contact from "../models/Contact.js";
import transporter from "../config/mailer.js";
// CREATE MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const { name, email, message, projectType, timeline } = req.body;

    if (!name || !email || !message || !projectType || !timeline) {
      return res.status(400).json({ message: "All fields required" });
    }

    await Contact.create({
      name,
      email,
      projectType,
      timeline,
      message,
    });

    const mailOptions = {
      from: `"Mahir.dev" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Message received ✅",
      html: `
        <div style="font-family:sans-serif;">
          <h2>Hey ${name}, 👋</h2>
          <p>Thanks for reaching out!</p>
          <p>I’ll get back to you within 24 hours.</p>
          <hr/>
          <p>${message}</p>
        </div>
      `,
    };

    // 🔥 REAL FIX
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Message sent successfully" });

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