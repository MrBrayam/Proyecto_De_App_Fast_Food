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
    
    // Buscar usuario con todos los permisos del perfil
    $stmt = $conexion->prepare(
        "SELECT u.IdUsuario, u.Contrasena, u.NombreCompleto, u.IdPerfil, 
                p.NombrePerfil, u.Estado,
                p.PermisoVentasRegistrar, p.PermisoVentasVisualizar,
                p.PermisoPromocionesRegistrar, p.PermisoPromocionesVisualizar,
                p.PermisoMesasRegistrar, p.PermisoMesasVisualizar,
                p.PermisoPedidosRegistrar, p.PermisoPedidosVisualizar,
                p.PermisoCajaApertura, p.PermisoCajaVisualizar, p.PermisoCajaCerrar,
                p.PermisoComprasRegistrar, p.PermisoComprasVisualizar,
                p.PermisoInventarioVisualizar,
                p.PermisoProveedoresRegistrar, p.PermisoProveedoresVisualizar,
                p.PermisoProductoRegistrar, p.PermisoProductoVisualizar,
                p.PermisoUsuariosRegistrar, p.PermisoUsuariosVisualizar,
                p.PermisoClientesRegistrar, p.PermisoClientesVisualizar,
                p.PermisoReportes,
                p.PermisoSeguridadUsuariosRegistrar, p.PermisoSeguridadUsuariosVisualizar,
                p.PermisoPerfilesRegistrar, p.PermisoPerfilesVisualizar
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
    
    // Construir objeto de permisos
    $permisos = [
        'registrarVenta' => (bool)$usuario_db['PermisoVentasRegistrar'],
        'visualizarVenta' => (bool)$usuario_db['PermisoVentasVisualizar'],
        'registrarPromociones' => (bool)$usuario_db['PermisoPromocionesRegistrar'],
        'visualizarPromociones' => (bool)$usuario_db['PermisoPromocionesVisualizar'],
        'registrarMesas' => (bool)$usuario_db['PermisoMesasRegistrar'],
        'visualizarMesas' => (bool)$usuario_db['PermisoMesasVisualizar'],
        'registrarPedidos' => (bool)$usuario_db['PermisoPedidosRegistrar'],
        'visualizarPedidos' => (bool)$usuario_db['PermisoPedidosVisualizar'],
        'aperturaCaja' => (bool)$usuario_db['PermisoCajaApertura'],
        'visualizarCaja' => (bool)$usuario_db['PermisoCajaVisualizar'],
        'cerrarCaja' => (bool)$usuario_db['PermisoCajaCerrar'],
        'registrarCompras' => (bool)$usuario_db['PermisoComprasRegistrar'],
        'visualizarCompras' => (bool)$usuario_db['PermisoComprasVisualizar'],
        'visualizarInventario' => (bool)$usuario_db['PermisoInventarioVisualizar'],
        'registrarProveedores' => (bool)$usuario_db['PermisoProveedoresRegistrar'],
        'visualizarProveedores' => (bool)$usuario_db['PermisoProveedoresVisualizar'],
        'registrarProducto' => (bool)$usuario_db['PermisoProductoRegistrar'],
        'visualizarProducto' => (bool)$usuario_db['PermisoProductoVisualizar'],
        'registrarUsuarios' => (bool)$usuario_db['PermisoUsuariosRegistrar'],
        'visualizarUsuarios' => (bool)$usuario_db['PermisoUsuariosVisualizar'],
        'registrarClientes' => (bool)$usuario_db['PermisoClientesRegistrar'],
        'visualizarClientes' => (bool)$usuario_db['PermisoClientesVisualizar'],
        'generarReportes' => (bool)$usuario_db['PermisoReportes'],
        'seguridadRegistrarUsuarios' => (bool)$usuario_db['PermisoSeguridadUsuariosRegistrar'],
        'seguridadVisualizarUsuarios' => (bool)$usuario_db['PermisoSeguridadUsuariosVisualizar'],
        'seguridadRegistrarPerfiles' => (bool)$usuario_db['PermisoPerfilesRegistrar'],
        'seguridadVisualizarPerfiles' => (bool)$usuario_db['PermisoPerfilesVisualizar']
    ];
    
    $respuesta = [
        'exito' => true,
        'mensaje' => 'Autenticación exitosa',
        'usuario' => [
            'id' => (int)$usuario_db['IdUsuario'],
            'nombre' => $usuario_db['NombreCompleto'],
            'perfil' => $usuario_db['NombrePerfil'],
            'idPerfil' => (int)$usuario_db['IdPerfil'],
            'permisos' => $permisos
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
