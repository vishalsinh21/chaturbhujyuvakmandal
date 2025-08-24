import Hero from '../models/Hero.js';
import cloudinary from '../config/cloudinaryConfig.js';

// CREATE
export const createHero = async (req, res) => {
  try {
    const { texts } = req.body;
    const images = req.files?.map(file => file.path) || [];

    const newHero = new Hero({
      texts: JSON.parse(texts),  // texts sent as JSON array string
      images,
    });

    await newHero.save();
    res.status(201).json(newHero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ALL
export const getHeroes = async (req, res) => {
  try {
    const heroes = await Hero.find().sort({ createdAt: -1 });
    res.json(heroes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateHero = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) return res.status(404).json({ message: 'Hero not found' });

    // Update texts if provided
    if (req.body.texts) {
      hero.texts = JSON.parse(req.body.texts);
    }

    // If new images uploaded
    if (req.files && req.files.length > 0) {
      // Delete old cloudinary images
      for (const imgUrl of hero.images) {
        // Extract public_id safely from full Cloudinary URL
        const parts = imgUrl.split('/');
        const folder = parts[parts.length - 2];
        const fileWithExtension = parts[parts.length - 1];
        const publicId = `thousandshades/hero/${fileWithExtension.split('.')[0]}`;

        await cloudinary.uploader.destroy(publicId, {
          resource_type: 'image',
        });
      }

      // Assign new uploaded image URLs
      hero.images = req.files.map(file => file.path);
    }

    await hero.save();
    res.json(hero);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) return res.status(404).json({ message: 'Hero not found' });

    // Delete cloudinary images
    for (const img of hero.images) {
      const publicId = img.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`thousandshades/hero/${publicId}`);
    }

    await hero.deleteOne();
    res.json({ message: 'Hero deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
