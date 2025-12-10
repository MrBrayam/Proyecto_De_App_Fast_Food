<?php
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../models/User.php';

class AuthController extends Controller
{
    public function login(): void
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
        $usuario = trim($input['usuario'] ?? '');
        $contrasena = trim($input['contrasena'] ?? '');

        if ($usuario === '' || $contrasena === '') {
            $this->json(['exito' => false, 'mensaje' => 'Usuario y contraseña no pueden estar vacíos'], 400);
            return;
        }

        $model = new User();
        try {
            $row = $model->findActiveByUsername($usuario);
        } catch (Throwable $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error en la base de datos'], 500);
            return;
        }

        if (!$row || $row['Contrasena'] !== $contrasena) {
            $this->json(['exito' => false, 'mensaje' => 'Usuario o contraseña incorrectos'], 401);
            return;
        }

        $token = $this->generateToken((int)$row['IdUsuario'], $row['NombrePerfil']);
        $this->json([
            'exito' => true,
            'mensaje' => 'Autenticación exitosa',
            'usuario' => [
                'id' => (int)$row['IdUsuario'],
                'nombre' => $row['NombreCompleto'],
                'perfil' => $row['NombrePerfil'],
                'idPerfil' => (int)$row['IdPerfil'],
            ],
            'token' => $token,
        ]);
    }

    /**
     * Login de empresa
     */
    public function loginEmpresa(): void {
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

        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['nombreEmpresa']) || !isset($input['contrasena'])) {
                $this->json(['exito' => false, 'mensaje' => 'Datos incompletos'], 400);
                return;
            }

            $nombreEmpresa = trim($input['nombreEmpresa']);
            $contrasena = $input['contrasena'];

            $db = Database::connection();
            
            $query = 'SELECT IdEmpresa, NombreEmpresa, Contrasena 
                     FROM Empresas 
                     WHERE NombreEmpresa = :nombreEmpresa 
                     LIMIT 1';
            
            $stmt = $db->prepare($query);
            $stmt->bindParam(':nombreEmpresa', $nombreEmpresa);
            $stmt->execute();
            
            $empresa = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$empresa) {
                $this->json(['exito' => false, 'mensaje' => 'Empresa no encontrada'], 401);
                return;
            }

            // Verificar contraseña
            if ($empresa['Contrasena'] !== $contrasena) {
                $this->json(['exito' => false, 'mensaje' => 'Contraseña incorrecta'], 401);
                return;
            }

            // Login exitoso
            $this->json([
                'exito' => true,
                'idEmpresa' => (int)$empresa['IdEmpresa'],
                'nombreEmpresa' => $empresa['NombreEmpresa'],
                'mensaje' => 'Acceso concedido'
            ], 200);

        } catch (Exception $e) {
            error_log('Error en AuthController::loginEmpresa: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error en el servidor', 'error' => $e->getMessage()], 500);
        }
    }

    private function generateToken(int $userId, string $perfil): string
    {
        $config = require __DIR__ . '/../config/config.php';
        $secret = $config['auth']['secret'];
        $ttl = $config['auth']['ttl'];

        $header = $this->base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload = $this->base64UrlEncode(json_encode([
            'id' => $userId,
            'perfil' => $perfil,
            'iat' => time(),
            'exp' => time() + $ttl,
        ]));
        $signature = $this->base64UrlEncode(hash_hmac('sha256', "$header.$payload", $secret, true));

        return "$header.$payload.$signature";
    }

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}
