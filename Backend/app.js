import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import productosRoutes from './routes/productosRoutes.js';
import ventasRoutes from './routes/ventasRoutes.js';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json()); // Para poder leer JSON en req.body
app.use(morgan('dev'));  // Muestra las peticiones en consola

// Rutas principales
app.use('/api/auth', authRoutes); // /api/auth/login, /api/auth/register
app.use(['/api/productos', '/api/productos/'], productosRoutes); // /api/productos
app.use('/api/ventas', ventasRoutes); // /api/ventas

// Ruta base de prueba
app.get('/', (req, res) => {
 res.send('API funcionando 🚀');
});

// Middleware de manejo de errores global (opcional)
app.use((err, req, res, next) => {
 console.error(err.stack);
 res.status(500).json({
 success: false,
 message: 'Error interno del servidor',
 error: err.message
 });
});

export default app;