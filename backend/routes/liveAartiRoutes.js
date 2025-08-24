import express from "express";
import {
  getLiveAarti,
  createLiveAarti,
  updateLiveAarti,
  deleteLiveAarti,
} from "../controllers/liveAartiController.js";

const router = express.Router();

// Public route to get active Live Aarti
router.get("/liveaarti", getLiveAarti);

// Admin routes
router.post("/liveaarti", createLiveAarti);
router.put("/liveaarti/:id", updateLiveAarti);
router.delete("/liveaarti/:id", deleteLiveAarti);

export default router;
