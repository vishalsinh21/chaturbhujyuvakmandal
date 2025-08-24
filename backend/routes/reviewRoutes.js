import express from "express";
import {
  submitReview,
  getAllReviews,
  deleteReview
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/submit-review", submitReview);
router.get("/get-reviews", getAllReviews);
router.delete("/delete-review/:id", deleteReview);

export default router;
