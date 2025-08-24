import LiveAarti from "../models/LiveAarti.js";

// Get current active Live Aarti
export const getLiveAarti = async (req, res) => {
  try {
    const live = await LiveAarti.findOne({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json(live);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch Live Aarti" });
  }
};

// Add new Live Aarti link
export const createLiveAarti = async (req, res) => {
  try {
    const { youtubeLink } = req.body;
    const live = new LiveAarti({ youtubeLink });
    await live.save();
    res.status(201).json(live);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create Live Aarti" });
  }
};

// Update Live Aarti link
export const updateLiveAarti = async (req, res) => {
  try {
    const { id } = req.params;
    const { youtubeLink, isActive } = req.body;
    const updated = await LiveAarti.findByIdAndUpdate(
      id,
      { youtubeLink, isActive },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update Live Aarti" });
  }
};

// Delete a Live Aarti record
export const deleteLiveAarti = async (req, res) => {
  try {
    const { id } = req.params;
    await LiveAarti.findByIdAndDelete(id);
    res.status(200).json({ message: "Live Aarti deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete Live Aarti" });
  }
};
