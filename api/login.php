<?php
/**
 * ENDPOINT DE LOGIN - KING'S PIZZA
 * Verifica credenciales y retorna datos de usuario
 * 
 * Método: POST
 * Parámetros JSON: { "usuario": "...", "contrasena": "..." }
 * Retorna: { "exito": true/false, "usuario": {...}, "token": "..." }
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar solicitud OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Validar método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['exito' => false, 'mensaje' => 'Método no permitido']);
    exit();
}

// Obtener datos JSON
$input = json_decode(file_get_contents('php://input'), true);

// Validar que existan los parámetros
if (!isset($input['usuario']) || !isset($input['contrasena'])) {
    http_response_code(400);
    echo json_encode(['exito' => false, 'mensaje' => 'Parámetros requeridos: usuario, contrasena']);
    exit();
}

$usuario = trim($input['usuario'] ?? '');
$contrasena = trim($input['contrasena'] ?? '');

// Validar que no estén vacíos
if (empty($usuario) || empty($contrasena)) {
    http_response_code(400);
    echo json_encode(['exito' => false, 'mensaje' => 'Usuario y contraseña no pueden estar vacíos']);
    exit();
}

try {
    // Configuración de conexión
    $host = 'localhost';
    $db = 'kings_pizza_db';
    $dbuser = 'root';
    $dbpass = '71490956';
    
    // Crear conexión PDO
    $conexion = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8mb4",
        $dbuser,
        $dbpass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
    
    // Buscar usuario directamente
    $stmt = $conexion->prepare(
        "SELECT u.IdUsuario, u.Contrasena, u.NombreCompleto, u.IdPerfil, p.NombrePerfil, u.Estado 
         FROM Usuarios u 
         JOIN Perfiles p ON u.IdPerfil = p.IdPerfil 
         WHERE u.NombreUsuario = :usuario AND u.Estado = 'activo' 
         LIMIT 1"
    );
    
    $stmt->bindParam(':usuario', $usuario, PDO::PARAM_STR);
    $stmt->execute();
    
    $usuario_db = $stmt->fetch();
    
    // Verificar si el usuario existe
    if (!$usuario_db) {
        http_response_code(401);
        echo json_encode(['exito' => false, 'mensaje' => 'Usuario o contraseña incorrectos']);
        exit();
    }
    
    // Verificar contraseña
    if ($usuario_db['Contrasena'] !== $contrasena) {
        http_response_code(401);
        echo json_encode(['exito' => false, 'mensaje' => 'Usuario o contraseña incorrectos']);
        exit();
    }
    
    // Login exitoso - generar token JWT
    $token = generarTokenJWT($usuario_db['IdUsuario'], $usuario_db['NombrePerfil']);
    
    $respuesta = [
        'exito' => true,
        'mensaje' => 'Autenticación exitosa',
        'usuario' => [
            'id' => (int)$usuario_db['IdUsuario'],
            'nombre' => $usuario_db['NombreCompleto'],
            'perfil' => $usuario_db['NombrePerfil'],
            'idPerfil' => (int)$usuario_db['IdPerfil']
        ],
        'token' => $token
    ];
    
    http_response_code(200);
    echo json_encode($respuesta);
    
    $conexion = null;
    exit();
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error en la base de datos'
    ]);
    exit();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error interno del servidor'
    ]);
    exit();
}

/**
 * Generar token JWT
 */
function generarTokenJWT($idUsuario, $perfil) {
    $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64_encode(json_encode([
        'id' => $idUsuario,
        'perfil' => $perfil,
        'iat' => time(),
        'exp' => time() + (24 * 3600)
    ]));
    
    $signature = base64_encode(hash_hmac('sha256', "$header.$payload", 'secret_key_king_pizza', true));
    
    return "$header.$payload.$signature";
}
?>
