import { Router } from 'express';
import { crearCategoria, eliminarCategoria } from '../controllers/categoriesController.js';

const router = Router();


// POST /api/categorias - Crear nueva categoría
router.post('/', crearCategoria);

// DELETE /api/categorias/:id - Eliminar categoría
router.delete('/:id', eliminarCategoria);

export default router;
