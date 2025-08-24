import RefundPolicy from "../models/RefundPolicy.js";

// Save or update Refund Policy
export const saveRefundPolicy = async (req, res) => {
  try {
    const { content, updatedBy } = req.body;

    let policy = await RefundPolicy.findOne();
    if (policy) {
      policy.content = content;
      policy.updatedBy = updatedBy;
      policy.updatedAt = new Date();
    } else {
      policy = new RefundPolicy({ content, updatedBy });
    }
    await policy.save();
    res.status(200).json({ message: "Refund Policy saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save refund policy", error });
  }
};

// Get Refund Policy
export const getRefundPolicy = async (req, res) => {
  try {
    const policy = await RefundPolicy.findOne();
    if (!policy) {
      return res.status(404).json({ message: "No Refund Policy found" });
    }
    res.status(200).json(policy);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch refund policy", error });
  }
};
