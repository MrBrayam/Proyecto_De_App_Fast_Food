<?php
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../models/Cliente.php';

class ClienteController extends Controller
{
    /**
     * Registra un nuevo cliente
     */
    public function registrar(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        // Validaciones
        $tipoDocumento = trim($input['tipoDocumento'] ?? 'DNI');
        $numDocumento = trim($input['numDocumento'] ?? '');
        $nombres = trim($input['nombres'] ?? '');
        $apellidos = trim($input['apellidos'] ?? '');
        $telefono = trim($input['telefono'] ?? '');
        $email = isset($input['email']) && $input['email'] !== '' ? trim($input['email']) : null;
        $direccion = trim($input['direccion'] ?? '');

        // Validar campos requeridos
        if ($numDocumento === '') {
            $this->json(['exito' => false, 'mensaje' => 'El número de documento es obligatorio'], 400);
            return;
        }

        if ($nombres === '') {
            $this->json(['exito' => false, 'mensaje' => 'Los nombres son obligatorios'], 400);
            return;
        }

        if ($apellidos === '') {
            $this->json(['exito' => false, 'mensaje' => 'Los apellidos son obligatorios'], 400);
            return;
        }

        if ($telefono === '') {
            $this->json(['exito' => false, 'mensaje' => 'El teléfono es obligatorio'], 400);
            return;
        }

        if ($direccion === '') {
            $this->json(['exito' => false, 'mensaje' => 'La dirección es obligatoria'], 400);
            return;
        }

        // Validar tipo de documento
        if (!in_array($tipoDocumento, ['DNI', 'CE', 'RUC', 'PASAPORTE'])) {
            $this->json(['exito' => false, 'mensaje' => 'Tipo de documento inválido'], 400);
            return;
        }

        // Validar longitud según tipo de documento
        if ($tipoDocumento === 'DNI' && !preg_match('/^\d{8}$/', $numDocumento)) {
            $this->json(['exito' => false, 'mensaje' => 'El DNI debe tener 8 dígitos'], 400);
            return;
        }

        if ($tipoDocumento === 'RUC' && !preg_match('/^\d{11}$/', $numDocumento)) {
            $this->json(['exito' => false, 'mensaje' => 'El RUC debe tener 11 dígitos'], 400);
            return;
        }

        // Validar teléfono (9 dígitos en Perú)
        if (!preg_match('/^\d{9}$/', $telefono)) {
            $this->json(['exito' => false, 'mensaje' => 'El teléfono debe tener 9 dígitos'], 400);
            return;
        }

        // Validar email si se proporciona
        if ($email !== null && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->json(['exito' => false, 'mensaje' => 'El email no es válido'], 400);
            return;
        }

        $model = new Cliente();
        try {
            $result = $model->registrar([
                'tipoDocumento' => $tipoDocumento,
                'numDocumento' => $numDocumento,
                'nombres' => $nombres,
                'apellidos' => $apellidos,
                'telefono' => $telefono,
                'email' => $email,
                'direccion' => $direccion,
            ]);

            $idCliente = isset($result['IdCliente']) ? (int)$result['IdCliente'] : null;
            
            $this->json([
                'exito' => true,
                'mensaje' => 'Cliente registrado exitosamente',
                'idCliente' => $idCliente,
                'nombreCompleto' => $result['NombreCompleto'] ?? "$nombres $apellidos",
            ], 201);
        } catch (Throwable $e) {
            $mensaje = $e->getMessage();
            
            // Manejar errores de duplicados
            if (strpos($mensaje, 'Duplicate entry') !== false || strpos($mensaje, 'ya está registrado') !== false) {
                $mensaje = 'El número de documento ya está registrado';
            }
            
            $this->json(['exito' => false, 'mensaje' => $mensaje], 400);
        }
    }

