import mongoose from "mongoose";

const paymentQRSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PaymentQR", paymentQRSchema);