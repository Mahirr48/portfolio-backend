import express from "express";
import {
  createReview,
  getAllReviews,
  getFeaturedReviews,
  toggleApprove,
  toggleFeature,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", createReview);
router.get("/", getAllReviews);
router.get("/featured", getFeaturedReviews);

router.put("/approve/:id", toggleApprove);
router.put("/feature/:id", toggleFeature);

export default router;