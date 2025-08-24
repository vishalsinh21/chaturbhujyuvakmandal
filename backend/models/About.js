import mongoose from 'mongoose';

const aboutMeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String }, // Cloudinary image URL
    description: { type: String, required: true }
  },
  { timestamps: true }
);

const AboutMe = mongoose.model('About', aboutMeSchema);

export default AboutMe;