import express from "express";
import { saveRefundPolicy, getRefundPolicy } from "../controllers/refundPolicyController.js";

const router = express.Router();

router.post("/save-refund-policy", saveRefundPolicy);
router.get("/get-refund-policy", getRefundPolicy);

export default router;
