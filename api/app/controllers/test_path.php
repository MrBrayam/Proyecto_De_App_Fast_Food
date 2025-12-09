<?php
$dir = __DIR__;
echo "DIR actual: " . $dir . "\n";
echo "Computada: " . __DIR__ . '/../../img/platos/' . "\n";
echo "Normalizada: " . realpath(__DIR__ . '/../../img/platos/') . "\n";

// Intentar crear un archivo de test
$testFile = __DIR__ . '/../../img/platos/' . 'test_from_controller_' . time() . '.txt';
echo "\nIntentando crear: " . $testFile . "\n";
$result = file_put_contents($testFile, 'Test from controller');

if ($result !== false) {
    echo "✓ Archivo creado exitosamente\n";
} else {
    echo "✗ Error al crear archivo\n";
}

// Listar archivos en el directorio
$dir = __DIR__ . '/../../img/platos/';
$files = @scandir($dir);
echo "\nArchivos en directorio:\n";
if ($files) {
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..') {
            echo "  - " . $file . "\n";
        }
    }
} else {
    echo "  (no se puede leer)\n";
}
?>
