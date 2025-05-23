import bcrypt from 'bcryptjs';
import { getConnection } from '../database/database.js';

export const registrarUsuario = async (req, res) => {
    const { nombre, email, password} = req.body;

    // Validar que todos los campos estén completos
    if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    let connection;
    try {
        connection = await getConnection();

        // Verificar si ya existe un usuario con el mismo correo o número de cuenta
        const [rows] = await connection.query('SELECT * FROM usuarios WHERE correo = ?', [email]);

        if (rows.length > 0) {
            return res.status(400).json({ message: 'El correo o el número de cuenta ya están registrados.' });
        }

        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el nuevo usuario en la base de datos
        await connection.query(
            'INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)',
            [nombre, email, hashedPassword]
        );

        // Enviar respuesta exitosa
        return res.status(200).json({ message: 'Usuario registrado con éxito.' });

    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        return res.status(500).json({ message: 'Error en el servidor.' });
    } finally {
        if (connection) connection.release();
    }
};
