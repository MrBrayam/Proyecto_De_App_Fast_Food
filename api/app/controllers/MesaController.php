<?php
require_once __DIR__ . '/../models/Mesa.php';

class MesaController
{
    /**
     * POST /api/mesas/registrar
     * Registra una nueva mesa o actualiza una existente
     */
    public function registrar()
    {
        try {
            // Get JSON body (handles UTF-16 payloads from PowerShell)
            $raw = file_get_contents('php://input');
            $raw = mb_convert_encoding($raw, 'UTF-8', 'UTF-8, UTF-16LE, UTF-16BE, ISO-8859-1');
            $data = json_decode($raw, true);

            // Validar campos requeridos
            if (empty($data['numeroMesa'])) {
                http_response_code(400);
                echo json_encode(['exito' => false, 'mensaje' => 'El número de mesa es obligatorio']);
                return;
            }

            if (empty($data['capacidad']) || (int)$data['capacidad'] <= 0) {
                http_response_code(400);
                echo json_encode(['exito' => false, 'mensaje' => 'La capacidad debe ser mayor a 0']);
                return;
            }

            // Registrar
            $mesa = new Mesa();
            $resultado = $mesa->registrar($data);

            if ($resultado) {
                http_response_code(201);
                echo json_encode([
                    'exito' => true,
                    'mesa' => $resultado,
                    'mensaje' => 'Mesa registrada exitosamente'
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['exito' => false, 'mensaje' => 'Error al registrar la mesa']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['exito' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
        }
    }

    /**
     * GET /api/mesas/listar
     * Lista todas las mesas
     */
    public function listar()
    {
        try {
            $mesa = new Mesa();
            $mesas = $mesa->obtenerTodas();

            http_response_code(200);
            echo json_encode([
                'exito' => true,
                'items' => $mesas,
                'cantidad' => count($mesas),
                'mensaje' => 'Mesas obtenidas exitosamente'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['exito' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
        }
    }

    /**
     * GET /api/mesas/buscar
     * Busca una mesa por número
     */
    public function buscar()
    {
        try {
            $numeroMesa = $_GET['numero'] ?? null;

            if (empty($numeroMesa)) {
                http_response_code(400);
                echo json_encode(['exito' => false, 'mensaje' => 'El número de mesa es obligatorio']);
                return;
            }

            $mesa = new Mesa();
            $resultado = $mesa->buscarPorId($numeroMesa);

            if ($resultado) {
                http_response_code(200);
                echo json_encode([
                    'exito' => true,
                    'mesa' => $resultado,
                    'mensaje' => 'Mesa encontrada'
                ]);
            } else {
                http_response_code(404);
                echo json_encode(['exito' => false, 'mensaje' => 'Mesa no encontrada']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['exito' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
        }
    }

    /**
     * POST /api/mesas/actualizar-estado
     * Actualiza el estado de una mesa
     */
    public function actualizarEstado()
    {
        try {
            $raw = file_get_contents('php://input');
            $raw = mb_convert_encoding($raw, 'UTF-8', 'UTF-8, UTF-16LE, UTF-16BE, ISO-8859-1');
            $data = json_decode($raw, true);

            if (empty($data['numMesa'])) {
                http_response_code(400);
                echo json_encode(['exito' => false, 'mensaje' => 'El número de mesa es obligatorio']);
                return;
            }

            if (empty($data['estado'])) {
                http_response_code(400);
                echo json_encode(['exito' => false, 'mensaje' => 'El estado es obligatorio']);
                return;
            }

            $mesa = new Mesa();
            $resultado = $mesa->actualizarEstado($data['numMesa'], $data['estado']);

            if ($resultado) {
                http_response_code(200);
                echo json_encode([
                    'exito' => true,
                    'mesa' => $resultado,
                    'mensaje' => 'Estado de la mesa actualizado'
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['exito' => false, 'mensaje' => 'No se pudo actualizar el estado de la mesa']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['exito' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
        }
    }
}
?>
