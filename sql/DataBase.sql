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
-- TABLA: EMPRESAS
-- ============================================
CREATE TABLE Empresas (
    IdEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    NombreEmpresa VARCHAR(200) NOT NULL UNIQUE,
    Contrasena VARCHAR(255) NOT NULL,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    PermisoPromocionesRegistrar BOOLEAN DEFAULT FALSE,
    PermisoPromocionesVisualizar BOOLEAN DEFAULT FALSE,
    PermisoMesasRegistrar BOOLEAN DEFAULT FALSE,
    PermisoMesasVisualizar BOOLEAN DEFAULT FALSE,
    PermisoPedidosRegistrar BOOLEAN DEFAULT FALSE,
    PermisoPedidosVisualizar BOOLEAN DEFAULT FALSE,
    PermisoCajaApertura BOOLEAN DEFAULT FALSE,
    PermisoCajaVisualizar BOOLEAN DEFAULT FALSE,
    PermisoCajaCerrar BOOLEAN DEFAULT FALSE,
    -- Permisos de Compras
    PermisoComprasRegistrar BOOLEAN DEFAULT FALSE,
    PermisoComprasVisualizar BOOLEAN DEFAULT FALSE,
    PermisoInventarioVisualizar BOOLEAN DEFAULT FALSE,
    PermisoProveedoresRegistrar BOOLEAN DEFAULT FALSE,
    PermisoProveedoresVisualizar BOOLEAN DEFAULT FALSE,
    PermisoProductoRegistrar BOOLEAN DEFAULT FALSE,
    PermisoProductoVisualizar BOOLEAN DEFAULT FALSE,
    -- Permisos de Usuarios
    PermisoUsuariosRegistrar BOOLEAN DEFAULT FALSE,
    PermisoUsuariosVisualizar BOOLEAN DEFAULT FALSE,
    -- Permisos de Clientes
    PermisoClientesRegistrar BOOLEAN DEFAULT FALSE,
    PermisoClientesVisualizar BOOLEAN DEFAULT FALSE,
    -- Permisos de Reportes
    PermisoReportes BOOLEAN DEFAULT FALSE,
    -- Permisos de Seguridad
    PermisoSeguridadUsuariosRegistrar BOOLEAN DEFAULT FALSE,
    PermisoSeguridadUsuariosVisualizar BOOLEAN DEFAULT FALSE,
    PermisoPerfilesRegistrar BOOLEAN DEFAULT FALSE,
    PermisoPerfilesVisualizar BOOLEAN DEFAULT FALSE,
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
    IdMesero INT NULL COMMENT 'Mesero asignado actualmente',
    Observacion TEXT,
    Prioridad ENUM('normal', 'preferencial', 'vip') DEFAULT 'normal',
    Ventana BOOLEAN DEFAULT FALSE,
    SillaBebe BOOLEAN DEFAULT FALSE,
    Accesible BOOLEAN DEFAULT FALSE,
    Silenciosa BOOLEAN DEFAULT FALSE,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdMesero) REFERENCES Usuarios(IdUsuario)
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
    StockMinimo INT DEFAULT 10 CHECK (StockMinimo >= 0),
    RutaImg VARCHAR(2000),
    Estado ENUM('disponible', 'bajo_stock', 'agotado') DEFAULT 'disponible',
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
    IdMesero INT NULL COMMENT 'Mesero que atiende',
    NombreCliente VARCHAR(200) NOT NULL,
    DireccionCliente TEXT NULL,
    TelefonoCliente VARCHAR(20) NULL,
    TipoComprobante ENUM('boleta', 'factura', 'ninguno') DEFAULT 'boleta',
    NumeroComprobante VARCHAR(50) UNIQUE NULL,
    IdUsuario INT NOT NULL COMMENT 'Usuario que registra',
    SubTotal DECIMAL(12,2) DEFAULT 0.00,
    Descuento DECIMAL(12,2) DEFAULT 0.00,
    CostoDelivery DECIMAL(10,2) DEFAULT 0.00,
    Total DECIMAL(12,2) DEFAULT 0.00,
    Estado ENUM('pendiente', 'preparando', 'listo', 'entregado', 'cancelado') DEFAULT 'pendiente',
    FechaPedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaEntrega TIMESTAMP NULL,
    Observaciones TEXT,
    FOREIGN KEY (NumMesa) REFERENCES Mesas(NumMesa),
    FOREIGN KEY (IdCliente) REFERENCES Clientes(IdCliente),
    FOREIGN KEY (IdMesero) REFERENCES Usuarios(IdUsuario),
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
    IdMesero INT NULL COMMENT 'Mesero que atendió',
    TipoPago ENUM('efectivo', 'tarjeta', 'yape', 'plin') NOT NULL,
    TipoComprobante ENUM('boleta', 'factura', 'ninguno') DEFAULT 'boleta',
    NumeroComprobante VARCHAR(50) UNIQUE NULL,
    SubTotal DECIMAL(12,2) DEFAULT 0.00,
    Descuento DECIMAL(12,2) DEFAULT 0.00,
    CostoDelivery DECIMAL(10,2) DEFAULT 0.00,
    Total DECIMAL(12,2) DEFAULT 0.00,
    Propina DECIMAL(10,2) DEFAULT 0.00,
    IdUsuario INT NOT NULL COMMENT 'Cajero que registra',
    CodCaja VARCHAR(50) NULL,
    Estado ENUM('pendiente', 'pagado', 'cancelado') DEFAULT 'pendiente',
    FechaVenta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Observaciones TEXT,
    FOREIGN KEY (IdCliente) REFERENCES Clientes(IdCliente),
    FOREIGN KEY (IdMesero) REFERENCES Usuarios(IdUsuario),
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
    TipoItem ENUM('producto') NOT NULL DEFAULT 'producto' COMMENT 'Indica si es Producto',
    Codigo VARCHAR(50) NOT NULL,
    Descripcion TEXT NOT NULL,
    Empaque VARCHAR(50),
    Cantidad DECIMAL(10,2) NOT NULL CHECK (Cantidad > 0),
    PrecioUnitario DECIMAL(10,2) NOT NULL,
    Total DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (IdCompra) REFERENCES Compras(IdCompra) ON DELETE CASCADE
);

-- ============================================
-- INSERTAR DATOS INICIALES
-- ============================================

-- Insertar Empresa por defecto
INSERT INTO Empresas (NombreEmpresa, Contrasena) VALUES
(King\s Pizza, '1234');

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
-- FUNCIONES AUXILIARES
-- ============================================

DELIMITER //

-- Función para generar número de boleta automático
DROP FUNCTION IF EXISTS fn_generar_numero_boleta//
CREATE FUNCTION fn_generar_numero_boleta(tipo VARCHAR(10))
RETURNS VARCHAR(50)
DETERMINISTIC
BEGIN
    DECLARE serie VARCHAR(4);
    DECLARE numero INT;
    DECLARE numero_formateado VARCHAR(50);
    
    -- Determinar la serie según el tipo
    SET serie = CASE 
        WHEN tipo = 'boleta' THEN 'B001'
        WHEN tipo = 'factura' THEN 'F001'
        ELSE 'C001'
    END;
    
    -- Obtener el último número usado para esta serie
    SELECT COALESCE(MAX(CAST(SUBSTRING(NumeroComprobante, 6) AS UNSIGNED)), 0) + 1
    INTO numero
    FROM (
        SELECT NumeroComprobante FROM Ventas WHERE NumeroComprobante LIKE CONCAT(serie, '-%')
        UNION ALL
        SELECT NumeroComprobante FROM Pedidos WHERE NumeroComprobante LIKE CONCAT(serie, '-%')
    ) AS comprobantes;
    
    -- Formatear el número con ceros a la izquierda (8 dígitos)
    SET numero_formateado = CONCAT(serie, '-', LPAD(numero, 8, '0'));
    
    RETURN numero_formateado;
END//

DELIMITER ;

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

-- Trigger para actualizar estado de producto al insertar
DELIMITER //
CREATE TRIGGER ActualizarEstadoProductoInsert
BEFORE INSERT ON Productos
FOR EACH ROW
BEGIN
    IF NEW.Stock = 0 THEN
        SET NEW.Estado = 'agotado';
    ELSEIF NEW.Stock <= NEW.StockMinimo THEN
        SET NEW.Estado = 'no_disponible';
    ELSE
        SET NEW.Estado = 'disponible';
    END IF;
END//

-- Trigger para actualizar estado de producto al actualizar
DELIMITER //
CREATE TRIGGER ActualizarEstadoProductoUpdate
BEFORE UPDATE ON Productos
FOR EACH ROW
BEGIN
    IF NEW.Stock = 0 THEN
        SET NEW.Estado = 'agotado';
    ELSEIF NEW.Stock <= NEW.StockMinimo THEN
        SET NEW.Estado = 'no_disponible';
    ELSE
        SET NEW.Estado = 'disponible';
    END IF;
END//

-- Trigger para actualizar estado de plato al insertar
DELIMITER //
CREATE TRIGGER ActualizarEstadoPlatoInsert
BEFORE INSERT ON Platos
FOR EACH ROW
BEGIN
    IF NEW.Cantidad = 0 THEN
        SET NEW.Estado = 'agotado';
    ELSEIF NEW.Cantidad <= NEW.StockMinimo THEN
        SET NEW.Estado = 'bajo_stock';
    ELSE
        SET NEW.Estado = 'disponible';
    END IF;
END//

