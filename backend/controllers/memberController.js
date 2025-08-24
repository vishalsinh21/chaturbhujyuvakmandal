import Member from "../models/Member.js";

export const createMember = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      console.log("Uploaded file:", req.file); // 👀 debug
      data.image = req.file.path; // Cloudinary URL
    }


    const member = new Member(data);
    await member.save();

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: "Error creating member", error });
  }
};

// ✅ Update Member by _id
export const updateMember = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.image = req.file.path; // ✅ Cloudinary URL
    }

    const updated = await Member.findByIdAndUpdate(req.params.id, data, { new: true });

    if (!updated) return res.status(404).json({ message: "Member not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating member", error });
  }
};

// ✅ Get All Members
export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 }); // newest first
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: "Error fetching members", error });
  }
};

// ✅ Get Member by _id
export const getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: "Error fetching member", error });
  }
};



// ✅ Delete Member by _id
export const deleteMember = async (req, res) => {
  try {
    const deleted = await Member.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Member not found" });
    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting member", error });
  }
};
