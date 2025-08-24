import express from 'express';
import multer from 'multer';
import multerStorage from '../config/multerConfig.js';


import {
  getUserPhotos, 
    saveUserPhoto, 
deleteUserPhoto
} from '../controllers/customPhotoController.js'

const router = express.Router();
const upload = multer({ 
  storage: multerStorage,
  limits: { fileSize: 1 * 1024 * 1024 } // 1MB limit
});

// Upload photo (after OTP verification complete)
router.post(
  '/upload-user-photo',
  upload.single('CustomPhoto'),
  // Middleware to validate fields
  (req, res, next) => {
    const { name, email, mobile } = req.body;

    // If somehow multer didn't parse the fields, use busboy workaround
    if (!name || !email || !mobile) {
      return res.status(400).json({ message: 'All fields (name, email, mobile) are required' });
    }
    next();
  },
  saveUserPhoto
);


// Other existing routes
router.delete('/delete-user-photo/:id', deleteUserPhoto);
router.get('/get-user-photos', getUserPhotos);

export default router;