-- Trigger para actualizar estado de plato al actualizar
DELIMITER //
CREATE TRIGGER ActualizarEstadoPlatoUpdate
BEFORE UPDATE ON Platos
FOR EACH ROW
BEGIN
    IF NEW.Cantidad = 0 THEN
        SET NEW.Estado = 'agotado';
    ELSEIF NEW.Cantidad <= NEW.StockMinimo THEN
        SET NEW.Estado = 'bajo_stock';
    ELSE
        SET NEW.Estado = 'disponible';
    END IF;
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
    -- Ventas
    IN p_ventas_registrar BOOLEAN,
    IN p_ventas_visualizar BOOLEAN,
    IN p_promociones_registrar BOOLEAN,
    IN p_promociones_visualizar BOOLEAN,
    IN p_mesas_registrar BOOLEAN,
    IN p_mesas_visualizar BOOLEAN,
    IN p_pedidos_registrar BOOLEAN,
    IN p_pedidos_visualizar BOOLEAN,
    IN p_caja_apertura BOOLEAN,
    IN p_caja_visualizar BOOLEAN,
    IN p_caja_cerrar BOOLEAN,
    -- Compras
    IN p_compras_registrar BOOLEAN,
    IN p_compras_visualizar BOOLEAN,
    IN p_inventario_visualizar BOOLEAN,
    IN p_proveedores_registrar BOOLEAN,
    IN p_proveedores_visualizar BOOLEAN,
    IN p_producto_registrar BOOLEAN,
    IN p_producto_visualizar BOOLEAN,
    -- Usuarios
    IN p_usuarios_registrar BOOLEAN,
    IN p_usuarios_visualizar BOOLEAN,
    -- Clientes
    IN p_clientes_registrar BOOLEAN,
    IN p_clientes_visualizar BOOLEAN,
    -- Reportes
    IN p_reportes BOOLEAN,
    -- Seguridad
    IN p_seguridad_usuarios_registrar BOOLEAN,
    IN p_seguridad_usuarios_visualizar BOOLEAN,
    IN p_perfiles_registrar BOOLEAN,
    IN p_perfiles_visualizar BOOLEAN
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
        PermisoVentasRegistrar, PermisoVentasVisualizar,
        PermisoPromocionesRegistrar, PermisoPromocionesVisualizar,
        PermisoMesasRegistrar, PermisoMesasVisualizar,
        PermisoPedidosRegistrar, PermisoPedidosVisualizar,
        PermisoCajaApertura, PermisoCajaVisualizar, PermisoCajaCerrar,
        PermisoComprasRegistrar, PermisoComprasVisualizar,
        PermisoInventarioVisualizar,
        PermisoProveedoresRegistrar, PermisoProveedoresVisualizar,
        PermisoProductoRegistrar, PermisoProductoVisualizar,
        PermisoUsuariosRegistrar, PermisoUsuariosVisualizar,
        PermisoClientesRegistrar, PermisoClientesVisualizar,
        PermisoReportes,
        PermisoSeguridadUsuariosRegistrar, PermisoSeguridadUsuariosVisualizar,
        PermisoPerfilesRegistrar, PermisoPerfilesVisualizar
    ) VALUES (
        p_nombre_perfil, p_descripcion, p_nivel_acceso, p_estado,
        p_ventas_registrar, p_ventas_visualizar,
        p_promociones_registrar, p_promociones_visualizar,
        p_mesas_registrar, p_mesas_visualizar,
        p_pedidos_registrar, p_pedidos_visualizar,
        p_caja_apertura, p_caja_visualizar, p_caja_cerrar,
        p_compras_registrar, p_compras_visualizar,
        p_inventario_visualizar,
        p_proveedores_registrar, p_proveedores_visualizar,
        p_producto_registrar, p_producto_visualizar,
        p_usuarios_registrar, p_usuarios_visualizar,
        p_clientes_registrar, p_clientes_visualizar,
        p_reportes,
        p_seguridad_usuarios_registrar, p_seguridad_usuarios_visualizar,
        p_perfiles_registrar, p_perfiles_visualizar
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
        PermisoPromocionesRegistrar,
        PermisoPromocionesVisualizar,
        PermisoMesasRegistrar,
        PermisoMesasVisualizar,
        PermisoPedidosRegistrar,
        PermisoPedidosVisualizar,
        PermisoCajaApertura,
        PermisoCajaVisualizar,
        PermisoCajaCerrar,
        PermisoComprasRegistrar,
        PermisoComprasVisualizar,
        PermisoInventarioVisualizar,
        PermisoProveedoresRegistrar,
        PermisoProveedoresVisualizar,
        PermisoProductoRegistrar,
        PermisoProductoVisualizar,
        PermisoUsuariosRegistrar,
        PermisoUsuariosVisualizar,
        PermisoClientesRegistrar,
        PermisoClientesVisualizar,
        PermisoReportes,
        PermisoSeguridadUsuariosRegistrar,
        PermisoSeguridadUsuariosVisualizar,
        PermisoPerfilesRegistrar,
        PermisoPerfilesVisualizar,
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
-- PA: REGISTRAR PLATO
-- ============================================
DROP PROCEDURE IF EXISTS pa_registrar_plato;
DELIMITER //
CREATE PROCEDURE pa_registrar_plato(
    IN p_codPlato VARCHAR(50),
    IN p_nombre VARCHAR(150),
    IN p_descripcion TEXT,
    IN p_ingredientes TEXT,
    IN p_tamano ENUM('personal', 'mediana', 'familiar', 'grande'),
    IN p_precio DECIMAL(10,2),
    IN p_cantidad INT,
    IN p_stockMinimo INT,
    IN p_rutaImg VARCHAR(2000),
    IN p_estado ENUM('disponible', 'no_disponible')
)
BEGIN
    DECLARE v_idPlato INT;

    START TRANSACTION;

    IF p_codPlato IS NULL OR p_codPlato = '' OR p_nombre IS NULL OR p_nombre = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Código y nombre del plato son requeridos';
    END IF;

    IF EXISTS (SELECT 1 FROM Platos WHERE CodPlato = p_codPlato) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El código de plato ya existe';
    END IF;

    INSERT INTO Platos (
        CodPlato,
        Nombre,
        Descripcion,
        Ingredientes,
        Tamano,
        Precio,
        Cantidad,
        StockMinimo,
        RutaImg,
        Estado
    ) VALUES (
        p_codPlato,
        p_nombre,
        NULLIF(p_descripcion, ''),
        NULLIF(p_ingredientes, ''),
        p_tamano,
        p_precio,
        COALESCE(p_cantidad, 0),
        COALESCE(p_stockMinimo, 10),
        NULLIF(p_rutaImg, ''),
        COALESCE(NULLIF(p_estado, ''), 'disponible')
    );

    SET v_idPlato = LAST_INSERT_ID();

    COMMIT;

    SELECT JSON_OBJECT(
        'IdPlato', v_idPlato,
        'CodPlato', p_codPlato,
        'Nombre', p_nombre,
        'mensaje', 'Plato registrado exitosamente'
    ) AS resultado;
END //
DELIMITER ;

-- ============================================
-- PA: LISTAR PLATOS
-- ============================================
DROP PROCEDURE IF EXISTS pa_listar_platos;
DELIMITER //
CREATE PROCEDURE pa_listar_platos()
BEGIN
    SELECT 
        IdPlato,
        CodPlato,
        Nombre,
        Descripcion,
        Ingredientes,
        Tamano,
        Precio,
        Cantidad,
        StockMinimo,
        RutaImg,
        Estado,
        FechaCreacion,
        FechaActualizacion
    FROM Platos
    ORDER BY CodPlato DESC;
END //
DELIMITER ;

-- ============================================
-- PA: BUSCAR PLATO
-- ============================================
DROP PROCEDURE IF EXISTS pa_buscar_plato;
DELIMITER //
CREATE PROCEDURE pa_buscar_plato(
    IN p_codPlato VARCHAR(50)
)
BEGIN
    SELECT 
        IdPlato,
        CodPlato,
        Nombre,
        Descripcion,
        Ingredientes,
        Tamano,
        Precio,
        Cantidad,
        StockMinimo,
        RutaImg,
        Estado,
        FechaCreacion,
        FechaActualizacion
    FROM Platos
    WHERE CodPlato = p_codPlato
    LIMIT 1;
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
-- PA: REGISTRAR MESA
-- ============================================
DROP PROCEDURE IF EXISTS pa_registrar_mesa;
DELIMITER //
CREATE PROCEDURE pa_registrar_mesa(
    IN p_numeroMesa INT,
    IN p_capacidad INT,
    IN p_ubicacion VARCHAR(50),
    IN p_tipo VARCHAR(50),
    IN p_estado VARCHAR(50),
    IN p_prioridad VARCHAR(50),
    IN p_ventana BOOLEAN,
    IN p_sillaBebe BOOLEAN,
    IN p_accesible BOOLEAN,
    IN p_silenciosa BOOLEAN,
    IN p_observaciones TEXT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Validar capacidad
    IF p_capacidad <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La capacidad debe ser mayor a 0';
    END IF;

    -- Verificar si la mesa ya existe
    IF EXISTS (SELECT 1 FROM Mesas WHERE NumMesa = p_numeroMesa) THEN
        -- Actualizar mesa existente
        UPDATE Mesas
        SET 
            Cantidad = p_capacidad,
            Ubicacion = COALESCE(NULLIF(p_ubicacion, ''), Ubicacion),
            TipoMesa = COALESCE(NULLIF(p_tipo, ''), TipoMesa),
            Estado = COALESCE(NULLIF(p_estado, ''), Estado),
            Prioridad = COALESCE(NULLIF(p_prioridad, ''), Prioridad),
            Ventana = COALESCE(p_ventana, Ventana),
            SillaBebe = COALESCE(p_sillaBebe, SillaBebe),
            Accesible = COALESCE(p_accesible, Accesible),
            Silenciosa = COALESCE(p_silenciosa, Silenciosa),
            Observacion = NULLIF(p_observaciones, '')
        WHERE NumMesa = p_numeroMesa;

        COMMIT;

        SELECT JSON_OBJECT(
            'NumMesa', p_numeroMesa,
            'mensaje', 'Mesa actualizada exitosamente'
        ) AS resultado;
    ELSE
        -- Insertar nueva mesa
        INSERT INTO Mesas (
            NumMesa,
            Cantidad,
            Ubicacion,
            TipoMesa,
            Estado,
            Prioridad,
            Ventana,
            SillaBebe,
            Accesible,
            Silenciosa,
            Observacion
        ) VALUES (
            p_numeroMesa,
            p_capacidad,
            COALESCE(NULLIF(p_ubicacion, ''), 'salon-principal'),
            COALESCE(NULLIF(p_tipo, ''), 'cuadrada'),
            COALESCE(NULLIF(p_estado, ''), 'disponible'),
            COALESCE(NULLIF(p_prioridad, ''), 'normal'),
            COALESCE(p_ventana, FALSE),
            COALESCE(p_sillaBebe, FALSE),
            COALESCE(p_accesible, FALSE),
            COALESCE(p_silenciosa, FALSE),
            NULLIF(p_observaciones, '')
        );

        COMMIT;

        SELECT JSON_OBJECT(
            'NumMesa', p_numeroMesa,
            'Capacidad', p_capacidad,
            'mensaje', 'Mesa registrada exitosamente'
        ) AS resultado;
    END IF;
END //
DELIMITER ;

-- ============================================
-- PA: LISTAR MESAS
-- ============================================
DROP PROCEDURE IF EXISTS pa_listar_mesas;
DELIMITER //
CREATE PROCEDURE pa_listar_mesas()
BEGIN
    SELECT 
        NumMesa AS IdMesa,
        NumMesa,
        Cantidad AS Capacidad,
        Ubicacion,
        TipoMesa AS Tipo,
        Estado,
        Prioridad,
        Ventana,
        SillaBebe,
        Accesible,
        Silenciosa,
        Observacion AS Observaciones,
        DATE_FORMAT(FechaCreacion, '%Y-%m-%d') AS FechaCreacion
    FROM Mesas
    ORDER BY NumMesa ASC;
END //
DELIMITER ;

-- ============================================
-- PA: REGISTRAR PEDIDO
-- ============================================
DROP PROCEDURE IF EXISTS pa_registrar_pedido;
DELIMITER //
CREATE PROCEDURE pa_registrar_pedido(
    IN p_numDocumentos VARCHAR(50),
    IN p_tipoServicio ENUM('local', 'delivery', 'para-llevar'),
    IN p_numMesa INT,
    IN p_idCliente INT,
    IN p_idMesero INT,
    IN p_nombreCliente VARCHAR(200),
    IN p_direccionCliente TEXT,
    IN p_telefonoCliente VARCHAR(20),
    IN p_idUsuario INT,
    IN p_subTotal DECIMAL(12,2),
    IN p_descuento DECIMAL(12,2),
    IN p_costoDelivery DECIMAL(10,2),
    IN p_total DECIMAL(12,2),
    IN p_estado ENUM('pendiente', 'preparando', 'listo', 'entregado', 'cancelado'),
    IN p_observaciones TEXT
)
BEGIN
    DECLARE v_idPedido INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Validar parámetros requeridos
    IF p_tipoServicio IS NULL OR p_tipoServicio = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El tipo de servicio es obligatorio';
    END IF;

    IF p_nombreCliente IS NULL OR p_nombreCliente = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El nombre del cliente es obligatorio';
    END IF;

    IF p_idUsuario IS NULL OR p_idUsuario <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El usuario es obligatorio';
    END IF;

    -- Insertar el nuevo pedido
    INSERT INTO Pedidos (
        NumDocumentos,
        TipoServicio,
        NumMesa,
        IdCliente,
        IdMesero,
        NombreCliente,
        DireccionCliente,
        TelefonoCliente,
        TipoComprobante,
        NumeroComprobante,
        IdUsuario,
        SubTotal,
        Descuento,
        CostoDelivery,
        Total,
        Estado,
        Observaciones
    ) VALUES (
        COALESCE(NULLIF(p_numDocumentos, ''), CONCAT('PED-', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))),
        p_tipoServicio,
        NULLIF(p_numMesa, 0),
        NULLIF(p_idCliente, 0),
        NULLIF(p_idMesero, 0),
        p_nombreCliente,
        NULLIF(p_direccionCliente, ''),
        NULLIF(p_telefonoCliente, ''),
        'ninguno',
        NULL,
        p_idUsuario,
        COALESCE(p_subTotal, 0.00),
        COALESCE(p_descuento, 0.00),
        COALESCE(p_costoDelivery, 0.00),
        COALESCE(p_total, 0.00),
        COALESCE(p_estado, 'pendiente'),
        NULLIF(p_observaciones, '')
    );

    SET v_idPedido = LAST_INSERT_ID();

    COMMIT;

    -- Retornar el pedido registrado sin número de comprobante
    SELECT JSON_OBJECT(
        'IdPedido', v_idPedido,
        'NumDocumentos', COALESCE(NULLIF(p_numDocumentos, ''), CONCAT('PED-', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))),
        'NombreCliente', p_nombreCliente,
        'Total', p_total,
        'Estado', COALESCE(p_estado, 'pendiente'),
        'mensaje', 'Pedido registrado exitosamente'
    ) AS resultado;
