<?php
// Script para probar la API de productos

function testAPI() {
    $baseUrl = 'http://localhost/Proyecto_De_App_Fast_Food/api';
    
    echo "=== PRUEBA DE API DE PRODUCTOS ===\n\n";
    
    // 1. Probar listar productos
    echo "1. Probando GET /productos/listar\n";
    $url = $baseUrl . '/productos/listar';
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "   Status: $httpCode\n";
    
    if ($response) {
        $data = json_decode($response, true);
        if ($data && isset($data['exito'])) {
            if ($data['exito']) {
                echo "   ✓ API respondió correctamente\n";
                echo "   Total de productos: " . (isset($data['total']) ? $data['total'] : 0) . "\n";
                
                if (isset($data['productos']) && count($data['productos']) > 0) {
                    echo "   Primeros 3 productos:\n";
                    $count = 0;
                    foreach ($data['productos'] as $prod) {
                        if ($count >= 3) break;
                        echo "   - " . ($prod['CodProducto'] ?? 'N/A') . ": " . ($prod['Nombre'] ?? 'N/A') . "\n";
                        $count++;
                    }
                }
            } else {
                echo "   ✗ Error en la respuesta: " . ($data['mensaje'] ?? 'Unknown') . "\n";
            }
        } else {
            echo "   ✗ Respuesta inválida:\n";
            echo "   " . substr($response, 0, 200) . "\n";
        }
    } else {
        echo "   ✗ No se obtuvo respuesta\n";
    }
}

testAPI();
?>
