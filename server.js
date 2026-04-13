import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import cloudinary from "./config/cloudinary.js";
import reviewRoutes from "./routes/reviewRoutes.js"



dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/projects", projectRoutes)
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 5000;
console.log("portfoliom:", cloudinary.config().cloud_name);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});