END //
DELIMITER ;

-- ============================================
-- PA: LISTAR PEDIDOS
-- ============================================
DROP PROCEDURE IF EXISTS pa_listar_pedidos;
DELIMITER //
CREATE PROCEDURE pa_listar_pedidos()
BEGIN
    SELECT 
        IdPedido,
        NumDocumentos,
        TipoServicio,
        NumMesa,
        IdCliente,
        NombreCliente,
        DireccionCliente,
        TelefonoCliente,
        IdUsuario,
        SubTotal,
        Descuento,
        Total,
        Estado,
        DATE_FORMAT(FechaPedido, '%Y-%m-%d %H:%i:%s') AS FechaPedido,
        DATE_FORMAT(FechaEntrega, '%Y-%m-%d %H:%i:%s') AS FechaEntrega,
        Observaciones
    FROM Pedidos
    ORDER BY FechaPedido DESC, IdPedido DESC;
END //-- ============================================
-- PA: LISTAR PEDIDOS
-- ============================================
DROP PROCEDURE IF EXISTS pa_listar_pedidos;
DELIMITER //
CREATE PROCEDURE pa_listar_pedidos()
BEGIN
    SELECT 
        IdPedido,
        NumDocumentos,
        TipoServicio,
        NumMesa,
        IdCliente,
        NombreCliente,
        DireccionCliente,
        TelefonoCliente,
        IdUsuario,
        SubTotal,
        Descuento,
        Total,
        Estado,
        DATE_FORMAT(FechaPedido, '%Y-%m-%d %H:%i:%s') AS FechaPedido,
        DATE_FORMAT(FechaEntrega, '%Y-%m-%d %H:%i:%s') AS FechaEntrega,
        Observaciones
    FROM Pedidos
    WHERE Estado IN ('pendiente', 'preparando', 'listo')
    ORDER BY FechaPedido DESC, IdPedido DESC;
END //
DELIMITER ;

-- ============================================
-- PA: BUSCAR PEDIDO POR ID
-- ============================================
DROP PROCEDURE IF EXISTS pa_buscar_pedido;
DELIMITER //
CREATE PROCEDURE pa_buscar_pedido(
    IN p_idPedido INT
)
BEGIN
    SELECT 
        IdPedido,
        NumDocumentos,
        TipoServicio,
        NumMesa,
        IdCliente,
        NombreCliente,
        DireccionCliente,
        TelefonoCliente,
        IdUsuario,
        SubTotal,
        Descuento,
        CostoDelivery,
        Total,
        Estado,
        DATE_FORMAT(FechaPedido, '%Y-%m-%d %H:%i:%s') AS FechaPedido,
        DATE_FORMAT(FechaEntrega, '%Y-%m-%d %H:%i:%s') AS FechaEntrega,
        Observaciones
    FROM Pedidos
    WHERE IdPedido = p_idPedido
    LIMIT 1;
END //
DELIMITER ;

-- ============================================
-- PA: REGISTRAR DETALLE PEDIDO
-- ============================================
DROP PROCEDURE IF EXISTS pa_registrar_detalle_pedido;
DELIMITER //
CREATE PROCEDURE pa_registrar_detalle_pedido(
    IN p_idPedido INT,
    IN p_idProducto INT,
    IN p_idPlato INT,
    IN p_codProducto VARCHAR(50),
    IN p_descripcionProducto TEXT,
    IN p_cantidad INT,
    IN p_precioUnitario DECIMAL(10,2)
)
BEGIN
    DECLARE v_idDetalle INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Validar parámetros requeridos
    IF p_idPedido IS NULL OR p_idPedido <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El ID del pedido es obligatorio';
    END IF;

    IF p_cantidad IS NULL OR p_cantidad <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La cantidad debe ser mayor a 0';
    END IF;

    IF p_precioUnitario IS NULL OR p_precioUnitario < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El precio unitario es obligatorio';
    END IF;

    -- Insertar detalle del pedido
    INSERT INTO DetallePedido (
        IdPedido,
        IdProducto,
        IdPlato,
        CodProducto,
        DescripcionProducto,
        Cantidad,
        PrecioUnitario,
        Subtotal
    ) VALUES (
        p_idPedido,
        NULLIF(p_idProducto, 0),
        NULLIF(p_idPlato, 0),
        p_codProducto,
        p_descripcionProducto,
        p_cantidad,
        p_precioUnitario,
        p_cantidad * p_precioUnitario
    );

    SET v_idDetalle = LAST_INSERT_ID();

    COMMIT;

    -- Retornar el detalle registrado
    SELECT JSON_OBJECT(
        'IdDetalle', v_idDetalle,
        'IdPedido', p_idPedido,
        'CodProducto', p_codProducto,
        'Cantidad', p_cantidad,
        'PrecioUnitario', p_precioUnitario,
        'Subtotal', p_cantidad * p_precioUnitario,
        'mensaje', 'Detalle de pedido registrado exitosamente'
    ) AS resultado;
END //


