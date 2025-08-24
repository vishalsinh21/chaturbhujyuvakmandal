import express from "express";
import {
  getAartiTimings,
  addAartiTiming,
  updateAartiTiming,
  deleteAartiTiming,
} from "../controllers/aartiTimingController.js";

const router = express.Router();

// Routes
router.get("/aarti-timings", getAartiTimings);           // Get all timings
router.post("/aarti-timings", addAartiTiming);           // Add new timing
router.put("/aarti-timings/:id", updateAartiTiming);      // Update timing by ID
router.delete("/aarti-timings/:id", deleteAartiTiming);   // Delete timing by ID

export default router;
