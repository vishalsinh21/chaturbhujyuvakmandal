// routes/socialIconRoutes.js
import express from 'express';
import { createSocialIcon, getAllSocialIcons, updateSocialIcon, deleteSocialIcon } from '../controllers/socailController.js';

const router = express.Router();

router.post('/save-social-icon', createSocialIcon);
router.get('/get-social-icons', getAllSocialIcons);
router.put('/update-social-icon/:id', updateSocialIcon);
router.delete('/delete-social-icon/:id', deleteSocialIcon);

export default router;
