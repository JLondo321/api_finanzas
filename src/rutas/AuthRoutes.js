import express from 'express';
import {iniciarSesion} from '../controllers/loginController.js';
import {registrarUsuario} from '../controllers/registroController.js';

const router = express.Router();

router.post('/register', registrarUsuario); // POST- Registro de usuarios
router.post('/login', iniciarSesion); //  POST- Login 

export default router;