import express from 'express';
import { loginUser, changePassword } from '../controllers/authController.js';
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware.js'
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/auth/login', loginUser);
router.put("/change-password", protect, changePassword);

export default router;