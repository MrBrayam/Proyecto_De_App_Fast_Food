<?php
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../models/Producto.php';

class ProductoController extends Controller
{
    /**
     * Lista todos los productos
     */
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

        $model = new Producto();
        try {
            $productos = $model->listar();

            if (empty($productos)) {
                $this->json(['exito' => true, 'productos' => [], 'total' => 0], 200);
                return;
            }

            $productosFormateados = array_map(function($producto) {
                return [
                    'CodProducto' => $producto['CodProducto'],
                    'Nombre' => $producto['NombreProducto'],
                    'Categoria' => $producto['Categoria'],
                    'Tamano' => $producto['Tamano'],
                    'Precio' => (float)$producto['Precio'],
                    'Costo' => (float)$producto['Costo'],
                    'Stock' => (int)$producto['Stock'],
                    'StockMinimo' => (int)$producto['StockMinimo'],
                    'TiempoPreparacion' => (int)$producto['TiempoPreparacion'],
                    'Estado' => $producto['Estado'],
                    'CodigoBarras' => $producto['CodigoBarras'],
                    'Descripcion' => $producto['Descripcion'],
                    'CodProveedor' => $producto['CodProveedor'],
                    'FechaCreacion' => $producto['FechaCreacion'],
                    'FechaActualizacion' => $producto['FechaActualizacion'],
                ];
            }, $productos);

            $this->json(['exito' => true, 'productos' => $productosFormateados, 'total' => count($productos)], 200);
        } catch (Exception $e) {
            error_log('Error en ProductoController::listar: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al obtener productos', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Registra un nuevo producto
     */
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

        // Validaciones
        $codProducto = trim($input['codProducto'] ?? '');
        $nombreProducto = trim($input['nombreProducto'] ?? '');
        $categoria = trim($input['categoria'] ?? '');
        $tamano = trim($input['tamano'] ?? 'na');
        $precio = isset($input['precio']) ? (float)$input['precio'] : 0;
        $costo = isset($input['costo']) ? (float)$input['costo'] : 0;
        $stock = isset($input['stock']) ? (int)$input['stock'] : 0;
        $stockMinimo = isset($input['stockMinimo']) ? (int)$input['stockMinimo'] : 0;
        $tiempoPreparacion = isset($input['tiempoPreparacion']) ? (int)$input['tiempoPreparacion'] : 0;
        $codigoBarras = isset($input['codigoBarras']) ? trim($input['codigoBarras']) : null;
        $descripcion = isset($input['descripcion']) ? trim($input['descripcion']) : null;
        $codProveedor = isset($input['codProveedor']) ? (int)$input['codProveedor'] : null;

        // Validar campos requeridos
        if ($codProducto === '' || $nombreProducto === '') {
            $this->json(['exito' => false, 'mensaje' => 'Código y nombre de producto son requeridos'], 400);
            return;
        }

        // Crear producto
        $model = new Producto();
        try {
            $producto = $model->registrar([
                'codProducto' => $codProducto,
                'nombreProducto' => $nombreProducto,
                'categoria' => $categoria,
                'tamano' => $tamano,
                'precio' => $precio,
                'costo' => $costo,
                'stock' => $stock,
                'stockMinimo' => $stockMinimo,
                'tiempoPreparacion' => $tiempoPreparacion,
                'codigoBarras' => $codigoBarras,
                'descripcion' => $descripcion,
                'codProveedor' => $codProveedor,
            ]);

            $this->json(['exito' => true, 'CodProducto' => $codProducto, 'mensaje' => 'Producto registrado exitosamente'], 201);
        } catch (Exception $e) {
            error_log('Error en ProductoController::registrar: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al registrar producto', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Actualiza un producto existente
     */
    public function actualizar(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: PUT, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $codProducto = $input['codProducto'] ?? null;

        if (!$codProducto) {
            $this->json(['exito' => false, 'mensaje' => 'Código de producto requerido'], 400);
            return;
        }

        $model = new Producto();
        try {
            $resultado = $model->actualizar($codProducto, $input);

            if ($resultado) {
                $this->json(['exito' => true, 'mensaje' => 'Producto actualizado exitosamente'], 200);
            } else {
                $this->json(['exito' => false, 'mensaje' => 'No se pudo actualizar el producto'], 400);
            }
        } catch (Exception $e) {
            error_log('Error en ProductoController::actualizar: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al actualizar producto', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Elimina un producto
     */
    public function eliminar(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $codProducto = $input['codProducto'] ?? null;

        if (!$codProducto) {
            $this->json(['exito' => false, 'mensaje' => 'Código de producto requerido'], 400);
            return;
        }

        $model = new Producto();
        try {
            $resultado = $model->eliminar($codProducto);

            if ($resultado) {
                $this->json(['exito' => true, 'mensaje' => 'Producto eliminado exitosamente'], 200);
            } else {
                $this->json(['exito' => false, 'mensaje' => 'No se pudo eliminar el producto'], 400);
            }
        } catch (Exception $e) {
            error_log('Error en ProductoController::eliminar: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al eliminar producto', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Busca un producto por código
     */
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

        $codProducto = $_GET['codProducto'] ?? '';
        if (trim($codProducto) === '') {
            $this->json(['exito' => false, 'mensaje' => 'Código de producto requerido'], 400);
            return;
        }

        $model = new Producto();
        try {
            $producto = $model->obtenerPorCodigo($codProducto);
            if (!$producto) {
                $this->json(['exito' => false, 'mensaje' => 'Producto no encontrado'], 404);
                return;
            }

            $this->json(['exito' => true, 'producto' => $producto], 200);
        } catch (Exception $e) {
            error_log('Error en ProductoController::buscar: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al buscar producto', 'error' => $e->getMessage()], 500);
        }
    }
}
?>
