<?php
// Script de prueba para verificar el endpoint de mesas
require_once __DIR__ . '/app/models/Mesa.php';

$mesa = new Mesa();
$mesas = $mesa->obtenerTodas();

echo json_encode([
    'exito' => true,
    'items' => $mesas,
    'cantidad' => count($mesas),
    'mensaje' => 'Prueba exitosa'
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
