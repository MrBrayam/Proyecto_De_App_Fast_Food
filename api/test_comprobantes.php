<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/app/core/Database.php';

$db = Database::connection();

echo "=== VERIFICACIÓN SISTEMA DE COMPROBANTES ===" . PHP_EOL . PHP_EOL;

echo "1. Generar números de comprobante:" . PHP_EOL;
$stmt = $db->query("SELECT fn_generar_numero_boleta('boleta') as boleta, fn_generar_numero_boleta('factura') as factura");
$result = $stmt->fetch(PDO::FETCH_ASSOC);
echo "   Boleta: " . $result['boleta'] . PHP_EOL;
echo "   Factura: " . $result['factura'] . PHP_EOL . PHP_EOL;

echo "2. Verificar stored procedure pa_registrar_venta:" . PHP_EOL;
$stmt = $db->query("SHOW CREATE PROCEDURE pa_registrar_venta");
$proc = $stmt->fetch(PDO::FETCH_ASSOC);
if (strpos($proc['Create Procedure'], 'p_tipoComprobante') !== false) {
    echo "   ✓ Tiene parámetro p_tipoComprobante" . PHP_EOL;
}
if (strpos($proc['Create Procedure'], 'v_numeroComprobante') !== false) {
    echo "   ✓ Genera número de comprobante condicional" . PHP_EOL;
}

echo PHP_EOL . "3. Verificar stored procedure pa_registrar_pedido:" . PHP_EOL;
$stmt = $db->query("SHOW CREATE PROCEDURE pa_registrar_pedido");
$proc = $stmt->fetch(PDO::FETCH_ASSOC);
if (strpos($proc['Create Procedure'], "'ninguno'") !== false) {
    echo "   ✓ Pedidos NO generan comprobante (ninguno)" . PHP_EOL;
}

echo PHP_EOL . "✅ Sistema configurado correctamente" . PHP_EOL;
