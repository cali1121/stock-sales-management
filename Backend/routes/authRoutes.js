import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const router = express.Router();

const JWT_SECRET = 'miclavesecreta123';

// Ruta de registro de usuarios
router.post('/register', async (req, res) => {
    const { id_usuario, nombre_usuario, apellido_usuario, contrasena, rol } = req.body;

    try {
        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        
        // Insertar el nuevo usuario en la base de datos
        await pool.query('INSERT INTO usuarios (id_usuario, nombre_usuario, apellido_usuario, contrasena, rol) VALUES (?, ?, ?, ?, ?)', [id_usuario, nombre_usuario, apellido_usuario, hashedPassword, rol]);

        res.status(201).json({ message: 'Usuario registrado con éxito.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
    const { id_usuario, contrasena } = req.body;
    
    try {
        // Buscar el usuario en la base de datos
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id_usuario]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Comparar la contraseña ingresada con la contraseña hasheada de la base de datos
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }
        
        // Generar un token JWT con el id y el rol del usuario
        const token = jwt.sign({ id: user.id_usuario, rol: user.rol }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

export default router;