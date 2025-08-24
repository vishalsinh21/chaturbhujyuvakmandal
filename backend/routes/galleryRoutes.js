import express from 'express';
import multer from 'multer';
import galleryStorage from '../config/multerConfig.js';
import {
  saveGallery,
  getGallery,
  updateGallery,
  deleteGallery
} from '../controllers/galleryController.js';

const router = express.Router();
const upload = multer({ storage: galleryStorage });

router.post('/savegallery', upload.single('gallery'), saveGallery);
router.get('/getgallery', getGallery);
router.put('/updategallery/:id', upload.single('gallery'), updateGallery);
router.delete('/deletegallery/:id', deleteGallery);

export default router;
