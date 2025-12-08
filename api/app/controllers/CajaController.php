<?php
require_once __DIR__ . '/../models/Caja.php';

class CajaController
{
    public function abrir()
    {
        header('Content-Type: application/json; charset=utf-8');
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); return; }
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['exito'=>false,'mensaje'=>'Método no permitido']); return; }

        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $codCaja = trim($data['codCaja'] ?? '');
        $montoInicial = $data['montoInicial'] ?? null;
        $turno = $data['turno'] ?? '';
        $fecha = $data['fechaApertura'] ?? date('Y-m-d');
        $idUsuario = $data['idUsuario'] ?? null;

        if ($codCaja === '' || $turno === '' || $idUsuario === null) {
            http_response_code(400);
            echo json_encode(['exito'=>false,'mensaje'=>'codCaja, turno e idUsuario son obligatorios']);
            return;
        }

        $model = new Caja();
        $res = $model->abrir([
            'codCaja'=>$codCaja,
            'montoInicial'=>$montoInicial,
            'turno'=>$turno,
            'idUsuario'=>$idUsuario,
            'fechaApertura'=>$fecha
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
            $model = new Caja();
            $items = $model->listar();
            http_response_code(200);
            echo json_encode(['exito'=>true,'items'=>$items,'cantidad'=>count($items)]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['exito'=>false,'mensaje'=>'Error: '.$e->getMessage()]);
        }
    }

    public function abierta()
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $model = new Caja();
            $caja = $model->obtenerAbierta();
            http_response_code(200);
            echo json_encode(['exito'=>true,'caja'=>$caja]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['exito'=>false,'mensaje'=>'Error: '.$e->getMessage()]);
        }
    }

    public function cerrar()
    {
        header('Content-Type: application/json; charset=utf-8');
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); return; }
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['exito'=>false,'mensaje'=>'Método no permitido']); return; }

        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $codCaja = trim($data['codCaja'] ?? '');
        $montoFinal = $data['montoFinal'] ?? null;
        $observaciones = $data['observaciones'] ?? null;
        $idUsuario = $data['idUsuario'] ?? null;

        if ($codCaja === '' || $idUsuario === null) {
            http_response_code(400);
            echo json_encode(['exito'=>false,'mensaje'=>'codCaja e idUsuario son obligatorios']);
            return;
        }

        $model = new Caja();
        $res = $model->cerrar([
            'codCaja'=>$codCaja,
            'montoFinal'=>$montoFinal,
            'observaciones'=>$observaciones,
            'idUsuario'=>$idUsuario
        ]);

        if (!$res || empty($res['exito'])) {
            http_response_code(500);
            echo json_encode(['exito'=>false,'mensaje'=>$res['mensaje'] ?? 'No se pudo cerrar la caja']);
            return;
        }

        http_response_code(200);
        echo json_encode($res);
    }
}
