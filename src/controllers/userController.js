import { getConnection } from '../database/database.js';

export const getUserData = async (req, res) => {
    try {
        console.log('Inicio getUserData');
        const connection = await getConnection();
        console.log('Conexión obtenida');

        const correo = req.user.correo;
        console.log('Correo del usuario:', correo);

        const [userRows] = await connection.query(
            'SELECT id_usuario, nombre FROM usuarios WHERE correo = ?',
            [correo]
        );

        console.log('User rows:', userRows);

        if (userRows.length === 0) {
            connection.release();
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = userRows[0];
        const userId = user.id_usuario;

        const [resumenRows] = await connection.query(
            'SELECT ingresos_totales, egresos_totales, saldo_disponible FROM resumen_financiero WHERE id_usuario = ?',
            [userId]
        );

        console.log('Resumen rows:', resumenRows);

        const resumen = resumenRows[0] || {
            ingresos_totales: 0,
            egresos_totales: 0,
            saldo_disponible: 0,
        };

        const [categoriasRows] = await connection.query(
            'SELECT id_categoria, nombre, descripcion, color, icono FROM categorias WHERE id_usuario = ? AND activo = TRUE',
            [userId]
        );

        console.log('Categorías:', categoriasRows.length);

        const [transaccionesRows] = await connection.query(
            `SELECT 
                t.id_transaccion,
                t.titulo,
                t.monto,
                t.tipo_transaccion,
                t.fecha_transaccion,
                c.nombre AS categoria,
                c.color,
                c.icono
             FROM transacciones t
             JOIN categorias c ON t.id_categoria = c.id_categoria
             WHERE t.id_usuario = ?
             ORDER BY t.fecha_transaccion DESC
             LIMIT 5`,
            [userId]
        );

        console.log('Transacciones recientes:', transaccionesRows.length);

        connection.release();

        const response = {
        usuario: {
        nombre: user.nombre,
        id_usuario: user.id_usuario
        },
        resumen: resumen,
        categorias: categoriasRows,
        transacciones: transaccionesRows
        };
        res.json(response);

    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