-- ============================================
-- PA: REGISTRAR VENTA
-- ============================================
DROP PROCEDURE IF EXISTS pa_registrar_venta;
DELIMITER //
CREATE PROCEDURE pa_registrar_venta(
    IN p_idCliente INT,
    IN p_idMesero INT,
    IN p_tipoPago ENUM('efectivo', 'tarjeta', 'yape', 'plin'),
    IN p_tipoComprobante ENUM('boleta', 'factura', 'ninguno'),
    IN p_subTotal DECIMAL(12,2),
    IN p_descuento DECIMAL(12,2),
    IN p_costoDelivery DECIMAL(10,2),
    IN p_total DECIMAL(12,2),
    IN p_idUsuario INT,
    IN p_codCaja VARCHAR(50),
    IN p_observaciones TEXT,
    IN p_detalles JSON
)
BEGIN
    DECLARE v_codVenta INT;
    DECLARE v_numeroComprobante VARCHAR(50);
    DECLARE v_detalle_count INT;
    DECLARE v_i INT DEFAULT 0;
    DECLARE v_codProducto VARCHAR(50);
    DECLARE v_linea VARCHAR(100);
    DECLARE v_descripcion TEXT;
    DECLARE v_cantidad INT;
    DECLARE v_precio DECIMAL(10,2);
    DECLARE v_subtotal DECIMAL(12,2);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT JSON_OBJECT(
            'error', 'Error al registrar venta'
        ) AS resultado;
    END;

    START TRANSACTION;

    -- Validar parámetros requeridos
    IF p_tipoPago IS NULL OR p_tipoPago = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El tipo de pago es obligatorio';
    END IF;

    IF p_idUsuario IS NULL OR p_idUsuario <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El usuario es obligatorio';
    END IF;

    -- Generar número de comprobante solo si no es 'ninguno'
    IF p_tipoComprobante != 'ninguno' THEN
        SET v_numeroComprobante = fn_generar_numero_boleta(p_tipoComprobante);
    ELSE
        SET v_numeroComprobante = NULL;
    END IF;

    -- Insertar la venta
    INSERT INTO Ventas (
        IdCliente,
        IdMesero,
        TipoPago,
        TipoComprobante,
        NumeroComprobante,
        SubTotal,
        Descuento,
        CostoDelivery,
        Total,
        IdUsuario,
        CodCaja,
        Estado,
        Observaciones
    ) VALUES (
        NULLIF(p_idCliente, 0),
        NULLIF(p_idMesero, 0),
        p_tipoPago,
        p_tipoComprobante,
        v_numeroComprobante,
        p_subTotal,
        p_descuento,
        COALESCE(p_costoDelivery, 0.00),
        p_total,
        p_idUsuario,
        NULLIF(p_codCaja, ''),
        'pagado',
        NULLIF(p_observaciones, '')
    );

    SET v_codVenta = LAST_INSERT_ID();

    -- Insertar detalles de venta desde JSON
    IF p_detalles IS NOT NULL AND JSON_TYPE(p_detalles) = 'ARRAY' THEN
        SET v_detalle_count = JSON_LENGTH(p_detalles);
        WHILE v_i < v_detalle_count DO
            SET v_codProducto = JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', v_i, '].codProducto')));
            SET v_linea = JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', v_i, '].linea')));
            SET v_descripcion = JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', v_i, '].descripcion')));
            SET v_cantidad = JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', v_i, '].cantidad')));
            SET v_precio = JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', v_i, '].precio')));
            SET v_subtotal = v_cantidad * v_precio;

            INSERT INTO DetalleVenta (
                CodVenta,
                CodProducto,
                Linea,
                Descripcion,
                Cantidad,
                Precio,
                Subtotal
            ) VALUES (
                v_codVenta,
                v_codProducto,
                COALESCE(v_linea, ''),
                COALESCE(v_descripcion, ''),
                COALESCE(v_cantidad, 0),
                COALESCE(v_precio, 0),
                v_subtotal
            );

            SET v_i = v_i + 1;
        END WHILE;
    END IF;

    COMMIT;

    -- Retornar la venta registrada
    SELECT JSON_OBJECT(
        'CodVenta', v_codVenta,
        'IdCliente', p_idCliente,
        'TipoPago', p_tipoPago,
        'SubTotal', p_subTotal,
        'Descuento', p_descuento,
        'Total', p_total,
        'Estado', 'pagado',
        'NumeroComprobante', (SELECT NumeroComprobante FROM Ventas WHERE CodVenta = v_codVenta),
        'mensaje', 'Venta registrada exitosamente'
    ) AS resultado;
END //
DELIMITER ;

-- ============================================
-- PA: LISTAR VENTAS
-- ============================================
DROP PROCEDURE IF EXISTS pa_listar_ventas;
DELIMITER //
CREATE PROCEDURE pa_listar_ventas()
BEGIN
    SELECT 
        v.CodVenta,
        v.IdCliente,
        COALESCE(c.NombreCliente, 'Sin cliente') AS NombreCliente,
        v.TipoPago,
        v.SubTotal,
        v.Descuento,
        v.Total,
        v.IdUsuario,
        v.CodCaja,
        v.Estado,
        DATE_FORMAT(v.FechaVenta, '%Y-%m-%d %H:%i:%s') AS FechaVenta,
        v.Observaciones
    FROM Ventas v
    LEFT JOIN Clientes c ON v.IdCliente = c.IdCliente
    ORDER BY v.FechaVenta DESC, v.CodVenta DESC;
END //
DELIMITER ;

-- ============================================
-- PA: BUSCAR VENTA
-- ============================================
DROP PROCEDURE IF EXISTS pa_buscar_venta;
DELIMITER //
CREATE PROCEDURE pa_buscar_venta(
    IN p_codVenta INT
)
BEGIN
    SELECT 
        v.CodVenta,
        v.IdCliente,
        v.IdMesero,
        COALESCE(c.NombreCompleto, 'Cliente General') AS NombreCliente,
        COALESCE(c.NumDocumento, '') AS DNI,
        COALESCE(c.Telefono, '') AS TelefonoCliente,
        COALESCE(c.Direccion, '') AS DireccionCliente,
        v.TipoPago,
        v.TipoComprobante,
        v.NumeroComprobante,
        v.SubTotal,
        v.Descuento,
        v.CostoDelivery,
        v.Total,
        v.IdUsuario,
        COALESCE(u.NombreCompleto, CONCAT('Usuario ID: ', v.IdUsuario)) AS NombreUsuario,
        COALESCE(m.NombreCompleto, '') AS NombreMesero,
        v.CodCaja,
        v.Estado,
        DATE_FORMAT(v.FechaVenta, '%Y-%m-%d %H:%i:%s') AS FechaVenta,
        v.Observaciones,
        -- Intentar obtener el tipo de servicio del pedido asociado si existe
        (SELECT p.TipoServicio FROM Pedidos p WHERE p.IdCliente = v.IdCliente ORDER BY p.IdPedido DESC LIMIT 1) AS TipoServicio
    FROM Ventas v
    LEFT JOIN Clientes c ON v.IdCliente = c.IdCliente
    LEFT JOIN Usuarios u ON v.IdUsuario = u.IdUsuario
    LEFT JOIN Usuarios m ON v.IdMesero = m.IdUsuario
    WHERE v.CodVenta = p_codVenta
    LIMIT 1;
END //

INSERT INTO Caja (
  CodCaja, Estado, MontoInicial, MontoFinal, Fecha, Turno, IdUsuario,
  HoraApertura, HoraCierre,
  TotalVentas, TotalEfectivo, TotalTarjeta, TotalYape, TotalPlin,
  Observaciones
) VALUES
('CAJ-20251208-A1', 'abierta', 300.00, 0.00, '2025-12-08', 'Mañana', 1,
 '2025-12-08 08:00:00', NULL,
 1250.00, 700.00, 350.00, 120.00, 80.00,
 'Turno mañana en curso'),

('CAJ-20251207-T1', 'cerrada', 250.00, 1870.00, '2025-12-07', 'Tarde', 2,
 '2025-12-07 15:00:00', '2025-12-07 23:15:00',
 1620.00, 900.00, 500.00, 140.00, 80.00,
 'Cierre sin incidencias'),

('CAJ-20251206-N1', 'cerrada', 200.00, 1180.00, '2025-12-06', 'Noche', 3,
 '2025-12-06 18:00:00', '2025-12-07 01:10:00',
 980.00, 520.00, 280.00, 90.00, 90.00,
 'Cuadre correcto, sin diferencias');
 
 
-- ============================================
-- PA: APERTURA CAJA
-- ============================================
DROP PROCEDURE IF EXISTS pa_caja_abrir;
DELIMITER //
CREATE PROCEDURE pa_caja_abrir(
    IN p_codCaja VARCHAR(50),
    IN p_montoInicial DECIMAL(12,2),
    IN p_turno ENUM('Mañana','Tarde','Noche'),
    IN p_idUsuario INT,
    IN p_fecha DATE
)
BEGIN
    DECLARE v_existe INT DEFAULT 0;
    
    -- Verificar si la caja existe
    SELECT COUNT(*) INTO v_existe
    FROM Caja 
    WHERE CodCaja = p_codCaja;
    
    -- Si no existe, crear nueva caja
    IF v_existe = 0 THEN
        INSERT INTO Caja (
            CodCaja, Estado, MontoInicial, MontoFinal, Fecha, Turno,
            IdUsuario, HoraApertura, TotalVentas, TotalEfectivo, TotalTarjeta,
            TotalYape, TotalPlin, Observaciones
        ) VALUES (
            p_codCaja,
            'abierta',
            IFNULL(p_montoInicial, 0),
            0,
            p_fecha,
            p_turno,
            p_idUsuario,
            NOW(),
            0, 0, 0, 0, 0,
            NULL
        );
        SELECT JSON_OBJECT('exito', TRUE, 'mensaje', 'Caja creada y abierta correctamente', 'CodCaja', p_codCaja) AS resultado;
    ELSE
        -- Si existe, actualizar (reabrir)
        UPDATE Caja SET
            Estado = 'abierta',
            MontoInicial = IFNULL(p_montoInicial, 0),
            MontoFinal = 0,
            Fecha = p_fecha,
            Turno = p_turno,
            IdUsuario = p_idUsuario,
            HoraApertura = NOW(),
            HoraCierre = NULL,
            TotalVentas = 0,
            TotalEfectivo = 0,
            TotalTarjeta = 0,
            TotalYape = 0,
            TotalPlin = 0,
            Observaciones = NULL
        WHERE CodCaja = p_codCaja;
        
        SELECT JSON_OBJECT('exito', TRUE, 'mensaje', 'Caja abierta correctamente', 'CodCaja', p_codCaja) AS resultado;
    END IF;
