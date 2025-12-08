<?php
require_once __DIR__ . '/app/controllers/SuministroController.php';

// Simular POST
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['CONTENT_TYPE'] = 'application/json';

// Simular datos
$_POST = [];
$input = json_encode([
    'tipoSuministro' => 'limpieza',
    'nombreSuministro' => 'Detergente Industrial',
    'proveedor' => 'Química Industrial SA',
    'cantidad' => 50,
    'unidadMedida' => 'lt',
    'precioUnitario' => 25.50,
    'fechaCompra' => '2025-12-08',
    'numeroFactura' => 'FAC-2025-001',
    'estado' => 'disponible',
    'ubicacion' => 'Almacén A',
    'observaciones' => 'Test'
]);

// Sobrescribir php://input
stream_wrapper_unregister("php");
stream_wrapper_register("php", "MockPhpStream");

class MockPhpStream {
    public $position = 0;
    public $data;

    public function stream_open($path, $mode, $options, &$opened_path) {
        global $input;
        $this->data = $input;
        return true;
    }

    public function stream_read($count) {
        $ret = substr($this->data, $this->position, $count);
        $this->position += strlen($ret);
        return $ret;
    }

    public function stream_eof() {
        return $this->position >= strlen($this->data);
    }
}

// Mejor: usar tmp
$tmp = tempnam(sys_get_temp_dir(), 'test');
file_put_contents($tmp, $input);

// Simular stdin
$STDIN = fopen($tmp, 'r');
stream_wrapper_unregister("php");
stream_wrapper_register("php", "TestPhpStream", STREAM_IS_URL);

class TestPhpStream {
    private static $data;
    
    public function stream_open($path, $mode, $options, &$opened_path) {
        global $input;
        self::$data = $input;
        return true;
    }

    public function stream_read($count) {
        return '';
    }

    public function stream_eof() {
        return true;
    }
}

// Mejor aún: usar exec
$json = json_encode([
    'tipoSuministro' => 'limpieza',
    'nombreSuministro' => 'Detergente Industrial',
    'proveedor' => 'Química Industrial SA',
    'cantidad' => 50,
    'unidadMedida' => 'lt',
    'precioUnitario' => 25.50,
    'fechaCompra' => '2025-12-08',
    'numeroFactura' => 'FAC-2025-001',
    'estado' => 'disponible',
    'ubicacion' => 'Almacén A',
    'observaciones' => 'Test'
]);

echo "Test de registro de suministro:\n";
echo "JSON: $json\n";

// Decode y validate
$data = json_decode($json, true);
echo "tipoSuministro: " . ($data['tipoSuministro'] ?? 'NO') . "\n";
echo "nombreSuministro: " . ($data['nombreSuministro'] ?? 'NO') . "\n";
echo "Empty tipoSuministro: " . (empty($data['tipoSuministro']) ? 'YES' : 'NO') . "\n";
