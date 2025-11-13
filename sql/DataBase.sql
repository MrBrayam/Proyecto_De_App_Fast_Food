-- ============================================
-- BASE DE DATOS: SISTEMA FAST FOOD COMPLETO
-- Basado en análisis completo de HTMLs y diagrama de referencia
-- Creado: Noviembre 2025
-- ============================================

-- Eliminar base de datos existente y crear nueva
DROP DATABASE IF EXISTS sistema_fast_food_completo;
CREATE DATABASE sistema_fast_food_completo CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE sistema_fast_food_completo;

-- ============================================
-- TABLA: PERFILES (ROLES DE USUARIO)
-- ============================================
CREATE TABLE Perfiles (
    IdPerfil INT PRIMARY KEY AUTO_INCREMENT,
    NombrePerfil VARCHAR(50) NOT NULL UNIQUE,
    Descripcion TEXT,
    PermisoVentas BOOLEAN DEFAULT FALSE,
    PermisoReportes BOOLEAN DEFAULT FALSE,
    PermisoInventario BOOLEAN DEFAULT FALSE,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: USUARIOS
-- ============================================
CREATE TABLE Usuarios (
    IdUsuario INT PRIMARY KEY AUTO_INCREMENT,
    Dni VARCHAR(20) NOT NULL UNIQUE,
    Nombres VARCHAR(100) NOT NULL,
    Apellidos VARCHAR(100) NOT NULL,
    NombreCompleto VARCHAR(200) GENERATED ALWAYS AS (CONCAT(Nombres, ' ', Apellidos)) STORED,
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
INSERT INTO Perfiles (NombrePerfil, Descripcion, PermisoVentas, PermisoReportes, PermisoInventario) VALUES
('administrador', 'Administrador del sistema', TRUE, TRUE, TRUE),
('cajero', 'Personal de caja y ventas', TRUE, FALSE, FALSE),
('mesero', 'Personal de atención de mesas', TRUE, FALSE, FALSE),
('repartidor', 'Personal de delivery', FALSE, FALSE, FALSE),
('supervisor', 'Supervisor de operaciones', TRUE, TRUE, FALSE),
('cocinero', 'Personal de cocina', FALSE, FALSE, TRUE);

-- Insertar Usuario Administrador por defecto
INSERT INTO Usuarios (Dni, Nombres, Apellidos, Telefono, Email, NombreUsuario, Contrasena, IdPerfil) VALUES
('12345678', 'Administrador', 'Sistema', '987654321', 'admin@fastfood.com', 'admin', 
'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);

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
-- PROCEDIMIENTOS ALMACENADOS
-- ============================================

DELIMITER //

-- Procedimiento para calcular totales de pedido
CREATE PROCEDURE CalcularTotalPedido(
    IN p_IdPedido INT
)
BEGIN
    DECLARE v_SubTotal DECIMAL(12,2) DEFAULT 0.00;
    
    -- Calcular subtotal
    SELECT SUM(Subtotal) INTO v_SubTotal
    FROM DetallePedido
    WHERE IdPedido = p_IdPedido;
    
    -- Actualizar pedido
    UPDATE Pedidos 
    SET SubTotal = IFNULL(v_SubTotal, 0.00),
        Total = IFNULL(v_SubTotal, 0.00) - Descuento
    WHERE IdPedido = p_IdPedido;
END//

-- Procedimiento para actualizar stock después de venta
CREATE PROCEDURE ActualizarStockVenta(
    IN p_CodVenta INT
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_IdProducto INT;
    DECLARE v_Cantidad INT;
    
    DECLARE cur CURSOR FOR 
        SELECT IdProducto, Cantidad 
        FROM DetalleVenta 
        WHERE CodVenta = p_CodVenta AND IdProducto IS NOT NULL;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_IdProducto, v_Cantidad;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Actualizar stock
        UPDATE Productos 
        SET Stock = Stock - v_Cantidad,
            Estado = CASE 
                WHEN Stock - v_Cantidad <= 0 THEN 'agotado'
                WHEN Stock - v_Cantidad <= StockMinimo THEN 'disponible'
                ELSE 'disponible'
            END
        WHERE IdProducto = v_IdProducto;
    END LOOP;
    
    CLOSE cur;
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

-- Trigger para calcular subtotal en detalle de pedido
CREATE TRIGGER CalcularSubtotalDetallePedido
BEFORE INSERT ON DetallePedido
FOR EACH ROW
BEGIN
    SET NEW.Subtotal = NEW.Cantidad * NEW.PrecioUnitario;
END//

-- Trigger para calcular subtotal en detalle de venta
CREATE TRIGGER CalcularSubtotalDetalleVenta
BEFORE INSERT ON DetalleVenta
FOR EACH ROW
BEGIN
    SET NEW.Subtotal = NEW.Cantidad * NEW.Precio;
END//

DELIMITER ;

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