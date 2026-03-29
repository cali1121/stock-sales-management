import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './components/authContext';
import LoginFormulario from './components/LoginFormulario';
import RegisterFormulario from './components/RegisterFormulario';
import Productos from './components/Productos';
import './App.css';
import Navbar from './components/navbar';
import RegistrarVenta from './components/RegistrarVenta';
import ListadoVentas from './components/ListadoVentas';

// Componente para la barra de navegación que incluye el botón de logout y registro
const App = () => {
  const { isLoggedIn, isAdmin } = useAuth();

  return (
    <BrowserRouter>
      {/* Navbar siempre visible */}
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/productos" /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<LoginFormulario />} />
        <Route path="/register" element={<RegisterFormulario />} />
        <Route
          path="/productos"
          element={isLoggedIn ? <Productos /> : <Navigate to="/login" />}
        />
        <Route
          path="/registrar-venta"
          element={isLoggedIn ? <RegistrarVenta /> : <Navigate to="/login" />}
        />
        <Route path="/listado-ventas" element={isAdmin ? <ListadoVentas /> : <Navigate to="/productos" />} />
        <Route
          path="*"
          element={<h1 className="text-center mt-10 text-xl font-bold">Página no encontrada</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;