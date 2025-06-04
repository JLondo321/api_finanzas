import express from 'express';
import { crearTransaccion } from '../controllers/transactionController.js';

const router = express.Router();

router.post('/transacciones', crearTransaccion);

export default router;
