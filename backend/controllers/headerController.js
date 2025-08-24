import Header from '../models/Header.js';

// Create Header
export const createHeader = async (req, res) => {
  try {
    const { title, link } = req.body;
    const newHeader = new Header({ title, link });
    await newHeader.save();
    res.status(201).json(newHeader);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create header', error });
  }
};

// Get All Headers
export const getHeaders = async (req, res) => {
  try {
    const headers = await Header.find();
    res.status(200).json(headers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch headers', error });
  }
};

// Update Header
export const updateHeader = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedHeader = await Header.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedHeader);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update header', error });
  }
};

// Delete Header
export const deleteHeader = async (req, res) => {
  try {
    const { id } = req.params;
    await Header.findByIdAndDelete(id);
    res.status(200).json({ message: 'Header deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete header', error });
  }
};
