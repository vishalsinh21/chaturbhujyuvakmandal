import express from 'express';
import { submitContact, getAllContacts, deleteContact } from '../controllers/contactController.js';

const router = express.Router();

router.post('/submit-contact', submitContact);
router.get('/get-contacts', getAllContacts);
router.delete('/delete-contact/:id', deleteContact);

export default router;
