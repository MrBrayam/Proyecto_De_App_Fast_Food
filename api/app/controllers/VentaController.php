<?php
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../models/Venta.php';

class VentaController extends Controller
{
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

        $tipoPago = trim($input['tipoPago'] ?? '');
        $idUsuario = isset($input['idUsuario']) ? (int)$input['idUsuario'] : null;
        $idCliente = isset($input['idCliente']) ? (int)$input['idCliente'] : null;
        $codCaja = isset($input['codCaja']) && $input['codCaja'] !== '' ? trim($input['codCaja']) : null;
        $observaciones = isset($input['observaciones']) && $input['observaciones'] !== '' ? trim($input['observaciones']) : null;
        $detalles = is_array($input['detalles'] ?? null) ? $input['detalles'] : [];

        if ($tipoPago === '' || $idUsuario === null) {
            $this->json(['exito' => false, 'mensaje' => 'tipoPago e idUsuario son obligatorios'], 400);
            return;
        }

        if (empty($detalles)) {
            $this->json(['exito' => false, 'mensaje' => 'Se requiere al menos un detalle de venta'], 400);
            return;
        }

        $subTotal = 0.0;
        $detallesNormalizados = [];
        foreach ($detalles as $idx => $item) {
            $codProducto = trim($item['codProducto'] ?? '');
            $linea = trim($item['linea'] ?? '');
            $descripcion = trim($item['descripcion'] ?? '');
            $cantidad = isset($item['cantidad']) ? (int)$item['cantidad'] : 0;
            $precio = isset($item['precio']) ? (float)$item['precio'] : -1;
            $idProducto = isset($item['idProducto']) ? (int)$item['idProducto'] : null;

            if ($descripcion === '' && $linea === '' && $codProducto === '') {
                $this->json(['exito' => false, 'mensaje' => "Detalle #" . ($idx + 1) . ": falta descripcion/linea/codProducto"], 400);
                return;
            }
            if ($cantidad <= 0) {
                $this->json(['exito' => false, 'mensaje' => "Detalle #" . ($idx + 1) . ": cantidad debe ser mayor a 0"], 400);
                return;
            }
            if ($precio < 0) {
                $this->json(['exito' => false, 'mensaje' => "Detalle #" . ($idx + 1) . ": precio no es válido"], 400);
                return;
            }

            $lineTotal = round($cantidad * $precio, 2);
            $subTotal += $lineTotal;

            $detallesNormalizados[] = [
                'codProducto' => $codProducto,
                'linea' => $linea,
                'descripcion' => $descripcion !== '' ? $descripcion : ($linea !== '' ? $linea : $codProducto),
                'cantidad' => $cantidad,
                'precio' => $precio,
                'subtotal' => $lineTotal,
                'idProducto' => $idProducto,
            ];
        }

        $descuento = isset($input['descuento']) ? (float)$input['descuento'] : 0.0;
        $total = isset($input['total']) ? (float)$input['total'] : ($subTotal - $descuento);
        if ($total < 0) {
            $total = 0;
        }

        $model = new Venta();
        try {
            $result = $model->registrar([
                'idCliente' => $idCliente,
                'tipoPago' => $tipoPago,
                'subTotal' => round($subTotal, 2),
                'descuento' => round($descuento, 2),
                'total' => round($total, 2),
                'idUsuario' => $idUsuario,
                'codCaja' => $codCaja,
                'observaciones' => $observaciones,
                'detalles' => $detallesNormalizados,
            ]);
        } catch (Throwable $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error en la base de datos'], 500);
            return;
        }

        $codVenta = isset($result['CodVenta']) ? (int)$result['CodVenta'] : null;
        $this->json([
            'exito' => true,
            'mensaje' => 'Venta registrada',
            'codVenta' => $codVenta,
            'subTotal' => round($subTotal, 2),
            'descuento' => round($descuento, 2),
            'total' => round($total, 2),
        ], 201);
    }

    public function listar(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        try {
            $model = new Venta();
            $ventas = $model->listar();

            $this->json([
                'exito' => true,
                'items' => $ventas,
                'cantidad' => count($ventas)
            ], 200);
        } catch (Exception $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function buscar(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        try {
            $codVenta = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            
            if ($codVenta <= 0) {
                $this->json(['exito' => false, 'mensaje' => 'ID de venta inválido'], 400);
                return;
            }

            $model = new Venta();
            $venta = $model->buscarPorId($codVenta);

            if ($venta) {
                $this->json(['exito' => true, 'venta' => $venta], 200);
            } else {
                $this->json(['exito' => false, 'mensaje' => 'Venta no encontrada'], 404);
            }
        } catch (Exception $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function detalles(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        try {
            $codVenta = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            
            if ($codVenta <= 0) {
                $this->json(['exito' => false, 'mensaje' => 'ID de venta inválido'], 400);
                return;
            }

            $model = new Venta();
            $detalles = $model->buscarDetalles($codVenta);

            $this->json(['exito' => true, 'detalles' => $detalles], 200);
        } catch (Exception $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}
