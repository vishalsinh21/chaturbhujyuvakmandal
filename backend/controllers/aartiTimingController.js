import AartiTiming from "../models/AartiTiming.js";

// Get all aarti timings
export const getAartiTimings = async (req, res) => {
  try {
    const timings = await AartiTiming.find().sort({ time: 1 });
    res.status(200).json(timings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch aarti timings" });
  }
};

// Add new aarti timing
export const addAartiTiming = async (req, res) => {
  try {
    const { name, time, day, notes } = req.body;
    const newTiming = new AartiTiming({ name, time, day, notes });
    await newTiming.save();
    res.status(201).json(newTiming);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add aarti timing" });
  }
};

// Update aarti timing
export const updateAartiTiming = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTiming = await AartiTiming.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedTiming);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update aarti timing" });
  }
};

// Delete aarti timing
export const deleteAartiTiming = async (req, res) => {
  try {
    const { id } = req.params;
    await AartiTiming.findByIdAndDelete(id);
    res.status(200).json({ message: "Aarti timing deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete aarti timing" });
  }
};
