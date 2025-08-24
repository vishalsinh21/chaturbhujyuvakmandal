import express from "express";
import multer from "multer";
import multerStorage from "../config/multerConfig.js";
import { createPaymentQR, getAllPaymentQR, deletePaymentQR } from "../controllers/paymentQRController.js";

const router = express.Router();

const upload = multer({ storage: multerStorage });

router.post("/paymentQR", upload.single("paymentQR"), createPaymentQR);
router.get("/paymentQR", getAllPaymentQR);
router.delete("/paymentQR/:id", deletePaymentQR);

export default router;
