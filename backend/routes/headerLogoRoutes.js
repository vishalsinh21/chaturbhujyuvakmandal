import express from "express";
import { getHeaderAndLogos } from "../controllers/headerLogoController.js";

const router = express.Router();

router.get("/get-header-logos", getHeaderAndLogos);

export default router;