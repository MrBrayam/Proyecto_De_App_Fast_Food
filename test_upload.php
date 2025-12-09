<?php
$dir = __DIR__ . '/img/platos/';
echo "Directorio: " . $dir . "\n";
echo "Existe: " . (is_dir($dir) ? 'SÍ' : 'NO') . "\n";
echo "Escribible: " . (is_writable($dir) ? 'SÍ' : 'NO') . "\n";

// Intentar crear un archivo de prueba
$testFile = $dir . 'test_' . time() . '.txt';
$result = file_put_contents($testFile, 'Test write');

if ($result !== false) {
    echo "Archivo creado exitosamente: " . $testFile . "\n";
    unlink($testFile);
} else {
    echo "Error al crear archivo\n";
}

// Mostrar contenido del directorio
echo "\nArchivos en el directorio:\n";
$files = scandir($dir);
foreach ($files as $file) {
    if ($file !== '.' && $file !== '..') {
        echo "  - " . $file . "\n";
    }
}

if (count($files) <= 2) {
    echo "  (vacío)\n";
}
?>
