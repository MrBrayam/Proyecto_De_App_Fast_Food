<?php
/**
 * Test para listar proveedores desde la API
 */

// URL de la API
$apiUrl = 'http://localhost/Proyecto_De_App_Fast_Food/api/proveedores/listar';

// Realizar la solicitud GET
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json'
));
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "=== TEST: LISTAR PROVEEDORES ===\n";
echo "URL: $apiUrl\n";
echo "HTTP Code: $httpCode\n";
echo "Response: \n";
echo $response . "\n";

if ($httpCode == 200) {
    $data = json_decode($response, true);
    if ($data && $data['exito']) {
        echo "\n✓ API respondió correctamente\n";
        echo "Total de proveedores: " . $data['total'] . "\n";
        if (!empty($data['proveedores'])) {
            echo "\nPrimer proveedor:\n";
            $prov = $data['proveedores'][0];
            echo "  - Código: " . $prov['codProveedor'] . "\n";
            echo "  - Razón Social: " . $prov['razonSocial'] . "\n";
            echo "  - Categoría: " . $prov['categoria'] . "\n";
            echo "  - Estado: " . $prov['estado'] . "\n";
        }
    } else {
        echo "\n✗ Error en respuesta API\n";
    }
} else {
    echo "\n✗ Error HTTP: $httpCode\n";
}
?>
