import express from 'express';
import multer from 'multer';
import multerStorage from '../config/multerConfig.js';
import { createHero, getHeroes, updateHero, deleteHero } from '../controllers/heroController.js';

const upload = multer({ storage: multerStorage });
const router = express.Router();

router.post('/savehero', upload.array('images'), createHero);
router.get('/gethero', getHeroes);
router.put('/updatehero/:id', upload.array('images'), updateHero);
router.delete('/deletehero/:id', deleteHero);

export default router;
