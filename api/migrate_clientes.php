<?php
/**
 * Script para ejecutar la migración de la tabla Clientes
 * Agregar campos Usuario y Contrasena si no existen
 */

require_once(__DIR__ . '/app/config/Database.php');

echo "Iniciando migración de tabla Clientes...\n";

try {
    $db = new Database();
    $conn = $db->connect();
    
    // Verificar si la columna Usuario ya existe
    $stmt = $conn->prepare("
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'Clientes' AND COLUMN_NAME = 'Usuario'
    ");
    $stmt->execute();
    $usuarioExists = $stmt->fetch();
    
    if (!$usuarioExists) {
        echo "Agregando columna Usuario...\n";
        $conn->exec("ALTER TABLE Clientes ADD COLUMN Usuario VARCHAR(50) UNIQUE AFTER NumDocumento");
    } else {
        echo "Columna Usuario ya existe.\n";
    }
    
    // Verificar si la columna Contrasena existe
    $stmt = $conn->prepare("
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'Clientes' AND COLUMN_NAME = 'Contrasena'
    ");
    $stmt->execute();
    $contrasenaExists = $stmt->fetch();
    
    if (!$contrasenaExists) {
        echo "Agregando columna Contrasena...\n";
        $conn->exec("ALTER TABLE Clientes ADD COLUMN Contrasena VARCHAR(255) AFTER Usuario");
    } else {
        echo "Columna Contrasena ya existe.\n";
    }
    
    // Verificar si el índice ya existe
    $stmt = $conn->prepare("
        SELECT INDEX_NAME 
        FROM INFORMATION_SCHEMA.STATISTICS 
        WHERE TABLE_NAME = 'Clientes' AND COLUMN_NAME = 'Usuario' AND INDEX_NAME = 'idx_cliente_usuario'
    ");
    $stmt->execute();
    $indexExists = $stmt->fetch();
    
    if (!$indexExists && !$usuarioExists) {
        echo "Creando índice idx_cliente_usuario...\n";
        $conn->exec("CREATE INDEX idx_cliente_usuario ON Clientes(Usuario)");
    }
    
    echo "\n✓ Migración completada exitosamente\n";
    
    // Mostrar estructura actual
    echo "\nEstructura actual de Clientes:\n";
    $stmt = $conn->prepare("DESCRIBE Clientes");
    $stmt->execute();
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $col) {
        if (in_array($col['Field'], ['Usuario', 'Contrasena'])) {
            echo "  • " . $col['Field'] . " (" . $col['Type'] . ")\n";
        }
    }
    
} catch (Exception $e) {
    echo "✗ Error en la migración: " . $e->getMessage() . "\n";
    exit(1);
}
?>
