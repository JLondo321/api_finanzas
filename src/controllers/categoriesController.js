import { getConnection } from '../database/database.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';

// Helper: extrae id_usuario de JWT en header
const getUserIdFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw { status: 401, message: 'No autorizado, falta token' };
  const parts = authHeader.split(' ');
  if (parts[0] !== 'Bearer' || !parts[1]) throw { status: 401, message: 'Formato de token inválido' };
  try {
    const payload = jwt.verify(parts[1], config.jwtSecret);
    return payload.id;
  } catch (err) {
    throw { status: 403, message: 'Token inválido o expirado' };
  }
};

// Crear una nueva categoría
export const crearCategoria = async (req, res) => {
  let connection;
  try {
    const id_usuario = getUserIdFromHeader(req);
    const { nombre, descripcion = null, color, icono } = req.body;
    if (!nombre || !color || !icono) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    connection = await getConnection();
    const [result] = await connection.query(
      'INSERT INTO categorias (id_usuario, nombre, descripcion, color, icono) VALUES (?, ?, ?, ?, ?)',
      [id_usuario, nombre, descripcion, color, icono]
    );
    res.status(201).json({ id_categoria: result.insertId, nombre, descripcion, color, icono });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Error en el servidor' });
  } finally {
    if (connection) connection.release();
  }
};

// Eliminar (desactivar) una categoría
export const eliminarCategoria = async (req, res) => {
  let connection;
  try {
    const id_usuario = getUserIdFromHeader(req);
    const { id } = req.params;
    connection = await getConnection();
    await connection.query(
      'UPDATE categorias SET activo = FALSE WHERE id_categoria = ? AND id_usuario = ?',
      [id, id_usuario]
    );
    res.json({ message: 'Categoría eliminada' });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Error en el servidor' });
  } finally {
    if (connection) connection.release();
  }
};
