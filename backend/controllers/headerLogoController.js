import Logo from "../models/Logo.js";
import Header from "../models/Header.js";

export const getHeaderAndLogos = async (req, res) => {
  try {
    const logos = await Logo.find().sort({ createdAt: -1 });
    const headers = await Header.find();
    
    res.status(200).json({
      logos,
      headers
    });
  } catch (error) {
    console.error("Error fetching headers and logos", error);
    res.status(500).json({ message: "Failed to fetch headers and logos", error });
  }
};
