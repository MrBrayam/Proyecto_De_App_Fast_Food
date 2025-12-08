<?php
/**
 * CONFIGURACIÓN DE LA API - ARCHIVO DE EJEMPLO
 * 
 * INSTRUCCIONES:
 * 1. Copiar este archivo como 'config.php' en el mismo directorio
 * 2. Reemplazar los valores de ejemplo con tus credenciales reales
 * 3. NO subir el archivo 'config.php' a GitHub (está en .gitignore)
 */

// Configuración de Conexión a Base de Datos
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'kings_pizza_db');
define('DB_USER', 'root');
define('DB_PASSWORD', '');  // ⚠️ COLOCAR TU CONTRASEÑA AQUÍ
define('DB_CHARSET', 'utf8mb4');

// Configuración de API
define('API_VERSION', '1.0.0');
define('API_BASE_URL', 'http://localhost/Proyecto_De_App_Fast_Food/api');
define('JWT_SECRET', 'CAMBIAR_POR_TU_CLAVE_SECRETA');  // ⚠️ Cambiar por una clave segura
define('JWT_EXPIRATION', 24 * 3600); // 24 horas

// Configuración de CORS
define('ALLOWED_ORIGINS', ['http://localhost', 'http://localhost/Proyecto_De_App_Fast_Food']);
define('ALLOWED_METHODS', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
define('ALLOWED_HEADERS', ['Content-Type', 'Authorization']);

// Configuración de Seguridad
define('ENABLE_HTTPS', false); // Cambiar a true en producción
define('SESSION_TIMEOUT', 3600); // 1 hora
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOGIN_ATTEMPT_TIMEOUT', 900); // 15 minutos

// Configuración de Logs
define('ENABLE_LOGS', true);
define('LOG_LEVEL', 'error'); // debug, info, warning, error
define('LOG_PATH', __DIR__ . '/logs/');

// Configuración de Upload
define('UPLOAD_MAX_SIZE', 5242880); // 5MB
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif', 'pdf']);
define('UPLOAD_PATH', __DIR__ . '/uploads/');

// Zona Horaria
date_default_timezone_set('America/Lima');

// Manejo de Errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuración de Sesión
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', ENABLE_HTTPS ? 1 : 0);

/**
 * Función auxiliar para obtener la configuración de la base de datos
 */
function getDatabaseConfig() {
    return [
        'host' => DB_HOST,
        'port' => DB_PORT,
        'name' => DB_NAME,
        'user' => DB_USER,
        'pass' => DB_PASSWORD,
        'charset' => DB_CHARSET
    ];
}

/**
 * Función auxiliar para obtener la configuración de JWT
 */
function getJWTConfig() {
    return [
        'secret' => JWT_SECRET,
        'expiration' => JWT_EXPIRATION
    ];
}

/**
 * Función auxiliar para configurar CORS
 */
function configureCORS() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, ALLOWED_ORIGINS)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header('Access-Control-Allow-Methods: ' . implode(', ', ALLOWED_METHODS));
    header('Access-Control-Allow-Headers: ' . implode(', ', ALLOWED_HEADERS));
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

/**
 * Función para validar la configuración
 */
function validateConfig() {
    $required = [
        'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD',
        'JWT_SECRET', 'API_BASE_URL'
    ];
    
    foreach ($required as $constant) {
        if (!defined($constant) || empty(constant($constant))) {
            die("Error: Configuración incompleta. Falta definir: $constant");
        }
    }
    
    if (DB_PASSWORD === '') {
        die("Error: La contraseña de la base de datos no puede estar vacía.");
    }
    
    if (JWT_SECRET === 'CAMBIAR_POR_TU_CLAVE_SECRETA') {
        die("Error: Debes cambiar JWT_SECRET por una clave segura.");
    }
}

// Ejecutar validación en desarrollo
if (defined('VALIDATE_CONFIG') && VALIDATE_CONFIG) {
    validateConfig();
}
