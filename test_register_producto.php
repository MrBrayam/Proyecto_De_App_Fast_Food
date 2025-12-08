<?php
// Script para probar registro de productos

function testRegistrarProducto() {
    $baseUrl = 'http://localhost/Proyecto_De_App_Fast_Food/api';
    
    echo "=== PRUEBA REGISTRO DE PRODUCTO ===\n\n";
    
    // Datos del producto a registrar
    $datos = [
        'codProducto' => 'PRD_TEST_' . time(),
        'nombreProducto' => 'Pizza Test ' . time(),
        'categoria' => 'pizzas',
        'tamano' => 'grande',
        'precio' => 29.90,
        'costo' => 15.00,
        'stock' => 50,
        'stockMinimo' => 10,
        'tiempoPreparacion' => 20,
        'codigoBarras' => '7751234567890',
        'descripcion' => 'Pizza de prueba para testing',
        'codProveedor' => null
    ];
    
    echo "Enviando datos:\n";
    echo json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n";
    
    $url = $baseUrl . '/productos/registrar';
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($datos));
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    echo "Response Status: $httpCode\n";
    
    if ($error) {
        echo "CURL Error: $error\n";
    }
    
    if ($response) {
        echo "Response:\n";
        echo $response . "\n\n";
        
        $data = json_decode($response, true);
        if ($data) {
            if (isset($data['exito'])) {
                if ($data['exito']) {
                    echo "✓ Producto registrado exitosamente\n";
                } else {
                    echo "✗ Error: " . ($data['mensaje'] ?? 'Unknown') . "\n";
                }
            } else {
                echo "Response structure:\n";
                print_r($data);
            }
        }
    } else {
        echo "✗ No se obtuvo respuesta\n";
    }
}

testRegistrarProducto();
?>
