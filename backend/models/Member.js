import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: String,
    memberType: { 
      type: String, 
      enum: ["Member", "Bal Yuvak Mandal"], 
      default: "Member" 
    },
    phone: String,
    email: String,
    address: String,
    bio: String,
    image: String, // photo URL
  },
  { timestamps: true } // adds createdAt & updatedAt
);

export default mongoose.model("Member", memberSchema);