import jwt from 'jsonwebtoken';
import config from '../config.js';


export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    console.log('Cabeceras de la solicitud:', req.headers); // Log de las cabeceras

    if (!token) {
        console.error('Token de autenticación faltante');
        return res.status(401).json({ message: 'Token de autenticación faltante' });
    }

    console.log('Token recibido:', token); // Log del token recibido

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            console.error('Error de verificación del token:', err); // Log del error
            return res.status(403).json({ message: 'Token no válido' });
        }

        console.log('Token decodificado:', decoded); // Log de los datos decodificados

        req.user = {
            id_usuario: decoded.id,      
            correo: decoded.correo 
        };

        next(); 
    });
};
