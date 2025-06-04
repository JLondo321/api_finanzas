import { getConnection } from '../database/database.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';

export const crearTransaccion = async (req, res) => {
  // Obtener token del header Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No autorizado, falta token' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No autorizado, token inválido' });
  }

  // Decodificar token para obtener id_usuario
  let payload;
  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
  const id_usuario = payload.id; // coincidir con el payload que usas en el JWT

  // Leer datos del body
  const { id_categoria, titulo, monto, tipo_transaccion, nota } = req.body;

  // Validaciones básicas
  if (!id_categoria || !titulo || !monto || !tipo_transaccion) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }
  if (!['ingreso', 'egreso'].includes(tipo_transaccion)) {
    return res.status(400).json({ message: 'Tipo de transacción inválido' });
  }
  if (isNaN(parseFloat(monto))) {
    return res.status(400).json({ message: 'Monto inválido' });
  }

  let connection;
  try {
    connection = await getConnection();

    // Insertar la transacción en la BD
    const [result] = await connection.query(
      `INSERT INTO transacciones (id_usuario, id_categoria, titulo, monto, tipo_transaccion, nota)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_usuario, id_categoria, titulo, monto, tipo_transaccion, nota || null]
    );

    return res.status(201).json({
      message: 'Transacción creada',
      id_transaccion: result.insertId
    });
  } catch (error) {
    console.error('Error al crear transacción:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  } finally {
    if (connection) connection.release();
  }
};
