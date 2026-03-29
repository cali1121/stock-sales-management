import express from 'express';
import pool from '../config/db.js';
import { verifyToken, verifyRole } from '../middlewares/validarToken.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Para crear un nuevo producto (CREATE)
router.post('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  // Ahora también extraemos la descripción del cuerpo de la solicitud
  const { nombre, descripcion, precio, stock } = req.body;

  // Validación de precios en el backend
  if (precio <= 0) {
    return res.status(400).json({ error: 'El precio debe ser un número positivo.' });
  }

  try {
    // Se corrige la consulta para incluir el campo 'descripcion'
    const [result] = await pool.query('INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)', [nombre, descripcion, precio, stock]);
    // Respondemos con el ID del nuevo producto
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

//Para actualizar un producto existente (UPDATE)
router.put('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  const { id } = req.params;
  // Ahora también extraemos la descripción del cuerpo de la solicitud
  const { nombre, descripcion, precio, stock } = req.body;

  // Validación de precios en el backend
  if (precio <= 0) {
    return res.status(400).json({ error: 'El precio debe ser un número positivo.' });
  }

  try {
    // Se corrige la consulta para incluir el campo 'descripcion' en la actualización
    await pool.query('UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?', [nombre, descripcion, precio, stock, id]);
    res.status(200).json({ message: 'Producto actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

//Para eliminar un producto (DELETE)
router.delete('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM productos WHERE id = ?', [id]);
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

export default router;

