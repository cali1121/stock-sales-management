import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './authContext';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const { isLoggedIn, isAdmin, logout, user } = useAuth();
  const location = useLocation();

  const roleRaw = (user?.rol ?? user?.role ?? '').toString().trim().toLowerCase();
  const roleLabel = isLoggedIn ? (roleRaw === 'admin' ? 'Admin' : 'Vendedor') : '';

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.title}>App de Gestión</h1>

      <div className={styles.links}>
        {/* Mostrar rol cuando esté autenticado */}
        {isLoggedIn && <span className={styles.roleBadge}>{roleLabel}</span>}
        {isLoggedIn && <Link to="/productos" className={styles.link}>Productos</Link>}
        {isLoggedIn && <Link to="/registrar-venta" className={styles.link}>Registrar Venta</Link>}
        {isAdmin && <Link to="/listado-ventas" className={styles.link}>Listado Ventas</Link>}
        
        {isLoggedIn ? (
          <button onClick={logout} className={styles.buttonLink}>Cerrar sesión</button>
        ) : (
          <>
            <Link to="/login" className={styles.link}>Login</Link>
            <Link to="/register" className={styles.link}>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;