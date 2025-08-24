import FAQ from '../models/Faq.js';

// Create FAQ
export const createFAQ = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newFAQ = new FAQ({ title, description });
    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All FAQs
export const getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update FAQ
export const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const updatedFAQ = await FAQ.findByIdAndUpdate(id, { title, description }, { new: true });
    res.json(updatedFAQ);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete FAQ
export const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    await FAQ.findByIdAndDelete(id);
    res.json({ message: 'FAQ deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
