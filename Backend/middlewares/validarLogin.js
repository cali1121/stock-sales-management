import { check, validationResult } from 'express-validator';

export const validarLogin = [
  // Validar que el id_usuario no esté vacío
  check('id_usuario')
    .notEmpty().withMessage('El ID de usuario es obligatorio'),

  // Validar que la contraseña no esté vacía
  check('contrasena')
    .notEmpty().withMessage('La contraseña es obligatoria'),

  // Middleware final para capturar los errores
  (req, res, next) => {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errores: errores.array()
      });
    }

    next(); // Si no hay errores, sigue al controlador
  }
];