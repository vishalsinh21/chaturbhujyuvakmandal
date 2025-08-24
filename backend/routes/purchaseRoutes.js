import express from "express";
import multer from "multer";
import { createPurchase, getAllPurchases, approvePurchase, rejectPurchase,updateTrackingDetails, updateOrderStatus } from "../controllers/purchaseController.js";
import multerStorage from '../config/multerConfig.js';

const router = express.Router();
const upload = multer({ storage: multerStorage });
router.post('/purchase', upload.single('paymentSS'), createPurchase);
// GET all purchases
router.get("/get-purchase-requests", getAllPurchases);

// POST approve purchase
router.post("/approve-purchase/:id", approvePurchase);

// POST reject purchase
router.post("/reject-purchase/:id", rejectPurchase);

router.post("/update-tracking/:id", updateTrackingDetails);

router.post("/update-order-status/:id", updateOrderStatus);

export default router;