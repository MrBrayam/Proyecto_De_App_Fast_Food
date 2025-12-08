<?php
// Script para crear los stored procedures de productos

try {
    $host = 'localhost';
    $user = 'root';
    $pass = '71490956';
    $db = 'kings_pizza_db';
    
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Conectado a la base de datos.\n";
    
    // Crear pa_registrar_producto
    $sql1 = <<<SQL
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
SQL;

    // Separar y ejecutar manualmente debido a los DELIMITER
    $statements = preg_split('/DELIMITER\s+[;\/\/]+/', $sql1);
    
    // Usar exec para permitir múltiples comandos
    $conn->exec("DROP PROCEDURE IF EXISTS pa_registrar_producto");
    
    $proc1 = "CREATE PROCEDURE pa_registrar_producto(
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
    
    IF p_codProducto IS NULL OR p_codProducto = '' OR 
       p_nombreProducto IS NULL OR p_nombreProducto = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Código y nombre de producto son requeridos';
    END IF;
    
    IF EXISTS (SELECT 1 FROM Productos WHERE CodProducto = p_codProducto) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El código de producto ya existe';
    END IF;
    
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
    
    SELECT JSON_OBJECT(
        'IdProducto', v_idProducto,
        'CodProducto', p_codProducto,
        'NombreProducto', p_nombreProducto,
        'mensaje', 'Producto registrado exitosamente'
    ) AS resultado;
END";
    
    $conn->exec($proc1);
    echo "✓ Stored procedure pa_registrar_producto creado\n";
    
    // Crear pa_listar_productos
    $conn->exec("DROP PROCEDURE IF EXISTS pa_listar_productos");
    
    $proc2 = "CREATE PROCEDURE pa_listar_productos()
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
END";
    
    $conn->exec($proc2);
    echo "✓ Stored procedure pa_listar_productos creado\n";
    
    echo "\n✓ Todos los stored procedures de productos fueron creados exitosamente\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
?>
