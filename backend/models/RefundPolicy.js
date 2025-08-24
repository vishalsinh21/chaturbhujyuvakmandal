import mongoose from "mongoose";

const refundPolicySchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  updatedBy: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("RefundPolicy", refundPolicySchema);
