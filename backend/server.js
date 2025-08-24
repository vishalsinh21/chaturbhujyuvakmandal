// Load environment variables
import "./config/dotenvConfig.js";
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import headerRoutes from "./routes/headerRoutes.js";
import logoRoutes from "./routes/logoRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import customPhotoRoutes from "./routes/customPhotoRoutes.js";
import sendOtpRoutes from "./routes/sendOtpRoutes.js"
import faqRoutes from "./routes/faqRoutes.js"
import footerRoutes from "./routes/footerRoutes.js"
import socialRoutes from "./routes/socialRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js";
import headerLogoRoutes from "./routes/headerLogoRoutes.js"
import paymentQRRoutes from "./routes/paymentQRRoutes.js"
import purchaseRoutes from "./routes/purchaseRoutes.js"
import privacyPolicyRoutes from './routes/privacyPolicyRoutes.js';
import refundPolicyRoutes from "./routes/refundPolicyRoutes.js";
import visitRoutes from "./routes/visitRoutes.js"
import adminAnalyticsRoutes from "./routes/adminAnalyticsRoutes.js";
import memberRoutes from "./routes/memberRoutes.js"
import liveAartiRoutes from "./routes/liveAartiRoutes.js"
import donorRoutes from "./routes/donorRoutes.js";
import aartiTimingRoutes from "./routes/aartiTimingRoutes.js";
import mongoose from "mongoose";
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' })); 

app.use('/api', authRoutes, headerRoutes, logoRoutes, heroRoutes, aboutRoutes, galleryRoutes, customPhotoRoutes,sendOtpRoutes,faqRoutes, footerRoutes, socialRoutes, contactRoutes, reviewRoutes,headerLogoRoutes,paymentQRRoutes, purchaseRoutes, privacyPolicyRoutes, refundPolicyRoutes,visitRoutes, adminAnalyticsRoutes, memberRoutes, liveAartiRoutes, donorRoutes, aartiTimingRoutes );
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState; // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  let dbStatus = "disconnected";
  if (dbState === 1) dbStatus = "connected";
  else if (dbState === 2) dbStatus = "connecting";
  else if (dbState === 3) dbStatus = "disconnecting";

  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date(),
    database: dbStatus,
  });
});

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});
    
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});