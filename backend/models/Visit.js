import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  ip: String,
  path: String,
  userAgent: String,
  deviceType: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Visit = mongoose.model('Visit', visitSchema);
export default Visit;