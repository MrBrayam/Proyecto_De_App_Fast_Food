<?php
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../models/Inventario.php';

class InventarioController extends Controller
{
    /**
     * Listar productos del inventario
     * GET /api/inventario/productos
     */
    public function listarProductos(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        try {
            $model = new Inventario();
            $productos = $model->listarProductos();

            $this->json([
                'exito' => true,
                'items' => $productos,
                'total' => count($productos),
                'mensaje' => 'Productos listados correctamente'
            ]);
        } catch (Exception $e) {
            $this->json([
                'exito' => false,
                'mensaje' => 'Error al listar productos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Listar insumos del inventario
     * GET /api/inventario/insumos
     */
    public function listarInsumos(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        try {
            $model = new Inventario();
            $insumos = $model->listarInsumos();

            $this->json([
                'exito' => true,
                'items' => $insumos,
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
     * Listar suministros del inventario
     * GET /api/inventario/suministros
     */
    public function listarSuministros(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        try {
            $model = new Inventario();
            $suministros = $model->listarSuministros();

            $this->json([
                'exito' => true,
                'items' => $suministros,
                'total' => count($suministros),
                'mensaje' => 'Suministros listados correctamente'
            ]);
        } catch (Exception $e) {
            $this->json([
                'exito' => false,
                'mensaje' => 'Error al listar suministros: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Buscar producto por ID
     * GET /api/inventario/producto?id={id}
     */
    public function buscarProducto(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;

        if (!$id) {
            $this->json(['exito' => false, 'mensaje' => 'ID de producto requerido'], 400);
            return;
        }

        try {
            $model = new Inventario();
            $producto = $model->buscarProductoPorId($id);

            if (!$producto) {
                $this->json(['exito' => false, 'mensaje' => 'Producto no encontrado'], 404);
                return;
            }

            $this->json([
                'exito' => true,
                'producto' => $producto,
                'mensaje' => 'Producto encontrado'
            ]);
        } catch (Exception $e) {
            $this->json([
                'exito' => false,
                'mensaje' => 'Error al buscar producto: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Buscar insumo por ID
     * GET /api/inventario/insumo?id={id}
     */
    public function buscarInsumo(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;

        if (!$id) {
            $this->json(['exito' => false, 'mensaje' => 'ID de insumo requerido'], 400);
            return;
        }

        try {
            $model = new Inventario();
            $insumo = $model->buscarInsumoPorId($id);

            if (!$insumo) {
                $this->json(['exito' => false, 'mensaje' => 'Insumo no encontrado'], 404);
                return;
            }

            $this->json([
                'exito' => true,
                'insumo' => $insumo,
                'mensaje' => 'Insumo encontrado'
            ]);
        } catch (Exception $e) {
            $this->json([
                'exito' => false,
                'mensaje' => 'Error al buscar insumo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Buscar suministro por ID
     * GET /api/inventario/suministro?id={id}
     */
    public function buscarSuministro(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;

        if (!$id) {
            $this->json(['exito' => false, 'mensaje' => 'ID de suministro requerido'], 400);
            return;
        }

        try {
            $model = new Inventario();
            $suministro = $model->buscarSuministroPorId($id);

            if (!$suministro) {
                $this->json(['exito' => false, 'mensaje' => 'Suministro no encontrado'], 404);
                return;
            }

            $this->json([
                'exito' => true,
                'suministro' => $suministro,
                'mensaje' => 'Suministro encontrado'
            ]);
        } catch (Exception $e) {
            $this->json([
                'exito' => false,
                'mensaje' => 'Error al buscar suministro: ' . $e->getMessage()
            ], 500);
        }
    }
}
