import { useState } from 'react';
import styles from '../styles/LoginFormulario.module.css';
import { useAuth } from './authContext'; 
import { useNavigate } from 'react-router-dom';

const LoginFormulario = () => {
  const [id_usuario, setId_usuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Obtener la función de login del contexto y el hook de navegación
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id_usuario || !contrasena) {
      setError('El ID de usuario y la contraseña son obligatorios');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_usuario, contrasena }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Token recibido:', data.token);
        // Llamamos a la función de login del contexto para guardar el token
        login(data.token); 
        // Redireccionamos al usuario a la página de productos
        navigate('/productos'); 
      } else {
        setError(data.error || 'Algo salió mal, intentalo de nuevo.');
      }
    } catch (err) {
      setError('Error de red o servidor');
      console.error('Error al hacer la solicitud:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Iniciar sesión</h2>

      <label htmlFor="id_usuario">ID de Usuario:</label>
      <input
        type="text"
        id="id_usuario"
        value={id_usuario}
        onChange={e => setId_usuario(e.target.value)}
        required
      />

      <label htmlFor="contrasena">Contraseña:</label>
      <input
        type="password"
        id="contrasena"
        value={contrasena}
        onChange={e => setContrasena(e.target.value)}
        required
      />

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Cargando...' : 'Ingresar'}
      </button>
    </form>
  );
};

export default LoginFormulario;
