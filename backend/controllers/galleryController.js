import Gallery from '../models/Gallery.js';
import cloudinary from '../config/cloudinaryConfig.js';

export const saveGallery = async (req, res) => {
  try {
    const { imageTitle, imageType, year } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    const gallery = new Gallery({
      imageTitle,
      imageType,
      year,
      image: req.file.path
    });

    await gallery.save();
    res.status(201).json(gallery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getGallery = async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ createdAt: -1 });
    res.json(galleries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: 'Gallery item not found' });

    if (req.body.imageTitle) gallery.imageTitle = req.body.imageTitle;
    if (req.body.imageType) gallery.imageType = req.body.imageType;
    if (req.body.year) gallery.year = req.body.year;

    if (req.file) {
      const publicIdWithFolder = gallery.image
        .split('/')
        .slice(-2)
        .join('/')
        .split('.')[0];
      await cloudinary.uploader.destroy(publicIdWithFolder, { resource_type: 'image' });
      gallery.image = req.file.path;
    }

    await gallery.save();
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ message: 'Gallery item not found' });

    const fileName = gallery.image.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`cbym/gallery/${fileName}`);
    await gallery.deleteOne();

    res.json({ message: 'Gallery item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
