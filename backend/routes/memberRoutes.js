import express from "express";
import multer from "multer";
import storage from "../config/multerConfig.js"; // 👈 same as logo routes
import {
  createMember,
  getAllMembers,
  updateMember,
  deleteMember,
} from "../controllers/memberController.js";

const router = express.Router();
const upload = multer({ storage }); // 👈 define upload

// CRUD routes
router.post("/savemembers", upload.single("memberPhoto"), createMember); // create with photo
router.get("/members", getAllMembers); // read
router.put("/updatemembers/:id", upload.single("memberPhoto"), updateMember); // update with optional new photo
router.delete("/deletemembers/:id", deleteMember); // delete

export default router;