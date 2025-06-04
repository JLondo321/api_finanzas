import express from 'express';
import { obtenerPromedios, obtenerCategorias } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/promedios', obtenerPromedios);
router.get('/categorias', obtenerCategorias);

export default router;