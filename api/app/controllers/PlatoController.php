<?php
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../models/Plato.php';

class PlatoController extends Controller
{
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

        $model = new Plato();
        try {
            $platos = $model->listar();
            $respuesta = array_map(function ($plato) {
                return [
                    'CodPlato' => $plato['CodPlato'],
                    'Nombre' => $plato['Nombre'],
                    'Descripcion' => $plato['Descripcion'],
                    'Ingredientes' => $plato['Ingredientes'],
                    'Tamano' => $plato['Tamano'],
                    'Precio' => (float)$plato['Precio'],
                    'Cantidad' => (int)$plato['Cantidad'],
                    'Estado' => $plato['Estado'],
                    'FechaCreacion' => $plato['FechaCreacion'],
                    'FechaActualizacion' => $plato['FechaActualizacion'],
                ];
            }, $platos);

            $this->json(['exito' => true, 'platos' => $respuesta, 'total' => count($respuesta)], 200);
        } catch (Exception $e) {
            error_log('Error en PlatoController::listar: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al obtener platos', 'error' => $e->getMessage()], 500);
        }
    }

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
        $codPlato = trim($input['codPlato'] ?? '');
        $nombre = trim($input['nombre'] ?? '');
        $tamano = trim($input['tamano'] ?? 'personal');
        $precio = isset($input['precio']) ? (float)$input['precio'] : 0;
        $cantidad = isset($input['cantidad']) ? (int)$input['cantidad'] : 0;
        $estado = trim($input['estado'] ?? 'disponible');

        if ($codPlato === '' || $nombre === '') {
            $this->json(['exito' => false, 'mensaje' => 'Código y nombre del plato son requeridos'], 400);
            return;
        }

        $tamanoPermitido = ['personal', 'mediana', 'familiar', 'grande'];
        if (!in_array($tamano, $tamanoPermitido, true)) {
            $this->json(['exito' => false, 'mensaje' => 'Tamaño de plato no válido'], 400);
            return;
        }

        if ($precio < 0) {
            $this->json(['exito' => false, 'mensaje' => 'El precio debe ser mayor o igual a 0'], 400);
            return;
        }

        $model = new Plato();
        try {
            $model->registrar([
                'codPlato' => $codPlato,
                'nombre' => $nombre,
                'descripcion' => $input['descripcion'] ?? null,
                'ingredientes' => $input['ingredientes'] ?? null,
                'tamano' => $tamano,
                'precio' => $precio,
                'cantidad' => $cantidad,
                'estado' => $estado,
            ]);

            $this->json(['exito' => true, 'CodPlato' => $codPlato, 'mensaje' => 'Plato registrado exitosamente'], 201);
        } catch (Exception $e) {
            error_log('Error en PlatoController::registrar: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al registrar plato', 'error' => $e->getMessage()], 500);
        }
    }

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

        $codPlato = $_GET['codPlato'] ?? '';
        if (trim($codPlato) === '') {
            $this->json(['exito' => false, 'mensaje' => 'Código de plato requerido'], 400);
            return;
        }

        $model = new Plato();
        try {
            $plato = $model->buscarPorCodigo($codPlato);
            if (!$plato) {
                $this->json(['exito' => false, 'mensaje' => 'Plato no encontrado'], 404);
                return;
            }

            $this->json(['exito' => true, 'plato' => $plato], 200);
        } catch (Exception $e) {
            error_log('Error en PlatoController::buscar: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al buscar plato', 'error' => $e->getMessage()], 500);
        }
    }
}
