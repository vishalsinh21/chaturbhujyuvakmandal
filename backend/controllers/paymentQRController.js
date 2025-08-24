import PaymentQR from "../models/paymentQR.js";

// Create QR
export const createPaymentQR = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newQR = new PaymentQR({
      image: req.file.path,
    });

    await newQR.save();
    res.status(201).json(newQR);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All QR
export const getAllPaymentQR = async (req, res) => {
  try {
    const allQR = await PaymentQR.find().sort({ createdAt: -1 });
    res.status(200).json(allQR);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete QR
export const deletePaymentQR = async (req, res) => {
  try {
    const qr = await PaymentQR.findById(req.params.id);
    if (!qr) return res.status(404).json({ message: "QR not found" });

    await PaymentQR.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "QR deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
