
import Purchase from "../models/Purchase.js";
import { purchaseApprovedTemplate, purchaseRejectedTemplate } from "../utils/purchaseTemplate.js";
import createTransporter from "../config/transporter.js";


// Create purchase request (User submission)
export const createPurchase = async (req, res) => {
  try {
    const {
      galleryItem,
      imageTitle,
      price,
      buyerName,
      email,
      upiId,
      phoneNumber,
      transactionDate,
      address,
      pincode
    } = req.body;

    let paymentScreenshot = null;
    if (req.file) {
      paymentScreenshot = req.file.path;
    }

    const purchase = new Purchase({
      galleryItem,
      imageTitle,
      price,
      buyerName,
      email,
      upiId,
      phoneNumber,
      transactionDate,
      address,
      pincode,
      paymentScreenshot
    });

    await purchase.save();
    res.status(201).json(purchase);
  } catch (error) {
    console.error("Failed to create purchase", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all purchase requests (Admin panel)
export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().populate("galleryItem").sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    console.error("Failed to fetch purchases", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Approve Purchase
export const approvePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    purchase.status = "Approved";
    await purchase.save();

    // Send email
    const transporter = createTransporter();
    const emailContent = purchaseApprovedTemplate(purchase);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: purchase.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    res.json({ message: "Purchase approved and email sent." });
  } catch (error) {
    console.error("Failed to approve purchase", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Reject Purchase
export const rejectPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    purchase.status = "Rejected";
    await purchase.save();

    // Send email
    const transporter = createTransporter();
    const emailContent = purchaseRejectedTemplate(purchase);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: purchase.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    res.json({ message: "Purchase rejected and email sent." });
  } catch (error) {
    console.error("Failed to reject purchase", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Approve / Reject purchase request (Admin)
export const updatePurchaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedPurchase = await Purchase.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    res.json(updatedPurchase);
  } catch (error) {
    console.error("Failed to update purchase", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTrackingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingPartner, awb } = req.body;

    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    purchase.trackingPartner = trackingPartner;
    purchase.awb = awb;
    await purchase.save();

    // Send email to buyer
    const transporter = createTransporter();
    const emailContent = {
      subject: "Your Order Has Been Shipped!",
      html: `
        <p>Dear ${purchase.buyerName},</p>
        <p>Your order for <strong>${purchase.imageTitle}</strong> has been shipped.</p>
        <p><strong>Tracking Partner:</strong> ${trackingPartner}</p>
        <p><strong>AWB Number:</strong> ${awb}</p>
        <p>Thank you for shopping with us!</p>
      `
    };

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: purchase.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    res.json({ message: "Tracking details updated and email sent." });
  } catch (error) {
    console.error("Failed to update tracking details", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status." });
    }

    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found." });
    }

    purchase.orderStatus = orderStatus;
    await purchase.save();

    // ✅ Send cancellation email if cancelled
    if (orderStatus === "Cancelled") {
      const transporter = createTransporter();

      // You can customize this template
      const emailContent = {
        subject: "Your Order Has Been Cancelled",
        html: `
          <p>Dear ${purchase.buyerName},</p>
          <p>We regret to inform you that your order for <strong>${purchase.imageTitle}</strong> has been cancelled.</p>
          <p>If you have any questions, feel free to contact our support team.</p>
          <p>Thank you.</p>
        `
      };

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: purchase.email,
        subject: emailContent.subject,
        html: emailContent.html,
      });
    }

    res.json(purchase);
  } catch (error) {
    console.error("Failed to update order status", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};