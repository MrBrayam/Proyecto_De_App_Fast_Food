<?php
// Front controller para API (MVC ligero)

// CORS genérico
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Cargar rutas
$routes = require __DIR__ . '/../app/routes.php';

// Resolver path limpio
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptDir = dirname($_SERVER['SCRIPT_NAME']); // e.g. /Proyecto.../api/public
$apiBase = preg_replace('#/public$#', '', $scriptDir); // e.g. /Proyecto.../api
$path = trim(preg_replace('#^' . preg_quote($apiBase, '#') . '#', '', $uri), '/');

// Debug temporal
error_log("URI: $uri");
error_log("Script Dir: $scriptDir");
error_log("API Base: $apiBase");
error_log("Path resolved: $path");

if ($path === '') {
    http_response_code(404);
    echo json_encode(['exito' => false, 'mensaje' => 'Ruta no encontrada']);
    exit;
}

if (!array_key_exists($path, $routes)) {
    http_response_code(404);
    error_log("Ruta no encontrada: $path");
    error_log("Rutas disponibles: " . implode(', ', array_keys($routes)));
    echo json_encode([
        'exito' => false, 
        'mensaje' => 'Ruta no encontrada',
        'path_solicitado' => $path,
        'debug' => 'Revisar logs del servidor'
    ]);
    exit;
}

[$class, $method] = $routes[$path];
$controller = new $class();

if (!method_exists($controller, $method)) {
    http_response_code(500);
    echo json_encode(['exito' => false, 'mensaje' => 'Controlador inválido']);
    exit;
}

$controller->$method();
