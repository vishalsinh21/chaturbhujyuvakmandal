// routes/footerRoutes.js
import express from 'express';
import { createFooter, getFooter, updateFooter, deleteFooter } from '../controllers/footerController.js';

const router = express.Router();

router.post('/savefooter', createFooter);
router.get('/getfooter', getFooter);
router.put('/updatefooter/:id', updateFooter);
router.delete('/deletefooter/:id', deleteFooter);

export default router;
