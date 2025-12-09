<?php
// Ejecutar migración SQL

require_once(__DIR__ . '/../config/Database.php');

try {
    $database = new Database();
    $conn = $database->connect();
    
    // Script de migración
    $sql = "
    ALTER TABLE Clientes 
    ADD COLUMN usuario VARCHAR(50) UNIQUE AFTER numDocumento,
    ADD COLUMN contrasena VARCHAR(255) AFTER usuario;
    ";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            'exito' => true,
            'mensaje' => 'Tabla Clientes actualizada correctamente'
        ]);
    } else {
        // Podría haber error si las columnas ya existen
        echo json_encode([
            'exito' => true,
            'mensaje' => 'Las columnas podrían ya existir'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'exito' => false,
        'error' => $e->getMessage()
    ]);
}
?>
