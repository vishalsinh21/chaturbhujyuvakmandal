import mongoose from 'mongoose';

const footerSchema = new mongoose.Schema({
  copyright: {
    type: String,
    required: true
  },
  quickLinks: [
    {
      title: { type: String, required: true },
      link: { type: String, required: true }
    }
  ],
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Footer', footerSchema);
