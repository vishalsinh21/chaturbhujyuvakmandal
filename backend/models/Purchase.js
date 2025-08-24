import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    galleryItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gallery",
      required: true,
    },
    imageTitle: { type: String, required: true },
    price: { type: Number, required: true },
    buyerName: { type: String, required: true },
    email: { type: String, required: true },
    upiId: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    transactionDate: { type: Date, required: true },
    paymentScreenshot: { type: String },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // ✅ NEW FIELDS:
    trackingPartner: { type: String, default: "" },
    awb: { type: String, default: "" },

    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },

  },
  { timestamps: true }
);

export default mongoose.model("Purchase", purchaseSchema);