END //
DELIMITER ;

-- ============================================
-- PA: LISTAR CAJAS
-- ============================================
DROP PROCEDURE IF EXISTS pa_caja_listar;
DELIMITER //
CREATE PROCEDURE pa_caja_listar()
BEGIN
    SELECT 
        CodCaja,
        Estado,
        MontoInicial,
        MontoFinal,
        Fecha AS FechaApertura,
        HoraApertura,
        HoraCierre,
        Fecha,
        Turno,
        IdUsuario,
        TotalVentas,
        TotalEfectivo,
        TotalTarjeta,
        TotalYape,
        TotalPlin,
        Observaciones
    FROM Caja
    ORDER BY Fecha DESC, HoraApertura DESC;
END //
DELIMITER ;

-- ============================================
-- PA: CAJA ABIERTA ACTUAL
-- ============================================
DROP PROCEDURE IF EXISTS pa_caja_abierta;
DELIMITER //
CREATE PROCEDURE pa_caja_abierta()
BEGIN
    SELECT 
        CodCaja,
        Estado,
        MontoInicial,
        MontoFinal,
        Fecha AS FechaApertura,
        HoraApertura,
        HoraCierre,
        Fecha,
        Turno,
        IdUsuario,
        TotalVentas,
        TotalEfectivo,
        TotalTarjeta,
        TotalYape,
        TotalPlin,
        Observaciones
    FROM Caja
    WHERE Estado = 'abierta'
    ORDER BY HoraApertura DESC
    LIMIT 1;
END //

-- ============================================
-- PA: CERRAR CAJA
-- ============================================
DROP PROCEDURE IF EXISTS pa_caja_cerrar;
DELIMITER //
CREATE PROCEDURE pa_caja_cerrar(
    IN p_codCaja VARCHAR(50),
    IN p_montoFinal DECIMAL(12,2),
    IN p_observaciones TEXT,
    IN p_idUsuario INT
)
BEGIN
    UPDATE Caja
    SET Estado = 'cerrada',
        MontoFinal = IFNULL(p_montoFinal, 0),
        HoraCierre = NOW(),
        Observaciones = p_observaciones,
        IdUsuario = p_idUsuario
    WHERE CodCaja = p_codCaja;

    SELECT JSON_OBJECT('exito', TRUE, 'mensaje', 'Caja cerrada correctamente', 'CodCaja', p_codCaja) AS resultado;
END //
 
-- ============================================
-- PA: REGISTRAR PROMOCION
-- ============================================
DROP PROCEDURE IF EXISTS pa_promocion_registrar;
DELIMITER //
CREATE PROCEDURE pa_promocion_registrar(
    IN p_nombre VARCHAR(150),
    IN p_tipo ENUM('2x1','porcentaje','monto','horario','combo','especial'),
    IN p_descuento VARCHAR(50),
    IN p_estado ENUM('activa','inactiva','programada'),
    IN p_fechaInicio DATE,
    IN p_fechaFin DATE,
    IN p_diasAplicables VARCHAR(200),
    IN p_horario VARCHAR(100),
    IN p_montoMinimo DECIMAL(10,2),
    IN p_usosMaximos INT,
    IN p_acumulable BOOLEAN,
    IN p_descripcion TEXT
)
BEGIN
    INSERT INTO Promociones (
        NombrePromocion, TipoPromocion, Descuento, Estado, FechaInicio, FechaFin,
        DiasAplicables, Horario, MontoMinimo, UsosMaximos, Acumulable, Descripcion
    ) VALUES (
        p_nombre, p_tipo, p_descuento, p_estado, p_fechaInicio, p_fechaFin,
        p_diasAplicables, p_horario, IFNULL(p_montoMinimo, 0), p_usosMaximos,
        IFNULL(p_acumulable, FALSE), p_descripcion
    );
    
    SELECT JSON_OBJECT('exito', TRUE, 'mensaje', 'Promoción registrada correctamente', 'idPromocion', LAST_INSERT_ID()) AS resultado;
END //
DELIMITER ;

-- ============================================
-- PA: LISTAR PROMOCIONES
-- ============================================
DROP PROCEDURE IF EXISTS pa_promocion_listar;
DELIMITER //
CREATE PROCEDURE pa_promocion_listar()
BEGIN
    SELECT 
        IdPromocion, NombrePromocion, TipoPromocion, Descuento, Estado,
        FechaInicio, FechaFin, DiasAplicables, Horario, MontoMinimo,
        UsosMaximos, UsosCliente, Acumulable, Descripcion, FechaCreacion
    FROM Promociones
    ORDER BY FechaCreacion DESC;
END //
DELIMITER ;

-- ============================================
-- PA: ACTUALIZAR PROMOCION
-- ============================================
DROP PROCEDURE IF EXISTS pa_promocion_actualizar;
DELIMITER //
CREATE PROCEDURE pa_promocion_actualizar(
    IN p_idPromocion INT,
    IN p_nombre VARCHAR(150),
    IN p_tipo ENUM('2x1','porcentaje','monto','horario','combo','especial'),
    IN p_descuento VARCHAR(50),
    IN p_estado ENUM('activa','inactiva','programada'),
    IN p_fechaInicio DATE,
    IN p_fechaFin DATE,
    IN p_diasAplicables VARCHAR(200),
    IN p_horario VARCHAR(100),
    IN p_montoMinimo DECIMAL(10,2),
    IN p_usosMaximos INT,
    IN p_acumulable BOOLEAN,
    IN p_descripcion TEXT
)
BEGIN
    UPDATE Promociones SET
        NombrePromocion = p_nombre,
        TipoPromocion = p_tipo,
        Descuento = p_descuento,
        Estado = p_estado,
        FechaInicio = p_fechaInicio,
        FechaFin = p_fechaFin,
        DiasAplicables = p_diasAplicables,
        Horario = p_horario,
        MontoMinimo = IFNULL(p_montoMinimo, 0),
        UsosMaximos = p_usosMaximos,
        Acumulable = IFNULL(p_acumulable, FALSE),
        Descripcion = p_descripcion
    WHERE IdPromocion = p_idPromocion;
    
    SELECT JSON_OBJECT('exito', TRUE, 'mensaje', 'Promoción actualizada correctamente') AS resultado;
END //
DELIMITER ;

-- ============================================
-- PA: BUSCAR PROMOCION
-- ============================================
DROP PROCEDURE IF EXISTS pa_promocion_buscar;
DELIMITER //
CREATE PROCEDURE pa_promocion_buscar(IN p_idPromocion INT)
BEGIN
    SELECT 
        IdPromocion, NombrePromocion, TipoPromocion, Descuento, Estado,
        FechaInicio, FechaFin, DiasAplicables, Horario, MontoMinimo,
        UsosMaximos, UsosCliente, Acumulable, Descripcion, FechaCreacion
    FROM Promociones
    WHERE IdPromocion = p_idPromocion
    LIMIT 1;
END //
DELIMITER ;

-- ============================================
-- PA: ELIMINAR PROMOCION
-- ============================================
DROP PROCEDURE IF EXISTS pa_promocion_eliminar;
DELIMITER //
CREATE PROCEDURE pa_promocion_eliminar(IN p_idPromocion INT)
BEGIN
    DELETE FROM Promociones WHERE IdPromocion = p_idPromocion;
    SELECT JSON_OBJECT('exito', TRUE, 'mensaje', 'Promoción eliminada correctamente') AS resultado;
END //
DELIMITER ;


