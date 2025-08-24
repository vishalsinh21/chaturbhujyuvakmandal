// controllers/socialIconController.js
import SocialIcon from "../models/Social.js";

export const createSocialIcon = async (req, res) => {
  try {
    const { url, logo } = req.body;
    const newIcon = new SocialIcon({ url, logo });
    await newIcon.save();
    res.status(201).json(newIcon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllSocialIcons = async (req, res) => {
  try {
    const icons = await SocialIcon.find();
    res.json(icons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSocialIcon = async (req, res) => {
  try {
    const updated = await SocialIcon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSocialIcon = async (req, res) => {
  try {
    await SocialIcon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