    /**
     * Lista todos los clientes del sistema
     */
    public function listar(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $model = new Cliente();
        try {
            $clientes = $model->listar();
            
            $clientesFormateados = array_map(function($cliente) {
                return [
                    'idCliente' => (int)$cliente['IdCliente'],
                    'tipoDocumento' => $cliente['TipoDocumento'],
                    'numDocumento' => $cliente['NumDocumento'],
                    'nombres' => $cliente['Nombres'],
                    'apellidos' => $cliente['Apellidos'],
                    'nombreCompleto' => $cliente['NombreCompleto'],
                    'telefono' => $cliente['Telefono'],
                    'email' => $cliente['Email'],
                    'direccion' => $cliente['Direccion'],
                    'montoGastado' => (float)$cliente['MontoGastado'],
                    'estado' => $cliente['Estado'],
                    'fechaRegistro' => $cliente['FechaRegistro'],
                    'fechaActualizacion' => $cliente['FechaActualizacion'],
                ];
            }, $clientes);

            $this->json([
                'exito' => true,
                'clientes' => $clientesFormateados,
                'total' => count($clientesFormateados),
            ]);
        } catch (Throwable $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error al obtener clientes: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Busca un cliente por ID
     */
    public function buscar(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $idCliente = isset($_GET['id']) ? (int)$_GET['id'] : null;

        if (!$idCliente) {
            $this->json(['exito' => false, 'mensaje' => 'ID de cliente requerido'], 400);
            return;
        }

        $model = new Cliente();
        try {
            $cliente = $model->buscarPorId($idCliente);
            
            if (!$cliente) {
                $this->json(['exito' => false, 'mensaje' => 'Cliente no encontrado'], 404);
                return;
            }

            $clienteFormateado = [
                'idCliente' => (int)$cliente['IdCliente'],
                'tipoDocumento' => $cliente['TipoDocumento'],
                'numDocumento' => $cliente['NumDocumento'],
                'nombres' => $cliente['Nombres'],
                'apellidos' => $cliente['Apellidos'],
                'nombreCompleto' => $cliente['NombreCompleto'],
                'telefono' => $cliente['Telefono'],
                'email' => $cliente['Email'],
                'direccion' => $cliente['Direccion'],
                'montoGastado' => (float)$cliente['MontoGastado'],
                'estado' => $cliente['Estado'],
                'fechaRegistro' => $cliente['FechaRegistro'],
                'fechaActualizacion' => $cliente['FechaActualizacion'],
            ];

            $this->json([
                'exito' => true,
                'cliente' => $clienteFormateado,
            ]);
        } catch (Throwable $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error al buscar cliente'], 500);
        }
    }

    /**
     * Busca un cliente por número de documento (DNI)
     */
    public function buscarPorDni(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $dni = isset($_GET['dni']) ? trim($_GET['dni']) : null;

        if (!$dni) {
            $this->json(['exito' => false, 'mensaje' => 'DNI requerido'], 400);
            return;
        }

        $model = new Cliente();
        try {
            $cliente = $model->buscarPorDocumento($dni);
            
            if (!$cliente) {
                $this->json(['exito' => false, 'mensaje' => 'Cliente no encontrado'], 404);
                return;
            }

            $clienteFormateado = [
                'idCliente' => (int)$cliente['IdCliente'],
                'tipoDocumento' => $cliente['TipoDocumento'],
                'numDocumento' => $cliente['NumDocumento'],
                'nombres' => $cliente['Nombres'],
                'apellidos' => $cliente['Apellidos'],
                'nombreCompleto' => $cliente['NombreCompleto'],
                'telefono' => $cliente['Telefono'],
                'email' => $cliente['Email'],
                'direccion' => $cliente['Direccion'],
                'montoGastado' => (float)$cliente['MontoGastado'],
                'estado' => $cliente['Estado'],
                'fechaRegistro' => $cliente['FechaRegistro'],
                'fechaActualizacion' => $cliente['FechaActualizacion'],
            ];

            $this->json([
                'exito' => true,
                'cliente' => $clienteFormateado,
            ]);
        } catch (Throwable $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error al buscar cliente'], 500);
        }
    }

    /**
     * Login de cliente (Nombre como Usuario + DNI como Contraseña)
     */
    public function login(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['exito' => false, 'error' => 'Método no permitido'], 405);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $usuario = isset($input['usuario']) ? trim($input['usuario']) : '';
        $contrasena = isset($input['contrasena']) ? trim($input['contrasena']) : '';

        if (!$usuario || !$contrasena) {
            $this->json(['exito' => false, 'error' => 'Usuario y contraseña requeridos'], 400);
            return;
        }

        try {
            $conn = Database::connection();
            
            // Llamar al PA para verificar login
            $stmt = $conn->prepare("CALL pa_login_cliente(?, ?)");
            $stmt->execute([$usuario, $contrasena]);
            
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();

            if (!$result) {
                $this->json(['exito' => false, 'error' => 'Credenciales incorrectas'], 401);
                return;
            }

            // Preparar respuesta
            $clienteFormateado = [
                'idCliente' => (int)$result['IdCliente'],
                'tipoDocumento' => $result['TipoDocumento'],
                'numDocumento' => $result['NumDocumento'],
                'nombres' => $result['Nombres'],
                'apellidos' => $result['Apellidos'],
                'nombreCompleto' => $result['NombreCompleto'],
                'telefono' => $result['Telefono'],
                'email' => $result['Email'],
                'direccion' => $result['Direccion'],
                'montoGastado' => (float)$result['MontoGastado'],
                'estado' => $result['Estado'],
                'fechaRegistro' => $result['FechaRegistro'],
                'fechaActualizacion' => $result['FechaActualizacion'],
            ];

            $this->json([
                'exito' => true,
                'mensaje' => 'Login exitoso',
                'cliente' => $clienteFormateado
            ]);

        } catch (Throwable $e) {
            $this->json(['exito' => false, 'error' => 'Error en el servidor: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Registro simplificado de cliente (solo campos básicos)
     */
    public function registro(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['exito' => false, 'error' => 'Método no permitido'], 405);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        
        $nombres = isset($input['nombres']) ? trim($input['nombres']) : '';
        $apellidos = isset($input['apellidos']) ? trim($input['apellidos']) : '';
        $numDocumento = isset($input['numDocumento']) ? trim($input['numDocumento']) : '';
        $email = isset($input['email']) ? trim($input['email']) : '';
        $telefono = isset($input['telefono']) ? trim($input['telefono']) : '';
        $direccion = isset($input['direccion']) ? trim($input['direccion']) : '';

        // Validar campos requeridos
        if (!$nombres || !$apellidos || !$numDocumento || !$email || !$telefono || !$direccion) {
            $this->json(['exito' => false, 'error' => 'Todos los campos son requeridos'], 400);
            return;
        }

        // Validaciones
        if (!preg_match('/^\d{8}$/', $numDocumento)) {
            $this->json(['exito' => false, 'error' => 'El DNI debe tener 8 dígitos'], 400);
            return;
        }

        if (!preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $email)) {
            $this->json(['exito' => false, 'error' => 'Email inválido'], 400);
            return;
        }

        try {
            $conn = Database::connection();
            
            // Verificar si el DNI ya existe
            $stmt = $conn->prepare("SELECT IdCliente FROM Clientes WHERE NumDocumento = ? LIMIT 1");
            $stmt->execute([$numDocumento]);
            if ($stmt->fetch()) {
                $this->json(['exito' => false, 'error' => 'El DNI ya está registrado'], 409);
                return;
            }
            $stmt = null;

            // Verificar si el nombre ya existe
            $stmt = $conn->prepare("SELECT IdCliente FROM Clientes WHERE Nombres = ? LIMIT 1");
            $stmt->execute([$nombres]);
            if ($stmt->fetch()) {
                $this->json(['exito' => false, 'error' => 'El nombre ya está en uso, intenta con otro'], 409);
                return;
            }
            $stmt = null;

            // Llamar al PA para registrar cliente
            $stmt = $conn->prepare("CALL pa_registrar_cliente(?, ?, ?, ?, ?, ?, ?)");
            
            $tipoDocumento = 'DNI';
            $stmt->execute([
                $tipoDocumento,
                $numDocumento,
                $nombres,
                $apellidos,
                $telefono,
                $email,
                $direccion
            ]);

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt->closeCursor();

            if (!$result) {
                throw new Exception('Error al registrar el cliente');
            }

            $decoded = json_decode($result['resultado'], true);

            if (isset($decoded['error'])) {
                throw new Exception($decoded['error']);
            }

            if (!isset($decoded['IdCliente'])) {
                throw new Exception('Cliente registrado pero no se obtuvo el ID');
            }

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

            $stmt->execute([$decoded['IdCliente']]);
            $cliente = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt = null;

            $this->json([
                'exito' => true,
                'mensaje' => 'Registro exitoso',
                'cliente' => $cliente
            ]);

        } catch (Throwable $e) {
            $this->json(['exito' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Verificar disponibilidad de nombre de usuario
     */
    public function verificarUsuario(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'error' => 'Método no permitido'], 405);
            return;
        }

        $usuario = isset($_GET['usuario']) ? trim($_GET['usuario']) : '';

        if (strlen($usuario) < 2) {
            $this->json(['disponible' => false, 'error' => 'El nombre debe tener al menos 2 caracteres'], 400);
            return;
        }

        try {
            $conn = Database::connection();
            
            $stmt = $conn->prepare("SELECT IdCliente FROM Clientes WHERE Nombres = ? LIMIT 1");
            $stmt->execute([$usuario]);
            $existe = $stmt->fetch();
            $stmt = null;

            $this->json([
                'disponible' => !$existe,
                'usuario' => $usuario
            ]);

        } catch (Throwable $e) {
            $this->json(['exito' => false, 'error' => 'Error en el servidor'], 500);
        }
    }

    /**
     * Logout
     */
    public function logout(): void
    {
        $this->json([
            'exito' => true,
            'mensaje' => 'Sesión cerrada'
        ]);
    }
}