<?php
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../models/Usuario.php';

class UsuarioController extends Controller
{
    /**
     * Registra un nuevo usuario del sistema
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
        $dni = trim($input['dni'] ?? '');
        $nombreCompleto = trim($input['nombreCompleto'] ?? '');
        $telefono = trim($input['telefono'] ?? '');
        $email = isset($input['email']) && $input['email'] !== '' ? trim($input['email']) : null;
        $nombreUsuario = trim($input['nombreUsuario'] ?? '');
        $contrasena = trim($input['contrasena'] ?? '');
        $idPerfil = isset($input['idPerfil']) ? (int)$input['idPerfil'] : null;
        $estado = trim($input['estado'] ?? 'activo');

        // Validar campos requeridos
        if ($dni === '') {
            $this->json(['exito' => false, 'mensaje' => 'El DNI es obligatorio'], 400);
            return;
        }

        if ($nombreCompleto === '') {
            $this->json(['exito' => false, 'mensaje' => 'El nombre completo es obligatorio'], 400);
            return;
        }

        if ($telefono === '') {
            $this->json(['exito' => false, 'mensaje' => 'El teléfono es obligatorio'], 400);
            return;
        }

        if ($nombreUsuario === '') {
            $this->json(['exito' => false, 'mensaje' => 'El nombre de usuario es obligatorio'], 400);
            return;
        }

        if ($contrasena === '') {
            $this->json(['exito' => false, 'mensaje' => 'La contraseña es obligatoria'], 400);
            return;
        }

        if ($idPerfil === null || $idPerfil <= 0) {
            $this->json(['exito' => false, 'mensaje' => 'El perfil es obligatorio'], 400);
            return;
        }

        // Validar DNI (8 dígitos en Perú)
        if (!preg_match('/^\d{8}$/', $dni)) {
            $this->json(['exito' => false, 'mensaje' => 'El DNI debe tener 8 dígitos'], 400);
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

        // Validar estado
        if (!in_array($estado, ['activo', 'inactivo', 'suspendido'])) {
            $this->json(['exito' => false, 'mensaje' => 'Estado inválido'], 400);
            return;
        }

        // Validar contraseña (mínimo 6 caracteres)
        if (strlen($contrasena) < 6) {
            $this->json(['exito' => false, 'mensaje' => 'La contraseña debe tener al menos 6 caracteres'], 400);
            return;
        }

        $model = new Usuario();
        try {
            $result = $model->registrar([
                'dni' => $dni,
                'nombreCompleto' => $nombreCompleto,
                'telefono' => $telefono,
                'email' => $email,
                'nombreUsuario' => $nombreUsuario,
                'contrasena' => $contrasena,
                'idPerfil' => $idPerfil,
                'estado' => $estado,
            ]);

            $idUsuario = isset($result['IdUsuario']) ? (int)$result['IdUsuario'] : null;
            
            $this->json([
                'exito' => true,
                'mensaje' => 'Usuario registrado exitosamente',
                'idUsuario' => $idUsuario,
                'nombreUsuario' => $result['NombreUsuario'] ?? $nombreUsuario,
            ], 201);
        } catch (Throwable $e) {
            $mensaje = $e->getMessage();
            
            // Manejar errores de duplicados
            if (strpos($mensaje, 'Duplicate entry') !== false) {
                if (strpos($mensaje, 'Dni') !== false) {
                    $mensaje = 'El DNI ya está registrado';
                } elseif (strpos($mensaje, 'NombreUsuario') !== false) {
                    $mensaje = 'El nombre de usuario ya está en uso';
                } elseif (strpos($mensaje, 'Email') !== false) {
                    $mensaje = 'El email ya está registrado';
                } else {
                    $mensaje = 'Ya existe un usuario con esos datos';
                }
            }
            
            $this->json(['exito' => false, 'mensaje' => $mensaje], 400);
        }
    }

    /**
     * Lista todos los usuarios del sistema
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

        $model = new Usuario();
        try {
            $usuarios = $model->listar();
            
            $usuariosFormateados = array_map(function($usuario) {
                return [
                    'idUsuario' => (int)$usuario['IdUsuario'],
                    'dni' => $usuario['Dni'],
                    'nombreCompleto' => $usuario['NombreCompleto'],
                    'telefono' => $usuario['Telefono'],
                    'email' => $usuario['Email'],
                    'nombreUsuario' => $usuario['NombreUsuario'],
                    'idPerfil' => (int)$usuario['IdPerfil'],
                    'nombrePerfil' => $usuario['NombrePerfil'],
                    'nivelAcceso' => $usuario['NivelAcceso'],
                    'estado' => $usuario['Estado'],
                    'fechaCreacion' => $usuario['FechaCreacion'],
                    'fechaActualizacion' => $usuario['FechaActualizacion'],
                ];
            }, $usuarios);

            $this->json([
                'exito' => true,
                'usuarios' => $usuariosFormateados,
                'total' => count($usuariosFormateados),
            ]);
        } catch (Throwable $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error al obtener usuarios'], 500);
        }
    }

    /**
     * Busca un usuario por ID
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

        $id = $_GET['id'] ?? null;

        if (!$id) {
            $this->json(['exito' => false, 'mensaje' => 'ID no proporcionado'], 400);
            return;
        }

        $model = new Usuario();
        try {
            $usuario = $model->buscar((int)$id);
            
            if (!$usuario) {
                $this->json(['exito' => false, 'mensaje' => 'Usuario no encontrado'], 404);
                return;
            }

            $usuarioFormateado = [
                'idUsuario' => (int)$usuario['IdUsuario'],
                'dni' => $usuario['Dni'],
                'nombreCompleto' => $usuario['NombreCompleto'],
                'telefono' => $usuario['Telefono'],
                'email' => $usuario['Email'],
                'nombreUsuario' => $usuario['NombreUsuario'],
                'idPerfil' => (int)$usuario['IdPerfil'],
                'nombrePerfil' => $usuario['NombrePerfil'],
                'nivelAcceso' => $usuario['NivelAcceso'],
                'estado' => $usuario['Estado'],
                'fechaCreacion' => $usuario['FechaCreacion'],
                'fechaActualizacion' => $usuario['FechaActualizacion'],
            ];

            $this->json(['exito' => true, 'usuario' => $usuarioFormateado]);
        } catch (Throwable $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error en la base de datos: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Actualiza un usuario existente
     */
    public function actualizar(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: PUT, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = $input['idUsuario'] ?? null;

        if (!$id) {
            $this->json(['exito' => false, 'mensaje' => 'ID del usuario no proporcionado'], 400);
            return;
        }

        $model = new Usuario();
        try {
            $result = $model->actualizar((int)$id, [
                'dni' => trim($input['dni'] ?? ''),
                'nombreCompleto' => trim($input['nombreCompleto'] ?? ''),
                'telefono' => trim($input['telefono'] ?? ''),
                'email' => isset($input['email']) && $input['email'] !== '' ? trim($input['email']) : null,
                'nombreUsuario' => trim($input['nombreUsuario'] ?? ''),
                'idPerfil' => (int)($input['idPerfil'] ?? 0),
                'estado' => trim($input['estado'] ?? 'activo'),
            ]);

            $this->json(['exito' => true, 'mensaje' => 'Usuario actualizado exitosamente']);
        } catch (Throwable $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error en la base de datos: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Cambia el estado de un usuario
     */
    public function cambiarEstado(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: PUT, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = $input['idUsuario'] ?? null;
        $estado = $input['estado'] ?? null;

        if (!$id) {
            $this->json(['exito' => false, 'mensaje' => 'ID del usuario no proporcionado'], 400);
            return;
        }

        if (!$estado || !in_array($estado, ['activo', 'inactivo', 'suspendido'])) {
            $this->json(['exito' => false, 'mensaje' => 'Estado inválido'], 400);
            return;
        }

        $model = new Usuario();
        try {
            $result = $model->cambiarEstado((int)$id, $estado);
            
            if ($result) {
                $this->json(['exito' => true, 'mensaje' => 'Estado actualizado exitosamente']);
            } else {
                $this->json(['exito' => false, 'mensaje' => 'No se pudo actualizar el estado'], 400);
            }
        } catch (Throwable $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error en la base de datos: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Elimina un usuario
     */
    public function eliminar(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $id = $_GET['id'] ?? null;

        if (!$id) {
            $this->json(['exito' => false, 'mensaje' => 'ID no proporcionado'], 400);
            return;
        }

        $model = new Usuario();
        try {
            $result = $model->eliminar((int)$id);
            
            if ($result) {
                $this->json(['exito' => true, 'mensaje' => 'Usuario eliminado exitosamente']);
            } else {
                $this->json(['exito' => false, 'mensaje' => 'No se pudo eliminar el usuario'], 400);
            }
        } catch (Throwable $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error en la base de datos: ' . $e->getMessage()], 500);
        }
    }
}

