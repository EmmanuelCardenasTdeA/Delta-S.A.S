-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-11-2025 a las 18:21:16
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `inventariodeltav2`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `addProductToBodega` (IN `p_id_bodega` BIGINT, IN `p_id_producto` BIGINT, IN `p_cantidad` INT)   BEGIN
    DECLARE v_existente INT DEFAULT 0;

    SELECT COUNT(*) INTO v_existente
    FROM bodega_producto
    WHERE id_bodega = p_id_bodega AND id_producto = p_id_producto;

    IF v_existente > 0 THEN
        -- Ya existe, actualizamos el stock
        UPDATE bodega_producto
        SET stock = stock + p_cantidad,
            fecha_registro = CURDATE()
        WHERE id_bodega = p_id_bodega AND id_producto = p_id_producto;
    ELSE
        -- No existe, insertamos nuevo registro
        INSERT INTO bodega_producto (id_bodega, id_producto, stock, fecha_registro)
        VALUES (p_id_bodega, p_id_producto, p_cantidad, CURDATE());
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `createBodega` (IN `p_nombre` VARCHAR(50))   BEGIN
    INSERT INTO bodega (nombre)
    VALUES (p_nombre);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `createProduct` (IN `p_nombre` VARCHAR(50), IN `p_material` VARCHAR(50), IN `p_detalle` VARCHAR(50))   BEGIN
    INSERT INTO producto (nombre, material, detalle)
    VALUES (p_nombre, p_material, p_detalle);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `createSell` (IN `p_id_producto` BIGINT, IN `p_id_bodega` BIGINT, IN `p_cantidad` INT, IN `p_fecha` DATETIME, IN `p_id_usuario` BIGINT)   BEGIN
    DECLARE v_stock_actual INT;

    -- Verificar existencia de stock
    SELECT stock INTO v_stock_actual
    FROM bodega_producto
    WHERE id_producto = p_id_producto AND id_bodega = p_id_bodega;

    IF v_stock_actual IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No existe registro de stock para este producto';
    ELSEIF v_stock_actual < p_cantidad THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock insuficiente para la venta';
    ELSE
        -- Registrar venta
        INSERT INTO venta (id_producto, id_bodega, cantidad, Fecha, id_responsable, Estado)
        VALUES (p_id_producto, p_id_bodega, p_cantidad, p_fecha, p_id_usuario, 'Activo');

        -- Actualizar stock
        UPDATE bodega_producto
        SET stock = v_stock_actual - p_cantidad
        WHERE id_producto = p_id_producto AND id_bodega = p_id_bodega;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `createUser` (IN `p_id` BIGINT, IN `p_nombre` VARCHAR(50), IN `p_apellido` VARCHAR(50), IN `p_rol` CHAR(10))   BEGIN
    INSERT INTO usuario (id_documento, nombre, apellido, rol)
    VALUES (p_id, p_nombre, p_apellido, p_rol);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteBodega` (IN `p_id` BIGINT)   BEGIN
    DELETE FROM bodega WHERE id_bodega = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteProduct` (IN `p_id` BIGINT)   BEGIN
    DELETE FROM producto WHERE id_producto = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteUser` (IN `p_id` BIGINT)   BEGIN
    DELETE FROM usuario WHERE id_documento = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getBodegaProducts` (IN `p_id_bodega` BIGINT)   BEGIN
    SELECT 
        bp.id_producto,
        p.nombre AS nombre_producto,
        bp.stock,
        b.nombre AS nombre_bodega
    FROM bodega_producto bp
    INNER JOIN producto p ON bp.id_producto = p.id_producto
    INNER JOIN bodega b ON bp.id_bodega = b.id_bodega
    WHERE bp.id_bodega = p_id_bodega;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getBodegas` ()   BEGIN
    SELECT * FROM bodega;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getProducts` ()   BEGIN
    SELECT * FROM producto;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getSells` ()   BEGIN
    SELECT 
        v.id_venta AS id_sell,
        v.id_producto AS id_product,
        p.nombre AS nombre_producto,
        v.id_bodega AS id_bodega,
        b.nombre AS nombre_bodega,
        v.cantidad AS lot,
        v.Fecha AS date,
        v.id_responsable AS id_user,
        CONCAT(u.nombre, ' ', u.apellido) AS nombre_usuario,
        v.Estado AS status
    FROM venta v
    INNER JOIN producto p ON v.id_producto = p.id_producto
    INNER JOIN bodega b ON v.id_bodega = b.id_bodega
    INNER JOIN usuario u ON v.id_responsable = u.id_documento
    ORDER BY v.id_venta DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getStock` (IN `p_id_producto` BIGINT, IN `p_id_bodega` BIGINT)   BEGIN
    SELECT stock
    FROM bodega_producto
    WHERE id_producto = p_id_producto
      AND id_bodega = p_id_bodega;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getUsers` ()   BEGIN
    SELECT * FROM usuario;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getUsuariosActivos` ()   BEGIN
    SELECT 
        id_documento, 
        nombre, 
        rol
    FROM usuario
    WHERE rol IN ('Vendedor', 'Admin')
    ORDER BY 
        CASE rol
            WHEN 'Admin' THEN 1
            WHEN 'Vendedor' THEN 2
        END,
        nombre ASC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getVentasPorBodega` ()   BEGIN
    SELECT b.nombre AS nombre_bodega, SUM(v.cantidad) AS cantidad
    FROM venta v
    INNER JOIN bodega b ON v.id_bodega = b.id_bodega
    GROUP BY v.id_bodega
    ORDER BY cantidad DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getVentasPorDia` ()   BEGIN
    SELECT DATE(Fecha) AS dia, SUM(cantidad) AS total
    FROM venta
    GROUP BY DATE(Fecha)
    ORDER BY DATE(Fecha) ASC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getVentasPorProducto` ()   BEGIN
    SELECT p.nombre AS nombre_producto, SUM(v.cantidad) AS cantidad
    FROM venta v
    INNER JOIN producto p ON v.id_producto = p.id_producto
    GROUP BY v.id_producto
    ORDER BY cantidad DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getVentasPorUsuario` ()   BEGIN
    SELECT u.nombre AS nombre_usuario, SUM(v.cantidad) AS cantidad
    FROM venta v
    INNER JOIN usuario u ON v.id_responsable = u.id_documento
    GROUP BY v.id_responsable
    ORDER BY cantidad DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `searchBodega` (IN `p_busqueda` VARCHAR(100))   BEGIN
    SELECT 
        id_bodega,
        nombre
    FROM bodega
    WHERE 
        nombre LIKE CONCAT('%', p_busqueda, '%')
        OR id_bodega LIKE CONCAT('%', p_busqueda, '%')
    ORDER BY nombre ASC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `searchProducto` (IN `p_busqueda` VARCHAR(100))   BEGIN
    SELECT 
        id_producto,
        nombre,
        material,
        detalle
    FROM producto
    WHERE 
        nombre LIKE CONCAT('%', p_busqueda, '%')
        OR material LIKE CONCAT('%', p_busqueda, '%')
        OR detalle LIKE CONCAT('%', p_busqueda, '%')
        OR id_producto LIKE CONCAT('%', p_busqueda, '%')
    ORDER BY nombre ASC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `searchUsuario` (IN `p_busqueda` VARCHAR(100))   BEGIN
    SELECT 
        id_documento,
        nombre,
        apellido,
        rol
    FROM usuario
    WHERE 
        nombre LIKE CONCAT('%', p_busqueda, '%')
        OR apellido LIKE CONCAT('%', p_busqueda, '%')
        OR rol LIKE CONCAT('%', p_busqueda, '%')
        OR id_documento LIKE CONCAT('%', p_busqueda, '%')
    ORDER BY nombre, apellido;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `searchVenta` (IN `p_busqueda` VARCHAR(100))   BEGIN
    SELECT 
        v.id_venta AS id_sell,
        v.id_producto AS id_product,
        p.nombre AS nombre_producto,
        v.id_bodega AS id_bodega,
        b.nombre AS nombre_bodega,
        v.cantidad AS lot,
        v.Fecha AS date,
        v.id_responsable AS id_user,
        CONCAT(u.nombre, ' ', u.apellido) AS nombre_usuario,
        v.Estado AS status
    FROM venta v
    INNER JOIN producto p ON v.id_producto = p.id_producto
    INNER JOIN bodega b ON v.id_bodega = b.id_bodega
    INNER JOIN usuario u ON v.id_responsable = u.id_documento
    WHERE 
        p.nombre LIKE CONCAT('%', p_busqueda, '%')
        OR b.nombre LIKE CONCAT('%', p_busqueda, '%')
        OR u.nombre LIKE CONCAT('%', p_busqueda, '%')
        OR u.apellido LIKE CONCAT('%', p_busqueda, '%')
        OR v.id_venta LIKE CONCAT('%', p_busqueda, '%')
        OR v.Estado LIKE CONCAT('%', p_busqueda, '%')
    ORDER BY v.id_venta DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `updateBodega` (IN `p_id` BIGINT, IN `p_nombre` VARCHAR(50))   BEGIN
    UPDATE bodega
    SET nombre = p_nombre
    WHERE id_bodega = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `updateProduct` (IN `p_id` BIGINT, IN `p_nombre` VARCHAR(50), IN `p_material` VARCHAR(50), IN `p_detalle` VARCHAR(50))   BEGIN
    UPDATE producto
    SET nombre = p_nombre,
        material = p_material,
        detalle = p_detalle
    WHERE id_producto = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `updateSell` (IN `p_id_venta` BIGINT, IN `p_id_producto` BIGINT, IN `p_id_bodega` BIGINT, IN `p_cantidad` INT, IN `p_fecha` DATETIME, IN `p_id_usuario` BIGINT)   BEGIN
    UPDATE venta
    SET id_producto = p_id_producto,
        id_bodega = p_id_bodega,
        cantidad = p_cantidad,
        Fecha = p_fecha,
        id_responsable = p_id_usuario
    WHERE id_venta = p_id_venta;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `updateSellStatus` (IN `p_id_venta` BIGINT, IN `p_estado` ENUM('Activo','Inactivo','Cancelada'))   BEGIN
    UPDATE venta
    SET Estado = p_estado
    WHERE id_venta = p_id_venta;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `updateStock` (IN `p_id_producto` BIGINT, IN `p_id_bodega` BIGINT, IN `p_nuevo_stock` INT)   BEGIN
    UPDATE bodega_producto
    SET stock = p_nuevo_stock
    WHERE id_producto = p_id_producto
      AND id_bodega = p_id_bodega;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `updateUser` (IN `p_old_id` BIGINT, IN `p_new_id` BIGINT, IN `p_nombre` VARCHAR(50), IN `p_apellido` VARCHAR(50), IN `p_rol` CHAR(10))   BEGIN
    UPDATE usuario
    SET id_documento = p_new_id,
        nombre = p_nombre,
        apellido = p_apellido,
        rol = p_rol
    WHERE id_documento = p_old_id;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bodega`
--

CREATE TABLE `bodega` (
  `id_bodega` bigint(20) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `bodega`
--

INSERT INTO `bodega` (`id_bodega`, `nombre`) VALUES
(0, 'ENTRADA'),
(1, 'Bodega Central'),
(2, 'Bodega Norte'),
(3, 'Bodega Sur'),
(4, 'Bodega de Secado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bodega_producto`
--

