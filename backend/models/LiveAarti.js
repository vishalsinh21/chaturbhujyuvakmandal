import mongoose from "mongoose";

const LiveAartiSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Live Aarti" }, // optional, default title
    youtubeLink: { type: String, required: true }, // YouTube live stream link
    isActive: { type: Boolean, default: true }, // toggle visibility
  },
  { timestamps: true }
);

export default mongoose.model("LiveAarti", LiveAartiSchema);
