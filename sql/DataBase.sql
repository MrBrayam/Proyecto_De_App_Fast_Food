-- ============================================
-- BASE DE DATOS: SISTEMA FAST FOOD
-- Creado: 2025
-- Todas las variables y tablas en español
-- ============================================

-- Crear base de datos
DROP DATABASE IF EXISTS sistema_fast_food;
CREATE DATABASE sistema_fast_food CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE sistema_fast_food;

-- ============================================
-- TABLA: SUCURSALES
-- ============================================
CREATE TABLE sucursales (
    id_sucursal INT PRIMARY KEY AUTO_INCREMENT,
    nombre_sucursal VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    horario_apertura TIME,
    horario_cierre TIME,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: ROLES
-- ============================================
CREATE TABLE roles (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: USUARIOS (Administradores, Meseros, Cajeros, Repartidores)
-- ============================================
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    dni VARCHAR(20) NOT NULL UNIQUE,
    nombre_completo VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(200),
    fecha_nacimiento DATE,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    id_sucursal INT,
    foto_perfil VARCHAR(255),
    estado ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo',
    fecha_contratacion DATE,
    salario DECIMAL(10,2),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal)
);

-- ============================================
-- TABLA: MESEROS (Información adicional)
-- ============================================
CREATE TABLE meseros (
    id_mesero INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL UNIQUE,
    mesas_asignadas VARCHAR(50),
    turno ENUM('mañana', 'tarde', 'noche'),
    horario_inicio TIME,
    horario_fin TIME,
    propinas_mes DECIMAL(10,2) DEFAULT 0,
    pedidos_atendidos INT DEFAULT 0,
    calificacion_promedio DECIMAL(3,2) DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- ============================================
-- TABLA: CAJEROS (Información adicional)
-- ============================================
CREATE TABLE cajeros (
    id_cajero INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL UNIQUE,
    numero_caja VARCHAR(20),
    turno ENUM('mañana', 'tarde', 'noche'),
    horario_inicio TIME,
    horario_fin TIME,
    ventas_dia DECIMAL(10,2) DEFAULT 0,
    ventas_mes DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- ============================================
-- TABLA: REPARTIDORES (Información adicional)
-- ============================================
CREATE TABLE repartidores (
    id_repartidor INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL UNIQUE,
    tipo_vehiculo VARCHAR(50),
    placa_vehiculo VARCHAR(20),
    licencia_conducir VARCHAR(50),
    turno ENUM('mañana', 'tarde', 'noche'),
    horario_inicio TIME,
    horario_fin TIME,
    pedidos_entregados_dia INT DEFAULT 0,
    pedidos_entregados_mes INT DEFAULT 0,
    propinas_dia DECIMAL(10,2) DEFAULT 0,
    propinas_mes DECIMAL(10,2) DEFAULT 0,
    calificacion_promedio DECIMAL(3,2) DEFAULT 0,
    estado_conexion ENUM('disponible', 'en_ruta', 'descanso') DEFAULT 'disponible',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- ============================================
-- TABLA: CATEGORIAS DE PRODUCTOS
-- ============================================
CREATE TABLE categorias (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    imagen VARCHAR(255),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: PRODUCTOS (Menú)
-- ============================================
CREATE TABLE productos (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre_producto VARCHAR(150) NOT NULL,
    descripcion TEXT,
    id_categoria INT,
    precio DECIMAL(10,2) NOT NULL,
    costo DECIMAL(10,2),
    imagen VARCHAR(255),
    tiempo_preparacion INT COMMENT 'Tiempo en minutos',
    disponible BOOLEAN DEFAULT TRUE,
    es_promocion BOOLEAN DEFAULT FALSE,
    stock_disponible INT DEFAULT 0,
    ingredientes TEXT,
    calorias INT,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

-- ============================================
-- TABLA: PROMOCIONES
-- ============================================
CREATE TABLE promociones (
    id_promocion INT PRIMARY KEY AUTO_INCREMENT,
    nombre_promocion VARCHAR(150) NOT NULL,
    descripcion TEXT,
    tipo_descuento ENUM('porcentaje', 'monto_fijo'),
    valor_descuento DECIMAL(10,2) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    hora_inicio TIME,
    hora_fin TIME,
    dias_aplicables SET('lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'),
    monto_minimo DECIMAL(10,2) DEFAULT 0,
    usos_maximos INT,
    usos_actuales INT DEFAULT 0,
    codigo_promocion VARCHAR(50) UNIQUE,
    estado ENUM('activo', 'inactivo', 'expirado') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: PRODUCTOS EN PROMOCION
-- ============================================
CREATE TABLE productos_promocion (
    id_producto_promocion INT PRIMARY KEY AUTO_INCREMENT,
    id_promocion INT NOT NULL,
    id_producto INT NOT NULL,
    FOREIGN KEY (id_promocion) REFERENCES promociones(id_promocion) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
);

-- ============================================
-- TABLA: CLIENTES
-- ============================================
CREATE TABLE clientes (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    dni VARCHAR(20) UNIQUE,
    nombre_completo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    direccion VARCHAR(200),
    direccion_entrega TEXT,
    referencias_direccion TEXT,
    fecha_nacimiento DATE,
    puntos_acumulados INT DEFAULT 0,
    total_compras DECIMAL(10,2) DEFAULT 0,
    numero_pedidos INT DEFAULT 0,
    cliente_frecuente BOOLEAN DEFAULT FALSE,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: MESAS
-- ============================================
CREATE TABLE mesas (
    id_mesa INT PRIMARY KEY AUTO_INCREMENT,
    numero_mesa VARCHAR(20) NOT NULL,
    id_sucursal INT NOT NULL,
    capacidad INT NOT NULL,
    ubicacion VARCHAR(100),
    estado ENUM('disponible', 'ocupada', 'reservada', 'mantenimiento') DEFAULT 'disponible',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal)
);

-- ============================================
-- TABLA: PEDIDOS
-- ============================================
CREATE TABLE pedidos (
    id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    numero_pedido VARCHAR(50) NOT NULL UNIQUE,
    id_cliente INT,
    id_sucursal INT NOT NULL,
    id_mesero INT,
    id_cajero INT,
    id_repartidor INT,
    id_mesa INT,
    tipo_pedido ENUM('local', 'delivery', 'para_llevar') NOT NULL,
    estado ENUM('pendiente', 'en_preparacion', 'listo', 'en_camino', 'entregado', 'cancelado') DEFAULT 'pendiente',
    subtotal DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    id_promocion INT,
    impuesto DECIMAL(10,2) DEFAULT 0,
    propina DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'yape', 'plin') NOT NULL,
    estado_pago ENUM('pendiente', 'pagado', 'cancelado') DEFAULT 'pendiente',
    observaciones TEXT,
    tiempo_estimado INT COMMENT 'Tiempo estimado en minutos',
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega TIMESTAMP NULL,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal),
    FOREIGN KEY (id_mesero) REFERENCES meseros(id_mesero),
    FOREIGN KEY (id_cajero) REFERENCES cajeros(id_cajero),
    FOREIGN KEY (id_repartidor) REFERENCES repartidores(id_repartidor),
    FOREIGN KEY (id_mesa) REFERENCES mesas(id_mesa),
    FOREIGN KEY (id_promocion) REFERENCES promociones(id_promocion)
);

-- ============================================
-- TABLA: DETALLE DE PEDIDOS
-- ============================================
CREATE TABLE detalle_pedidos (
    id_detalle INT PRIMARY KEY AUTO_INCREMENT,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    observaciones TEXT,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- ============================================
-- TABLA: INVENTARIO
-- ============================================
CREATE TABLE inventario (
    id_inventario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_insumo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    categoria_insumo VARCHAR(100),
    unidad_medida ENUM('kg', 'g', 'l', 'ml', 'unidad', 'caja', 'paquete'),
    cantidad_actual DECIMAL(10,2) NOT NULL,
    cantidad_minima DECIMAL(10,2) NOT NULL,
    cantidad_maxima DECIMAL(10,2),
    precio_unitario DECIMAL(10,2),
    id_sucursal INT,
    estado ENUM('disponible', 'agotado', 'por_vencer', 'vencido') DEFAULT 'disponible',
    fecha_vencimiento DATE,
    proveedor VARCHAR(150),
    telefono_proveedor VARCHAR(20),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal)
);

-- ============================================
-- TABLA: MOVIMIENTOS DE INVENTARIO
-- ============================================
CREATE TABLE movimientos_inventario (
    id_movimiento INT PRIMARY KEY AUTO_INCREMENT,
    id_inventario INT NOT NULL,
    tipo_movimiento ENUM('entrada', 'salida', 'ajuste', 'merma'),
    cantidad DECIMAL(10,2) NOT NULL,
    motivo TEXT,
    id_usuario INT,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_inventario) REFERENCES inventario(id_inventario),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- ============================================
-- TABLA: IMPRESORAS
-- ============================================
CREATE TABLE impresoras (
    id_impresora INT PRIMARY KEY AUTO_INCREMENT,
    nombre_impresora VARCHAR(100) NOT NULL,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    tipo ENUM('tickets', 'cocina', 'comandas', 'factura') NOT NULL,
    direccion_ip VARCHAR(50),
    puerto VARCHAR(20),
    id_sucursal INT,
    ubicacion VARCHAR(100),
    estado ENUM('activo', 'inactivo', 'mantenimiento') DEFAULT 'activo',
    fecha_instalacion DATE,
    ultima_revision DATE,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal)
);

-- ============================================
-- TABLA: REPORTES
-- ============================================
CREATE TABLE reportes (
    id_reporte INT PRIMARY KEY AUTO_INCREMENT,
    tipo_reporte VARCHAR(100) NOT NULL,
    nombre_reporte VARCHAR(150) NOT NULL,
    descripcion TEXT,
    id_usuario INT,
    id_sucursal INT,
    fecha_inicio DATE,
    fecha_fin DATE,
    datos_reporte JSON,
    archivo_generado VARCHAR(255),
    estado ENUM('generado', 'enviado', 'archivado') DEFAULT 'generado',
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal)
);

-- ============================================
-- TABLA: NOTIFICACIONES
-- ============================================
CREATE TABLE notificaciones (
    id_notificacion INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    tipo_notificacion ENUM('pedido', 'inventario', 'sistema', 'promocion', 'alerta'),
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    prioridad ENUM('baja', 'media', 'alta', 'urgente') DEFAULT 'media',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- ============================================
-- TABLA: HISTORIAL DE SESIONES
-- ============================================
CREATE TABLE historial_sesiones (
    id_sesion INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    direccion_ip VARCHAR(50),
    navegador VARCHAR(100),
    dispositivo VARCHAR(100),
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- ============================================
-- TABLA: CONFIGURACION DEL SISTEMA
-- ============================================
CREATE TABLE configuracion_sistema (
    id_configuracion INT PRIMARY KEY AUTO_INCREMENT,
    clave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT NOT NULL,
    descripcion TEXT,
    tipo_dato ENUM('texto', 'numero', 'boolean', 'json'),
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- INSERTAR DATOS INICIALES
-- ============================================

-- Insertar Roles
INSERT INTO roles (nombre_rol, descripcion) VALUES
('Super Administrador', 'Acceso completo al sistema'),
('Administrador', 'Gestión de sucursal y operaciones'),
('Mesero', 'Atención de mesas y pedidos'),
('Cajero', 'Gestión de pagos y facturación'),
('Repartidor', 'Entrega de pedidos a domicilio'),
('Cocinero', 'Preparación de alimentos');

-- Insertar Sucursales
INSERT INTO sucursales (nombre_sucursal, direccion, telefono, email, horario_apertura, horario_cierre) VALUES
('Miraflores', 'Av. Larco 1234, Miraflores', '01-2345678', 'miraflores@fastfood.com', '08:00:00', '23:00:00'),
('San Isidro', 'Av. Conquistadores 567, San Isidro', '01-3456789', 'sanisidro@fastfood.com', '08:00:00', '23:00:00'),
('Surco', 'Av. Benavides 890, Surco', '01-4567890', 'surco@fastfood.com', '08:00:00', '23:00:00');

-- Insertar Usuario Administrador por defecto (contraseña: admin123)
INSERT INTO usuarios (dni, nombre_completo, email, telefono, usuario, contrasena, id_rol, id_sucursal, fecha_contratacion, salario) VALUES
('12345678', 'Carlos Alberto Rodríguez', 'admin@fastfood.com', '987654321', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2024-01-01', 3500.00);

-- Insertar Categorías
INSERT INTO categorias (nombre_categoria, descripcion) VALUES
('Pizzas', 'Pizzas artesanales con ingredientes frescos'),
('Hamburguesas', 'Hamburguesas gourmet y clásicas'),
('Bebidas', 'Bebidas frías y calientes'),
('Postres', 'Postres caseros y deliciosos'),
('Ensaladas', 'Ensaladas frescas y saludables'),
('Entradas', 'Aperitivos y entradas para compartir');

-- Insertar Productos de ejemplo
INSERT INTO productos (nombre_producto, descripcion, id_categoria, precio, costo, tiempo_preparacion, stock_disponible) VALUES
('Pizza Hawaiana', 'Pizza con piña, jamón y queso mozzarella', 1, 35.00, 15.00, 20, 50),
('Pizza Pepperoni', 'Pizza con pepperoni y queso mozzarella', 1, 40.00, 18.00, 20, 45),
('Pizza Vegetariana', 'Pizza con vegetales frescos', 1, 38.00, 16.00, 20, 40),
('Hamburguesa Clásica', 'Hamburguesa con carne, lechuga, tomate y queso', 2, 25.00, 12.00, 15, 60),
('Hamburguesa BBQ', 'Hamburguesa con salsa BBQ y aros de cebolla', 2, 28.00, 14.00, 15, 55),
('Coca Cola 500ml', 'Bebida gaseosa', 3, 5.00, 2.50, 0, 200),
('Limonada Natural', 'Limonada fresca preparada al momento', 3, 8.00, 3.00, 5, 100);

-- Insertar Mesas
INSERT INTO mesas (numero_mesa, id_sucursal, capacidad, ubicacion) VALUES
('Mesa 1', 1, 4, 'Zona principal'),
('Mesa 2', 1, 4, 'Zona principal'),
('Mesa 3', 1, 2, 'Zona terraza'),
('Mesa 4', 1, 6, 'Zona VIP'),
('Mesa 5', 2, 4, 'Zona principal'),
('Mesa 6', 2, 4, 'Zona principal'),
('Mesa 7', 3, 4, 'Zona principal'),
('Mesa 8', 3, 2, 'Zona bar');

-- Insertar Configuración del sistema
INSERT INTO configuracion_sistema (clave, valor, descripcion, tipo_dato) VALUES
('impuesto_igv', '18', 'Porcentaje de IGV aplicable', 'numero'),
('moneda', 'S/.', 'Símbolo de moneda', 'texto'),
('tiempo_sesion', '3600', 'Tiempo de sesión en segundos', 'numero'),
('pedido_minimo_delivery', '20', 'Monto mínimo para delivery', 'numero'),
('costo_delivery', '5', 'Costo de delivery estándar', 'numero');

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista de Pedidos Completos
CREATE VIEW vista_pedidos_completos AS
SELECT 
    p.id_pedido,
    p.numero_pedido,
    c.nombre_completo AS cliente,
    c.telefono AS telefono_cliente,
    s.nombre_sucursal AS sucursal,
    u_mesero.nombre_completo AS mesero,
    u_cajero.nombre_completo AS cajero,
    u_repartidor.nombre_completo AS repartidor,
    p.tipo_pedido,
    p.estado,
    p.subtotal,
    p.descuento,
    p.impuesto,
    p.propina,
    p.total,
    p.metodo_pago,
    p.estado_pago,
    p.fecha_pedido,
    p.fecha_entrega
FROM pedidos p
LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
LEFT JOIN sucursales s ON p.id_sucursal = s.id_sucursal
LEFT JOIN meseros m ON p.id_mesero = m.id_mesero
LEFT JOIN usuarios u_mesero ON m.id_usuario = u_mesero.id_usuario
LEFT JOIN cajeros caj ON p.id_cajero = caj.id_cajero
LEFT JOIN usuarios u_cajero ON caj.id_usuario = u_cajero.id_usuario
LEFT JOIN repartidores r ON p.id_repartidor = r.id_repartidor
LEFT JOIN usuarios u_repartidor ON r.id_usuario = u_repartidor.id_usuario;

-- Vista de Inventario con Alertas
CREATE VIEW vista_inventario_alertas AS
SELECT 
    i.id_inventario,
    i.nombre_insumo,
    i.categoria_insumo,
    i.cantidad_actual,
    i.cantidad_minima,
    i.unidad_medida,
    s.nombre_sucursal,
    i.estado,
    CASE 
        WHEN i.cantidad_actual <= i.cantidad_minima THEN 'CRÍTICO'
        WHEN i.cantidad_actual <= (i.cantidad_minima * 1.5) THEN 'BAJO'
        ELSE 'NORMAL'
    END AS nivel_stock,
    i.fecha_vencimiento,
    DATEDIFF(i.fecha_vencimiento, CURDATE()) AS dias_para_vencer
FROM inventario i
LEFT JOIN sucursales s ON i.id_sucursal = s.id_sucursal;

-- Vista de Ventas Diarias por Sucursal
CREATE VIEW vista_ventas_diarias AS
SELECT 
    DATE(p.fecha_pedido) AS fecha,
    s.nombre_sucursal,
    COUNT(p.id_pedido) AS total_pedidos,
    SUM(p.total) AS total_ventas,
    AVG(p.total) AS promedio_venta,
    SUM(CASE WHEN p.tipo_pedido = 'local' THEN 1 ELSE 0 END) AS pedidos_local,
    SUM(CASE WHEN p.tipo_pedido = 'delivery' THEN 1 ELSE 0 END) AS pedidos_delivery,
    SUM(CASE WHEN p.tipo_pedido = 'para_llevar' THEN 1 ELSE 0 END) AS pedidos_para_llevar
FROM pedidos p
JOIN sucursales s ON p.id_sucursal = s.id_sucursal
WHERE p.estado_pago = 'pagado'
GROUP BY DATE(p.fecha_pedido), s.id_sucursal;

-- ============================================
-- PROCEDIMIENTOS ALMACENADOS
-- ============================================

DELIMITER //

-- Procedimiento para registrar un nuevo pedido
CREATE PROCEDURE sp_registrar_pedido(
    IN p_id_cliente INT,
    IN p_id_sucursal INT,
    IN p_tipo_pedido VARCHAR(20),
    IN p_metodo_pago VARCHAR(20),
    IN p_observaciones TEXT,
    OUT p_numero_pedido VARCHAR(50)
)
BEGIN
    DECLARE v_numero INT;
    
    -- Generar número de pedido
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_pedido, 2) AS UNSIGNED)), 0) + 1 
    INTO v_numero 
    FROM pedidos 
    WHERE DATE(fecha_pedido) = CURDATE();
    
    SET p_numero_pedido = CONCAT('#', LPAD(v_numero, 4, '0'));
    
    -- Insertar pedido
    INSERT INTO pedidos (numero_pedido, id_cliente, id_sucursal, tipo_pedido, metodo_pago, observaciones, subtotal, total)
    VALUES (p_numero_pedido, p_id_cliente, p_id_sucursal, p_tipo_pedido, p_metodo_pago, p_observaciones, 0, 0);
END//

-- Procedimiento para actualizar stock de inventario
CREATE PROCEDURE sp_actualizar_stock_inventario(
    IN p_id_inventario INT,
    IN p_cantidad DECIMAL(10,2),
    IN p_tipo_movimiento VARCHAR(20),
    IN p_motivo TEXT,
    IN p_id_usuario INT
)
BEGIN
    DECLARE v_cantidad_actual DECIMAL(10,2);
    
    -- Obtener cantidad actual
    SELECT cantidad_actual INTO v_cantidad_actual FROM inventario WHERE id_inventario = p_id_inventario;
    
    -- Actualizar inventario
    IF p_tipo_movimiento = 'entrada' THEN
        UPDATE inventario SET cantidad_actual = cantidad_actual + p_cantidad WHERE id_inventario = p_id_inventario;
    ELSE
        UPDATE inventario SET cantidad_actual = cantidad_actual - p_cantidad WHERE id_inventario = p_id_inventario;
    END IF;
    
    -- Registrar movimiento
    INSERT INTO movimientos_inventario (id_inventario, tipo_movimiento, cantidad, motivo, id_usuario)
    VALUES (p_id_inventario, p_tipo_movimiento, p_cantidad, p_motivo, p_id_usuario);
    
    -- Actualizar estado si es necesario
    UPDATE inventario 
    SET estado = CASE 
        WHEN cantidad_actual <= 0 THEN 'agotado'
        WHEN cantidad_actual <= cantidad_minima THEN 'disponible'
        ELSE 'disponible'
    END
    WHERE id_inventario = p_id_inventario;
END//

DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

DELIMITER //

-- Trigger para actualizar total de compras del cliente
CREATE TRIGGER tr_actualizar_cliente_compras
AFTER UPDATE ON pedidos
FOR EACH ROW
BEGIN
    IF NEW.estado_pago = 'pagado' AND OLD.estado_pago != 'pagado' THEN
        UPDATE clientes 
        SET total_compras = total_compras + NEW.total,
            numero_pedidos = numero_pedidos + 1,
            cliente_frecuente = IF(numero_pedidos + 1 >= 10, TRUE, FALSE)
        WHERE id_cliente = NEW.id_cliente;
    END IF;
END//

-- Trigger para actualizar ventas del cajero
CREATE TRIGGER tr_actualizar_ventas_cajero
AFTER UPDATE ON pedidos
FOR EACH ROW
BEGIN
    IF NEW.estado_pago = 'pagado' AND OLD.estado_pago != 'pagado' AND NEW.id_cajero IS NOT NULL THEN
        UPDATE cajeros 
        SET ventas_dia = ventas_dia + NEW.total,
            ventas_mes = ventas_mes + NEW.total
        WHERE id_cajero = NEW.id_cajero;
    END IF;
END//

-- Trigger para actualizar estadísticas del repartidor
CREATE TRIGGER tr_actualizar_repartidor_stats
AFTER UPDATE ON pedidos
FOR EACH ROW
BEGIN
    IF NEW.estado = 'entregado' AND OLD.estado != 'entregado' AND NEW.id_repartidor IS NOT NULL THEN
        UPDATE repartidores 
        SET pedidos_entregados_dia = pedidos_entregados_dia + 1,
            pedidos_entregados_mes = pedidos_entregados_mes + 1,
            propinas_dia = propinas_dia + NEW.propina,
            propinas_mes = propinas_mes + NEW.propina
        WHERE id_repartidor = NEW.id_repartidor;
    END IF;
END//

DELIMITER ;

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

CREATE INDEX idx_pedidos_fecha ON pedidos(fecha_pedido);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_cliente ON pedidos(id_cliente);
CREATE INDEX idx_pedidos_sucursal ON pedidos(id_sucursal);
CREATE INDEX idx_productos_categoria ON productos(id_categoria);
CREATE INDEX idx_usuarios_rol ON usuarios(id_rol);
CREATE INDEX idx_inventario_sucursal ON inventario(id_sucursal);
CREATE INDEX idx_inventario_estado ON inventario(estado);

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
