<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once(__DIR__ . '/../app/config/Database.php');

$action = isset($_GET['action']) ? $_GET['action'] : '';

try {
    switch ($action) {
        case 'login':
            handleLogin();
            break;
        case 'registro':
            handleRegistro();
            break;
        case 'verificar-usuario':
            handleVerificarUsuario();
            break;
        case 'logout':
            handleLogout();
            break;
        default:
            echo json_encode(['exito' => false, 'error' => 'Acción no válida']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['exito' => false, 'error' => $e->getMessage()]);
}

/**
 * Login de cliente
 */
function handleLogin() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['exito' => false, 'error' => 'Método no permitido']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['usuario']) || !isset($data['contrasena'])) {
        http_response_code(400);
        echo json_encode(['exito' => false, 'error' => 'Usuario y contraseña requeridos']);
        return;
    }

    $usuario = trim($data['usuario']);
    $contrasena = trim($data['contrasena']);

    try {
        $db = new Database();
        $conn = $db->connect();
        
        // Buscar cliente por usuario
        $stmt = $conn->prepare("
            SELECT 
                IdCliente,
                TipoDocumento,
                NumDocumento,
                Nombres,
                Apellidos,
                NombreCompleto,
                Telefono,
                Email,
                Direccion,
                MontoGastado,
                Estado,
                Usuario,
                Contrasena,
                FechaRegistro,
                FechaActualizacion
            FROM Clientes
            WHERE Usuario = ? AND Estado = 'activo'
            LIMIT 1
        ");
        
        $stmt->execute([$usuario]);
        $cliente = $stmt->fetch(PDO::FETCH_ASSOC);
        $stmt = null;

        if (!$cliente) {
            http_response_code(401);
            echo json_encode(['exito' => false, 'error' => 'Usuario no encontrado']);
            return;
        }

        // Verificar contraseña
        if (!$cliente['Contrasena'] || !password_verify($contrasena, $cliente['Contrasena'])) {
            http_response_code(401);
            echo json_encode(['exito' => false, 'error' => 'Contraseña incorrecta']);
            return;
        }

        // Preparar respuesta sin mostrar contraseña
        unset($cliente['Contrasena']);
        
        echo json_encode([
            'exito' => true,
            'mensaje' => 'Login exitoso',
            'cliente' => $cliente
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['exito' => false, 'error' => 'Error en el servidor: ' . $e->getMessage()]);
    }
}

/**
 * Registro de nuevo cliente
 */
function handleRegistro() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['exito' => false, 'error' => 'Método no permitido']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validar campos requeridos
    $campos = ['nombres', 'apellidos', 'numDocumento', 'usuario', 'contrasena', 'email', 'telefono', 'direccion'];
    foreach ($campos as $campo) {
        if (!isset($data[$campo]) || trim($data[$campo]) === '') {
            http_response_code(400);
            echo json_encode(['exito' => false, 'error' => "El campo '$campo' es requerido"]);
            return;
        }
    }

    $nombres = trim($data['nombres']);
    $apellidos = trim($data['apellidos']);
    $numDocumento = trim($data['numDocumento']);
    $usuario = trim($data['usuario']);
    $contrasena = trim($data['contrasena']);
    $email = trim($data['email']);
    $telefono = trim($data['telefono']);
    $direccion = trim($data['direccion']);

    // Validaciones
    if (strlen($contrasena) < 6) {
        http_response_code(400);
        echo json_encode(['exito' => false, 'error' => 'La contraseña debe tener al menos 6 caracteres']);
        return;
    }

    if (strlen($numDocumento) !== 8 || !preg_match('/^\d{8}$/', $numDocumento)) {
        http_response_code(400);
        echo json_encode(['exito' => false, 'error' => 'El DNI debe tener 8 dígitos']);
        return;
    }

    if (!preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $email)) {
        http_response_code(400);
        echo json_encode(['exito' => false, 'error' => 'Email inválido']);
        return;
    }

    try {
        $db = new Database();
        $conn = $db->connect();
        
        // Verificar si el usuario ya existe
        $stmt = $conn->prepare("SELECT IdCliente FROM Clientes WHERE Usuario = ? LIMIT 1");
        $stmt->execute([$usuario]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['exito' => false, 'error' => 'El usuario ya está registrado']);
            return;
        }
        $stmt = null;

        // Verificar si el DNI ya existe
        $stmt = $conn->prepare("SELECT IdCliente FROM Clientes WHERE NumDocumento = ? LIMIT 1");
        $stmt->execute([$numDocumento]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['exito' => false, 'error' => 'El DNI ya está registrado']);
            return;
        }
        $stmt = null;

        // Encriptar contraseña
        $contrasenaHash = password_hash($contrasena, PASSWORD_DEFAULT);

        // Insertar nuevo cliente
        $nombreCompleto = "$nombres $apellidos";
        
        $stmt = $conn->prepare("
            INSERT INTO Clientes (
                TipoDocumento,
                NumDocumento,
                Nombres,
                Apellidos,
                NombreCompleto,
                Telefono,
                Email,
                Direccion,
                Usuario,
                Contrasena,
                Estado,
                FechaRegistro
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");

        $tipoDocumento = 'DNI';
        $estado = 'activo';
        $montoGastado = 0;

        $stmt->execute([
            $tipoDocumento,
            $numDocumento,
            $nombres,
            $apellidos,
            $nombreCompleto,
            $telefono,
            $email,
            $direccion,
            $usuario,
            $contrasenaHash,
            $estado
        ]);

        $idCliente = $conn->lastInsertId();
        $stmt = null;

        // Obtener cliente registrado
        $stmt = $conn->prepare("
            SELECT 
                IdCliente,
                TipoDocumento,
                NumDocumento,
                Nombres,
                Apellidos,
                NombreCompleto,
                Telefono,
                Email,
                Direccion,
                MontoGastado,
                Estado,
                FechaRegistro,
                FechaActualizacion
            FROM Clientes
            WHERE IdCliente = ?
            LIMIT 1
        ");

        $stmt->execute([$idCliente]);
        $clienteRegistrado = $stmt->fetch(PDO::FETCH_ASSOC);
        $stmt = null;

        echo json_encode([
            'exito' => true,
            'mensaje' => 'Registro exitoso',
            'cliente' => $clienteRegistrado
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['exito' => false, 'error' => 'Error en el servidor: ' . $e->getMessage()]);
    }
}

/**
 * Verificar disponibilidad de usuario
 */
function handleVerificarUsuario() {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode(['exito' => false, 'error' => 'Método no permitido']);
        return;
    }

    $usuario = isset($_GET['usuario']) ? trim($_GET['usuario']) : '';

    if (strlen($usuario) < 3) {
        http_response_code(400);
        echo json_encode(['disponible' => false, 'error' => 'Usuario debe tener al menos 3 caracteres']);
        return;
    }

    try {
        $db = new Database();
        $conn = $db->connect();
        
        $stmt = $conn->prepare("SELECT IdCliente FROM Clientes WHERE Usuario = ? LIMIT 1");
        $stmt->execute([$usuario]);
        $existe = $stmt->fetch();
        $stmt = null;

        echo json_encode([
            'disponible' => !$existe,
            'usuario' => $usuario
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['exito' => false, 'error' => 'Error en el servidor']);
    }
}

/**
 * Logout
 */
function handleLogout() {
    echo json_encode([
        'exito' => true,
        'mensaje' => 'Sesión cerrada'
    ]);
}
?>
