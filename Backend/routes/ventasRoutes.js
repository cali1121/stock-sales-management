import express from 'express';
import pool from '../config/db.js';
import { verifyToken, verifyRole } from '../middlewares/validarToken.js';

const router = express.Router();

// Crear una nueva venta
router.post('/', verifyToken, verifyRole(['admin' ,  'vendedor']), async (req, res) => {
  try {
    const { productos } = req.body; // esperar [{ id: 1, cantidad: 5 }, ...]

    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'Debe incluir al menos un producto en la venta.' });
    }

    // Consolidar cantidades por producto.id
    const consolidado = productos.reduce((acc, p) => {
      const id = Number(p.id);
      const qty = Number(p.cantidad) || 0;
      if (!acc[id]) acc[id] = 0;
      acc[id] += qty;
      return acc;
    }, {});

    const productosConsolidados = Object.entries(consolidado).map(([id, cantidad]) => ({
      id: Number(id),
      cantidad: Number(cantidad)
    }));

    // Validar stock para cada producto consolidado
    for (const prod of productosConsolidados) {
      const [rows] = await pool.query('SELECT stock FROM productos WHERE id = ?', [prod.id]);
      if (rows.length === 0) return res.status(404).json({ error: `Producto ${prod.id} no encontrado.` });
      if (rows[0].stock < prod.cantidad) return res.status(400).json({ error: `Stock insuficiente para producto ${prod.id}.` });
    }

    // Crear la venta
    const [ventaResult] = await pool.query('INSERT INTO ventas (fecha) VALUES (NOW())');
    const ventaId = ventaResult.insertId;

    // Preparar detalles para inserción en bloque
    const detallesVenta = productosConsolidados.map(p => [ventaId, p.id, p.cantidad]);

    // Actualizar stock y luego insertar los detalles en bloque
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (const p of productosConsolidados) {
        await conn.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [p.cantidad, p.id]);
      }
      await conn.query('INSERT INTO detalles_venta (venta_id, producto_id, cantidad) VALUES ?', [detallesVenta]);
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    res.status(201).json({ message: 'Venta registrada con éxito.', ventaId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar la venta.' });
  }
});
// Listar ventas con filtro por fecha
router.get('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;

  try {
    let query = `
      SELECT v.id AS venta_id, v.fecha, dv.producto_id, dv.cantidad, p.nombre AS producto_nombre
      FROM ventas v
      JOIN detalles_venta dv ON v.id = dv.venta_id
      JOIN productos p ON dv.producto_id = p.id
    `;
    const params = [];

    if (fechaInicio && fechaFin) {
      query += ' WHERE v.fecha BETWEEN ? AND ?';
      params.push(fechaInicio, fechaFin);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar las ventas.' });
  }
});
export default router;