import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  image: { type: String, required: true },
  imageTitle: { type: String, required: true },
  imageType: { 
    type: String, 
    enum: ["Group Photo", "Ganesh Photo", "Event Photo", "Other"], 
    required: true 
  },
  year: { type: Number, required: true }
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
