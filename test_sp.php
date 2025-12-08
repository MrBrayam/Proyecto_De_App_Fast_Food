<?php
// Test directo del stored procedure
header('Content-Type: application/json; charset=utf-8');

$logFile = __DIR__ . '/debug.log';

function logDebug($msg) {
    global $logFile;
    file_put_contents($logFile, date('Y-m-d H:i:s') . ' - ' . $msg . "\n", FILE_APPEND);
}

try {
    logDebug('TEST SP: Iniciando conexión a la base de datos');
    
    $conn = new PDO('mysql:host=localhost;dbname=kings_pizza_db;charset=utf8mb4', 'root', '71490956');
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    logDebug('TEST SP: Conexión exitosa');
    
    // Probar si la tabla Proveedores tiene datos
    $testStmt = $conn->query('SELECT COUNT(*) as total FROM Proveedores');
    $count = $testStmt->fetch(PDO::FETCH_ASSOC);
    logDebug('TEST SP: Conteo de proveedores: ' . $count['total']);
    
    // Probar la llamada al stored procedure
    logDebug('TEST SP: Llamando stored procedure pa_listar_proveedores');
    $stmt = $conn->prepare('CALL pa_listar_proveedores()');
    $stmt->execute();
    
    $proveedores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    logDebug('TEST SP: Total de resultados: ' . count($proveedores));
    
    if (count($proveedores) > 0) {
        logDebug('TEST SP: Primer proveedor: ' . json_encode($proveedores[0]));
    }
    
    echo json_encode([
        'exito' => true,
        'total' => count($proveedores),
        'proveedores' => $proveedores
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
} catch (PDOException $e) {
    logDebug('TEST SP ERROR PDO: ' . $e->getMessage());
    echo json_encode([
        'exito' => false,
        'error' => $e->getMessage(),
        'code' => $e->getCode()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    logDebug('TEST SP ERROR GENERAL: ' . $e->getMessage());
    echo json_encode([
        'exito' => false,
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
?>
