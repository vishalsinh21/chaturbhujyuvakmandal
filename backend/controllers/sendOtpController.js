import nodemailer from 'nodemailer';
import EmailOtp from '../models/otp.js';
import { generateOtpEmailTemplate } from '../utils/otpTemplate.js';

// Send OTP and store in DB
export const sendEmailOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Save to database
    await EmailOtp.create({ email, otp: otpCode });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      html: generateOtpEmailTemplate(otpCode),
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error("Failed to send OTP:", err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// Verify OTP from DB
export const verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

  try {
    const record = await EmailOtp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Delete OTP after successful verification
    await EmailOtp.deleteOne({ _id: record._id });

    return res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error("OTP verification failed:", err);
    res.status(500).json({ message: 'Server error' });
  }
};