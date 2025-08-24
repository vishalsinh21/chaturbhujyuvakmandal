import express from 'express';

import { 
  sendEmailOtp, 
  verifyEmailOtp 
} from '../controllers/sendOtpController.js';

const router = express.Router();

// Send OTP to email
router.post('/send-otp', sendEmailOtp);

// Verify OTP before allowing upload
router.post('/verify-otp', verifyEmailOtp);

export default router;