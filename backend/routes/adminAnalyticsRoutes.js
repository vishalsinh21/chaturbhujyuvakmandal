import express from "express";
import { getFullDashboardAnalytics } from "../controllers/adminAnalyticsController.js";

const router = express.Router();

router.get("/admin-analytics", getFullDashboardAnalytics);

export default router;
