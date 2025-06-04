import express from 'express';
import cors from 'cors';
import AuthRoutes from './rutas/AuthRoutes.js';
import CategoriesRoutes from './rutas/CategoriesRoutes.js';
import TransactionListRoutes from './rutas/TransactionListRoutes.js';
import TransactionRoutes from './rutas/TransactionRoutes.js';
import UserRoutes from './rutas/UserRoutes.js';
import AnalyticsRoutes from './rutas/AnalyticsRoutes.js'
import dotenv from 'dotenv';


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Middleware de logging para debug
app.use((req, res, next) => {
  console.log(`🔍 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});


app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API de finanzas personales" });
});
// Registrar rutas
app.use("/api/auth", AuthRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/categorias", CategoriesRoutes);
app.use("/api/transactions", TransactionRoutes);
app.use("/api/transactions", TransactionListRoutes);
app.use("/api/analytics", AnalyticsRoutes);



// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).send({
    status: 404,
    message: "La ruta solicitada no existe"
  });
});

// Middleware para manejar errores (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    status: 500,
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : {}
  });
});

// Definir puerto y arrancar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});



export default app;