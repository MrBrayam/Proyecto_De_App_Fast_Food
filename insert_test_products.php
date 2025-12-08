<?php
// Script para insertar productos de prueba

try {
    $host = 'localhost';
    $user = 'root';
    $pass = '71490956';
    $db = 'kings_pizza_db';
    
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Conectado a la base de datos.\n";
    
    // Verificar si ya existen productos
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM Productos");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result['total'] > 0) {
        echo "Ya existen " . $result['total'] . " productos en la base de datos.\n";
        echo "No se insertan productos de prueba.\n";
        exit(0);
    }
    
    // Insertar productos de prueba
    $productos = [
        ['PRD001', 'Pizza Hawaiana', 'pizzas', 'grande', 25.90, 12.00, 50, 10, 15, null, 'Jamón, piña y queso', 1],
        ['PRD002', 'Pizza Pepperoni', 'pizzas', 'grande', 28.50, 14.00, 45, 10, 15, null, 'Pepperoni y queso mozzarella', 1],
        ['PRD003', 'Pasta Alfredo', 'pastas', 'na', 18.50, 7.00, 30, 5, 10, null, 'Fettuccine con salsa Alfredo', 1],
        ['PRD004', 'Ensalada César', 'ensaladas', 'na', 12.90, 5.00, 40, 10, 5, null, 'Lechuga romana, croutons, queso parmesano', 1],
        ['PRD005', 'Coca Cola', 'bebidas', 'na', 6.50, 2.50, 100, 20, 0, null, 'Botella 1.5L', 2],
        ['PRD006', 'Inca Kola', 'bebidas', 'na', 5.90, 2.00, 80, 15, 0, null, 'Botella 1L', 2],
        ['PRD007', 'Tiramisú', 'postres', 'na', 9.90, 3.50, 25, 5, 5, null, 'Postre italiano clásico', 1],
        ['PRD008', 'Pizza Margarita', 'pizzas', 'mediana', 22.50, 10.00, 60, 15, 15, null, 'Tomate, mozzarella y albahaca', 1],
    ];
    
    $stmt = $conn->prepare("
        INSERT INTO Productos (CodProducto, NombreProducto, Categoria, Tamano, Precio, Costo, Stock, StockMinimo, TiempoPreparacion, CodigoBarras, Descripcion, CodProveedor)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    foreach ($productos as $prod) {
        $stmt->execute($prod);
        echo "✓ Insertado: {$prod[1]}\n";
    }
    
    echo "\n✓ " . count($productos) . " productos de prueba insertados exitosamente\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
?>
