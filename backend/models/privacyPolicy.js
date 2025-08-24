import mongoose from 'mongoose';

const privacyPolicySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      default: 'Admin',
    },
  },
  { timestamps: true }
);

const PrivacyPolicy = mongoose.model('PrivacyPolicy', privacyPolicySchema);
export default PrivacyPolicy;
