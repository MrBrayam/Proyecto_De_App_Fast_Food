<?php
require_once __DIR__ . '/../models/Suministro.php';

class SuministroController
{
    /**
     * POST /api/suministros/registrar
     * Registra un nuevo suministro
     */
    public function registrar()
    {
        try {
            // Get JSON body
            $raw = file_get_contents('php://input');
            $data = json_decode($raw, true, 512, JSON_UNESCAPED_UNICODE);

            // Validar campos requeridos
            if (empty($data['tipoSuministro'])) {
                http_response_code(400);
                echo json_encode(['exito' => false, 'mensaje' => 'El tipo de suministro es obligatorio']);
                return;
            }

            if (empty($data['nombreSuministro'])) {
                http_response_code(400);
                echo json_encode(['exito' => false, 'mensaje' => 'El nombre del suministro es obligatorio']);
                return;
            }

            if (empty($data['proveedor'])) {
                http_response_code(400);
                echo json_encode(['exito' => false, 'mensaje' => 'El proveedor es obligatorio']);
                return;
            }

            if (empty($data['cantidad']) || (int)$data['cantidad'] <= 0) {
                http_response_code(400);
                echo json_encode(['exito' => false, 'mensaje' => 'La cantidad debe ser mayor a 0']);
                return;
            }

            if (empty($data['precioUnitario']) || (float)$data['precioUnitario'] <= 0) {
                http_response_code(400);
                echo json_encode(['exito' => false, 'mensaje' => 'El precio unitario debe ser mayor a 0']);
                return;
            }

            if (empty($data['fechaCompra'])) {
                http_response_code(400);
                echo json_encode(['exito' => false, 'mensaje' => 'La fecha de compra es obligatoria']);
                return;
            }

            // Registrar
            $suministro = new Suministro();
            $resultado = $suministro->registrar($data);

            if ($resultado) {
                http_response_code(201);
                echo json_encode([
                    'exito' => true,
                    'suministro' => $resultado,
                    'mensaje' => 'Suministro registrado exitosamente'
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['exito' => false, 'mensaje' => 'Error al registrar el suministro']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['exito' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
        }
    }

    /**
     * GET /api/suministros/listar
     * Lista todos los suministros
     */
    public function listar()
    {
        try {
            $suministro = new Suministro();
            $suministros = $suministro->listar();

            echo json_encode([
                'exito' => true,
                'suministros' => $suministros,
                'total' => count($suministros),
                'mensaje' => 'Suministros listados correctamente'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['exito' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
        }
    }

    /**
     * GET /api/suministros/buscar?id={id}
     * Busca un suministro por ID
     */
    public function buscar()
    {
        try {
            $id = $_GET['id'] ?? null;

            if (empty($id)) {
                http_response_code(400);
                echo json_encode(['exito' => false, 'mensaje' => 'El ID del suministro es obligatorio']);
                return;
            }

            $suministro = new Suministro();
            $resultado = $suministro->buscarPorId($id);

            if ($resultado) {
                echo json_encode([
                    'exito' => true,
                    'suministro' => $resultado,
                    'mensaje' => 'Suministro encontrado'
                ]);
            } else {
                http_response_code(404);
                echo json_encode(['exito' => false, 'mensaje' => 'Suministro no encontrado']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['exito' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
        }
    }
}
