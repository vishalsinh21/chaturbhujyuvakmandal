    import express from 'express';
    import {
    createHeader,
    getHeaders,
    updateHeader,
    deleteHeader
    } from '../controllers/headerController.js';

    const router = express.Router();

    router.post('/saveheader', createHeader);
    router.get('/getheader', getHeaders);
    router.put('/updateheader/:id', updateHeader);
    router.delete('/deleteheader/:id', deleteHeader);

    export default router;
