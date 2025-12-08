<?php
require_once __DIR__ . '/../models/Compra.php';

class CompraController {
    
    public function registrar() {
        header('Content-Type: application/json; charset=utf-8');
        
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                http_response_code(405);
                echo json_encode([
                    'exito' => false,
                    'mensaje' => 'Método no permitido'
                ]);
                return;
            }
            
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                http_response_code(400);
                echo json_encode([
                    'exito' => false,
                    'mensaje' => 'Datos inválidos o vacíos'
                ]);
                return;
            }
            
            // Validar campos requeridos
            $camposRequeridos = ['codProveedor', 'numeroComprobante', 'total', 'idUsuario'];
            foreach ($camposRequeridos as $campo) {
                if (empty($data[$campo])) {
                    http_response_code(400);
                    echo json_encode([
                        'exito' => false,
                        'mensaje' => "El campo '$campo' es requerido"
                    ]);
                    return;
                }
            }
            
            $resultado = Compra::registrar($data);
            
            if ($resultado['exito']) {
                http_response_code(201);
                echo json_encode($resultado);
            } else {
                http_response_code(400);
                echo json_encode($resultado);
            }
            
        } catch (Exception $e) {
            error_log("Error en CompraController::registrar() - " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'exito' => false,
                'mensaje' => 'Error interno del servidor'
            ]);
        }
    }
    
    public function listar() {
        header('Content-Type: application/json; charset=utf-8');
        
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
                http_response_code(405);
                echo json_encode([
                    'exito' => false,
                    'mensaje' => 'Método no permitido'
                ]);
                return;
            }
            
            $resultado = Compra::listar();
            
            if ($resultado['exito']) {
                http_response_code(200);
                echo json_encode($resultado);
            } else {
                http_response_code(500);
                echo json_encode($resultado);
            }
            
        } catch (Exception $e) {
            error_log("Error en CompraController::listar() - " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'exito' => false,
                'mensaje' => 'Error interno del servidor',
                'compras' => [],
                'total' => 0
            ]);
        }
    }
    
    public function buscar() {
        header('Content-Type: application/json; charset=utf-8');
        
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
                http_response_code(405);
                echo json_encode([
                    'exito' => false,
                    'mensaje' => 'Método no permitido'
                ]);
                return;
            }
            
            $idCompra = $_GET['id'] ?? null;
            
            if (empty($idCompra)) {
                http_response_code(400);
                echo json_encode([
                    'exito' => false,
                    'mensaje' => 'ID de compra no proporcionado'
                ]);
                return;
            }
            
            $resultado = Compra::buscarPorId($idCompra);
            
            if ($resultado['exito']) {
                http_response_code(200);
                echo json_encode($resultado);
            } else {
                http_response_code(404);
                echo json_encode($resultado);
            }
            
        } catch (Exception $e) {
            error_log("Error en CompraController::buscar() - " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'exito' => false,
                'mensaje' => 'Error interno del servidor'
            ]);
        }
    }
}
