<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/app/core/Database.php';

$db = Database::connection();

echo "=== VERIFICACIÓN PA_REGISTRAR_PEDIDO ===" . PHP_EOL . PHP_EOL;

$stmt = $db->query('SHOW CREATE PROCEDURE pa_registrar_pedido');
$proc = $stmt->fetch(PDO::FETCH_ASSOC);
$createProc = $proc['Create Procedure'];

if (strpos($createProc, "'ninguno'") !== false) {
    echo "✓ TipoComprobante = 'ninguno'" . PHP_EOL;
} else {
    echo "✗ NO tiene TipoComprobante = 'ninguno'" . PHP_EOL;
}

if (strpos($createProc, 'NULL') !== false) {
    echo "✓ Asigna NULL al NumeroComprobante" . PHP_EOL;
} else {
    echo "✗ NO asigna NULL" . PHP_EOL;
}

// Mostrar las líneas relevantes
$lines = explode("\n", $createProc);
echo PHP_EOL . "Líneas relevantes del stored procedure:" . PHP_EOL;
foreach ($lines as $line) {
    if (stripos($line, 'tipocomprobante') !== false || stripos($line, 'numerocomprobante') !== false) {
        echo "  " . trim($line) . PHP_EOL;
    }
}
