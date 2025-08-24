import mongoose from "mongoose";

const AartiTimingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., Morning Aarti, Evening Aarti
    time: { type: String, required: true }, // store as string like "06:00 AM"
    day: { type: String, default: "Everyday" }, // optional: day or weekday
    notes: { type: String }, // optional
  },
  { timestamps: true }
);

const AartiTiming = mongoose.model("AartiTiming", AartiTimingSchema);
export default AartiTiming;
