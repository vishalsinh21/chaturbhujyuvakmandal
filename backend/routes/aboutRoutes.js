import express from 'express';
import multer from 'multer';
import multerStorage from '../config/multerConfig.js';
import {
  createAboutMe,
  getAboutMe,
  updateAboutMe,
  deleteAboutMe
} from '../controllers/aboutController.js';

const router = express.Router();
const upload = multer({ storage: multerStorage });

router.post('/saveaboutme', upload.single('aboutImage'), createAboutMe);
router.get('/getaboutme', getAboutMe);
router.put('/updateaboutme/:id', upload.single('aboutImage'), updateAboutMe);
router.delete('/deleteaboutme/:id', deleteAboutMe);

export default router;