-- nuevos inserts 

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
) VALUES
('DNI','90000001','Carlos','Lopez','987111001','carlos.lopez1@example.com','Av. Principal 101',0.00,'activo'),
('DNI','90000002','Maria','Gomez','987111002','maria.gomez2@example.com','Jr. Los Olivos 202',0.00,'activo'),
('DNI','90000003','Jose','Fernandez','987111003','jose.fernandez3@example.com','Calle Luna 303',0.00,'activo'),
('DNI','90000004','Ana','Ramirez','987111004','ana.ramirez4@example.com','Av. Sol 404',0.00,'activo'),
('DNI','90000005','Luis','Torres','987111005','luis.torres5@example.com','Jr. Mar 505',0.00,'activo'),
('DNI','90000006','Lucia','Castillo','987111006','lucia.castillo6@example.com','Pasaje Rio 606',0.00,'activo'),
('DNI','90000007','Jorge','Rojas','987111007','jorge.rojas7@example.com','Av. Andes 707',0.00,'activo'),
('DNI','90000008','Carmen','Vargas','987111008','carmen.vargas8@example.com','Jr. Norte 808',0.00,'activo'),
('DNI','90000009','Ricardo','Soto','987111009','ricardo.soto9@example.com','Calle Sur 909',0.00,'activo'),
('DNI','90000010','Elena','Herrera','987111010','elena.herrera10@example.com','Av. Lima 110',0.00,'activo'),
('DNI','90000011','Miguel','Paredes','987111011','miguel.paredes11@example.com','Jr. Cusco 211',0.00,'activo'),
('DNI','90000012','Sofia','Campos','987111012','sofia.campos12@example.com','Calle Arequipa 312',0.00,'activo'),
('DNI','90000013','Pedro','Silva','987111013','pedro.silva13@example.com','Av. Tacna 413',0.00,'activo'),
('DNI','90000014','Patricia','Mendoza','987111014','patricia.mendoza14@example.com','Jr. Moquegua 514',0.00,'activo'),
('DNI','90000015','Diego','Chavez','987111015','diego.chavez15@example.com','Calle Puno 615',0.00,'activo'),
('DNI','90000016','Valeria','Rios','987111016','valeria.rios16@example.com','Av. Ica 716',0.00,'activo'),
('DNI','90000017','Andres','Guerrero','987111017','andres.guerrero17@example.com','Jr. MadreDeDios 817',0.00,'activo'),
('DNI','90000018','Daniela','Flores','987111018','daniela.flores18@example.com','Calle Ucayali 918',0.00,'activo'),
('DNI','90000019','Fernando','Cruz','987111019','fernando.cruz19@example.com','Av. Amazonas 119',0.00,'activo'),
('DNI','90000020','Rosa','Peña','987111020','rosa.pena20@example.com','Jr. Selva 220',0.00,'activo'),
('DNI','90000021','Hugo','Salazar','987111021','hugo.salazar21@example.com','Calle Prado 321',0.00,'activo'),
('DNI','90000022','Paola','Aguilar','987111022','paola.aguilar22@example.com','Av. Central 422',0.00,'activo'),
('DNI','90000023','Oscar','Cabrera','987111023','oscar.cabrera23@example.com','Jr. Comercio 523',0.00,'activo'),
('DNI','90000024','Diana','Reyes','987111024','diana.reyes24@example.com','Calle Vista 624',0.00,'activo'),
('DNI','90000025','Hernan','Iglesias','987111025','hernan.iglesias25@example.com','Av. Pacifico 725',0.00,'activo'),
('DNI','90000026','Gabriela','Vera','987111026','gabriela.vera26@example.com','Jr. Horizonte 826',0.00,'activo'),
('DNI','90000027','Raul','Bravo','987111027','raul.bravo27@example.com','Calle Sierra 927',0.00,'activo'),
('DNI','90000028','Patty','Nunez','987111028','patty.nunez28@example.com','Av. Costa 128',0.00,'activo'),
('DNI','90000029','Alfredo','Mejia','987111029','alfredo.mejia29@example.com','Jr. Valle 229',0.00,'activo'),
('DNI','90000030','Liliana','Huaman','987111030','liliana.huaman30@example.com','Calle Rocas 330',0.00,'activo'),
('DNI','90000031','Franco','Pizarro','987111031','franco.pizarro31@example.com','Av. Portal 431',0.00,'activo'),
('DNI','90000032','Angela','Quispe','987111032','angela.quispe32@example.com','Jr. Olivar 532',0.00,'activo'),
('DNI','90000033','Sebastian','Loayza','987111033','sebastian.loayza33@example.com','Calle Jardin 633',0.00,'activo'),
('DNI','90000034','Marta','Palacios','987111034','marta.palacios34@example.com','Av. Litoral 734',0.00,'activo'),
('DNI','90000035','Ivan','Carrillo','987111035','ivan.carrillo35@example.com','Jr. Palmeras 835',0.00,'activo'),
('DNI','90000036','Fiorella','Ponce','987111036','fiorella.ponce36@example.com','Calle Cedros 936',0.00,'activo'),
('DNI','90000037','Gonzalo','Bermudez','987111037','gonzalo.bermudez37@example.com','Av. Horizonte 137',0.00,'activo'),
('DNI','90000038','Alejandra','Vidal','987111038','alejandra.vidal38@example.com','Jr. Prado 238',0.00,'activo'),
('DNI','90000039','Mauricio','Solano','987111039','mauricio.solano39@example.com','Calle Norte 339',0.00,'activo'),
('DNI','90000040','Nadia','Campos','987111040','nadia.campos40@example.com','Av. Oeste 440',0.00,'activo'),
('DNI','90000041','Javier','Barrios','987111041','javier.barrios41@example.com','Jr. Andes 541',0.00,'activo'),
('DNI','90000042','Carla','Delgado','987111042','carla.delgado42@example.com','Calle Sur 642',0.00,'activo'),
('DNI','90000043','Bruno','Escobar','987111043','bruno.escobar43@example.com','Av. Centro 743',0.00,'activo'),
('DNI','90000044','Tamara','Luna','987111044','tamara.luna44@example.com','Jr. Estrella 844',0.00,'activo'),
('DNI','90000045','Pablo','Ojeda','987111045','pablo.ojeda45@example.com','Calle Faro 945',0.00,'activo'),
('DNI','90000046','Claudia','Salas','987111046','claudia.salas46@example.com','Av. Costa 146',0.00,'activo'),
('DNI','90000047','Rodrigo','Acosta','987111047','rodrigo.acosta47@example.com','Jr. Bahia 247',0.00,'activo'),
('DNI','90000048','Monica','Polo','987111048','monica.polo48@example.com','Calle Arena 348',0.00,'activo'),
('DNI','90000049','Kevin','Zavala','987111049','kevin.zavala49@example.com','Av. Faro 449',0.00,'activo'),
('DNI','90000050','Julieta','Suarez','987111050','julieta.suarez50@example.com','Jr. Olmos 550',0.00,'activo');
DELIMITER ;




INSERT INTO Usuarios (Dni, NombreCompleto, Telefono, Email, NombreUsuario, Contrasena, IdPerfil, Estado) VALUES
('90010001', 'Lucia Rivas Soto',      '987200001', 'lucia.rivas@kingspizza.com',    'cajera1',     'cajero123',    2, 'activo'), -- cajero
('90010002', 'Diego Torres Paredes',  '987200002', 'diego.torres@kingspizza.com',   'cajero2',     'cajero123',    2, 'activo'), -- cajero
('90010003', 'Valeria Quispe Luna',   '987200003', 'valeria.quispe@kingspizza.com', 'mesera1',     'mesero123',    3, 'activo'), -- mesero
('90010004', 'Jorge Salas Nuñez',     '987200004', 'jorge.salas@kingspizza.com',    'mesero2',     'mesero123',    3, 'activo'), -- mesero
('90010005', 'Carla Vidal Peña',      '987200005', 'carla.vidal@kingspizza.com',    'reparto1',    'delivery123',  4, 'activo'), -- repartidor
('90010006', 'Sebastian Moya Cruz',   '987200006', 'sebastian.moya@kingspizza.com', 'reparto2',    'delivery123',  4, 'activo'), -- repartidor
('90010007', 'Patricia Ramos León',   '987200007', 'patricia.ramos@kingspizza.com', 'superv1',     'supervisor123',5, 'activo'), -- supervisor
('90010008', 'Ricardo Bravo Mejia',   '987200008', 'ricardo.bravo@kingspizza.com',  'cocina1',     'cocina123',    6, 'activo'), -- cocinero
('90010009', 'Fiorella Peña Aguirre', '987200009', 'fiorella.pena@kingspizza.com',  'cocina2',     'cocina123',    6, 'activo'); -- cocinero
DELIMITER ;

INSERT INTO Proveedores (TipoDoc, NumDoc, RazonSocial, NombreComercial, Categoria, Telefono, Email, Direccion) VALUES
('RUC', '20567890123', 'Bebidas Premium SAC', 'Bebidas Premium', 'Bebidas', '042-567890', 'ventas@bebidaspremium.pe', 'Av. Tarapoto 150, Banda de Shilcayo'),
('RUC', '20678901234', 'Verduras Frescas del Norte SRL', 'Verduras del Norte', 'Vegetales', '042-578901', 'pedidos@verdurasnn.com', 'Jr. Huallaga 280, Morales'),
('RUC', '20789012345', 'Limpieza Total EIRL', 'Limpieza Total', 'Limpieza', '042-589012', 'contacto@limpiezatotal.pe', 'Calle San Miguel 95, Tarapoto'),
('RUC', '20890123456', 'Equipos Gastronómicos SAC', 'Equipo Gastro', 'Equipos', '042-590123', 'info@equipogastro.pe', 'Av. Alfonso Ugarte 412, Tarapoto'),
('RUC', '20901234567', 'Carnes Selectas del Oriente SRL', 'Carnes Selectas', 'Carnes', '042-601234', 'ventas@carnesselectas.pe', 'Jr. Cajamarca 321, La Banda');
DELIMITER ;

INSERT IGNORE INTO Platos (CodPlato, Nombre, Descripcion, Ingredientes, Tamano, Precio, Cantidad, Estado) VALUES
-- PIZZAS CLÁSICAS
('PIZZA-MARGARITA-P', 'Pizza Margarita Personal', 'Clásica pizza italiana con tomate, mozzarella y albahaca fresca', 'Tomate, Mozzarella, Albahaca, Aceite de oliva', 'personal', 22.50, 20, 'disponible'),
('PIZZA-MARGARITA-M', 'Pizza Margarita Mediana', 'Clásica pizza italiana con tomate, mozzarella y albahaca fresca', 'Tomate, Mozzarella, Albahaca, Aceite de oliva', 'mediana', 32.50, 20, 'disponible'),
('PIZZA-MARGARITA-G', 'Pizza Margarita Grande', 'Clásica pizza italiana con tomate, mozzarella y albahaca fresca', 'Tomate, Mozzarella, Albahaca, Aceite de oliva', 'grande', 42.50, 20, 'disponible'),
('PIZZA-MARGARITA-F', 'Pizza Margarita Familiar', 'Clásica pizza italiana con tomate, mozzarella y albahaca fresca', 'Tomate, Mozzarella, Albahaca, Aceite de oliva', 'familiar', 52.50, 15, 'disponible'),

