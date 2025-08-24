import mongoose from 'mongoose';

const logoSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Logo', logoSchema);