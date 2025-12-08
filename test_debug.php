<?php
$data = json_decode(file_get_contents('php://input'), true);
echo "Datos recibidos: " . json_encode($data, JSON_PRETTY_PRINT) . "\n";
echo "tipoSuministro: " . ($data['tipoSuministro'] ?? 'NO EXISTE') . "\n";
echo "nombreSuministro: " . ($data['nombreSuministro'] ?? 'NO EXISTE') . "\n";
echo "Empty check tipoSuministro: " . (empty($data['tipoSuministro']) ? 'VACÍO' : 'OK') . "\n";
