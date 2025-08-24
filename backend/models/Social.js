// models/socialIconModel.js
import mongoose from 'mongoose';

const socialIconSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true  // You will store icon name like "FaInstagram", "FaLinkedin"
  }
}, { timestamps: true });

export default mongoose.model('SocialIcon', socialIconSchema);
