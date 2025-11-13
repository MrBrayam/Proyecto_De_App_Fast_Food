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

-- Insertar Sucursales (Ubicaciones reales de San Martín, Perú)
INSERT INTO sucursales (nombre_sucursal, direccion, telefono, email, horario_apertura, horario_cierre) VALUES
('Morales', 'Jr. Lima 345, Morales, San Martín', '042-526789', 'morales@fastfood.com', '08:00:00', '23:00:00'),
('Partido Alto', 'Av. Perú 567, Partido Alto, Moyobamba', '042-562134', 'partidoalto@fastfood.com', '08:00:00', '23:00:00'),
('La Banda de Shilcayo', 'Jr. San Martín 890, La Banda de Shilcayo, Tarapoto', '042-528456', 'labanda@fastfood.com', '08:00:00', '23:00:00');

-- Insertar Usuario Administrador por defecto (contraseña: admin123)
INSERT INTO usuarios (dni, nombre_completo, email, telefono, usuario, contrasena, id_rol, id_sucursal, fecha_contratacion, salario) VALUES
('12345678', 'Carlos Alberto Rodríguez', 'admin@fastfood.com', '987654321', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2024-01-01', 3500.00);

-- Insertar más usuarios de ejemplo
INSERT INTO usuarios (dni, nombre_completo, email, telefono, usuario, contrasena, id_rol, id_sucursal, fecha_contratacion, salario) VALUES
('23456789', 'María Elena Vásquez', 'mesero1@fastfood.com', '987123456', 'mesero1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, 1, '2024-02-01', 1500.00),
('34567890', 'José Luis Fernández', 'cajero1@fastfood.com', '987234567', 'cajero1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 4, 1, '2024-02-01', 1800.00),
('45678901', 'Ana Patricia Ruiz', 'repartidor1@fastfood.com', '987345678', 'repartidor1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 5, 1, '2024-02-01', 1600.00),
('56789012', 'Pedro Miguel Torres', 'cocinero1@fastfood.com', '987456789', 'cocinero1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 6, 1, '2024-02-01', 2000.00);

-- Insertar empleados específicos
INSERT INTO meseros (id_usuario, mesas_asignadas, turno, horario_inicio, horario_fin) VALUES
(2, '1,2,3,4', 'mañana', '08:00:00', '16:00:00');

INSERT INTO cajeros (id_usuario, numero_caja, turno, horario_inicio, horario_fin) VALUES
(3, 'CAJA-001', 'mañana', '08:00:00', '16:00:00');

INSERT INTO repartidores (id_usuario, tipo_vehiculo, placa_vehiculo, licencia_conducir, turno, horario_inicio, horario_fin) VALUES
(4, 'Motocicleta', 'MTA-123', 'L12345678', 'completo', '08:00:00', '20:00:00');

-- Insertar Categorías
INSERT INTO categorias (nombre_categoria, descripcion) VALUES
('Entrada', 'Aperitivos y entradas para compartir'),
('Plato Principal', 'Platos principales contundentes'),
('Postre', 'Postres caseros y deliciosos'),
('Bebida', 'Bebidas frías y calientes');

-- Insertar Productos de ejemplo con datos más completos
INSERT INTO productos (nombre_producto, descripcion, id_categoria, precio, costo, tiempo_preparacion, stock_disponible, ingredientes) VALUES
('Alitas BBQ', 'Alitas de pollo bañadas en salsa BBQ casera', 1, 35.90, 18.00, 15, 50, 'Alitas de pollo, salsa BBQ, especias, apio'),
('Anticucho de Corazón', 'Brochetas de corazón de res marinado', 2, 28.50, 14.00, 20, 30, 'Corazón de res, ají panca, chicha de jora, papa'),
('Lomo Saltado', 'Tradicional lomo saltado con papas fritas', 2, 32.00, 16.00, 18, 40, 'Lomo de res, cebolla, tomate, papa, sillao, ají amarillo'),
('Pollo a la Brasa', 'Pollo entero a la brasa con papas y ensalada', 2, 38.90, 20.00, 25, 25, 'Pollo entero, papa, ensalada, ají, cremas'),
('Suspiro Limeño', 'Postre tradicional peruano', 3, 12.50, 6.00, 10, 20, 'Manjar blanco, merengue, canela, vainilla'),
('Inca Kola 500ml', 'Bebida gaseosa nacional', 4, 5.00, 2.50, 0, 200, 'Agua gasificada, azúcar, saborizantes naturales'),
('Chicha Morada', 'Bebida tradicional peruana', 4, 8.00, 3.50, 5, 100, 'Maíz morado, piña, manzana, canela, clavo de olor');

-- Insertar Inventario de insumos y suministros
INSERT INTO inventario (nombre_insumo, descripcion, categoria_insumo, unidad_medida, cantidad_actual, cantidad_minima, cantidad_maxima, precio_unitario, id_sucursal, fecha_vencimiento, proveedor, telefono_proveedor) VALUES
-- Insumos para cocina
('Arroz Extra', 'Arroz de grano largo para preparaciones', 'Insumos', 'kg', 50.0, 10.0, 100.0, 3.20, 1, '2025-12-31', 'Distribuidora San Martín', '042-123456'),
('Aceite Vegetal', 'Aceite para freír y cocinar', 'Insumos', 'l', 25.0, 5.0, 50.0, 4.50, 1, '2025-08-15', 'Comercial Amazónica', '042-234567'),
('Pollo Entero', 'Pollos frescos para parrilla', 'Insumos', 'unidad', 30.0, 8.0, 60.0, 18.00, 1, '2025-01-15', 'Avícola Regional', '042-345678'),
('Carne de Res', 'Lomo de res para saltado', 'Insumos', 'kg', 20.0, 5.0, 40.0, 25.00, 1, '2025-01-10', 'Carnicería Central', '042-456789'),
('Papa Amarilla', 'Papas peruanas para guarnición', 'Insumos', 'kg', 80.0, 15.0, 150.0, 2.80, 1, '2025-02-28', 'Mercado Mayorista', '042-567890'),
('Cebolla Roja', 'Cebollas frescas', 'Insumos', 'kg', 40.0, 8.0, 80.0, 3.50, 1, '2025-02-15', 'Verduras del Valle', '042-678901'),
('Ají Amarillo', 'Ají amarillo en pasta', 'Insumos', 'kg', 15.0, 3.0, 30.0, 8.00, 1, '2025-06-30', 'Productos Cusco', '042-789012'),
('Maíz Morado', 'Maíz morado para chicha', 'Insumos', 'kg', 25.0, 5.0, 50.0, 6.00, 1, '2025-12-31', 'Agroexportadora Norte', '042-890123'),

-- Suministros de operación
('Vasos Descartables 500ml', 'Vasos para bebidas frías', 'Suministros', 'paquete', 20.0, 5.0, 50.0, 12.00, 1, NULL, 'Envases Perú', '042-123789'),
('Platos Descartables', 'Platos biodegradables', 'Suministros', 'paquete', 15.0, 3.0, 30.0, 18.00, 1, NULL, 'EcoPlast SAC', '042-234890'),
('Bolsas Delivery', 'Bolsas termo para delivery', 'Suministros', 'paquete', 25.0, 5.0, 50.0, 25.00, 1, NULL, 'Packaging Solutions', '042-345901'),
('Servilletas', 'Servilletas de mesa', 'Suministros', 'paquete', 30.0, 8.0, 60.0, 8.00, 1, NULL, 'Papelería Industrial', '042-456012'),
('Cubiertos Plásticos', 'Set de cubiertos descartables', 'Suministros', 'paquete', 18.0, 4.0, 40.0, 15.00, 1, NULL, 'Distribuidora Total', '042-567123'),
('Gas LP', 'Balón de gas para cocina', 'Suministros', 'unidad', 8.0, 2.0, 15.0, 45.00, 1, NULL, 'Gas Amazónico', '042-678234');

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

-- Insertar clientes de ejemplo
INSERT INTO clientes (dni, nombre_completo, telefono, email, direccion, puntos_acumulados, total_compras, numero_pedidos) VALUES
('87654321', 'Ana María González', '987654321', 'ana.gonzalez@email.com', 'Jr. Progreso 123, Morales', 150, 450.50, 8),
('76543210', 'Luis Carlos Mendoza', '976543210', 'luis.mendoza@email.com', 'Av. Circunvalación 456, La Banda', 75, 225.00, 4),
('65432109', 'Carmen Rosa Silva', '965432109', 'carmen.silva@email.com', 'Jr. San Martín 789, Partido Alto', 200, 680.90, 12),
('54321098', 'Roberto Ángel Pérez', '954321098', 'roberto.perez@email.com', 'Av. Perú 321, Morales', 50, 150.75, 3);

-- Insertar promociones activas
INSERT INTO promociones (nombre_promocion, descripcion, tipo_descuento, valor_descuento, fecha_inicio, fecha_fin, codigo_promocion, monto_minimo) VALUES
('Descuento Estudiante', '15% de descuento para estudiantes', 'porcentaje', 15.00, '2024-01-01', '2024-12-31', 'ESTUDIANTE15', 20.00),
('Combo Familiar', '20% descuento en pedidos familiares', 'porcentaje', 20.00, '2024-01-01', '2024-12-31', 'FAMILIA20', 80.00),
('Delivery Gratis', 'Delivery sin costo adicional', 'monto_fijo', 5.00, '2024-01-01', '2024-06-30', 'DELIVERYFREE', 35.00);

-- Insertar pedidos de ejemplo
INSERT INTO pedidos (numero_pedido, id_cliente, id_sucursal, id_mesero, id_cajero, tipo_pedido, estado, subtotal, descuento, impuesto, total, metodo_pago, estado_pago, observaciones) VALUES
('#0001', 1, 1, 1, 1, 'local', 'entregado', 71.80, 0.00, 12.92, 84.72, 'efectivo', 'pagado', 'Sin ají extra'),
('#0002', 2, 1, 1, 1, 'delivery', 'entregado', 45.50, 5.00, 7.29, 47.79, 'yape', 'pagado', 'Casa con reja azul'),
('#0003', 3, 1, 1, 1, 'para_llevar', 'listo', 28.50, 0.00, 5.13, 33.63, 'tarjeta', 'pagado', 'Para llevar en 15 min'),
('#0004', 4, 2, 1, 1, 'local', 'en_preparacion', 67.40, 13.48, 9.71, 63.63, 'efectivo', 'pagado', 'Mesa cerca de la ventana');

-- Insertar detalle de pedidos
INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES
-- Pedido #0001
(1, 1, 2, 35.90, 71.80),
-- Pedido #0002  
(2, 2, 1, 28.50, 28.50),
(2, 6, 2, 5.00, 10.00),
(2, 7, 1, 8.00, 8.00),
-- Pedido #0003
(3, 2, 1, 28.50, 28.50),
-- Pedido #0004
(4, 3, 1, 32.00, 32.00),
(4, 1, 1, 35.90, 35.90);

-- Insertar Configuración del sistema
INSERT INTO configuracion_sistema (clave, valor, descripcion, tipo_dato) VALUES
('impuesto_igv', '18', 'Porcentaje de IGV aplicable', 'numero'),
('moneda', 'S/.', 'Símbolo de moneda', 'texto'),
('tiempo_sesion', '3600', 'Tiempo de sesión en segundos', 'numero'),
('pedido_minimo_delivery', '25', 'Monto mínimo para delivery', 'numero'),
('costo_delivery', '5', 'Costo de delivery estándar', 'numero'),
('empresa_nombre', 'Fast Food San Martín', 'Nombre de la empresa', 'texto'),
('empresa_ruc', '20123456789', 'RUC de la empresa', 'texto'),
('empresa_direccion', 'Jr. Lima 345, Morales, San Martín', 'Dirección principal', 'texto');

-- ============================================
-- TABLA: INGREDIENTES DE PRODUCTOS (Relación muchos a muchos)
-- ============================================
CREATE TABLE producto_ingredientes (
    id_producto_ingrediente INT PRIMARY KEY AUTO_INCREMENT,
    id_producto INT NOT NULL,
    id_inventario INT NOT NULL,
    cantidad_necesaria DECIMAL(10,2) NOT NULL,
    unidad_medida ENUM('kg', 'g', 'l', 'ml', 'unidad', 'porciones'),
    es_opcional BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (id_inventario) REFERENCES inventario(id_inventario),
    UNIQUE KEY unique_producto_ingrediente (id_producto, id_inventario)
);

-- Insertar relaciones producto-ingredientes
INSERT INTO producto_ingredientes (id_producto, id_inventario, cantidad_necesaria, unidad_medida) VALUES
-- Alitas BBQ necesita pollo
(1, 3, 0.5, 'unidad'),
-- Anticucho necesita carne y papa
(2, 4, 0.3, 'kg'),
(2, 5, 0.2, 'kg'),
-- Lomo Saltado necesita carne, papa, cebolla, ají
(3, 4, 0.25, 'kg'),
(3, 5, 0.3, 'kg'),
(3, 6, 0.1, 'kg'),
(3, 7, 0.05, 'kg'),
-- Pollo a la Brasa necesita pollo y papa
(4, 3, 1.0, 'unidad'),
(4, 5, 0.4, 'kg'),
-- Chicha Morada necesita maíz morado
(7, 8, 0.2, 'kg');

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista de Productos con Inventario
CREATE VIEW vista_productos_inventario AS
SELECT 
    p.id_producto,
    p.nombre_producto,
    p.descripcion,
    c.nombre_categoria,
    p.precio,
    p.disponible,
    p.stock_disponible,
    GROUP_CONCAT(
        CONCAT(i.nombre_insumo, ' (', pi.cantidad_necesaria, ' ', pi.unidad_medida, ')')
        SEPARATOR ', '
    ) AS ingredientes_necesarios,
    MIN(FLOOR(i.cantidad_actual / pi.cantidad_necesaria)) AS max_porciones_posibles,
    CASE 
        WHEN MIN(FLOOR(i.cantidad_actual / pi.cantidad_necesaria)) <= 0 THEN 'SIN STOCK'
        WHEN MIN(FLOOR(i.cantidad_actual / pi.cantidad_necesaria)) <= 5 THEN 'STOCK BAJO'
        ELSE 'DISPONIBLE'
    END AS estado_inventario
FROM productos p
LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
LEFT JOIN producto_ingredientes pi ON p.id_producto = pi.id_producto
LEFT JOIN inventario i ON pi.id_inventario = i.id_inventario
GROUP BY p.id_producto;

-- Vista de Reportes de Ventas Detallados
CREATE VIEW vista_reportes_ventas AS
SELECT 
    DATE(p.fecha_pedido) AS fecha_venta,
    s.nombre_sucursal,
    p.tipo_pedido,
    COUNT(p.id_pedido) AS total_pedidos,
    SUM(p.subtotal) AS total_subtotal,
    SUM(p.descuento) AS total_descuentos,
    SUM(p.impuesto) AS total_impuestos,
    SUM(p.total) AS total_ventas,
    AVG(p.total) AS promedio_por_pedido,
    SUM(CASE WHEN p.metodo_pago = 'efectivo' THEN p.total ELSE 0 END) AS ventas_efectivo,
    SUM(CASE WHEN p.metodo_pago = 'tarjeta' THEN p.total ELSE 0 END) AS ventas_tarjeta,
    SUM(CASE WHEN p.metodo_pago = 'yape' THEN p.total ELSE 0 END) AS ventas_yape,
    COUNT(DISTINCT p.id_cliente) AS clientes_unicos
FROM pedidos p
JOIN sucursales s ON p.id_sucursal = s.id_sucursal
WHERE p.estado_pago = 'pagado'
GROUP BY DATE(p.fecha_pedido), s.id_sucursal, p.tipo_pedido;
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
-- TRIGGERS ADICIONALES PARA INTEGRIDAD
-- ============================================

DELIMITER //

-- Trigger para actualizar stock de productos basado en ingredientes
CREATE TRIGGER tr_actualizar_stock_producto
AFTER INSERT ON detalle_pedidos
FOR EACH ROW
BEGIN
    -- Reducir ingredientes del inventario cuando se confirma un pedido
    UPDATE inventario i
    JOIN producto_ingredientes pi ON i.id_inventario = pi.id_inventario
    SET i.cantidad_actual = i.cantidad_actual - (pi.cantidad_necesaria * NEW.cantidad)
    WHERE pi.id_producto = NEW.id_producto;
    
    -- Actualizar estado del inventario si es necesario
    UPDATE inventario i
    JOIN producto_ingredientes pi ON i.id_inventario = pi.id_inventario
    SET i.estado = CASE 
        WHEN i.cantidad_actual <= 0 THEN 'agotado'
        WHEN i.cantidad_actual <= i.cantidad_minima THEN 'por_agotar'
        ELSE 'disponible'
    END
    WHERE pi.id_producto = NEW.id_producto;
END//

-- Trigger para validar disponibilidad antes de crear pedido
CREATE TRIGGER tr_validar_disponibilidad_producto
BEFORE INSERT ON detalle_pedidos
FOR EACH ROW
BEGIN
    DECLARE v_disponible BOOLEAN DEFAULT TRUE;
    DECLARE v_stock_suficiente INT DEFAULT 0;
    DECLARE v_total_ingredientes INT DEFAULT 0;
    
    -- Verificar si el producto está disponible
    SELECT disponible INTO v_disponible 
    FROM productos 
    WHERE id_producto = NEW.id_producto;
    
    IF NOT v_disponible THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Producto no disponible';
    END IF;
    
    -- Contar total de ingredientes necesarios
    SELECT COUNT(*) INTO v_total_ingredientes
    FROM producto_ingredientes 
    WHERE id_producto = NEW.id_producto;
    
    -- Verificar stock de ingredientes disponibles
    SELECT COUNT(*) INTO v_stock_suficiente
    FROM producto_ingredientes pi
    JOIN inventario i ON pi.id_inventario = i.id_inventario
    WHERE pi.id_producto = NEW.id_producto
    AND i.cantidad_actual >= (pi.cantidad_necesaria * NEW.cantidad);
    
    IF v_stock_suficiente < v_total_ingredientes THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock insuficiente de ingredientes';
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
CREATE INDEX idx_pedidos_tipo ON pedidos(tipo_pedido);
CREATE INDEX idx_pedidos_metodo_pago ON pedidos(metodo_pago);
CREATE INDEX idx_productos_categoria ON productos(id_categoria);
CREATE INDEX idx_productos_disponible ON productos(disponible);
CREATE INDEX idx_usuarios_rol ON usuarios(id_rol);
CREATE INDEX idx_usuarios_sucursal ON usuarios(id_sucursal);
CREATE INDEX idx_inventario_sucursal ON inventario(id_sucursal);
CREATE INDEX idx_inventario_estado ON inventario(estado);
CREATE INDEX idx_inventario_categoria ON inventario(categoria_insumo);
CREATE INDEX idx_inventario_vencimiento ON inventario(fecha_vencimiento);
CREATE INDEX idx_detalle_pedidos_producto ON detalle_pedidos(id_producto);
CREATE INDEX idx_producto_ingredientes_producto ON producto_ingredientes(id_producto);
CREATE INDEX idx_producto_ingredientes_inventario ON producto_ingredientes(id_inventario);
CREATE INDEX idx_clientes_telefono ON clientes(telefono);
CREATE INDEX idx_clientes_frecuente ON clientes(cliente_frecuente);
CREATE INDEX idx_promociones_codigo ON promociones(codigo_promocion);
CREATE INDEX idx_promociones_fechas ON promociones(fecha_inicio, fecha_fin);

-- ============================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- ============================================

-- Esta base de datos está diseñada para un sistema completo de restaurante fast food
-- Incluye todas las relaciones necesarias para:
-- 1. Gestión de usuarios y roles (administradores, meseros, cajeros, repartidores)
-- 2. Control de inventario con alertas automáticas
-- 3. Gestión de pedidos con diferentes tipos de servicio (local, delivery, para llevar)
-- 4. Sistema de promociones y descuentos
-- 5. Reportes de ventas y análisis de datos
-- 6. Control de stock automático basado en ingredientes
-- 7. Triggers para mantener integridad de datos
-- 8. Vistas optimizadas para consultas frecuentes
-- 9. Procedimientos almacenados para operaciones complejas

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
