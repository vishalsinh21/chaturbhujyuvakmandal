import Footer from "../models/Footer.js";

export const createFooter = async (req, res) => {
  try {
    const { copyright, quickLinks, email, phone } = req.body;
    const footer = new Footer({ copyright, quickLinks, email, phone });
    await footer.save();
    res.status(201).json(footer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFooter = async (req, res) => {
  try {
    const footer = await Footer.find();
    res.json(footer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateFooter = async (req, res) => {
  try {
    const { id } = req.params;
    const { copyright, quickLinks, email, phone } = req.body;
    const updated = await Footer.findByIdAndUpdate(id, { copyright, quickLinks, email, phone }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteFooter = async (req, res) => {
  try {
    const { id } = req.params;
    await Footer.findByIdAndDelete(id);
    res.json({ message: "Footer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
