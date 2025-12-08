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
}
