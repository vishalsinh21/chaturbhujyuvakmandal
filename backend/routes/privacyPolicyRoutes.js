import express from 'express';
import { savePrivacyPolicy, getPrivacyPolicy } from '../controllers/privacyPolicyController.js';

const router = express.Router();

router.get('/getpolicy', getPrivacyPolicy);
router.post('/savepolicy', savePrivacyPolicy);

export default router;
