// src/controllers/transaccionesController.js
import { getConnection } from '../database/database.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';

export const obtenerTransacciones = async (req, res) => {
  // 1. Leer header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No autorizado, falta token' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }

  const token = parts[1];

  // 2. Verificar y decodificar el JWT
  let payload;
  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
  const id_usuario = payload.id; // Ajusta si tu payload usa otro campo

  // 3. Consultar todas las transacciones de este usuario
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT 
         id_transaccion,
         id_usuario,
         id_categoria,
         titulo,
         monto,
         tipo_transaccion,
         fecha_transaccion,
         nota
       FROM transacciones
       WHERE id_usuario = ?
       ORDER BY fecha_transaccion DESC`,
      [id_usuario]
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  } finally {
    if (connection) connection.release();
  }
};
