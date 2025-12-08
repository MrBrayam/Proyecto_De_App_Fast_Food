<?php
require_once __DIR__ . '/../models/Pedido.php';

class PedidoController
{
    public function registrar()
    {
        try {
            $raw = file_get_contents('php://input');
            $raw = mb_convert_encoding($raw, 'UTF-8', 'UTF-8, UTF-16LE, UTF-16BE, ISO-8859-1');
            $data = json_decode($raw, true);

            if (empty($data['tipoServicio'])) {
                http_response_code(400);
                echo json_encode(['exito' => false, 'mensaje' => 'El tipo de servicio es obligatorio']);
                return;
            }

            if (empty($data['nombreCliente'])) {
                http_response_code(400);
                echo json_encode(['exito' => false, 'mensaje' => 'El nombre del cliente es obligatorio']);
                return;
            }

            if (empty($data['idUsuario'])) {
                http_response_code(400);
                echo json_encode(['exito' => false, 'mensaje' => 'El usuario es obligatorio']);
                return;
            }

            $pedidoModel = new Pedido();
            $resultado = $pedidoModel->registrar($data);

            if (!$resultado || empty($resultado['IdPedido'])) {
                http_response_code(500);
                echo json_encode(['exito' => false, 'mensaje' => 'No se pudo registrar el pedido']);
                return;
            }

            $idPedido = (int)$resultado['IdPedido'];
            $detallesGuardados = [];

            if (!empty($data['detalles']) && is_array($data['detalles'])) {
                foreach ($data['detalles'] as $detalle) {
                    $detalle['idPedido'] = $idPedido;
                    $resDetalle = $pedidoModel->registrarDetalle($idPedido, $detalle);
                    if ($resDetalle) {
                        $detallesGuardados[] = $resDetalle;
                    }
                }
            }

            http_response_code(201);
            echo json_encode([
                'exito' => true,
                'pedido' => $resultado,
                'detalles' => $detallesGuardados,
                'mensaje' => 'Pedido registrado exitosamente'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['exito' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
        }
    }

    public function listar()
    {
        try {
            $pedidoModel = new Pedido();
            $pedidos = $pedidoModel->listar();

            http_response_code(200);
            echo json_encode([
                'exito' => true,
                'items' => $pedidos,
                'cantidad' => count($pedidos)
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['exito' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
        }
    }

    public function buscar()
    {
        // Agregar CORS headers
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        
        try {
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            if ($id <= 0) {
                http_response_code(400);
                echo json_encode(['exito' => false, 'mensaje' => 'Id de pedido inválido']);
                return;
            }

            $pedidoModel = new Pedido();
            $pedido = $pedidoModel->buscarPorId($id);

            if ($pedido) {
                http_response_code(200);
                echo json_encode(['exito' => true, 'pedido' => $pedido]);
            } else {
                http_response_code(404);
                echo json_encode(['exito' => false, 'mensaje' => 'Pedido no encontrado']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['exito' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
        }
    }

    public function actualizarEstado()
    {
        // Headers CORS
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
                http_response_code(200);
                return;
            }
            
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                http_response_code(405);
                echo json_encode(['exito' => false, 'mensaje' => 'Método no permitido']);
                return;
            }

            $raw = file_get_contents('php://input');
            $raw = mb_convert_encoding($raw, 'UTF-8', 'UTF-8, UTF-16LE, UTF-16BE, ISO-8859-1');
            $data = json_decode($raw, true);

            $idPedido = isset($data['idPedido']) ? (int)$data['idPedido'] : 0;
            $nuevoEstado = isset($data['estado']) ? trim($data['estado']) : '';

            if ($idPedido <= 0) {
                http_response_code(400);
                echo json_encode(['exito' => false, 'mensaje' => 'ID de pedido inválido']);
                return;
            }

            if (!in_array($nuevoEstado, ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'])) {
                http_response_code(400);
                echo json_encode(['exito' => false, 'mensaje' => 'Estado inválido']);
                return;
            }

            $pedidoModel = new Pedido();
            $actualizado = $pedidoModel->actualizarEstado($idPedido, $nuevoEstado);

            if ($actualizado) {
                http_response_code(200);
                echo json_encode([
                    'exito' => true,
                    'mensaje' => 'Estado del pedido actualizado',
                    'idPedido' => $idPedido,
                    'nuevoEstado' => $nuevoEstado
                ]);
            } else {
                http_response_code(404);
                echo json_encode(['exito' => false, 'mensaje' => 'Pedido no encontrado']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['exito' => false, 'mensaje' => 'Error: ' . $e->getMessage()]);
        }
    }
}
