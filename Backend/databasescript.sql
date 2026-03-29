create database StockyVentas;
use StockyVentas; 

CREATE TABLE `productos` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(255) NOT NULL,
    `descripcion` TEXT,
    `precio` DECIMAL(10, 2) NOT NULL CHECK (`precio` > 0),
    `stock` INT UNSIGNED NOT NULL,
    `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_actualizacion` DATETIME
);
CREATE TABLE `usuarios` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`nombre_usuario` VARCHAR(255) NOT NULL,
    `apellido_usuario` VARCHAR(255) NOT NULL,
    `id_usuario` VARCHAR(50) NOT NULL UNIQUE,
    `rol` VARCHAR(50) NOT NULL,
    `contrasena` VARCHAR(255) NOT NULL,
    `fecha_registro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `ventas` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `fecha` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `detalles_venta` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `venta_id` INT UNSIGNED NOT NULL,
    `producto_id` INT UNSIGNED NOT NULL,
    `cantidad` INT UNSIGNED NOT NULL,
    FOREIGN KEY (`venta_id`) REFERENCES `ventas`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE CASCADE
);

INSERT INTO productos (nombre, descripcion, precio, stock)
VALUES ('Laptop Gamer', 'Laptop de alto rendimiento para videojuegos.', 1250.00, 15);
INSERT INTO productos (nombre, descripcion, precio, stock)
VALUES ('Teclado Mecánico', 'Teclado con retroiluminación RGB, ideal para gaming y programación.', 85.50, 50);
INSERT INTO productos (nombre, descripcion, precio, stock)
VALUES ('Mouse Inalámbrico', 'Mouse ergonómico de 8000 DPI con batería recargable.', 45.99, 120);
INSERT INTO productos (nombre, descripcion, precio, stock)
VALUES ('Monitor 4K 27"', 'Monitor de alta resolución con tasa de refresco de 144Hz.', 499.00, 25);
INSERT INTO productos (nombre, descripcion, precio, stock)
VALUES ('Audífonos Bluetooth', 'Audífonos con cancelación de ruido y micrófono integrado.', 75.00, 90);

