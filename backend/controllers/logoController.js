import Logo from '../models/Logo.js';
import cloudinary from '../config/cloudinaryConfig.js';

// Upload new logo
export const createLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = req.file.path;
    const publicId = req.file.filename;

    const newLogo = new Logo({ imageUrl, publicId });
    await newLogo.save();

    res.status(201).json(newLogo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading logo' });
  }
};

// Get all logos
export const getLogos = async (req, res) => {
  try {
    const logos = await Logo.find().sort({ createdAt: -1 });
    res.json(logos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching logos' });
  }
};

// Delete logo (with Cloudinary deletion)
export const deleteLogo = async (req, res) => {
  try {
    const logo = await Logo.findById(req.params.id);
    if (!logo) {
      return res.status(404).json({ message: 'Logo not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(logo.publicId, { resource_type: 'image' });

    await Logo.findByIdAndDelete(req.params.id);

    res.json({ message: 'Logo deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting logo' });
  }
};