-- PIZZAS CARNES
('PIZZA-CARNES-P', 'Pizza 4 Carnes Personal', 'Deliciosa combinación de jamón, chorizo, salchicha y tocino', 'Jamón, Chorizo, Salchicha, Tocino, Queso, Tomate', 'personal', 26.50, 18, 'disponible'),
('PIZZA-CARNES-M', 'Pizza 4 Carnes Mediana', 'Deliciosa combinación de jamón, chorizo, salchicha y tocino', 'Jamón, Chorizo, Salchicha, Tocino, Queso, Tomate', 'mediana', 36.50, 18, 'disponible'),
('PIZZA-CARNES-G', 'Pizza 4 Carnes Grande', 'Deliciosa combinación de jamón, chorizo, salchicha y tocino', 'Jamón, Chorizo, Salchicha, Tocino, Queso, Tomate', 'grande', 46.50, 18, 'disponible'),
('PIZZA-CARNES-F', 'Pizza 4 Carnes Familiar', 'Deliciosa combinación de jamón, chorizo, salchicha y tocino', 'Jamón, Chorizo, Salchicha, Tocino, Queso, Tomate', 'familiar', 56.50, 15, 'disponible'),

-- PIZZAS VEGETARIANAS
('PIZZA-VEGGIE-P', 'Pizza Vegetariana Personal', 'Sano mix de vegetales frescos: pimenton, cebolla, champiñones y aceitunas', 'Pimentón, Cebolla, Champiñones, Aceitunas, Tomate, Queso', 'personal', 23.50, 20, 'disponible'),
('PIZZA-VEGGIE-M', 'Pizza Vegetariana Mediana', 'Sano mix de vegetales frescos: pimenton, cebolla, champiñones y aceitunas', 'Pimentón, Cebolla, Champiñones, Aceitunas, Tomate, Queso', 'mediana', 33.50, 20, 'disponible'),
('PIZZA-VEGGIE-G', 'Pizza Vegetariana Grande', 'Sano mix de vegetales frescos: pimenton, cebolla, champiñones y aceitunas', 'Pimentón, Cebolla, Champiñones, Aceitunas, Tomate, Queso', 'grande', 43.50, 18, 'disponible'),
('PIZZA-VEGGIE-F', 'Pizza Vegetariana Familiar', 'Sano mix de vegetales frescos: pimenton, cebolla, champiñones y aceitunas', 'Pimentón, Cebolla, Champiñones, Aceitunas, Tomate, Queso', 'familiar', 53.50, 15, 'disponible'),

-- PIZZAS ESPECIALES
('PIZZA-HAWAIANA-P', 'Pizza Hawaiana Personal', 'Exótica mezcla de jamón y piña fresca', 'Jamón, Piña, Queso, Tomate, Salsa BBQ', 'personal', 25.50, 18, 'disponible'),
('PIZZA-HAWAIANA-M', 'Pizza Hawaiana Mediana', 'Exótica mezcla de jamón y piña fresca', 'Jamón, Piña, Queso, Tomate, Salsa BBQ', 'mediana', 35.50, 18, 'disponible'),
('PIZZA-HAWAIANA-G', 'Pizza Hawaiana Grande', 'Exótica mezcla de jamón y piña fresca', 'Jamón, Piña, Queso, Tomate, Salsa BBQ', 'grande', 45.50, 16, 'disponible'),
('PIZZA-HAWAIANA-F', 'Pizza Hawaiana Familiar', 'Exótica mezcla de jamón y piña fresca', 'Jamón, Piña, Queso, Tomate, Salsa BBQ', 'familiar', 55.50, 14, 'disponible'),

-- PIZZAS GOURMET
('PIZZA-BBQCHICKEN-P', 'Pizza BBQ Chicken Personal', 'Pollo a la BBQ con cebolla roja y bacon crujiente', 'Pollo BBQ, Bacon, Cebolla roja, Cilantro, Queso, Salsa BBQ', 'personal', 27.50, 16, 'disponible'),
('PIZZA-BBqchicken-M', 'Pizza BBQ Chicken Mediana', 'Pollo a la BBQ con cebolla roja y bacon crujiente', 'Pollo BBQ, Bacon, Cebolla roja, Cilantro, Queso, Salsa BBQ', 'mediana', 37.50, 16, 'disponible'),
('PIZZA-BBqchicken-G', 'Pizza BBQ Chicken Grande', 'Pollo a la BBQ con cebolla roja y bacon crujiente', 'Pollo BBQ, Bacon, Cebolla roja, Cilantro, Queso, Salsa BBQ', 'grande', 47.50, 16, 'disponible'),
('PIZZA-BBqchicken-F', 'Pizza BBQ Chicken Familiar', 'Pollo a la BBQ con cebolla roja y bacon crujiente', 'Pollo BBQ, Bacon, Cebolla roja, Cilantro, Queso, Salsa BBQ', 'familiar', 57.50, 12, 'disponible'),

-- PIZZAS PREMIUM
('PIZZA-SUPREMA-P', 'Pizza Suprema Personal', 'La reina de las pizzas: jamón, chorizo, pimenton, cebolla, champiñones', 'Jamón, Chorizo, Pimentón, Cebolla, Champiñones, Queso, Tomate', 'personal', 28.50, 15, 'disponible'),
('PIZZA-SUPREMA-M', 'Pizza Suprema Mediana', 'La reina de las pizzas: jamón, chorizo, pimenton, cebolla, champiñones', 'Jamón, Chorizo, Pimentón, Cebolla, Champiñones, Queso, Tomate', 'mediana', 38.50, 15, 'disponible'),
('PIZZA-SUPREMA-G', 'Pizza Suprema Grande', 'La reina de las pizzas: jamón, chorizo, pimenton, cebolla, champiñones', 'Jamón, Chorizo, Pimentón, Cebolla, Champiñones, Queso, Tomate', 'grande', 48.50, 15, 'disponible'),
('PIZZA-SUPREMA-F', 'Pizza Suprema Familiar', 'La reina de las pizzas: jamón, chorizo, pimenton, cebolla, champiñones', 'Jamón, Chorizo, Pimentón, Cebolla, Champiñones, Queso, Tomate', 'familiar', 58.50, 12, 'disponible'),

-- PIZZAS ESPECIALES ADICIONALES
('PIZZA-PEPPERONI-P', 'Pizza Pepperoni Personal', 'Clásica pizza de pepperoni con queso derretido', 'Pepperoni, Queso Mozzarella, Tomate, Orégano', 'personal', 24.50, 20, 'disponible'),
('PIZZA-PEPPERONI-M', 'Pizza Pepperoni Mediana', 'Clásica pizza de pepperoni con queso derretido', 'Pepperoni, Queso Mozzarella, Tomate, Orégano', 'mediana', 34.50, 20, 'disponible'),
('PIZZA-PEPPERONI-G', 'Pizza Pepperoni Grande', 'Clásica pizza de pepperoni con queso derretido', 'Pepperoni, Queso Mozzarella, Tomate, Orégano', 'grande', 44.50, 18, 'disponible'),
('PIZZA-PEPPERONI-F', 'Pizza Pepperoni Familiar', 'Clásica pizza de pepperoni con queso derretido', 'Pepperoni, Queso Mozzarella, Tomate, Orégano', 'familiar', 54.50, 15, 'disponible'),

-- PIZZAS SEAFOOD
('PIZZA-SEAFOOD-P', 'Pizza Seafood Personal', 'Deliciosa mezcla de camarones y pulpo fresco', 'Camarones, Pulpo, Queso, Tomate, Ajo, Perejil', 'personal', 32.50, 12, 'disponible'),
('PIZZA-SEAFOOD-M', 'Pizza Seafood Mediana', 'Deliciosa mezcla de camarones y pulpo fresco', 'Camarones, Pulpo, Queso, Tomate, Ajo, Perejil', 'mediana', 42.50, 12, 'disponible'),
('PIZZA-SEAFOOD-G', 'Pizza Seafood Grande', 'Deliciosa mezcla de camarones y pulpo fresco', 'Camarones, Pulpo, Queso, Tomate, Ajo, Perejil', 'grande', 52.50, 10, 'disponible'),
('PIZZA-SEAFOOD-F', 'Pizza Seafood Familiar', 'Deliciosa mezcla de camarones y pulpo fresco', 'Camarones, Pulpo, Queso, Tomate, Ajo, Perejil', 'familiar', 62.50, 10, 'disponible'),

-- PIZZAS MEAT LOVERS
('PIZZA-MEATLOVERS-P', 'Pizza Meat Lovers Personal', 'Para los amantes de la carne: jamón, chorizo, salchicha, tocino y carne molida', 'Jamón, Chorizo, Salchicha, Tocino, Carne Molida, Queso, Tomate', 'personal', 29.50, 14, 'disponible'),
('PIZZA-MEATLOVERS-M', 'Pizza Meat Lovers Mediana', 'Para los amantes de la carne: jamón, chorizo, salchicha, tocino y carne molida', 'Jamón, Chorizo, Salchicha, Tocino, Carne Molida, Queso, Tomate', 'mediana', 39.50, 14, 'disponible'),
('PIZZA-MEATLOVERS-G', 'Pizza Meat Lovers Grande', 'Para los amantes de la carne: jamón, chorizo, salchicha, tocino y carne molida', 'Jamón, Chorizo, Salchicha, Tocino, Carne Molida, Queso, Tomate', 'grande', 49.50, 12, 'disponible'),
('PIZZA-MEATLOVERS-F', 'Pizza Meat Lovers Familiar', 'Para los amantes de la carne: jamón, chorizo, salchicha, tocino y carne molida', 'Jamón, Chorizo, Salchicha, Tocino, Carne Molida, Queso, Tomate', 'familiar', 59.50, 10, 'disponible');

DELIMITER ;

DROP PROCEDURE IF EXISTS pa_login_cliente;
DELIMITER //
CREATE PROCEDURE pa_login_cliente(
    IN p_usuario VARCHAR(100),
    IN p_contrasena VARCHAR(20)
)
BEGIN
    -- Buscar cliente por Nombre (usuario) y NumDocumento (contraseña)
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
    WHERE Nombres = p_usuario 
      AND NumDocumento = p_contrasena
      AND Estado = 'activo'
    LIMIT 1;
END//
DELIMITER ;

