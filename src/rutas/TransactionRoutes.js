import express from 'express';

const router = express.Router();

router.get('/transactions'); // GET - Listar transacciones del usuario (Se pueden poner filtros)
router.post('/transactions'); //  POST - Crear nueva transacción
router.put('/transactions/:id'); // PUT - Actualizar transacción
router.delete('/transaction/:id'); // DELETE - Eliminar transacción
router.get('/transactions/recent'); // GET - Obtener transacciones recientes

export default router;