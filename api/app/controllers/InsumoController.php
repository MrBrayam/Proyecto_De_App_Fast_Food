<?php
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../models/Insumo.php';

class InsumoController extends Controller
{
    /**
     * Registra un nuevo insumo
     * POST /api/insumos/registrar
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
        $nombreInsumo = trim($input['nombreInsumo'] ?? '');
        $ubicacion = trim($input['ubicacion'] ?? '');
        $observacion = isset($input['observacion']) && $input['observacion'] !== '' ? trim($input['observacion']) : null;
        $precioUnitario = floatval($input['precioUnitario'] ?? 0);
        $vencimiento = isset($input['vencimiento']) && $input['vencimiento'] !== '' ? $input['vencimiento'] : null;
        $estado = trim($input['estado'] ?? 'disponible');
        $codProveedor = isset($input['codProveedor']) && $input['codProveedor'] !== '' ? intval($input['codProveedor']) : null;

        // Validar campos requeridos
        if ($nombreInsumo === '') {
            $this->json(['exito' => false, 'mensaje' => 'El nombre del insumo es obligatorio'], 400);
            return;
        }

        if ($ubicacion === '') {
            $this->json(['exito' => false, 'mensaje' => 'La ubicación es obligatoria'], 400);
            return;
        }

        if ($precioUnitario <= 0) {
            $this->json(['exito' => false, 'mensaje' => 'El precio unitario debe ser mayor a 0'], 400);
            return;
        }

        // Validar estado válido
        $estadosValidos = ['disponible', 'agotado', 'vencido'];
        if (!in_array($estado, $estadosValidos)) {
            $this->json(['exito' => false, 'mensaje' => 'Estado inválido'], 400);
            return;
        }

        try {
            $model = new Insumo();
            $result = $model->registrar([
                'nombreInsumo' => $nombreInsumo,
                'ubicacion' => $ubicacion,
                'observacion' => $observacion,
                'precioUnitario' => $precioUnitario,
                'vencimiento' => $vencimiento,
                'estado' => $estado,
                'codProveedor' => $codProveedor
            ]);

            if ($result) {
                $this->json([
                    'exito' => true,
                    'insumo' => $result,
                    'mensaje' => 'Insumo registrado exitosamente'
                ], 201);
            } else {
                $this->json([
                    'exito' => false,
                    'mensaje' => 'Error al registrar el insumo'
                ], 500);
            }
        } catch (Exception $e) {
            $this->json([
                'exito' => false,
                'mensaje' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lista todos los insumos
     * GET /api/insumos/listar
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

        try {
            $model = new Insumo();
            $insumos = $model->listar();

            $this->json([
                'exito' => true,
                'insumos' => $insumos,
                'total' => count($insumos),
                'mensaje' => 'Insumos listados correctamente'
            ]);
        } catch (Exception $e) {
            $this->json([
                'exito' => false,
                'mensaje' => 'Error al listar insumos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Busca un insumo por ID
     * GET /api/insumos/buscar?id={id}
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

        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        if ($id <= 0) {
            $this->json(['exito' => false, 'mensaje' => 'ID de insumo inválido'], 400);
            return;
        }

        try {
            $model = new Insumo();
            $insumo = $model->buscarPorId($id);

            if ($insumo) {
                $this->json([
                    'exito' => true,
                    'insumo' => $insumo,
                    'mensaje' => 'Insumo encontrado'
                ]);
            } else {
                $this->json([
                    'exito' => false,
                    'mensaje' => 'Insumo no encontrado'
                ], 404);
            }
        } catch (Exception $e) {
            $this->json([
                'exito' => false,
                'mensaje' => 'Error al buscar insumo: ' . $e->getMessage()
            ], 500);
        }
    }
}
