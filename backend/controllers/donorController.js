import Donor from "../models/donorModel.js";

// Get all donors
export const getDonors = async (req, res) => {
  try {
    const donors = await Donor.find().sort({ date: -1 });
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch donors", error });
  }
};

// Add new donor
export const addDonor = async (req, res) => {
  try {
    const { name, amount, purpose, date, notes } = req.body;
    const newDonor = await Donor.create({ name, amount, purpose, date, notes });
    res.status(201).json(newDonor);
  } catch (error) {
    res.status(500).json({ message: "Failed to add donor", error });
  }
};

// Update donor
export const updateDonor = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDonor = await Donor.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedDonor);
  } catch (error) {
    res.status(500).json({ message: "Failed to update donor", error });
  }
};

// Delete donor
export const deleteDonor = async (req, res) => {
  try {
    const { id } = req.params;
    await Donor.findByIdAndDelete(id);
    res.status(200).json({ message: "Donor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete donor", error });
  }
};