CREATE TABLE `bodega_producto` (
  `id_bodega` bigint(20) DEFAULT NULL,
  `id_producto` bigint(20) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `fecha_registro` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `bodega_producto`
--

INSERT INTO `bodega_producto` (`id_bodega`, `id_producto`, `stock`, `fecha_registro`) VALUES
(1, 1, 1500, '2025-10-25'),
(1, 2, 500, '2025-10-25'),
(1, 3, 300, '2025-10-25'),
(1, 4, 200, '2025-10-25'),
(1, 5, 500, '2025-10-25'),
(2, 1, 1200, '2025-10-25'),
(2, 2, 900, '2025-10-25'),
(2, 3, 250, '2025-10-25'),
(2, 4, 180, '2025-10-25'),
(2, 5, 400, '2025-10-25'),
(3, 1, 1800, '2025-10-25'),
(3, 2, 700, '2025-10-25'),
(3, 3, 150, '2025-10-25'),
(3, 4, 220, '2025-10-25'),
(3, 5, 450, '2025-10-25'),
(4, 1, 900, '2025-10-25'),
(4, 2, 650, '2025-10-25'),
(4, 3, 150, '2025-10-25'),
(4, 4, 120, '2025-10-25'),
(4, 5, 300, '2025-10-25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `despacho`
--

CREATE TABLE `despacho` (
  `id_despacho` bigint(20) NOT NULL,
  `id_venta` bigint(20) DEFAULT NULL,
  `nombre_despacho` varchar(50) DEFAULT NULL,
  `apellido_despacho` varchar(50) DEFAULT NULL,
  `id` bigint(20) DEFAULT NULL,
  `placa` char(10) DEFAULT NULL,
  `empresa` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `produccion`
--

CREATE TABLE `produccion` (
  `id_lote` bigint(20) NOT NULL,
  `id_producto` bigint(20) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `id_responsable` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_producto` bigint(20) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `material` varchar(50) DEFAULT NULL,
  `detalle` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id_producto`, `nombre`, `material`, `detalle`) VALUES
(0, 'Ladrilo de 10', 'Arcilla', 'ladrillo de 10x20x40'),
(1, 'Ladrillo Rojo Estándar', 'Arcilla', 'Medidas 25x12x7 cm'),
(2, 'Bloque de Concreto', 'Cemento y Arena', 'Bloque hueco 40x20x15 cm'),
(3, 'Ladrillo Refractario', 'Arcilla Refractaria', 'Resiste altas temperaturas'),
(4, 'Teja Colonial', 'Arcilla', 'Color rojo natural, uso en techos'),
(5, 'Ladrillo Ecológico', 'Cemento y Polvo de Piedra', 'Fabricado con material reciclado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_documento` bigint(20) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `rol` char(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_documento`, `nombre`, `apellido`, `rol`) VALUES
(0, 'ADMIN', 'ADMIN', 'ADMIN'),
(1, 'Emmanuel', 'Cardenas', 'DICKTADOR'),
(2, 'Natalia', 'Ossa', 'DUEÑA'),
(3, 'Kuro', 'LeCastor', 'PERRA'),
(4, 'El', 'Mock', 'PERROTA'),
(1000762850, 'Santiago', 'Salazar', 'Admin'),
(1001001001, 'Carlos', 'Ramírez', 'Admin'),
(1001001002, 'Ana', 'Gómez', 'Vendedor'),
(1001001003, 'Luis', 'Martínez', 'Bodega'),
(1001001004, 'María', 'Torres', 'Vendedor'),
(1001001005, 'Jorge', 'Pérez', 'Bodega'),
(1001001006, 'Camila', 'Fernández', 'Vendedor'),
(1001001007, 'Andrés', 'Castillo', 'Admin'),
(1001001008, 'Paola', 'Suárez', 'Bodega'),
(1001001009, 'Felipe', 'Morales', 'Vendedor'),
(1001001010, 'Daniela', 'Cruz', 'Bodega');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `id_venta` bigint(20) NOT NULL,
  `id_producto` bigint(20) DEFAULT NULL,
  `id_bodega` bigint(20) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `Fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `id_responsable` bigint(20) DEFAULT NULL,
  `Estado` enum('Activo','Inactivo','Cancelada') NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `venta`
--

INSERT INTO `venta` (`id_venta`, `id_producto`, `id_bodega`, `cantidad`, `Fecha`, `id_responsable`, `Estado`) VALUES
(4, 2, 1, 100, '2025-10-31 20:00:00', 1, 'Activo'),
(7, 3, 3, 200, '2025-11-08 01:10:00', 1001001002, 'Activo');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bodega`
--
ALTER TABLE `bodega`
  ADD PRIMARY KEY (`id_bodega`);

--
-- Indices de la tabla `bodega_producto`
--
ALTER TABLE `bodega_producto`
  ADD KEY `FK_bodega_producto` (`id_producto`),
  ADD KEY `FK_bodega_producto_bodega` (`id_bodega`);

--
-- Indices de la tabla `despacho`
--
ALTER TABLE `despacho`
  ADD PRIMARY KEY (`id_despacho`),
  ADD KEY `FK_Despacho_Venta` (`id_venta`);

--
-- Indices de la tabla `produccion`
--
ALTER TABLE `produccion`
  ADD PRIMARY KEY (`id_lote`),
  ADD KEY `FK_Produccion_Usuario` (`id_responsable`),
  ADD KEY `FK_Produccion_Inventario` (`id_producto`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_documento`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`id_venta`),
  ADD KEY `FK_Venta_Usuario` (`id_responsable`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `id_venta` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `bodega_producto`
--
ALTER TABLE `bodega_producto`
  ADD CONSTRAINT `FK_bodega_inventario_Bodega` FOREIGN KEY (`id_bodega`) REFERENCES `bodega` (`id_bodega`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_bodega_inventario_Inventario` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_bodega_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_bodega_producto_bodega` FOREIGN KEY (`id_bodega`) REFERENCES `bodega` (`id_bodega`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `despacho`
--
ALTER TABLE `despacho`
  ADD CONSTRAINT `FK_Despacho_Venta` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `produccion`
--
ALTER TABLE `produccion`
  ADD CONSTRAINT `FK_Produccion_Inventario` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_Produccion_Usuario` FOREIGN KEY (`id_responsable`) REFERENCES `usuario` (`id_documento`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `FK_Venta_Usuario` FOREIGN KEY (`id_responsable`) REFERENCES `usuario` (`id_documento`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
