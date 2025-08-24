import PrivacyPolicy from '../models/privacyPolicy.js';

// Create or update policy
export const savePrivacyPolicy = async (req, res) => {
  try {
    const { content, updatedBy } = req.body;

    let policy = await PrivacyPolicy.findOne();
    if (policy) {
      policy.content = content;
      policy.updatedBy = updatedBy || 'Admin';
      await policy.save();
    } else {
      policy = await PrivacyPolicy.create({ content, updatedBy });
    }

    res.status(200).json(policy);
  } catch (error) {
    res.status(500).json({ message: 'Error saving privacy policy', error });
  }
};

// Get policy
export const getPrivacyPolicy = async (req, res) => {
  try {
    const policy = await PrivacyPolicy.findOne();
    res.status(200).json(policy);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching privacy policy', error });
  }
};
