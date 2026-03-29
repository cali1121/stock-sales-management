import React, { useEffect, useState } from 'react';
import { useAuth } from './authContext'; 
import styles from '../styles/RegistrarVenta.module.css';

const RegistrarVenta = () => {
  const [productos, setProductos] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [qty, setQty] = useState('');
  const [cart, setCart] = useState([]); // { id, nombre, cantidad }
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth(); 

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch('http://localhost:5000/api/productos', {
          headers: { 'Content-Type': 'application/json', ...authHeader },
        });

        if (res.status === 401) {
          setError('No autorizado. Por favor inicia sesión de nuevo.');
          setProductos([]);
          return;
        }
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

        const data = await res.json();
        setProductos(Array.isArray(data) ? data : []); // asegurar array
      } catch (err) {
        console.error('Error al obtener productos:', err);
        setProductos([]);
        setError('No se pudieron cargar los productos.');
      }
    };

    fetchProductos();
  }, [token]);

  const handleAddToCart = () => {
    setError(''); setSuccess('');
    const id = Number(selectedId);
    const cantidad = Number(qty) || 0;
    if (!id) return setError('Seleccione un producto.');
    if (cantidad <= 0) return setError('Ingrese una cantidad válida (> 0).');

    const producto = productos.find(p => p.id === id);
    if (!producto) return setError('Producto no encontrado.');
    if (cantidad > producto.stock) return setError('Cantidad supera el stock disponible.');

    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        const nuevaCantidad = existing.cantidad + cantidad;
        if (nuevaCantidad > producto.stock) {
          setError('Total en carrito supera el stock disponible.');
          return prev;
        }
        return prev.map(item => item.id === id ? { ...item, cantidad: nuevaCantidad } : item);
      } else {
        return [...prev, { id, nombre: producto.nombre, cantidad }];
      }
    });

    setSelectedId('');
    setQty('');
  };

  const handleRemove = (id) => {
    setCart(prev => prev.filter(it => it.id !== id));
  };

  const handleSubmit = async () => {
    setError(''); setSuccess(''); setLoading(true);
    if (cart.length === 0) { setError('El carrito está vacío.'); setLoading(false); return; }

    const ventaProductos = cart.map(({ id, cantidad }) => ({ id, cantidad }));

    try {
      const authToken = token || localStorage.getItem('authToken');
      const res = await fetch('http://localhost:5000/api/ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({ productos: ventaProductos })
      });

      const text = await res.text(); // siempre leer body para depuración
      console.log('RegistrarVenta -> /api/ventas status:', res.status, 'body:', text);

      // intentar parsear JSON si corresponde
      let data;
      try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }

      if (!res.ok) {
        // mostrar mensaje del backend si existe
        const msg = data?.error || text || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      setSuccess('Venta registrada. ID: ' + (data?.ventaId ?? 'desconocido'));
      setCart([]);
      setProductos(prev => prev.map(p => {
        const t = ventaProductos.find(v => v.id === p.id);
        return t ? { ...p, stock: p.stock - t.cantidad } : p;
      }));
    } catch (err) {
      console.error('RegistrarVenta error:', err);
      setError(err.message || 'Error al registrar venta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Registrar Venta</h2>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.controls}>
        <select
          className={styles.select}
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
        >
          <option value="">-- Seleccione producto --</option>
  { Array.isArray(productos) && productos.map(p => (
    <option key={p.id} value={p.id}>
      {p.nombre} (stock: {p.stock})
    </option>
  )) }
        </select>

        <input
          className={styles.qtyInput}
          type="number"
          min="1"
          value={qty}
          placeholder="Cantidad"
          onChange={e => setQty(e.target.value)}
        />

        <button className={styles.addButton} onClick={handleAddToCart}>Agregar</button>
      </div>

      <div>
        <h3>Carrito</h3>
        {cart.length === 0 ? (
          <div>No hay productos en el carrito.</div>
        ) : (
          <table className={styles.cartTable}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Producto</th>
                <th style={{ textAlign: 'right' }}>Cantidad</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td style={{ textAlign: 'right' }}>{item.cantidad}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className={styles.removeButton} onClick={() => handleRemove(item.id)}>Quitar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div>
        <button className={styles.submitButton} onClick={handleSubmit} disabled={loading || cart.length === 0}>
          {loading ? 'Enviando...' : 'Registrar Venta'}
        </button>
      </div>
    </div>
  );
};

export default RegistrarVenta;