import { useState } from 'react';
import styles from '../styles/RegisterFormulario.module.css';
import { Link } from 'react-router-dom';

const RegisterFormulario = () => {
  const [id_usuario, setId_usuario] = useState('');
  const [nombre_usuario, setNombre_usuario] = useState('');
  const [apellido_usuario, setApellido_usuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('vendedor');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id_usuario || !nombre_usuario || !apellido_usuario || !contrasena || !rol) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_usuario, nombre_usuario, apellido_usuario, contrasena, rol }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsRegistered(true);
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

  // Si el registro fue exitoso, mostramos el mensaje y el enlace
  if (isRegistered) {
    return (
      <div className={styles.form}>
        <h2>¡Registro exitoso!</h2>
        <p>Ahora puedes iniciar sesión con tu nuevo usuario.</p>
        <Link to="/login" className={styles.button}>
          Ir a Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Registrar usuario</h2>
      <label htmlFor="id_usuario">ID de Usuario:</label>
      <input
        type="text"
        id="id_usuario"
        value={id_usuario}
        onChange={e => setId_usuario(e.target.value)}
        required
      />
      <label htmlFor="nombre_usuario">Nombre:</label>
      <input
        type="text"
        id="nombre_usuario"
        value={nombre_usuario}
        onChange={e => setNombre_usuario(e.target.value)}
        required
      />
      <label htmlFor="apellido_usuario">Apellido:</label>
      <input
        type="text"
        id="apellido_usuario"
        value={apellido_usuario}
        onChange={e => setApellido_usuario(e.target.value)}
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
      <label htmlFor="rol">Rol:</label>
      <select id="rol" value={rol} onChange={e => setRol(e.target.value)} required>
        <option value="vendedor">Vendedor</option>
        <option value="admin">Administrador</option>
      </select>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Registrando...' : 'Registrar'}
      </button>
    </form>
  );
};

export default RegisterFormulario;