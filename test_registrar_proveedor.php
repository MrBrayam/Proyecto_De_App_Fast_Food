<?php
/**
 * Test para registrar un proveedor desde la API
 */

// URL de la API
$apiUrl = 'http://localhost/Proyecto_De_App_Fast_Food/api/proveedores/registrar';

// Datos del proveedor de prueba
$data = [
    'tipoDoc' => 'RUC',
    'numDoc' => '20987654321',
    'razonSocial' => 'Test Proveedor API S.A.C.',
    'nombreComercial' => 'Test Proveedor',
    'categoria' => 'Bebidas',
    'telefono' => '987654321',
    'telefonoSecundario' => '942123456',
    'email' => 'test@proveedor.com',
    'sitioWeb' => 'www.testproveedor.com',
    'personaContacto' => 'Juan Test',
    'direccion' => 'Av. Test 123, Tarapoto',
    'ciudad' => 'Tarapoto',
    'distrito' => 'Morales',
    'tiempoEntrega' => 2,
    'montoMinimo' => 50.00,
    'descuento' => 5.0,
    'nota' => 'Proveedor de prueba API',
    'estado' => 'activo'
];

// Realizar la solicitud POST
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json'
));
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "=== TEST: REGISTRAR PROVEEDOR ===\n";
echo "URL: $apiUrl\n";
echo "HTTP Code: $httpCode\n";
echo "Response: \n";
echo $response . "\n";

if ($httpCode == 201) {
    $result = json_decode($response, true);
    if ($result && $result['exito']) {
        echo "\n✓ Proveedor registrado exitosamente\n";
        echo "Código Proveedor: " . $result['codProveedor'] . "\n";
        echo "Razón Social: " . $result['razonSocial'] . "\n";
    } else {
        echo "\n✗ Error en respuesta: " . ($result['mensaje'] ?? 'Sin mensaje') . "\n";
    }
} else {
    echo "\n✗ Error HTTP: $httpCode\n";
    $result = json_decode($response, true);
    if ($result && isset($result['mensaje'])) {
        echo "Mensaje: " . $result['mensaje'] . "\n";
    }
}
?>
