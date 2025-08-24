import express from "express";
import {
  getDonors,
  addDonor,
  updateDonor,
  deleteDonor,
} from "../controllers/donorController.js";

const router = express.Router();

// CRUD Routes
router.get("/donors", getDonors);           // Get all donors
router.post("/donors", addDonor);           // Add new donor
router.put("/donors/:id", updateDonor);      // Update donor by ID
router.delete("/donors/:id", deleteDonor);   // Delete donor by ID

export default router;
