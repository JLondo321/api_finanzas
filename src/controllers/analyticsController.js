import { getConnection } from '../database/database.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';

//Análisis de promedios por periodo
export const obtenerPromedios = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No autorizado, falta token' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }

  const token = parts[1];
  let payload;

  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }

  const id_usuario = payload.id;
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT * FROM analisis_promedios WHERE id_usuario = ? ORDER BY periodo DESC`,
      [id_usuario]
    );
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener análisis de promedios:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  } finally {
    if (connection) connection.release();
  }
};

//Análisis de categorías
export const obtenerCategorias = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No autorizado, falta token' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }

  const token = parts[1];
  let payload;

  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }

  const id_usuario = payload.id;
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT * FROM analisis_categorias WHERE id_usuario = ?`,
      [id_usuario]
    );
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener análisis por categorías:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  } finally {
    if (connection) connection.release();
  }
};
