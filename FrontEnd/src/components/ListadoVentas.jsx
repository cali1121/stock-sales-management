import React, { useState, useEffect } from 'react';
import { useAuth } from './authContext';
import styles from '../styles/ListadoVentas.module.css';

const ListadoVentas = () => {
  const { token, logout } = useAuth();
  const [ventas, setVentas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20; // filas por página

  const formatDate = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return value; // fallback si no es fecha válida
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };

const fetchVentas = async () => {
    try {
      const authHeader = token || localStorage.getItem('authToken');
      const res = await fetch(`http://localhost:5000/api/ventas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: `Bearer ${authHeader}` } : {})
        }
      });
      if (res.status === 401) {
        // opcional: forzar logout si token inválido
        // logout();
        throw new Error('401');
      }
      if (!res.ok) throw new Error(`Error en la solicitud: ${res.status}`);
      const data = await res.json();
      setVentas(data);
      setPage(1);
    } catch (err) {
      console.error('Error al cargar ventas:', err);
    }
  };

  useEffect(() => { fetchVentas(); }, [fechaInicio, fechaFin, token]);

    const totalPages = Math.max(1, Math.ceil(ventas.length / pageSize));
  const pageData = ventas.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <h2>Listado de Ventas</h2>
      <input type="date" onChange={e => setFechaInicio(e.target.value)} />
      <input type="date" onChange={e => setFechaFin(e.target.value)} />
      <button onClick={fetchVentas}>Filtrar</button>
      <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Fecha</th>
            <th>Producto</th>
            <th>Cantidad</th>
          </tr>
        </thead>
<tbody>
  {pageData.map((venta, i) => (
              <tr key={`${venta.venta_id}-${venta.producto_id}-${i}`}>
                <td>{venta.venta_id}</td>
                <td>{formatDate(venta.fecha)}</td>
                <td>{venta.producto_nombre}</td>
                <td>{venta.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 8 }}>
        <button onClick={() => setPage(1)} disabled={page === 1}>« Primero</button>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
        <span style={{ margin: '0 8px' }}>{page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
        <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>Último »</button>
      </div>
    </div>
  );
};

export default ListadoVentas;