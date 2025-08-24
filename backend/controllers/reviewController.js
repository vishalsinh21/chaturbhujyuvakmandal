import Review from "../models/Review.js";

// Submit Review
export const submitReview = async (req, res) => {
  try {
    const { name, email, review, rating } = req.body;

    if (!name || !email || !review || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newReview = new Review({ name, email, review, rating });
    await newReview.save();

    res.status(201).json({ message: "Review submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit review", error: err.message });
  }
};

// Get All Reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
  }
};

// Delete Review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review", error: err.message });
  }
};
