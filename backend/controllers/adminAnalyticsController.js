import SocialIcon from "../models/Social.js";
import Gallery from "../models/Gallery.js";
import CustomPhoto from "../models/Custom.js";
import Contact from "../models/Contact.js";
import FAQ from "../models/Faq.js";
import Review from "../models/Review.js";
import Purchase from "../models/Purchase.js";

export const getFullDashboardAnalytics = async (req, res) => {
  try {
    // Get counts for all models
    const [
      socialIconsCount,
      galleryCount,
      customPhotoCount,
      contactCount,
      faqCount,
      reviewCount,
      purchaseCount,

      approvedCount,
      pendingCount,
      rejectedCount,

      processingCount,
      shippedCount,
      deliveredCount,
      cancelledCount
    ] = await Promise.all([
      SocialIcon.countDocuments(),
      Gallery.countDocuments(),
      CustomPhoto.countDocuments(),
      Contact.countDocuments(),
      FAQ.countDocuments(),
      Review.countDocuments(),
      Purchase.countDocuments(),

      Purchase.countDocuments({ status: "Approved" }),
      Purchase.countDocuments({ status: "Pending" }),
      Purchase.countDocuments({ status: "Rejected" }),

      Purchase.countDocuments({ orderStatus: "Processing" }),
      Purchase.countDocuments({ orderStatus: "Shipped" }),
      Purchase.countDocuments({ orderStatus: "Delivered" }),
      Purchase.countDocuments({ orderStatus: "Cancelled" }),
    ]);

    res.json({
      socialIconsCount,
      galleryCount,
      customPhotoCount,
      contactCount,
      faqCount,
      reviewCount,
      purchaseCount,

      status: {
        approvedCount,
        pendingCount,
        rejectedCount,
      },

      orderStatus: {
        processingCount,
        shippedCount,
        deliveredCount,
        cancelledCount,
      },
    });

  } catch (error) {
    console.error("Failed to get full dashboard analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
