// controllers/visitController.js
import Visit from "../models/Visit.js";
import {UAParser} from "ua-parser-js";


export const recordVisit = async (req, res) => {
  try {
    const path = req.body.path || "unknown";

    // Only record if path is '/'
    if (path !== "/") {
      return res.status(200).json({ message: "Visit ignored: path not '/'" });
    }

    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const parser = new UAParser(userAgent);
    const deviceType = parser.getDevice().type || "desktop";

    // Prevent duplicate visit from same IP + path in the last 60 seconds
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentVisit = await Visit.findOne({
      ip,
      path,
      createdAt: { $gte: oneMinuteAgo },
    });

    if (recentVisit) {
      return res.status(200).json({ message: "Duplicate visit ignored" });
    }

    const visit = new Visit({
      ip,
      path,
      userAgent,
      deviceType,
    });

    await visit.save();
    res.status(200).json({ message: "Visit recorded" });
  } catch (error) {
    console.error("Visit recording error:", error);
    res.status(500).json({ message: "Error recording visit" });
  }
};

export const getAllVisits = async (req, res) => {
  try {
    const visits = await Visit.find();

    const total = visits.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisits = visits.filter(v => new Date(v.createdAt) >= today).length;

    const byPath = {};
    visits.forEach(v => {
      byPath[v.path] = (byPath[v.path] || 0) + 1;
    });

    const byDevice = { desktop: 0, mobile: 0 };
    visits.forEach(v => {
      const device = v.deviceType || "desktop";
      byDevice[device] = (byDevice[device] || 0) + 1;
    });

    res.json({
      total,
      today: todayVisits,
      byPath,
      byDevice,
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};



export const getVisitCount = async (req, res) => {
  try {
    const totalVisitors = await Visit.countDocuments({ path: "/" });
    res.status(200).json({ totalVisitors });
  } catch (error) {
    console.error("Error fetching visit count:", error);
    res.status(500).json({ message: "Error fetching visit count" });
  }
};