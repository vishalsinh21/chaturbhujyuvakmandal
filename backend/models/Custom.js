import mongoose from 'mongoose';

const customPhotoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  photo: { type: String, required: true },  // Cloudinary URL
}, { timestamps: true });

export default mongoose.model('CustomPhoto', customPhotoSchema);