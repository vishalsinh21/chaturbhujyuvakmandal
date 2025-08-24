// routes/faqRoutes.js
import express from 'express';
import { createFAQ, getAllFAQs, updateFAQ, deleteFAQ } from '../controllers/faqController.js';

const router = express.Router();

router.post('/savefaq', createFAQ);
router.get('/getfaq', getAllFAQs);
router.put('/updatefaq/:id', updateFAQ);
router.delete('/deletefaq/:id', deleteFAQ);

export default router;
