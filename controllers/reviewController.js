import Review from "../models/Review.js";
import mongoose from "mongoose";

// ================= CREATE =================
export const createReview = async (req, res) => {
  try {
    const { name, message, rating } = req.body;

    // ✅ Backend validation (never trust frontend)
    if (!name || !message || !rating) {
      return res.status(400).json({ message: "All fields required" });
    }

    const review = await Review.create({
      name,
      message,
      rating,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ALL =================
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET FEATURED =================
export const getFeaturedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      approved: true,
      featured: true,
    })

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= TOGGLE APPROVE =================
export const toggleApprove = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // ✅ Atomic update (NO validation crash)
    const updated = await Review.findByIdAndUpdate(
      id,
      { $set: { approved: !review.approved } },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= TOGGLE FEATURE =================
export const toggleFeature = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // ✅ Enforce logic: must be approved first
    if (!review.approved) {
      return res.status(400).json({ message: "Approve first" });
    }

    // ✅ Atomic update (safe)
    const updated = await Review.findByIdAndUpdate(
  id,
  { $set: { approved: !review.approved } },
  { returnDocument: "after" }
);

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};