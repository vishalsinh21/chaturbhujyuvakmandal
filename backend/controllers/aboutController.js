import About from '../models/About.js';
import cloudinary from '../config/cloudinaryConfig.js';

// Create
export const createAboutMe = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file?.path || "";

    const about = new About({ name, description, image });
    await about.save();
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All
export const getAboutMe = async (req, res) => {
  try {
    const aboutData = await About.find();
    res.json(aboutData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
export const updateAboutMe = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) return res.status(404).json({ message: 'About Me not found' });

    if (req.body.name) about.name = req.body.name;
    if (req.body.description) about.description = req.body.description;

    if (req.file) {
      // Delete old image from Cloudinary
      if (about.image) {
        const parts = about.image.split('/');
        const fileWithExt = parts[parts.length - 1];
        const publicId = `thousandshades/about/${fileWithExt.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      }

      about.image = req.file.path;
    }

    await about.save();
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
export const deleteAboutMe = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) return res.status(404).json({ message: 'About Me not found' });

    if (about.image) {
      const parts = about.image.split('/');
      const fileWithExt = parts[parts.length - 1];
      const publicId = `thousandshades/about/${fileWithExt.split('.')[0]}`;
      await cloudinary.uploader.destroy(publicId);
    }

    await About.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
