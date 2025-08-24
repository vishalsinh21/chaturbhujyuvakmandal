import express from 'express';
import { recordVisit, getAllVisits, getVisitCount } from '../controllers/visitController.js';

const router = express.Router();

router.post('/visits/record', recordVisit);
router.get('/visits/all', getAllVisits);
router.get('/visits/count', getVisitCount);

export default router;