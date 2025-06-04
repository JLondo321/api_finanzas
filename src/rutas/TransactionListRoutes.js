// src/routes/transaccionesRoutes.js
import express from 'express';
import { obtenerTransacciones } from '../controllers/transactionListController.js';

const router = express.Router();

router.get('/lista', obtenerTransacciones);

export default router;
