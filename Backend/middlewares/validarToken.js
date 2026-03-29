import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'miclavesecreta123';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token no proporcionado.' });
  const parts = authHeader.split(' ');
  const token = parts.length === 2 ? parts[1] : null;
  if (!token) return res.status(401).json({ error: 'Formato de token incorrecto.' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log('JWT payload en backend:', payload); // <-- LOG para depuración
    req.user = payload;
    next();
  } catch (err) {
    console.error('Token inválido:', err.message);
    return res.status(403).json({ error: 'Token no válido o expirado.' });
  }
};

// normalize roles and compare in lowercase
export const verifyRole = (allowedRoles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'No autenticado.' });
  const raw = (req.user?.rol ?? req.user?.role ?? '').toString().trim().toLowerCase();
  if (allowedRoles.length === 0) return next();
  const allowedNormalized = allowedRoles.map(r => r.toString().toLowerCase());
  if (allowedNormalized.includes(raw)) return next();
  return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente.' });
};