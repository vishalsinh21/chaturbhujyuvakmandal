import UserPhoto from '../models/Custom.js';
import { generateConfirmationEmailTemplate } from '../utils/confirmationTemplate.js';
import cloudinary from '../config/cloudinaryConfig.js';
import createTransporter from '../config/transporter.js';

export const saveUserPhoto = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Photo is required' });

    const userPhoto = new UserPhoto({
      name,
      email,
      mobile,
      photo: req.file.path
    });

    await userPhoto.save();

    // Send confirmation email
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for choosing us!',
      html: generateConfirmationEmailTemplate(name)
    });

    res.status(201).json(userPhoto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const getUserPhotos = async (req, res) => {
  try {
    const userPhotos = await UserPhoto.find().sort({ createdAt: -1 });
    res.json(userPhotos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
export const deleteUserPhoto = async (req, res) => {
  try {
    const userPhoto = await UserPhoto.findById(req.params.id);
    if (!userPhoto) return res.status(404).json({ message: 'User Photo not found' });

    const fileName = userPhoto.photo.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`thousandshades/CustomPhoto/${fileName}`);

    await userPhoto.deleteOne();
    res.json({ message: 'User photo deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