-- ============================================
-- PA: ACTUALIZAR PLATO
-- ============================================
DROP PROCEDURE IF EXISTS pa_actualizar_plato;
DELIMITER //
CREATE PROCEDURE pa_actualizar_plato(
    IN p_codPlato VARCHAR(50),
    IN p_nombre VARCHAR(150),
    IN p_descripcion TEXT,
    IN p_ingredientes TEXT,
    IN p_tamano ENUM('personal', 'mediana', 'familiar', 'grande'),
    IN p_precio DECIMAL(10,2),
    IN p_cantidad INT,
    IN p_stockMinimo INT,
    IN p_rutaImg VARCHAR(2000),
    IN p_estado ENUM('disponible', 'no_disponible')
)
BEGIN
    START TRANSACTION;

    IF p_codPlato IS NULL OR p_codPlato = '' OR p_nombre IS NULL OR p_nombre = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Código y nombre del plato son requeridos';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM Platos WHERE CodPlato = p_codPlato) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El plato no existe';
    END IF;

    UPDATE Platos
    SET 
        Nombre = p_nombre,
        Descripcion = NULLIF(p_descripcion, ''),
        Ingredientes = NULLIF(p_ingredientes, ''),
        Tamano = p_tamano,
        Precio = p_precio,
        Cantidad = COALESCE(p_cantidad, 0),
        StockMinimo = COALESCE(p_stockMinimo, 10),
        RutaImg = COALESCE(NULLIF(p_rutaImg, ''), RutaImg),
        Estado = COALESCE(NULLIF(p_estado, ''), 'disponible'),
        FechaActualizacion = CURRENT_TIMESTAMP
    WHERE CodPlato = p_codPlato;

    COMMIT;

    SELECT JSON_OBJECT(
        'CodPlato', p_codPlato,
        'Nombre', p_nombre,
        'mensaje', 'Plato actualizado exitosamente'
    ) AS resultado;
END //

DELIMITER ;

DROP PROCEDURE IF EXISTS pa_listar_platos;
DELIMITER //
CREATE PROCEDURE pa_listar_platos()
BEGIN
    SELECT
        IdPlato,
        CodPlato,
        Nombre,
        Descripcion,
        Ingredientes,
        Tamano,
        Precio,
        Cantidad,
        RutaImg,
        Estado,
        FechaCreacion,
        FechaActualizacion
    FROM Platos
    ORDER BY CodPlato DESC;
END //
DELIMITER ;



INSERT INTO Productos (CodProducto, NombreProducto, Categoria, Tamano, Precio, Costo, Stock, StockMinimo, TiempoPreparacion, CodigoBarras, Descripcion) VALUES
-- BEBIDAS
('BEB-001', 'Inca Kola 500ml', 'bebidas', 'na', 5.00, 2.50, 200, 50, 0, '7751234567001', 'Bebida gaseosa nacional'),
('BEB-002', 'Coca Cola 500ml', 'bebidas', 'na', 5.00, 2.50, 180, 50, 0, '7751234567002', 'Bebida gaseosa clásica'),
('BEB-003', 'Coca Cola 1.5L', 'bebidas', 'na', 8.50, 4.00, 120, 30, 0, '7751234567003', 'Bebida gaseosa familiar'),
('BEB-004', 'Sprite 500ml', 'bebidas', 'na', 5.00, 2.50, 150, 40, 0, '7751234567004', 'Bebida gaseosa lima-limón'),
('BEB-005', 'Fanta 500ml', 'bebidas', 'na', 5.00, 2.50, 140, 40, 0, '7751234567005', 'Bebida gaseosa sabor naranja'),
('BEB-006', 'Agua Mineral 625ml', 'bebidas', 'na', 3.50, 1.50, 250, 60, 0, '7751234567006', 'Agua mineral sin gas'),
('BEB-007', 'Chicha Morada 1L', 'bebidas', 'na', 10.00, 4.50, 80, 20, 5, '7751234567007', 'Bebida tradicional peruana'),
('BEB-008', 'Limonada Natural 1L', 'bebidas', 'na', 12.00, 5.00, 60, 15, 5, '7751234567008', 'Limonada fresca preparada'),

('POST-001', 'Tres Leches', 'postres', 'na', 12.50, 6.00, 25, 8, 10, '7751234567301', 'Postre tradicional peruano'),
('POST-002', 'Tiramisu', 'postres', 'na', 15.00, 7.50, 20, 6, 12, '7751234567302', 'Postre italiano con café y mascarpone'),
('POST-003', 'Cheesecake de Fresa', 'postres', 'na', 14.00, 7.00, 22, 6, 10, '7751234567303', 'Tarta de queso con fresas'),
('POST-004', 'Brownie con Helado', 'postres', 'na', 13.00, 6.50, 28, 8, 8, '7751234567304', 'Brownie caliente con helado de vainilla'),
('POST-005', 'Volcán de Chocolate', 'postres', 'na', 16.00, 8.00, 18, 5, 15, '7751234567305', 'Volcán de chocolate caliente'),

-- EXTRAS
('EXT-001', 'Pan al Ajo (6 unid)', 'extras', 'na', 8.00, 3.50, 60, 15, 10, '7751234567401', 'Pan tostado con mantequilla de ajo'),
('EXT-002', 'Chicken Wings (8 unid)', 'extras', 'na', 25.00, 12.00, 40, 10, 18, '7751234567402', 'Alitas de pollo picantes'),
('EXT-003', 'Papas Fritas Grandes', 'extras', 'na', 10.00, 4.00, 80, 20, 12, '7751234567403', 'Papas fritas crujientes'),
('EXT-004', 'Aros de Cebolla', 'extras', 'na', 12.00, 5.00, 50, 12, 15, '7751234567404', 'Aros de cebolla empanizados'),
('EXT-005', 'Nuggets de Pollo (10 unid)', 'extras', 'na', 18.00, 8.00, 55, 15, 12, '7751234567405', 'Nuggets de pollo crujientes'),
('EXT-006', 'Tequeños (6 unid)', 'extras', 'na', 15.00, 6.50, 45, 12, 15, '7751234567406', 'Tequeños de queso venezolanos');

-- ============================================
-- PROCEDIMIENTO: OBTENER ESTADÍSTICAS DE MESEROS
-- ============================================
DROP PROCEDURE IF EXISTS pa_estadisticas_meseros;
DELIMITER //
CREATE PROCEDURE pa_estadisticas_meseros()
BEGIN
    SELECT 
        u.IdUsuario,
        u.NombreCompleto,
        u.Dni,
        u.NombreUsuario,
        u.Telefono,
        u.Email,
        u.Estado,
        p.NombrePerfil,
        -- Contar pedidos del día actual registrados por este mesero (usando IdUsuario)
        (SELECT COUNT(*) 
         FROM Pedidos ped 
         WHERE ped.IdUsuario = u.IdUsuario 
         AND DATE(ped.FechaPedido) = CURDATE()) AS PedidosHoy,
        -- Calcular total de ventas del día de este mesero
        COALESCE((SELECT SUM(ped.Total) 
         FROM Pedidos ped 
         WHERE ped.IdUsuario = u.IdUsuario 
         AND DATE(ped.FechaPedido) = CURDATE()
         AND ped.Estado != 'cancelado'), 0) AS VentasHoy
    FROM Usuarios u
    INNER JOIN Perfiles p ON u.IdPerfil = p.IdPerfil
    WHERE p.NombrePerfil = 'Mesero'
    ORDER BY u.NombreCompleto;
END //
DELIMITER ;

-- ============================================
-- PROCEDIMIENTO: OBTENER ESTADÍSTICAS DE CAJEROS
-- ============================================
DROP PROCEDURE IF EXISTS pa_estadisticas_cajeros;
DELIMITER //
CREATE PROCEDURE pa_estadisticas_cajeros()
BEGIN
    SELECT 
        u.IdUsuario,
        u.NombreCompleto,
        u.Dni,
        u.NombreUsuario,
        u.Telefono,
        u.Email,
        u.Estado,
        p.NombrePerfil,
        -- Contar ventas del día actual registradas por este cajero (usando IdUsuario)
        (SELECT COUNT(*) 
         FROM Ventas v 
         WHERE v.IdUsuario = u.IdUsuario 
         AND DATE(v.FechaVenta) = CURDATE()) AS VentasHoy,
        -- Calcular total de ventas del día de este cajero
        COALESCE((SELECT SUM(v.Total) 
         FROM Ventas v 
         WHERE v.IdUsuario = u.IdUsuario 
         AND DATE(v.FechaVenta) = CURDATE()
         AND v.Estado != 'cancelado'), 0) AS MontoHoy
    FROM Usuarios u
    INNER JOIN Perfiles p ON u.IdPerfil = p.IdPerfil
    WHERE p.NombrePerfil = 'Cajero'
    ORDER BY u.NombreCompleto;
END //
DELIMITER ;

-- ============================================
-- PROCEDIMIENTO: OBTENER ESTADÍSTICAS DE REPARTIDORES
-- ============================================
DROP PROCEDURE IF EXISTS pa_estadisticas_repartidores;
DELIMITER //
CREATE PROCEDURE pa_estadisticas_repartidores()
BEGIN
    SELECT 
        u.IdUsuario,
        u.NombreCompleto,
        u.Dni,
        u.NombreUsuario,
        u.Telefono,
        u.Email,
        u.Estado,
        p.NombrePerfil,
        -- Contar ventas del día actual confirmadas por este repartidor
        (SELECT COUNT(*) 
         FROM Ventas v 
         WHERE v.IdUsuario = u.IdUsuario 
         AND DATE(v.FechaVenta) = CURDATE()) AS EntregasHoy,
        -- Calcular total de ventas del día de este repartidor
        COALESCE((SELECT SUM(v.Total) 
         FROM Ventas v 
         WHERE v.IdUsuario = u.IdUsuario 
         AND DATE(v.FechaVenta) = CURDATE()
         AND v.Estado != 'cancelado'), 0) AS MontoHoy
    FROM Usuarios u
    INNER JOIN Perfiles p ON u.IdPerfil = p.IdPerfil
    WHERE p.NombrePerfil = 'Repartidor'
    ORDER BY u.NombreCompleto;
END //
DELIMITER ;
