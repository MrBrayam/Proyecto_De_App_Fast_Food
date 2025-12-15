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
}
