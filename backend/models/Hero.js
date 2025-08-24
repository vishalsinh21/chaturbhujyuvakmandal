import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
  texts: [{ type: String, required: true }],
  images: [{ type: String, required: true }],
}, { timestamps: true });

const Hero = mongoose.model('Hero', heroSchema);
export default Hero;
