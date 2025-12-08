-- ============================================
-- BASE DE DATOS: KING'S PIZZA - SISTEMA FAST FOOD COMPLETO
-- Basado en análisis completo del proyecto
-- Actualizado: Diciembre 2025
-- ============================================

-- Eliminar base de datos existente y crear nueva
DROP DATABASE IF EXISTS kings_pizza_db;
CREATE DATABASE kings_pizza_db CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE kings_pizza_db;

-- ============================================
-- TABLA: PERFILES (ROLES DE USUARIO)
-- ============================================
CREATE TABLE Perfiles (
    IdPerfil INT PRIMARY KEY AUTO_INCREMENT,
    NombrePerfil VARCHAR(50) NOT NULL UNIQUE,
    Descripcion TEXT,
    NivelAcceso ENUM('1', '2', '3', '4') DEFAULT '1' COMMENT '1=Básico, 2=Intermedio, 3=Avanzado, 4=Administrador',
    Estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    -- Permisos de Ventas
    PermisoVentasRegistrar BOOLEAN DEFAULT FALSE,
    PermisoVentasVisualizar BOOLEAN DEFAULT FALSE,
    PermisoVentasModificar BOOLEAN DEFAULT FALSE,
    PermisoVentasEliminar BOOLEAN DEFAULT FALSE,
    -- Permisos de Compras
    PermisoComprasRegistrar BOOLEAN DEFAULT FALSE,
    PermisoComprasVisualizar BOOLEAN DEFAULT FALSE,
    PermisoComprasInventario BOOLEAN DEFAULT FALSE,
    -- Permisos de Usuarios
    PermisoUsuariosRegistrar BOOLEAN DEFAULT FALSE,
    PermisoUsuariosVisualizar BOOLEAN DEFAULT FALSE,
    PermisoUsuariosModificar BOOLEAN DEFAULT FALSE,
    PermisoUsuariosEliminar BOOLEAN DEFAULT FALSE,
    -- Permisos de Reportes
    PermisoReportesVentas BOOLEAN DEFAULT FALSE,
    PermisoReportesCompras BOOLEAN DEFAULT FALSE,
    PermisoReportesFinancieros BOOLEAN DEFAULT FALSE,
    -- Permisos Generales
    PermisoClientes BOOLEAN DEFAULT FALSE,
    PermisoProveedores BOOLEAN DEFAULT FALSE,
    PermisoPerfiles BOOLEAN DEFAULT FALSE,
    AccesoCompleto BOOLEAN DEFAULT FALSE,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: USUARIOS
-- ============================================
CREATE TABLE Usuarios (
    IdUsuario INT PRIMARY KEY AUTO_INCREMENT,
    Dni VARCHAR(20) NOT NULL UNIQUE,
    NombreCompleto VARCHAR(200) NOT NULL,
    Telefono VARCHAR(20) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    NombreUsuario VARCHAR(50) NOT NULL UNIQUE,
    Contrasena VARCHAR(255) NOT NULL,
    IdPerfil INT NOT NULL,
    Estado ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo',
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (IdPerfil) REFERENCES Perfiles(IdPerfil)
);

-- ============================================
-- TABLA: CLIENTES
-- ============================================
CREATE TABLE Clientes (
    IdCliente INT PRIMARY KEY AUTO_INCREMENT,
    TipoDocumento ENUM('DNI', 'CE', 'RUC', 'PASAPORTE') DEFAULT 'DNI',
    NumDocumento VARCHAR(20) NOT NULL UNIQUE,
    Nombres VARCHAR(100) NOT NULL,
    Apellidos VARCHAR(100) NOT NULL,
    NombreCompleto VARCHAR(200) GENERATED ALWAYS AS (CONCAT(Nombres, ' ', Apellidos)) STORED,
    Telefono VARCHAR(20) NOT NULL,
    Email VARCHAR(100),
    Direccion TEXT,
    MontoGastado DECIMAL(12,2) DEFAULT 0.00,
    Estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: PROVEEDORES
-- ============================================
CREATE TABLE Proveedores (
    CodProveedor INT PRIMARY KEY AUTO_INCREMENT,
    TipoDoc ENUM('RUC', 'DNI', 'CE') DEFAULT 'RUC',
    NumDoc VARCHAR(20) NOT NULL UNIQUE,
    RazonSocial VARCHAR(200) NOT NULL,
    NombreComercial VARCHAR(200),
    Categoria ENUM('Alimentos', 'Bebidas', 'Empaques', 'Lácteos', 'Carnes', 'Vegetales', 'Limpieza', 'Equipos') NOT NULL,
    Estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    TipoDoc_Contacto VARCHAR(50),
    Telefono VARCHAR(20),
    TelefonoSecundario VARCHAR(20),
    Email VARCHAR(100),
    Sitio_Web VARCHAR(255),
    PersonaContacto VARCHAR(100),
    Direccion TEXT,
    Ciudad VARCHAR(100),
    Distrito VARCHAR(100),
    TiempoEntrega INT DEFAULT 0,
    MontoMinimo DECIMAL(10,2) DEFAULT 0.00,
    Descuento DECIMAL(5,2) DEFAULT 0.00,
    Nota TEXT,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: MESAS
-- ============================================
CREATE TABLE Mesas (
    NumMesa INT PRIMARY KEY,
    Cantidad INT NOT NULL CHECK (Cantidad > 0),
    Ubicacion ENUM('salon-principal', 'terraza', 'segundo-piso', 'area-vip', 'exterior') DEFAULT 'salon-principal',
    TipoMesa ENUM('cuadrada', 'rectangular', 'circular', 'alta') DEFAULT 'cuadrada',
    Estado ENUM('disponible', 'ocupada', 'reservada', 'mantenimiento') DEFAULT 'disponible',
    Observacion TEXT,
    Prioridad ENUM('normal', 'preferencial', 'vip') DEFAULT 'normal',
    Ventana BOOLEAN DEFAULT FALSE,
    SillaBebe BOOLEAN DEFAULT FALSE,
    Accesible BOOLEAN DEFAULT FALSE,
    Silenciosa BOOLEAN DEFAULT FALSE,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: PRODUCTOS
-- ============================================
CREATE TABLE Productos (
    IdProducto INT PRIMARY KEY AUTO_INCREMENT,
    CodProducto VARCHAR(50) UNIQUE NOT NULL,
    NombreProducto VARCHAR(150) NOT NULL,
    Categoria ENUM('pizzas', 'pastas', 'ensaladas', 'bebidas', 'postres', 'extras', 'promociones') NOT NULL,
    Tamano ENUM('personal', 'mediana', 'grande', 'familiar', 'xl', 'na') DEFAULT 'na',
    Precio DECIMAL(10,2) NOT NULL CHECK (Precio >= 0),
    Costo DECIMAL(10,2) DEFAULT 0.00 CHECK (Costo >= 0),
    Stock INT DEFAULT 0 CHECK (Stock >= 0),
    StockMinimo INT DEFAULT 0 CHECK (StockMinimo >= 0),
    TiempoPreparacion INT DEFAULT 0 COMMENT 'Tiempo en minutos',
    Estado ENUM('disponible', 'no_disponible', 'agotado') DEFAULT 'disponible',
    CodigoBarras VARCHAR(100),
    Descripcion TEXT,
    CodProveedor INT,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CodProveedor) REFERENCES Proveedores(CodProveedor)
);

-- ============================================
-- TABLA: PLATOS (ESPECIALIDADES DE LA CASA)
-- ============================================
CREATE TABLE Platos (
    IdPlato INT PRIMARY KEY AUTO_INCREMENT,
    CodPlato VARCHAR(50) UNIQUE NOT NULL,
    Nombre VARCHAR(150) NOT NULL,
    Descripcion TEXT,
    Ingredientes TEXT,
    Tamano ENUM('personal', 'mediana', 'familiar', 'grande') DEFAULT 'personal',
    Precio DECIMAL(10,2) NOT NULL CHECK (Precio >= 0),
    Cantidad INT DEFAULT 0 CHECK (Cantidad >= 0),
    Estado ENUM('disponible', 'no_disponible') DEFAULT 'disponible',
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: PROMOCIONES
-- ============================================
CREATE TABLE Promociones (
    IdPromocion INT PRIMARY KEY AUTO_INCREMENT,
    NombrePromocion VARCHAR(150) NOT NULL,
    TipoPromocion ENUM('2x1', 'porcentaje', 'monto', 'horario', 'combo', 'especial') NOT NULL,
    Descuento VARCHAR(50) NOT NULL COMMENT 'Ej: 20% o S/10',
    Estado ENUM('activa', 'inactiva', 'programada') DEFAULT 'activa',
    FechaInicio DATE NOT NULL,
    FechaFin DATE NOT NULL,
    DiasAplicables VARCHAR(200) COMMENT 'Días de la semana aplicables',
    Horario VARCHAR(100) COMMENT 'Horario de aplicación',
    MontoMinimo DECIMAL(10,2) DEFAULT 0.00,
    UsosMaximos INT DEFAULT NULL,
    UsosCliente INT DEFAULT 0,
    Acumulable BOOLEAN DEFAULT FALSE,
    Descripcion TEXT,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: PROMOCION_PRODUCTOS (Relación M:N)
-- ============================================
CREATE TABLE PromocionProducto (
    IdPromocionProducto INT PRIMARY KEY AUTO_INCREMENT,
    IdPromocion INT NOT NULL,
    IdProducto INT NOT NULL,
    FOREIGN KEY (IdPromocion) REFERENCES Promociones(IdPromocion) ON DELETE CASCADE,
    FOREIGN KEY (IdProducto) REFERENCES Productos(IdProducto) ON DELETE CASCADE,
    UNIQUE KEY unique_promocion_producto (IdPromocion, IdProducto)
);

-- ============================================
-- TABLA: CAJA
-- ============================================
CREATE TABLE Caja (
    CodCaja VARCHAR(50) PRIMARY KEY,
    Estado ENUM('abierta', 'cerrada') DEFAULT 'cerrada',
    MontoInicial DECIMAL(12,2) DEFAULT 0.00,
    MontoFinal DECIMAL(12,2) DEFAULT 0.00,
    Fecha DATE NOT NULL,
    Turno ENUM('Mañana', 'Tarde', 'Noche') NOT NULL,
    IdUsuario INT,
    HoraApertura TIMESTAMP NULL,
    HoraCierre TIMESTAMP NULL,
    TotalVentas DECIMAL(12,2) DEFAULT 0.00,
    TotalEfectivo DECIMAL(12,2) DEFAULT 0.00,
    TotalTarjeta DECIMAL(12,2) DEFAULT 0.00,
    TotalYape DECIMAL(12,2) DEFAULT 0.00,
    TotalPlin DECIMAL(12,2) DEFAULT 0.00,
    Observaciones TEXT,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
);

-- ============================================
-- TABLA: PEDIDOS
-- ============================================
CREATE TABLE Pedidos (
    IdPedido INT PRIMARY KEY AUTO_INCREMENT,
    NumDocumentos VARCHAR(50) UNIQUE NOT NULL,
    TipoServicio ENUM('local', 'delivery', 'para-llevar') NOT NULL,
    NumMesa INT NULL,
    IdCliente INT NULL,
    NombreCliente VARCHAR(200) NOT NULL,
    DireccionCliente TEXT NULL,
    TelefonoCliente VARCHAR(20) NULL,
    IdUsuario INT NOT NULL COMMENT 'Usuario que registra',
    SubTotal DECIMAL(12,2) DEFAULT 0.00,
    Descuento DECIMAL(12,2) DEFAULT 0.00,
    Total DECIMAL(12,2) DEFAULT 0.00,
    Estado ENUM('pendiente', 'preparando', 'listo', 'entregado', 'cancelado') DEFAULT 'pendiente',
    FechaPedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaEntrega TIMESTAMP NULL,
    Observaciones TEXT,
    FOREIGN KEY (NumMesa) REFERENCES Mesas(NumMesa),
    FOREIGN KEY (IdCliente) REFERENCES Clientes(IdCliente),
    FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
);

-- ============================================
-- TABLA: DETALLE_PEDIDOS
-- ============================================
CREATE TABLE DetallePedido (
    IdDetalle INT PRIMARY KEY AUTO_INCREMENT,
    IdPedido INT NOT NULL,
    IdProducto INT NULL,
    IdPlato INT NULL,
    CodProducto VARCHAR(50) NOT NULL,
    DescripcionProducto TEXT NOT NULL,
    Cantidad INT NOT NULL CHECK (Cantidad > 0),
    PrecioUnitario DECIMAL(10,2) NOT NULL,
    Subtotal DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (IdPedido) REFERENCES Pedidos(IdPedido) ON DELETE CASCADE,
    FOREIGN KEY (IdProducto) REFERENCES Productos(IdProducto),
    FOREIGN KEY (IdPlato) REFERENCES Platos(IdPlato)
);

-- ============================================
-- TABLA: VENTAS
-- ============================================
CREATE TABLE Ventas (
    CodVenta INT PRIMARY KEY AUTO_INCREMENT,
    IdCliente INT NULL,
    TipoPago ENUM('efectivo', 'tarjeta', 'yape', 'plin') NOT NULL,
    SubTotal DECIMAL(12,2) DEFAULT 0.00,
    Descuento DECIMAL(12,2) DEFAULT 0.00,
    Total DECIMAL(12,2) DEFAULT 0.00,
    IdUsuario INT NOT NULL COMMENT 'Cajero que registra',
    CodCaja VARCHAR(50) NULL,
    Estado ENUM('pendiente', 'pagado', 'cancelado') DEFAULT 'pendiente',
    FechaVenta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Observaciones TEXT,
    FOREIGN KEY (IdCliente) REFERENCES Clientes(IdCliente),
    FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario),
    FOREIGN KEY (CodCaja) REFERENCES Caja(CodCaja)
);

-- ============================================
-- TABLA: DETALLE_VENTAS
-- ============================================
CREATE TABLE DetalleVenta (
    IdDetalleVenta INT PRIMARY KEY AUTO_INCREMENT,
    CodVenta INT NOT NULL,
    CodProducto VARCHAR(50) NOT NULL,
    Linea VARCHAR(100) NOT NULL,
    Descripcion TEXT NOT NULL,
    Cantidad INT NOT NULL CHECK (Cantidad > 0),
    Precio DECIMAL(10,2) NOT NULL,
    Subtotal DECIMAL(12,2) NOT NULL,
    IdProducto INT NULL,
    FOREIGN KEY (CodVenta) REFERENCES Ventas(CodVenta) ON DELETE CASCADE,
    FOREIGN KEY (IdProducto) REFERENCES Productos(IdProducto)
);

-- ============================================
-- TABLA: COMPRAS
-- ============================================
CREATE TABLE Compras (
    IdCompra INT PRIMARY KEY AUTO_INCREMENT,
    CodProveedor INT NOT NULL,
    RUC VARCHAR(20) NOT NULL,
    TipoComprobante ENUM('factura', 'boleta') NOT NULL,
    NumeroComprobante VARCHAR(50) UNIQUE,
    RazonSocial VARCHAR(200) NOT NULL,
    Telefono VARCHAR(20),
    Direccion TEXT,
    SubTotal DECIMAL(12,2) DEFAULT 0.00,
    IGV DECIMAL(12,2) DEFAULT 0.00,
    Total DECIMAL(12,2) DEFAULT 0.00,
    FechaCompra DATE NOT NULL,
    Estado ENUM('pendiente', 'recibido', 'cancelado') DEFAULT 'pendiente',
    IdUsuario INT NOT NULL,
    Observaciones TEXT,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CodProveedor) REFERENCES Proveedores(CodProveedor),
    FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
);

-- ============================================
-- TABLA: DETALLE_COMPRAS
-- ============================================
CREATE TABLE DetalleCompra (
    IdDetalleCompra INT PRIMARY KEY AUTO_INCREMENT,
    IdCompra INT NOT NULL,
    Codigo VARCHAR(50) NOT NULL,
    Descripcion TEXT NOT NULL,
    Empaque VARCHAR(50),
    Cantidad DECIMAL(10,2) NOT NULL CHECK (Cantidad > 0),
    PrecioUnitario DECIMAL(10,2) NOT NULL,
    Total DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (IdCompra) REFERENCES Compras(IdCompra) ON DELETE CASCADE
);

-- ============================================
-- TABLA: INSUMOS (INVENTARIO)
-- ============================================
CREATE TABLE Insumos (
    CodInsumo INT PRIMARY KEY AUTO_INCREMENT,
    NombreInsumo VARCHAR(150) NOT NULL,
    Ubicacion VARCHAR(100),
    Observacion TEXT,
    PrecioUnitario DECIMAL(10,2) DEFAULT 0.00,
    Vencimiento DATE,
    Estado ENUM('disponible', 'agotado', 'vencido') DEFAULT 'disponible',
    CodProveedor INT,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CodProveedor) REFERENCES Proveedores(CodProveedor)
);

-- ============================================
-- TABLA: SUMINISTROS
-- ============================================
CREATE TABLE Suministros (
    IdSuministro INT PRIMARY KEY AUTO_INCREMENT,
    TipoSuministro ENUM('limpieza', 'embalaje', 'oficina', 'equipamiento', 'uniformes', 'otro') NOT NULL,
    NombreSuministro VARCHAR(150) NOT NULL,
    Proveedor VARCHAR(200) NOT NULL,
    Cantidad INT NOT NULL CHECK (Cantidad > 0),
    UnidadMedida ENUM('unidad', 'caja', 'paquete', 'bolsa', 'rollo', 'kg', 'lt') DEFAULT 'unidad',
    PrecioUnitario DECIMAL(10,2) NOT NULL CHECK (PrecioUnitario >= 0),
    FechaCompra DATE NOT NULL,
    NumeroFactura VARCHAR(50),
    Estado ENUM('disponible', 'en_uso', 'agotado', 'pedido') DEFAULT 'disponible',
    Ubicacion VARCHAR(150),
    Observaciones TEXT,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- INSERTAR DATOS INICIALES
-- ============================================

-- Insertar Perfiles
INSERT INTO Perfiles (NombrePerfil, Descripcion, NivelAcceso, AccesoCompleto, 
    PermisoVentasRegistrar, PermisoVentasVisualizar, PermisoVentasModificar, PermisoVentasEliminar,
    PermisoComprasRegistrar, PermisoComprasVisualizar, PermisoComprasInventario,
    PermisoUsuariosRegistrar, PermisoUsuariosVisualizar, PermisoUsuariosModificar, PermisoUsuariosEliminar,
    PermisoReportesVentas, PermisoReportesCompras, PermisoReportesFinancieros,
    PermisoClientes, PermisoProveedores, PermisoPerfiles) VALUES
('administrador', 'Acceso completo al sistema con todos los permisos administrativos', '4', TRUE, 
    TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
('cajero', 'Gestión de ventas y caja', '2', FALSE, 
    TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE),
('mesero', 'Toma de pedidos y gestión de mesas', '1', FALSE, 
    TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
('repartidor', 'Gestión de entregas a domicilio', '1', FALSE, 
    FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE),
('supervisor', 'Supervisor de operaciones', '3', FALSE, 
    TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, TRUE, FALSE),
('cocinero', 'Personal de cocina', '1', FALSE, 
    FALSE, FALSE, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE);

-- Insertar Usuarios de ejemplo (contraseña: admin123)
INSERT INTO Usuarios (Dni, NombreCompleto, Telefono, Email, NombreUsuario, Contrasena, IdPerfil, Estado) VALUES
('12345678', 'Administrador Sistema', '987654321', 'admin@kingspizza.com', 'admin', 'admin123', 1, 'activo'),
('87654321', 'Juan Pérez García', '987654322', 'jperez@kingspizza.com', 'cajero', 'cajero123', 2, 'activo'),
('76543210', 'María González López', '987654323', 'mgonzalez@kingspizza.com', 'mesero', 'mesero123', 3, 'activo'),
('65432109', 'Carlos Ramírez Torres', '987654324', 'cramirez@kingspizza.com', 'delivery', 'delivery123', 4, 'activo');

-- Insertar Mesas de ejemplo
INSERT INTO Mesas (NumMesa, Cantidad, Ubicacion, TipoMesa, Prioridad) VALUES
(1, 4, 'salon-principal', 'cuadrada', 'normal'),
(2, 4, 'salon-principal', 'cuadrada', 'normal'),
(3, 2, 'terraza', 'circular', 'normal'),
(4, 6, 'area-vip', 'rectangular', 'vip'),
(5, 4, 'segundo-piso', 'cuadrada', 'normal'),
(6, 8, 'area-vip', 'rectangular', 'preferencial'),
(7, 2, 'terraza', 'alta', 'normal'),
(8, 4, 'exterior', 'cuadrada', 'normal');

-- Insertar Proveedores de ejemplo
INSERT INTO Proveedores (TipoDoc, NumDoc, RazonSocial, NombreComercial, Categoria, Telefono, Email, Direccion) VALUES
('RUC', '20123456789', 'Distribuidora San Martín EIRL', 'Distribuidora San Martín', 'Alimentos', '042-523456', 'ventas@disansm.com', 'Jr. Lima 123, Morales'),
('RUC', '20234567890', 'Carnicería Central SAC', 'Carnicería Central', 'Carnes', '042-534567', 'pedidos@carniceriacentral.com', 'Av. Perú 456, Tarapoto'),
('RUC', '20345678901', 'Lácteos del Valle SRL', 'Lácteos del Valle', 'Lácteos', '042-545678', 'contacto@lacteosval.com', 'Jr. Progreso 789, La Banda'),
('RUC', '20456789012', 'EcoEmpaques Norte EIRL', 'EcoEmpaques', 'Empaques', '042-556789', 'info@ecoempaques.pe', 'Av. Circunvalación 321, Morales');

-- Insertar Productos de ejemplo
INSERT INTO Productos (CodProducto, NombreProducto, Categoria, Tamano, Precio, Costo, Stock, StockMinimo, TiempoPreparacion, CodigoBarras, Descripcion) VALUES
('PIZZA001', 'Pizza Hawaiana', 'pizzas', 'mediana', 35.90, 18.00, 50, 10, 20, '7751234567890', 'Pizza con jamón y piña fresca'),
('PIZZA002', 'Pizza Pepperoni', 'pizzas', 'mediana', 38.90, 20.00, 45, 10, 20, '7751234567891', 'Pizza con pepperoni italiano'),
('PASTA001', 'Spaghetti Bolognese', 'pastas', 'na', 28.50, 14.00, 30, 8, 15, '7751234567892', 'Pasta con salsa bolognese casera'),
('BEB001', 'Inca Kola 500ml', 'bebidas', 'na', 5.00, 2.50, 200, 50, 0, '7751234567893', 'Bebida gaseosa nacional'),
('POST001', 'Tres Leches', 'postres', 'na', 12.50, 6.00, 25, 5, 10, '7751234567894', 'Postre tradicional peruano');

-- Insertar Platos especiales
INSERT INTO Platos (CodPlato, Nombre, Descripcion, Ingredientes, Tamano, Precio, Cantidad) VALUES
('PLATO001', 'Lomo Saltado', 'Tradicional lomo saltado peruano', 'Lomo de res, cebolla, tomate, papa, sillao, ají amarillo', 'personal', 32.00, 40),
('PLATO002', 'Anticuchos', 'Brochetas de corazón marinado', 'Corazón de res, ají panca, chicha de jora, papa sancochada', 'personal', 25.50, 30),
('PLATO003', 'Pollo a la Brasa', 'Pollo entero a la brasa con guarnición', 'Pollo entero, papa, ensalada mixta, cremas', 'familiar', 45.90, 20);

-- Insertar Promociones activas
INSERT INTO Promociones (NombrePromocion, TipoPromocion, Descuento, FechaInicio, FechaFin, DiasAplicables, MontoMinimo, UsosMaximos) VALUES
('Descuento Estudiante', 'porcentaje', '15%', '2025-01-01', '2025-12-31', 'Lunes a Viernes', 25.00, NULL),
('2x1 en Pizzas', '2x1', '2x1', '2025-11-01', '2025-11-30', 'Martes y Miércoles', 0.00, 100),
('Delivery Gratis', 'monto', 'S/5', '2025-11-01', '2025-12-31', 'Todos los días', 40.00, NULL);

-- Insertar Clientes de ejemplo
INSERT INTO Clientes (TipoDocumento, NumDocumento, Nombres, Apellidos, Telefono, Email, Direccion, MontoGastado) VALUES
('DNI', '87654321', 'Ana María', 'González Silva', '987654321', 'ana.gonzalez@email.com', 'Jr. Progreso 123, Morales', 450.50),
('DNI', '76543210', 'Luis Carlos', 'Mendoza Torres', '976543210', 'luis.mendoza@email.com', 'Av. Circunvalación 456, La Banda', 325.75),
('DNI', '65432109', 'Carmen Rosa', 'Silva Pérez', '965432109', 'carmen.silva@email.com', 'Jr. San Martín 789, Partido Alto', 680.90),
('DNI', '54321098', 'Roberto Ángel', 'Pérez Ramírez', '954321098', 'roberto.perez@email.com', 'Av. Perú 321, Morales', 195.25);

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista de Productos con Stock
CREATE VIEW VistaProductosStock AS
SELECT 
    p.IdProducto,
    p.CodProducto,
    p.NombreProducto,
    p.Categoria,
    p.Tamano,
    p.Precio,
    p.Stock,
    p.StockMinimo,
    p.Estado,
    CASE 
        WHEN p.Stock <= 0 THEN 'SIN STOCK'
        WHEN p.Stock <= p.StockMinimo THEN 'STOCK BAJO'
        ELSE 'DISPONIBLE'
    END AS EstadoStock,
    prov.RazonSocial AS Proveedor
FROM Productos p
LEFT JOIN Proveedores prov ON p.CodProveedor = prov.CodProveedor;

-- Vista de Ventas Diarias
CREATE VIEW VistaVentasDiarias AS
SELECT 
    DATE(v.FechaVenta) AS Fecha,
    COUNT(v.CodVenta) AS TotalVentas,
    SUM(v.Total) AS MontoTotal,
    AVG(v.Total) AS PromedioVenta,
    SUM(CASE WHEN v.TipoPago = 'efectivo' THEN v.Total ELSE 0 END) AS VentasEfectivo,
    SUM(CASE WHEN v.TipoPago = 'tarjeta' THEN v.Total ELSE 0 END) AS VentasTarjeta,
    SUM(CASE WHEN v.TipoPago = 'yape' THEN v.Total ELSE 0 END) AS VentasYape,
    SUM(CASE WHEN v.TipoPago = 'plin' THEN v.Total ELSE 0 END) AS VentasPlin
FROM Ventas v
WHERE v.Estado = 'pagado'
GROUP BY DATE(v.FechaVenta);

-- Vista de Pedidos Completos
CREATE VIEW VistaPedidosCompletos AS
SELECT 
    p.IdPedido,
    p.NumDocumentos,
    p.TipoServicio,
    p.NumMesa,
    c.NombreCompleto AS Cliente,
    p.NombreCliente,
    p.DireccionCliente,
    p.TelefonoCliente,
    u.NombreCompleto AS Usuario,
    p.SubTotal,
    p.Descuento,
    p.Total,
    p.Estado,
    p.FechaPedido,
    p.FechaEntrega
FROM Pedidos p
LEFT JOIN Clientes c ON p.IdCliente = c.IdCliente
LEFT JOIN Usuarios u ON p.IdUsuario = u.IdUsuario;

-- ============================================
-- TRIGGERS
-- ============================================

DELIMITER //

-- Trigger para actualizar monto gastado del cliente
CREATE TRIGGER ActualizarMontoCliente
AFTER UPDATE ON Ventas
FOR EACH ROW
BEGIN
    IF NEW.Estado = 'pagado' AND OLD.Estado != 'pagado' AND NEW.IdCliente IS NOT NULL THEN
        UPDATE Clientes 
        SET MontoGastado = MontoGastado + NEW.Total
        WHERE IdCliente = NEW.IdCliente;
    END IF;
END//

DELIMITER //
-- Trigger para calcular subtotal en detalle de pedido
CREATE TRIGGER CalcularSubtotalDetallePedido
BEFORE INSERT ON DetallePedido
FOR EACH ROW
BEGIN
    SET NEW.Subtotal = NEW.Cantidad * NEW.PrecioUnitario;
END//

-- Trigger para calcular subtotal en detalle de venta
DELIMITER //
CREATE TRIGGER CalcularSubtotalDetalleVenta
BEFORE INSERT ON DetalleVenta
FOR EACH ROW
BEGIN
    SET NEW.Subtotal = NEW.Cantidad * NEW.Precio;
END//

-- Trigger para calcular subtotal al actualizar detalle de compra
DELIMITER //
CREATE TRIGGER CalcularSubtotalDetalleCompra
BEFORE INSERT ON DetalleCompra
FOR EACH ROW
BEGIN
    SET NEW.Total = NEW.Cantidad * NEW.PrecioUnitario;
END//

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

CREATE INDEX idx_usuarios_perfil ON Usuarios(IdPerfil);
CREATE INDEX idx_usuarios_dni ON Usuarios(Dni);
CREATE INDEX idx_clientes_documento ON Clientes(NumDocumento);
CREATE INDEX idx_productos_codigo ON Productos(CodProducto);
CREATE INDEX idx_productos_categoria ON Productos(Categoria);
CREATE INDEX idx_productos_stock ON Productos(Stock);
CREATE INDEX idx_platos_codigo ON Platos(CodPlato);
CREATE INDEX idx_pedidos_fecha ON Pedidos(FechaPedido);
CREATE INDEX idx_pedidos_estado ON Pedidos(Estado);
CREATE INDEX idx_ventas_fecha ON Ventas(FechaVenta);
CREATE INDEX idx_ventas_tipo_pago ON Ventas(TipoPago);
CREATE INDEX idx_compras_fecha ON Compras(FechaCompra);
CREATE INDEX idx_proveedores_documento ON Proveedores(NumDoc);
CREATE INDEX idx_promociones_fechas ON Promociones(FechaInicio, FechaFin);

-- ============================================
-- PA: REGISTRAR PERFIL
-- ============================================
DROP PROCEDURE IF EXISTS pa_registrar_perfil;
DELIMITER //
CREATE PROCEDURE pa_registrar_perfil(
    IN p_nombre_perfil VARCHAR(50),
    IN p_descripcion TEXT,
    IN p_nivel_acceso ENUM('1', '2', '3', '4'),
    IN p_estado ENUM('activo', 'inactivo'),
    IN p_ventas_registrar BOOLEAN,
    IN p_ventas_visualizar BOOLEAN,
    IN p_ventas_modificar BOOLEAN,
    IN p_ventas_eliminar BOOLEAN,
    IN p_compras_registrar BOOLEAN,
    IN p_compras_visualizar BOOLEAN,
    IN p_compras_inventario BOOLEAN,
    IN p_usuarios_registrar BOOLEAN,
    IN p_usuarios_visualizar BOOLEAN,
    IN p_usuarios_modificar BOOLEAN,
    IN p_usuarios_eliminar BOOLEAN,
    IN p_reportes_ventas BOOLEAN,
    IN p_reportes_compras BOOLEAN,
    IN p_reportes_financieros BOOLEAN,
    IN p_clientes BOOLEAN,
    IN p_proveedores BOOLEAN,
    IN p_perfiles BOOLEAN,
    IN p_acceso_completo BOOLEAN
)
BEGIN
    DECLARE v_id_perfil INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    INSERT INTO Perfiles (
        NombrePerfil, Descripcion, NivelAcceso, Estado,
        PermisoVentasRegistrar, PermisoVentasVisualizar, PermisoVentasModificar, PermisoVentasEliminar,
        PermisoComprasRegistrar, PermisoComprasVisualizar, PermisoComprasInventario,
        PermisoUsuariosRegistrar, PermisoUsuariosVisualizar, PermisoUsuariosModificar, PermisoUsuariosEliminar,
        PermisoReportesVentas, PermisoReportesCompras, PermisoReportesFinancieros,
        PermisoClientes, PermisoProveedores, PermisoPerfiles, AccesoCompleto
    ) VALUES (
        p_nombre_perfil, p_descripcion, p_nivel_acceso, p_estado,
        p_ventas_registrar, p_ventas_visualizar, p_ventas_modificar, p_ventas_eliminar,
        p_compras_registrar, p_compras_visualizar, p_compras_inventario,
        p_usuarios_registrar, p_usuarios_visualizar, p_usuarios_modificar, p_usuarios_eliminar,
        p_reportes_ventas, p_reportes_compras, p_reportes_financieros,
        p_clientes, p_proveedores, p_perfiles, p_acceso_completo
    );
    
    SET v_id_perfil = LAST_INSERT_ID();
    
    COMMIT;
    
    SELECT v_id_perfil AS IdPerfil;
END //
DELIMITER ;

-- ============================================
-- PA: LISTAR PERFILES
-- ============================================
DROP PROCEDURE IF EXISTS pa_listar_perfiles;
DELIMITER //
CREATE PROCEDURE pa_listar_perfiles()
BEGIN
    SELECT 
        IdPerfil,
        NombrePerfil,
        Descripcion,
        NivelAcceso,
        Estado,
        PermisoVentasRegistrar,
        PermisoVentasVisualizar,
        PermisoVentasModificar,
        PermisoVentasEliminar,
        PermisoComprasRegistrar,
        PermisoComprasVisualizar,
        PermisoComprasInventario,
        PermisoUsuariosRegistrar,
        PermisoUsuariosVisualizar,
        PermisoUsuariosModificar,
        PermisoUsuariosEliminar,
        PermisoReportesVentas,
        PermisoReportesCompras,
        PermisoReportesFinancieros,
        PermisoClientes,
        PermisoProveedores,
        PermisoPerfiles,
        AccesoCompleto,
        FechaCreacion,
        FechaActualizacion
    FROM Perfiles
    ORDER BY IdPerfil ASC;
END //
DELIMITER ;

-- ============================================
-- PROCEDIMIENTO: REGISTRAR USUARIO DEL SISTEMA
-- Descripción: Registra un nuevo usuario en el sistema
-- Parámetros:
--   - p_dni: DNI del usuario
--   - p_nombreCompleto: Nombre completo del usuario
--   - p_telefono: Teléfono del usuario
--   - p_email: Correo electrónico (opcional)
--   - p_nombreUsuario: Nombre de usuario único
--   - p_contrasena: Contraseña (será hasheada)
--   - p_idPerfil: ID del perfil asignado
--   - p_estado: Estado del usuario (activo/inactivo)
-- Retorna: JSON con IdUsuario o mensaje de error
-- ============================================
DELIMITER //
CREATE PROCEDURE pa_registrar_usuario(
    IN p_dni VARCHAR(20),
    IN p_nombreCompleto VARCHAR(200),
    IN p_telefono VARCHAR(20),
    IN p_email VARCHAR(100),
    IN p_nombreUsuario VARCHAR(50),
    IN p_contrasena VARCHAR(255),
    IN p_idPerfil INT,
    IN p_estado ENUM('activo', 'inactivo', 'suspendido')
)
BEGIN
    DECLARE v_idUsuario INT;
    DECLARE v_contrasenaHash VARCHAR(255);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT JSON_OBJECT('error', 'Error al registrar usuario') AS resultado;
    END;

    START TRANSACTION;

    -- Validar que el perfil existe
    IF NOT EXISTS (SELECT 1 FROM Perfiles WHERE IdPerfil = p_idPerfil) THEN
        SELECT JSON_OBJECT('error', 'El perfil especificado no existe') AS resultado;
        ROLLBACK;
    ELSE
        -- Guardar contraseña sin hashear (solo para desarrollo)
        SET v_contrasenaHash = p_contrasena;

        -- Insertar el nuevo usuario
        INSERT INTO Usuarios (
            Dni,
            NombreCompleto,
            Telefono,
            Email,
            NombreUsuario,
            Contrasena,
            IdPerfil,
            Estado
        ) VALUES (
            p_dni,
            p_nombreCompleto,
            p_telefono,
            NULLIF(p_email, ''),
            p_nombreUsuario,
            v_contrasenaHash,
            p_idPerfil,
            p_estado
        );

        SET v_idUsuario = LAST_INSERT_ID();

        COMMIT;

        -- Retornar el ID del usuario registrado
        SELECT JSON_OBJECT(
            'IdUsuario', v_idUsuario,
            'NombreUsuario', p_nombreUsuario,
            'mensaje', 'Usuario registrado exitosamente'
        ) AS resultado;
    END IF;
END //
DELIMITER ;

-- ============================================
-- PA: LOGIN - VERIFICAR USUARIO Y CONTRASEÑA
-- ============================================
DROP PROCEDURE IF EXISTS pa_login;
DELIMITER //
CREATE PROCEDURE pa_login(
    IN p_nombreUsuario VARCHAR(50),
    IN p_contrasena VARCHAR(255)
)
BEGIN
    DECLARE v_idUsuario INT;
    DECLARE v_nombreCompleto VARCHAR(200);
    DECLARE v_idPerfil INT;
    DECLARE v_nombrePerfil VARCHAR(50);
    DECLARE v_nivelAcceso VARCHAR(1);
    DECLARE v_contrasenaGuardada VARCHAR(255);
    DECLARE v_estado VARCHAR(20);
    
    -- Buscar usuario activo
    SELECT 
        u.IdUsuario,
        u.NombreCompleto,
        u.IdPerfil,
        u.Contrasena,
        u.Estado,
        p.NombrePerfil,
        p.NivelAcceso
    INTO 
        v_idUsuario,
        v_nombreCompleto,
        v_idPerfil,
        v_contrasenaGuardada,
        v_estado,
        v_nombrePerfil,
        v_nivelAcceso
    FROM Usuarios u
    INNER JOIN Perfiles p ON u.IdPerfil = p.IdPerfil
    WHERE u.NombreUsuario = p_nombreUsuario 
    AND u.Estado = 'activo'
    LIMIT 1;
    
    -- Verificar si el usuario existe
    IF v_idUsuario IS NULL THEN
        SELECT JSON_OBJECT(
            'exito', FALSE,
            'mensaje', 'Usuario o contraseña incorrectos'
        ) AS resultado;
    ELSEIF v_contrasenaGuardada != p_contrasena THEN
        SELECT JSON_OBJECT(
            'exito', FALSE,
            'mensaje', 'Usuario o contraseña incorrectos'
        ) AS resultado;
    ELSE
        -- Autenticación exitosa
        SELECT JSON_OBJECT(
            'exito', TRUE,
            'idUsuario', v_idUsuario,
            'nombreCompleto', v_nombreCompleto,
            'idPerfil', v_idPerfil,
            'nombrePerfil', v_nombrePerfil,
            'nivelAcceso', v_nivelAcceso,
            'mensaje', 'Autenticación exitosa'
        ) AS resultado;
    END IF;
END //
DELIMITER ;

-- ============================================
-- PA: LISTAR USUARIOS DEL SISTEMA
-- ============================================
DROP PROCEDURE IF EXISTS pa_listar_usuarios;
DELIMITER //
CREATE PROCEDURE pa_listar_usuarios()
BEGIN
    SELECT 
        u.IdUsuario,
        u.Dni,
        u.NombreCompleto,
        u.Telefono,
        u.Email,
        u.NombreUsuario,
        u.IdPerfil,
        p.NombrePerfil,
        p.NivelAcceso,
        u.Estado,
        u.FechaCreacion,
        u.FechaActualizacion
    FROM Usuarios u
    INNER JOIN Perfiles p ON u.IdPerfil = p.IdPerfil
    ORDER BY u.IdUsuario DESC;
END //
DELIMITER ;

-- ============================================
-- PA: LISTAR CLIENTES
-- ============================================
DROP PROCEDURE IF EXISTS pa_listar_clientes;
DELIMITER //
CREATE PROCEDURE pa_listar_clientes()
BEGIN
    SELECT 
        IdCliente,
        TipoDocumento,
        NumDocumento,
        Nombres,
        Apellidos,
        NombreCompleto,
        Telefono,
        Email,
        Direccion,
        MontoGastado,
        Estado,
        FechaRegistro,
        FechaActualizacion
    FROM Clientes
    WHERE Estado = 'activo'
    ORDER BY IdCliente DESC;
END //
DELIMITER ;

-- ============================================
-- PA: REGISTRAR PROVEEDOR
-- ============================================
DROP PROCEDURE IF EXISTS pa_registrar_proveedor;
DELIMITER //
CREATE PROCEDURE pa_registrar_proveedor(
    IN p_tipoDoc ENUM('RUC', 'DNI', 'CE'),
    IN p_numDoc VARCHAR(20),
    IN p_razonSocial VARCHAR(200),
    IN p_nombreComercial VARCHAR(200),
    IN p_categoria ENUM('Alimentos', 'Bebidas', 'Empaques', 'Lácteos', 'Carnes', 'Vegetales', 'Limpieza', 'Equipos'),
    IN p_telefono VARCHAR(20),
    IN p_telefonoSecundario VARCHAR(20),
    IN p_email VARCHAR(100),
    IN p_sitioWeb VARCHAR(255),
    IN p_personaContacto VARCHAR(100),
    IN p_direccion TEXT,
    IN p_ciudad VARCHAR(100),
    IN p_distrito VARCHAR(100),
    IN p_tiempoEntrega INT,
    IN p_montoMinimo DECIMAL(10,2),
    IN p_descuento DECIMAL(5,2),
    IN p_nota TEXT,
    IN p_estado ENUM('activo', 'inactivo')
)
BEGIN
    DECLARE v_codProveedor INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT JSON_OBJECT('error', 'Error al registrar proveedor') AS resultado;
    END;
    
    START TRANSACTION;
    
    -- Validar que el documento no exista
    IF EXISTS (SELECT 1 FROM Proveedores WHERE NumDoc = p_numDoc) THEN
        SELECT JSON_OBJECT('error', 'El número de documento ya está registrado') AS resultado;
        ROLLBACK;
    ELSE
        -- Insertar el nuevo proveedor
        INSERT INTO Proveedores (
            TipoDoc,
            NumDoc,
            RazonSocial,
            NombreComercial,
            Categoria,
            Telefono,
            TelefonoSecundario,
            Email,
            Sitio_Web,
            PersonaContacto,
            Direccion,
            Ciudad,
            Distrito,
            TiempoEntrega,
            MontoMinimo,
            Descuento,
            Nota,
            Estado
        ) VALUES (
            p_tipoDoc,
            p_numDoc,
            p_razonSocial,
            NULLIF(p_nombreComercial, ''),
            p_categoria,
            p_telefono,
            NULLIF(p_telefonoSecundario, ''),
            p_email,
            NULLIF(p_sitioWeb, ''),
            p_personaContacto,
            p_direccion,
            NULLIF(p_ciudad, ''),
            NULLIF(p_distrito, ''),
            COALESCE(p_tiempoEntrega, 0),
            COALESCE(p_montoMinimo, 0.00),
            COALESCE(p_descuento, 0.00),
            NULLIF(p_nota, ''),
            p_estado
        );
        
        SET v_codProveedor = LAST_INSERT_ID();
        
        COMMIT;
        
        -- Retornar el ID del proveedor registrado
        SELECT JSON_OBJECT(
            'CodProveedor', v_codProveedor,
            'RazonSocial', p_razonSocial,
            'mensaje', 'Proveedor registrado exitosamente'
        ) AS resultado;
    END IF;
END //
DELIMITER ;

-- ============================================
-- PA: LISTAR PROVEEDORES
-- ============================================
DROP PROCEDURE IF EXISTS pa_listar_proveedores;
DELIMITER //
CREATE PROCEDURE pa_listar_proveedores()
BEGIN
    SELECT 
        CodProveedor,
        TipoDoc,
        NumDoc,
        RazonSocial,
        NombreComercial,
        Categoria,
        Estado,
        Telefono,
        TelefonoSecundario,
        Email,
        Sitio_Web,
        PersonaContacto,
        Direccion,
        Ciudad,
        Distrito,
        TiempoEntrega,
        MontoMinimo,
        Descuento,
        Nota,
        FechaCreacion,
        FechaActualizacion
    FROM Proveedores
    ORDER BY CodProveedor DESC;
END //
DELIMITER ;

-- ============================================
-- PA: REGISTRAR PRODUCTO
-- ============================================
DROP PROCEDURE IF EXISTS pa_registrar_producto;
DELIMITER //
CREATE PROCEDURE pa_registrar_producto(
    IN p_codProducto VARCHAR(50),
    IN p_nombreProducto VARCHAR(150),
    IN p_categoria ENUM('pizzas', 'pastas', 'ensaladas', 'bebidas', 'postres', 'extras', 'promociones'),
    IN p_tamano ENUM('personal', 'mediana', 'grande', 'familiar', 'xl', 'na'),
    IN p_precio DECIMAL(10,2),
    IN p_costo DECIMAL(10,2),
    IN p_stock INT,
    IN p_stockMinimo INT,
    IN p_tiempoPreparacion INT,
    IN p_codigoBarras VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_codProveedor INT
)
BEGIN
    DECLARE v_idProducto INT;
    
    START TRANSACTION;
    
    -- Validar datos requeridos
    IF p_codProducto IS NULL OR p_codProducto = '' OR 
       p_nombreProducto IS NULL OR p_nombreProducto = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Código y nombre de producto son requeridos';
    END IF;
    
    -- Verificar si el código ya existe
    IF EXISTS (SELECT 1 FROM Productos WHERE CodProducto = p_codProducto) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El código de producto ya existe';
    END IF;
    
    -- Insertar el nuevo producto
    INSERT INTO Productos (
        CodProducto, NombreProducto, Categoria, Tamano, Precio, 
        Costo, Stock, StockMinimo, TiempoPreparacion, 
        CodigoBarras, Descripcion, CodProveedor
    ) VALUES (
        p_codProducto, p_nombreProducto, p_categoria, p_tamano, p_precio,
        p_costo, p_stock, p_stockMinimo, p_tiempoPreparacion,
        p_codigoBarras, p_descripcion, p_codProveedor
    );
    
    SET v_idProducto = LAST_INSERT_ID();
    
    COMMIT;
    
    -- Retornar el ID del producto registrado
    SELECT JSON_OBJECT(
        'IdProducto', v_idProducto,
        'CodProducto', p_codProducto,
        'NombreProducto', p_nombreProducto,
        'mensaje', 'Producto registrado exitosamente'
    ) AS resultado;
END //
DELIMITER ;

-- ============================================
-- PA: LISTAR PRODUCTOS
-- ============================================
DROP PROCEDURE IF EXISTS pa_listar_productos;
DELIMITER //
CREATE PROCEDURE pa_listar_productos()
BEGIN
    SELECT 
        CodProducto,
        NombreProducto,
        Categoria,
        Tamano,
        Precio,
        Costo,
        Stock,
        StockMinimo,
        TiempoPreparacion,
        Estado,
        CodigoBarras,
        Descripcion,
        CodProveedor,
        FechaCreacion,
        FechaActualizacion
    FROM Productos
    ORDER BY CodProducto DESC;
END //
DELIMITER ;

-- ============================================
-- PA: REGISTRAR CLIENTE
-- ============================================
DROP PROCEDURE IF EXISTS pa_registrar_cliente;
DELIMITER //
CREATE PROCEDURE pa_registrar_cliente(
    IN p_tipoDocumento ENUM('DNI', 'CE', 'RUC', 'PASAPORTE'),
    IN p_numDocumento VARCHAR(20),
    IN p_nombres VARCHAR(100),
    IN p_apellidos VARCHAR(100),
    IN p_telefono VARCHAR(20),
    IN p_email VARCHAR(100),
    IN p_direccion TEXT
)
BEGIN
    DECLARE v_idCliente INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT JSON_OBJECT('error', 'Error al registrar cliente') AS resultado;
    END;
    
    START TRANSACTION;
    
    -- Validar que el documento no exista
    IF EXISTS (SELECT 1 FROM Clientes WHERE NumDocumento = p_numDocumento) THEN
        SELECT JSON_OBJECT('error', 'El número de documento ya está registrado') AS resultado;
        ROLLBACK;
    ELSE
        -- Insertar el nuevo cliente
        INSERT INTO Clientes (
            TipoDocumento,
            NumDocumento,
            Nombres,
            Apellidos,
            Telefono,
            Email,
            Direccion,
            MontoGastado,
            Estado
        ) VALUES (
            p_tipoDocumento,
            p_numDocumento,
            p_nombres,
            p_apellidos,
            p_telefono,
            NULLIF(p_email, ''),
            p_direccion,
            0.00,
            'activo'
        );
        
        SET v_idCliente = LAST_INSERT_ID();
        
        COMMIT;
        
        -- Retornar el ID del cliente registrado
        SELECT JSON_OBJECT(
            'IdCliente', v_idCliente,
            'NombreCompleto', CONCAT(p_nombres, ' ', p_apellidos),
            'mensaje', 'Cliente registrado exitosamente'
        ) AS resultado;
    END IF;
END //
DELIMITER ;

-- ============================================
-- PA: REGISTRAR COMPRA
-- ============================================
DROP PROCEDURE IF EXISTS pa_registrar_compra;
DELIMITER //
CREATE PROCEDURE pa_registrar_compra(
    IN p_codProveedor INT,
    IN p_ruc VARCHAR(20),
    IN p_tipoComprobante ENUM('factura', 'boleta'),
    IN p_numeroComprobante VARCHAR(50),
    IN p_razonSocial VARCHAR(200),
    IN p_telefono VARCHAR(20),
    IN p_direccion TEXT,
    IN p_subTotal DECIMAL(12,2),
    IN p_igv DECIMAL(12,2),
    IN p_total DECIMAL(12,2),
    IN p_fechaCompra DATE,
    IN p_estado ENUM('pendiente', 'recibido', 'cancelado'),
    IN p_idUsuario INT,
    IN p_observaciones TEXT
)
BEGIN
    DECLARE v_idCompra INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT JSON_OBJECT('error', 'Error al registrar compra') AS resultado;
    END;

    START TRANSACTION;

    -- Insertar la nueva compra
    INSERT INTO Compras (
        CodProveedor,
        RUC,
        TipoComprobante,
        NumeroComprobante,
        RazonSocial,
        Telefono,
        Direccion,
        SubTotal,
        IGV,
        Total,
        FechaCompra,
        Estado,
        IdUsuario,
        Observaciones
    ) VALUES (
        p_codProveedor,
        p_ruc,
        p_tipoComprobante,
        p_numeroComprobante,
        p_razonSocial,
        p_telefono,
        p_direccion,
        p_subTotal,
        p_igv,
        p_total,
        p_fechaCompra,
        p_estado,
        p_idUsuario,
        p_observaciones
    );

    SET v_idCompra = LAST_INSERT_ID();

    COMMIT;

    -- Retornar el ID de la compra registrada
    SELECT JSON_OBJECT(
        'IdCompra', v_idCompra,
        'NumeroComprobante', p_numeroComprobante,
        'RazonSocial', p_razonSocial,
        'Total', p_total,
        'mensaje', 'Compra registrada exitosamente'
    ) AS resultado;
END //
DELIMITER ;

-- ============================================
-- PA: LISTAR COMPRAS
-- ============================================
DROP PROCEDURE IF EXISTS pa_listar_compras;
DELIMITER //
CREATE PROCEDURE pa_listar_compras()
BEGIN
    SELECT
        IdCompra,
        CodProveedor,
        RUC,
        TipoComprobante,
        NumeroComprobante,
        RazonSocial,
        Telefono,
        Direccion,
        SubTotal,
        IGV,
        Total,
        DATE_FORMAT(FechaCompra, '%Y-%m-%d') as FechaCompra,
        Estado,
        IdUsuario,
        Observaciones,
        DATE_FORMAT(FechaCreacion, '%Y-%m-%d %H:%i:%s') as FechaCreacion
    FROM Compras
    ORDER BY FechaCompra DESC, IdCompra DESC;
END //
DELIMITER ;

-- ============================================
-- PA: LISTAR PRODUCTOS INVENTARIO
-- ============================================
DROP PROCEDURE IF EXISTS pa_listar_productos_inventario;
DELIMITER //
CREATE PROCEDURE pa_listar_productos_inventario()
BEGIN
    SELECT 
        IdProducto,
        CodProducto,
        NombreProducto,
        Categoria,
        Tamano,
        Precio,
        Costo,
        Stock,
        StockMinimo,
        TiempoPreparacion,
        CASE 
            WHEN Stock <= 0 THEN 'Agotado'
            WHEN Stock <= StockMinimo THEN 'Stock Bajo'
            ELSE 'Disponible'
        END AS EstadoStock,
        Estado,
        CodigoBarras,
        Descripcion,
        CodProveedor,
        DATE_FORMAT(FechaCreacion, '%Y-%m-%d') as FechaCreacion,
        DATE_FORMAT(FechaActualizacion, '%Y-%m-%d') as FechaActualizacion
    FROM Productos
    ORDER BY CodProducto ASC;
END //
DELIMITER ;

-- ============================================
-- PA: LISTAR INSUMOS INVENTARIO
-- ============================================
DROP PROCEDURE IF EXISTS pa_listar_insumos_inventario;
DELIMITER //
CREATE PROCEDURE pa_listar_insumos_inventario()
BEGIN
    SELECT 
        CodInsumo,
        NombreInsumo,
        Ubicacion,
        Observacion,
        PrecioUnitario,
        DATE_FORMAT(Vencimiento, '%Y-%m-%d') as Vencimiento,
        Estado,
        CodProveedor,
        DATE_FORMAT(FechaCreacion, '%Y-%m-%d') as FechaCreacion,
        DATE_FORMAT(FechaActualizacion, '%Y-%m-%d') as FechaActualizacion
    FROM Insumos
    ORDER BY CodInsumo ASC;
END //
DELIMITER ;

-- ============================================
-- PA: LISTAR SUMINISTROS INVENTARIO
-- ============================================
DROP PROCEDURE IF EXISTS pa_listar_suministros_inventario;
DELIMITER //
CREATE PROCEDURE pa_listar_suministros_inventario()
BEGIN
    SELECT 
        IdSuministro,
        TipoSuministro,
        NombreSuministro,
        Proveedor,
        Cantidad,
        UnidadMedida,
        PrecioUnitario,
        Cantidad * PrecioUnitario as Total,
        DATE_FORMAT(FechaCompra, '%Y-%m-%d') as FechaCompra,
        NumeroFactura,
        Estado,
        Ubicacion,
        Observaciones,
        DATE_FORMAT(FechaCreacion, '%Y-%m-%d') as FechaCreacion,
        DATE_FORMAT(FechaActualizacion, '%Y-%m-%d') as FechaActualizacion
    FROM Suministros
    ORDER BY IdSuministro DESC;
END //
DELIMITER ;

-- ============================================
-- PA: REGISTRAR INSUMO
-- ============================================
DROP PROCEDURE IF EXISTS pa_registrar_insumo;
DELIMITER //
CREATE PROCEDURE pa_registrar_insumo(
    IN p_nombreInsumo VARCHAR(150),
    IN p_ubicacion VARCHAR(100),
    IN p_precioUnitario DECIMAL(10,2),
    IN p_vencimiento DATE,
    IN p_estado ENUM('disponible', 'agotado', 'vencido'),
    IN p_codProveedor INT,
    IN p_observacion TEXT
)
BEGIN
    DECLARE v_codInsumo INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT JSON_OBJECT('error', 'Error al registrar insumo') AS resultado;
    END;

    START TRANSACTION;

    -- Insertar el nuevo insumo
    INSERT INTO Insumos (
        NombreInsumo,
        Ubicacion,
        Observacion,
        PrecioUnitario,
        Vencimiento,
        Estado,
        CodProveedor
    ) VALUES (
        p_nombreInsumo,
        p_ubicacion,
        NULLIF(p_observacion, ''),
        p_precioUnitario,
        p_vencimiento,
        p_estado,
        NULLIF(p_codProveedor, 0)
    );

    SET v_codInsumo = LAST_INSERT_ID();

    COMMIT;

    -- Retornar el insumo registrado
    SELECT JSON_OBJECT(
        'CodInsumo', v_codInsumo,
        'NombreInsumo', p_nombreInsumo,
        'Ubicacion', p_ubicacion,
        'PrecioUnitario', p_precioUnitario,
        'mensaje', 'Insumo registrado exitosamente'
    ) AS resultado;
END //

-- ============================================
-- PA: REGISTRAR SUMINISTRO
-- ============================================
CREATE PROCEDURE pa_registrar_suministro(
    IN p_tipoSuministro VARCHAR(50),
    IN p_nombreSuministro VARCHAR(150),
    IN p_proveedor VARCHAR(200),
    IN p_cantidad INT,
    IN p_unidadMedida VARCHAR(50),
    IN p_precioUnitario DECIMAL(10,2),
    IN p_fechaCompra DATE,
    IN p_numeroFactura VARCHAR(50),
    IN p_estado VARCHAR(50),
    IN p_ubicacion VARCHAR(150),
    IN p_observaciones TEXT
)
BEGIN
    DECLARE v_idSuministro INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Insertar el suministro
    INSERT INTO Suministros (
        TipoSuministro,
        NombreSuministro,
        Proveedor,
        Cantidad,
        UnidadMedida,
        PrecioUnitario,
        FechaCompra,
        NumeroFactura,
        Estado,
        Ubicacion,
        Observaciones
    ) VALUES (
        p_tipoSuministro,
        p_nombreSuministro,
        p_proveedor,
        p_cantidad,
        NULLIF(p_unidadMedida, ''),
        p_precioUnitario,
        p_fechaCompra,
        NULLIF(p_numeroFactura, ''),
        NULLIF(p_estado, 'disponible'),
        NULLIF(p_ubicacion, ''),
        NULLIF(p_observaciones, '')
    );

    SET v_idSuministro = LAST_INSERT_ID();

    COMMIT;

    -- Retornar el suministro registrado
    SELECT JSON_OBJECT(
        'IdSuministro', v_idSuministro,
        'NombreSuministro', p_nombreSuministro,
        'TipoSuministro', p_tipoSuministro,
        'Proveedor', p_proveedor,
        'PrecioUnitario', p_precioUnitario,
        'mensaje', 'Suministro registrado exitosamente'
    ) AS resultado;
END //
DELIMITER ;
