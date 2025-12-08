<?php
require_once __DIR__ . '/../models/Promocion.php';

class PromocionController
{
    public function registrar()
    {
        header('Content-Type: application/json; charset=utf-8');
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); return; }
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['exito'=>false,'mensaje'=>'Método no permitido']); return; }

        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $nombre = trim($data['nombre'] ?? '');
        $tipo = trim($data['tipo'] ?? '');
        $descuento = trim($data['descuento'] ?? '');
        $estado = $data['estado'] ?? 'activa';
        $fechaInicio = $data['fechaInicio'] ?? null;
        $fechaFin = $data['fechaFin'] ?? null;

        if ($nombre === '' || $tipo === '' || $descuento === '' || !$fechaInicio || !$fechaFin) {
            http_response_code(400);
            echo json_encode(['exito'=>false,'mensaje'=>'Nombre, tipo, descuento y fechas son obligatorios']);
            return;
        }

        $model = new Promocion();
        $res = $model->registrar([
            'nombre'=>$nombre,
            'tipo'=>$tipo,
            'descuento'=>$descuento,
            'estado'=>$estado,
            'fechaInicio'=>$fechaInicio,
            'fechaFin'=>$fechaFin,
            'diasAplicables'=>$data['diasAplicables'] ?? null,
            'horario'=>$data['horario'] ?? null,
            'montoMinimo'=>$data['montoMinimo'] ?? 0,
            'usosMaximos'=>$data['usosMaximos'] ?? null,
            'acumulable'=>$data['acumulable'] ?? false,
            'descripcion'=>$data['descripcion'] ?? null
        ]);

        if (!$res) {
            http_response_code(500);
            echo json_encode(['exito'=>false,'mensaje'=>'Error al ejecutar el procedimiento']);
            return;
        }

        if (empty($res['exito'])) {
            http_response_code(500);
            echo json_encode($res);
            return;
        }

        http_response_code(201);
        echo json_encode($res);
    }

    public function listar()
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $model = new Promocion();
            $items = $model->listar();
            http_response_code(200);
            echo json_encode(['exito'=>true,'items'=>$items,'cantidad'=>count($items)]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['exito'=>false,'mensaje'=>'Error: '.$e->getMessage()]);
        }
    }

    public function actualizar()
    {
        header('Content-Type: application/json; charset=utf-8');
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); return; }
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['exito'=>false,'mensaje'=>'Método no permitido']); return; }

        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $idPromocion = $data['idPromocion'] ?? null;

        if (!$idPromocion) {
            http_response_code(400);
            echo json_encode(['exito'=>false,'mensaje'=>'idPromocion es obligatorio']);
            return;
        }

        $model = new Promocion();
        $res = $model->actualizar([
            'idPromocion'=>$idPromocion,
            'nombre'=>$data['nombre'] ?? null,
            'tipo'=>$data['tipo'] ?? null,
            'descuento'=>$data['descuento'] ?? null,
            'estado'=>$data['estado'] ?? 'activa',
            'fechaInicio'=>$data['fechaInicio'] ?? null,
            'fechaFin'=>$data['fechaFin'] ?? null,
            'diasAplicables'=>$data['diasAplicables'] ?? null,
            'horario'=>$data['horario'] ?? null,
            'montoMinimo'=>$data['montoMinimo'] ?? 0,
            'usosMaximos'=>$data['usosMaximos'] ?? null,
            'acumulable'=>$data['acumulable'] ?? false,
            'descripcion'=>$data['descripcion'] ?? null
        ]);

        if (!$res) {
            http_response_code(500);
            echo json_encode(['exito'=>false,'mensaje'=>'Error al ejecutar el procedimiento']);
            return;
        }

        if (empty($res['exito'])) {
            http_response_code(500);
            echo json_encode($res);
            return;
        }

        http_response_code(200);
        echo json_encode($res);
    }

    public function buscar()
    {
        header('Content-Type: application/json; charset=utf-8');
        $idPromocion = $_GET['id'] ?? null;

        if (!$idPromocion) {
            http_response_code(400);
            echo json_encode(['exito'=>false,'mensaje'=>'ID de promoción es obligatorio']);
            return;
        }

        $model = new Promocion();
        $promocion = $model->buscar($idPromocion);

        if (!$promocion) {
            http_response_code(404);
            echo json_encode(['exito'=>false,'mensaje'=>'Promoción no encontrada']);
            return;
        }

        http_response_code(200);
        echo json_encode(['exito'=>true,'promocion'=>$promocion]);
    }

    public function eliminar()
    {
        header('Content-Type: application/json; charset=utf-8');
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); return; }
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['exito'=>false,'mensaje'=>'Método no permitido']); return; }

        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $idPromocion = $data['idPromocion'] ?? null;

        if (!$idPromocion) {
            http_response_code(400);
            echo json_encode(['exito'=>false,'mensaje'=>'idPromocion es obligatorio']);
            return;
        }

        $model = new Promocion();
        $res = $model->eliminar($idPromocion);

        if (!$res) {
            http_response_code(500);
            echo json_encode(['exito'=>false,'mensaje'=>'Error al ejecutar el procedimiento']);
            return;
        }

        if (empty($res['exito'])) {
            http_response_code(500);
            echo json_encode($res);
            return;
        }

        http_response_code(200);
        echo json_encode($res);
    }
}
