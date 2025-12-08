<?php
// Seed script para agregar mesas de prueba
require_once __DIR__ . '/app/core/Database.php';

try {
    $db = Database::connection();
    
    // Insertar mesas de prueba
    $sql = "INSERT IGNORE INTO Mesas (NumMesa, Cantidad, Ubicacion, TipoMesa, Estado, Prioridad, Ventana, SillaBebe, Accesible, Silenciosa, Observacion) VALUES
    (1, 2, 'salon-principal', 'cuadrada', 'disponible', 'normal', 0, 0, 0, 0, 'Mesa para dos personas'),
    (2, 4, 'salon-principal', 'cuadrada', 'disponible', 'normal', 0, 0, 0, 0, 'Mesa estándar'),
    (3, 4, 'salon-principal', 'rectangular', 'disponible', 'normal', 1, 0, 0, 0, 'Con vista a la ventana'),
    (4, 6, 'salon-principal', 'rectangular', 'disponible', 'preferencial', 0, 0, 0, 0, 'Mesa preferencial'),
    (5, 2, 'salon-principal', 'circular', 'disponible', 'normal', 0, 1, 0, 0, 'Con silla para bebé'),
    (6, 8, 'salon-principal', 'rectangular', 'disponible', 'normal', 0, 0, 0, 0, 'Mesa grande'),
    (7, 4, 'terraza', 'cuadrada', 'disponible', 'normal', 1, 0, 0, 0, 'Terraza - vista al exterior'),
    (8, 6, 'terraza', 'rectangular', 'disponible', 'preferencial', 1, 0, 0, 0, 'Terraza - mesa grande'),
    (9, 2, 'segundo-piso', 'cuadrada', 'disponible', 'normal', 0, 0, 0, 0, 'Piso 2 - pareja'),
    (10, 4, 'segundo-piso', 'rectangular', 'disponible', 'normal', 0, 0, 0, 0, 'Piso 2 - grupo'),
    (11, 8, 'area-vip', 'rectangular', 'disponible', 'vip', 0, 0, 0, 0, 'Área VIP'),
    (12, 6, 'area-vip', 'rectangular', 'disponible', 'vip', 0, 0, 1, 0, 'VIP - Accesible'),
    (13, 4, 'exterior', 'cuadrada', 'disponible', 'normal', 1, 0, 0, 0, 'Exterior - tranquila'),
    (14, 2, 'salon-principal', 'alta', 'disponible', 'normal', 0, 0, 0, 1, 'Barra - zona tranquila'),
    (15, 4, 'salon-principal', 'cuadrada', 'disponible', 'normal', 0, 0, 1, 0, 'Accesible para silla de ruedas')";
    
    $stmt = $db->prepare($sql);
    $result = $stmt->execute();
    
    echo json_encode([
        'exito' => true,
        'mensaje' => 'Mesas de prueba insertadas correctamente',
        'rowsInserted' => $stmt->rowCount()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error: ' . $e->getMessage()
    ]);
}
?>
