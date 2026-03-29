import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Función para manejar la solicitud de login
export const login = async (req, res) => {
  console.log('Body recibido:', req.body);
 const { id_usuario, contrasena } = req.body;
 const sql = 'SELECT * FROM usuarios WHERE id_usuario = ?';

 try {
  const [rows] = await pool.query(sql, [id_usuario]);
  console.log('Usuario encontrado:', rows[0]);

  if (rows.length === 0) {
   return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const usuario = rows[0];
  const contrasenaCorrecta = bcrypt.compareSync(contrasena, usuario.contrasena);

  if (!contrasenaCorrecta) {
   return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
   { id: usuario.id, rol: usuario.rol },
  process.env.JWT_SECRET,
   { expiresIn: '2h' }
  );

  res.json({ mensaje: 'Login exitoso', token });

 } catch (err) {
  console.error(err);
  return res.status(500).json({ error: 'Error en la base de datos' });
 }
};

export const register = async (req, res) => {
 const { id_usuario, nombre_usuario, apellido_usuario, rol, contrasena } = req.body;

 try {
  const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id_usuario]);

  if (existingUser.length > 0) {
   return res.status(400).json({ error: 'El nombre de usuario ya está registrado' });
  }

  const hashedPassword = bcrypt.hashSync(contrasena, 10);
  const sql = 'INSERT INTO usuarios (nombre_usuario, apellido_usuario, id_usuario, rol, contrasena) VALUES (?, ?, ?, ?, ?)';

  const [result] = await pool.query(sql, [nombre_usuario, apellido_usuario, id_usuario, rol, hashedPassword]);

  const userId = result.insertId;

  res.status(201).json({ mensaje: 'Usuario registrado con éxito', userId });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Error al registrar el usuario' });
 }
};