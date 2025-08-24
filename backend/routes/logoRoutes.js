import express from 'express';
import multer from 'multer';
import storage from '../config/multerConfig.js';
import { createLogo, getLogos, deleteLogo } from '../controllers/logoController.js';

const router = express.Router();
const upload = multer({ storage });

router.post('/savelogo', upload.single('logo'), createLogo);
router.get('/getlogo', getLogos);
router.delete('/deletelogo/:id', deleteLogo);

export default router;
