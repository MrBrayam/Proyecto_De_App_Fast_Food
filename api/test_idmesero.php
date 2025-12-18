<?php
/**
 * Script de prueba para verificar que IdMesero se guarda correctamente
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/app/core/Database.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $db = Database::connection();
    
    echo "=== PRUEBA DE IdMesero EN PEDIDOS Y VENTAS ===\n\n";
    
    // 1. Verificar stored procedure pa_registrar_pedido
    echo "1. Verificando pa_registrar_pedido:\n";
    $stmt = $db->query("SHOW CREATE PROCEDURE pa_registrar_pedido");
    $proc = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($proc) {
        $createProc = $proc['Create Procedure'];
        if (strpos($createProc, 'p_idMesero') !== false) {
            echo "   ✓ Parámetro p_idMesero encontrado\n";
        } else {
            echo "   ✗ Parámetro p_idMesero NO encontrado\n";
        }
        if (strpos($createProc, 'IdMesero') !== false) {
            echo "   ✓ Campo IdMesero en INSERT encontrado\n";
        } else {
            echo "   ✗ Campo IdMesero en INSERT NO encontrado\n";
        }
    }
    
    // 2. Verificar stored procedure pa_registrar_venta
    echo "\n2. Verificando pa_registrar_venta:\n";
    $stmt = $db->query("SHOW CREATE PROCEDURE pa_registrar_venta");
    $proc = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($proc) {
        $createProc = $proc['Create Procedure'];
        if (strpos($createProc, 'p_idMesero') !== false) {
            echo "   ✓ Parámetro p_idMesero encontrado\n";
        } else {
            echo "   ✗ Parámetro p_idMesero NO encontrado\n";
        }
        if (strpos($createProc, 'IdMesero') !== false) {
            echo "   ✓ Campo IdMesero en INSERT encontrado\n";
        } else {
            echo "   ✗ Campo IdMesero en INSERT NO encontrado\n";
        }
    }
    
    // 3. Verificar últimos pedidos con IdMesero
    echo "\n3. Últimos 5 pedidos con IdMesero:\n";
    $stmt = $db->query("
        SELECT 
            p.IdPedido,
            p.IdMesero,
            u.NombreCompleto as NombreMesero,
            p.FechaPedido
        FROM Pedidos p
        LEFT JOIN Usuarios u ON p.IdMesero = u.IdUsuario
        ORDER BY p.IdPedido DESC
        LIMIT 5
    ");
    $pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($pedidos)) {
        echo "   No hay pedidos registrados\n";
    } else {
        foreach ($pedidos as $pedido) {
            $mesero = $pedido['IdMesero'] ? $pedido['NombreMesero'] : 'Sin mesero';
            echo "   - Pedido #{$pedido['IdPedido']}: IdMesero={$pedido['IdMesero']} ({$mesero})\n";
        }
    }
    
    // 4. Verificar últimas ventas con IdMesero
    echo "\n4. Últimas 5 ventas con IdMesero:\n";
    $stmt = $db->query("
        SELECT 
            v.CodVenta,
            v.IdMesero,
            u.NombreCompleto as NombreMesero,
            v.FechaVenta,
            v.Total
        FROM Ventas v
        LEFT JOIN Usuarios u ON v.IdMesero = u.IdUsuario
        ORDER BY v.CodVenta DESC
        LIMIT 5
    ");
    $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($ventas)) {
        echo "   No hay ventas registradas\n";
    } else {
        foreach ($ventas as $venta) {
            $mesero = $venta['IdMesero'] ? $venta['NombreMesero'] : 'Sin mesero';
            echo "   - Venta #{$venta['CodVenta']}: IdMesero={$venta['IdMesero']} ({$mesero}) - Total: S/ {$venta['Total']}\n";
        }
    }
    
    // 5. Contar pedidos por mesero
    echo "\n5. Pedidos por mesero:\n";
    $stmt = $db->query("
        SELECT 
            u.NombreCompleto,
            COUNT(p.IdPedido) as TotalPedidos
        FROM Usuarios u
        INNER JOIN Perfiles pf ON u.IdPerfil = pf.IdPerfil
        LEFT JOIN Pedidos p ON u.IdUsuario = p.IdMesero
        WHERE pf.NombrePerfil = 'mesero'
        GROUP BY u.IdUsuario, u.NombreCompleto
        ORDER BY TotalPedidos DESC
    ");
    $estadisticas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($estadisticas)) {
        echo "   No hay meseros registrados\n";
    } else {
        foreach ($estadisticas as $stat) {
            echo "   - {$stat['NombreCompleto']}: {$stat['TotalPedidos']} pedidos\n";
        }
    }
    
    // 6. Contar ventas por mesero
    echo "\n6. Ventas por mesero:\n";
    $stmt = $db->query("
        SELECT 
            u.NombreCompleto,
            COUNT(v.CodVenta) as TotalVentas,
            COALESCE(SUM(v.Total), 0) as MontoTotal
        FROM Usuarios u
        INNER JOIN Perfiles pf ON u.IdPerfil = pf.IdPerfil
        LEFT JOIN Ventas v ON u.IdUsuario = v.IdMesero
        WHERE pf.NombrePerfil = 'mesero'
        GROUP BY u.IdUsuario, u.NombreCompleto
        ORDER BY TotalVentas DESC
    ");
    $estadisticas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($estadisticas)) {
        echo "   No hay meseros registrados\n";
    } else {
        foreach ($estadisticas as $stat) {
            echo "   - {$stat['NombreCompleto']}: {$stat['TotalVentas']} ventas - S/ {$stat['MontoTotal']}\n";
        }
    }
    
    echo "\n=== FIN DE PRUEBAS ===\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
