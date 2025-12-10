<?php
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../models/Proveedor.php';

class ProveedorController extends Controller
{
    /**
     * Registra un nuevo proveedor
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
        $tipoDoc = trim($input['tipoDoc'] ?? '');
        $numDoc = trim($input['numDoc'] ?? '');
        $razonSocial = trim($input['razonSocial'] ?? '');
        $nombreComercial = isset($input['nombreComercial']) && $input['nombreComercial'] !== '' ? trim($input['nombreComercial']) : null;
        $categoria = trim($input['categoria'] ?? '');
        $telefono = trim($input['telefono'] ?? '');
        $telefonoSecundario = isset($input['telefonoSecundario']) && $input['telefonoSecundario'] !== '' ? trim($input['telefonoSecundario']) : null;
        $email = trim($input['email'] ?? '');
        $sitioWeb = isset($input['sitioWeb']) && $input['sitioWeb'] !== '' ? trim($input['sitioWeb']) : null;
        $personaContacto = trim($input['personaContacto'] ?? '');
        $direccion = trim($input['direccion'] ?? '');
        $ciudad = isset($input['ciudad']) && $input['ciudad'] !== '' ? trim($input['ciudad']) : null;
        $distrito = isset($input['distrito']) && $input['distrito'] !== '' ? trim($input['distrito']) : null;
        $tiempoEntrega = isset($input['tiempoEntrega']) && $input['tiempoEntrega'] !== '' ? (int)$input['tiempoEntrega'] : 0;
        $montoMinimo = isset($input['montoMinimo']) && $input['montoMinimo'] !== '' ? (float)$input['montoMinimo'] : 0.00;
        $descuento = isset($input['descuento']) && $input['descuento'] !== '' ? (float)$input['descuento'] : 0.00;
        $nota = isset($input['nota']) && $input['nota'] !== '' ? trim($input['nota']) : null;
        $estado = trim($input['estado'] ?? 'activo');

        // Validar campos requeridos
        if ($tipoDoc === '') {
            $this->json(['exito' => false, 'mensaje' => 'El tipo de documento es obligatorio'], 400);
            return;
        }

        if ($numDoc === '') {
            $this->json(['exito' => false, 'mensaje' => 'El número de documento es obligatorio'], 400);
            return;
        }

        if ($razonSocial === '') {
            $this->json(['exito' => false, 'mensaje' => 'La razón social es obligatoria'], 400);
            return;
        }

        if ($categoria === '') {
            $this->json(['exito' => false, 'mensaje' => 'La categoría es obligatoria'], 400);
            return;
        }

        if ($telefono === '') {
            $this->json(['exito' => false, 'mensaje' => 'El teléfono es obligatorio'], 400);
            return;
        }

        if ($email === '') {
            $this->json(['exito' => false, 'mensaje' => 'El email es obligatorio'], 400);
            return;
        }

        if ($personaContacto === '') {
            $this->json(['exito' => false, 'mensaje' => 'La persona de contacto es obligatoria'], 400);
            return;
        }

        if ($direccion === '') {
            $this->json(['exito' => false, 'mensaje' => 'La dirección es obligatoria'], 400);
            return;
        }

        // Validar tipo de documento
        if (!in_array($tipoDoc, ['RUC', 'DNI', 'CE'])) {
            $this->json(['exito' => false, 'mensaje' => 'Tipo de documento inválido'], 400);
            return;
        }

        // Validar longitud del documento según tipo
        if ($tipoDoc === 'RUC' && strlen($numDoc) !== 11) {
            $this->json(['exito' => false, 'mensaje' => 'El RUC debe tener 11 dígitos'], 400);
            return;
        }

        if ($tipoDoc === 'DNI' && strlen($numDoc) !== 8) {
            $this->json(['exito' => false, 'mensaje' => 'El DNI debe tener 8 dígitos'], 400);
            return;
        }

        // Validar teléfono (9 dígitos en Perú)
        if (!preg_match('/^\d{9}$/', $telefono)) {
            $this->json(['exito' => false, 'mensaje' => 'El teléfono debe tener 9 dígitos'], 400);
            return;
        }

        // Validar email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->json(['exito' => false, 'mensaje' => 'El email no es válido'], 400);
            return;
        }

        // Validar categoría
        $categoriasValidas = ['Alimentos', 'Bebidas', 'Empaques', 'Lácteos', 'Carnes', 'Vegetales', 'Limpieza', 'Equipos'];
        if (!in_array($categoria, $categoriasValidas)) {
            $this->json(['exito' => false, 'mensaje' => 'Categoría inválida'], 400);
            return;
        }

        // Validar estado
        if (!in_array($estado, ['activo', 'inactivo'])) {
            $this->json(['exito' => false, 'mensaje' => 'Estado inválido'], 400);
            return;
        }

        // Validar descuento (0-100)
        if ($descuento < 0 || $descuento > 100) {
            $this->json(['exito' => false, 'mensaje' => 'El descuento debe estar entre 0 y 100'], 400);
            return;
        }

        $model = new Proveedor();
        try {
            $result = $model->registrar([
                'tipoDoc' => $tipoDoc,
                'numDoc' => $numDoc,
                'razonSocial' => $razonSocial,
                'nombreComercial' => $nombreComercial,
                'categoria' => $categoria,
                'telefono' => $telefono,
                'telefonoSecundario' => $telefonoSecundario,
                'email' => $email,
                'sitioWeb' => $sitioWeb,
                'personaContacto' => $personaContacto,
                'direccion' => $direccion,
                'ciudad' => $ciudad,
                'distrito' => $distrito,
                'tiempoEntrega' => $tiempoEntrega,
                'montoMinimo' => $montoMinimo,
                'descuento' => $descuento,
                'nota' => $nota,
                'estado' => $estado,
            ]);

            $codProveedor = isset($result['CodProveedor']) ? (int)$result['CodProveedor'] : null;
            
            $this->json([
                'exito' => true,
                'mensaje' => 'Proveedor registrado exitosamente',
                'codProveedor' => $codProveedor,
                'razonSocial' => $result['RazonSocial'] ?? $razonSocial,
            ], 201);
        } catch (Throwable $e) {
            $mensaje = $e->getMessage();
            
            // Manejar errores de duplicados
            if (strpos($mensaje, 'Duplicate entry') !== false || strpos($mensaje, 'ya está registrado') !== false) {
                $mensaje = 'El número de documento ya está registrado';
            }
            
            $this->json(['exito' => false, 'mensaje' => $mensaje], 400);
        }
    }

    /**
     * Lista todos los proveedores
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

        $model = new Proveedor();
        try {
            $proveedores = $model->listar();
            
            // Debug: verificar que hay datos
            file_put_contents(__DIR__ . '/../../debug_listar.log', 
                date('Y-m-d H:i:s') . " - Total proveedores: " . count($proveedores) . "\n", 
                FILE_APPEND);
            
            if (empty($proveedores)) {
                file_put_contents(__DIR__ . '/../../debug_listar.log', 
                    date('Y-m-d H:i:s') . " - WARNING: No hay proveedores\n", 
                    FILE_APPEND);
            }
            
            $proveedoresFormateados = array_map(function($proveedor) {
                return [
                    'codProveedor' => (int)$proveedor['CodProveedor'],
                    'tipoDoc' => $proveedor['TipoDoc'],
                    'numDoc' => $proveedor['NumDoc'],
                    'razonSocial' => $proveedor['RazonSocial'],
                    'nombreComercial' => $proveedor['NombreComercial'],
                    'categoria' => $proveedor['Categoria'],
                    'estado' => $proveedor['Estado'],
                    'telefono' => $proveedor['Telefono'],
                    'telefonoSecundario' => $proveedor['TelefonoSecundario'],
                    'email' => $proveedor['Email'],
                    'sitioWeb' => $proveedor['Sitio_Web'],
                    'personaContacto' => $proveedor['PersonaContacto'],
                    'direccion' => $proveedor['Direccion'],
                    'ciudad' => $proveedor['Ciudad'],
                    'distrito' => $proveedor['Distrito'],
                    'tiempoEntrega' => (int)$proveedor['TiempoEntrega'],
                    'montoMinimo' => (float)$proveedor['MontoMinimo'],
                    'descuento' => (float)$proveedor['Descuento'],
                    'nota' => $proveedor['Nota'],
                    'fechaCreacion' => $proveedor['FechaCreacion'],
                    'fechaActualizacion' => $proveedor['FechaActualizacion'],
                ];
            }, $proveedores);

            $this->json([
                'exito' => true,
                'proveedores' => $proveedoresFormateados,
                'total' => count($proveedoresFormateados),
            ]);
        } catch (Throwable $e) {
            file_put_contents(__DIR__ . '/../../debug_listar.log', 
                date('Y-m-d H:i:s') . " - ERROR: " . $e->getMessage() . "\n", 
                FILE_APPEND);
            $this->json(['exito' => false, 'mensaje' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Busca un proveedor por ID o documento
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

        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
        $numDoc = isset($_GET['numDoc']) ? trim($_GET['numDoc']) : null;

        if (!$id && !$numDoc) {
            $this->json(['exito' => false, 'mensaje' => 'Debe proporcionar un ID o número de documento'], 400);
            return;
        }

        $model = new Proveedor();
        try {
            $proveedor = $id ? $model->buscarPorId($id) : $model->buscarPorDocumento($numDoc);

            if (!$proveedor) {
                $this->json(['exito' => false, 'mensaje' => 'Proveedor no encontrado'], 404);
                return;
            }

            $this->json([
                'exito' => true,
                'proveedor' => [
                    'codProveedor' => (int)$proveedor['CodProveedor'],
                    'tipoDoc' => $proveedor['TipoDoc'],
                    'numDoc' => $proveedor['NumDoc'],
                    'razonSocial' => $proveedor['RazonSocial'],
                    'nombreComercial' => $proveedor['NombreComercial'],
                    'categoria' => $proveedor['Categoria'],
                    'estado' => $proveedor['Estado'],
                    'telefono' => $proveedor['Telefono'],
                    'telefonoSecundario' => $proveedor['TelefonoSecundario'],
                    'email' => $proveedor['Email'],
                    'sitioWeb' => $proveedor['Sitio_Web'],
                    'personaContacto' => $proveedor['PersonaContacto'],
                    'direccion' => $proveedor['Direccion'],
                    'ciudad' => $proveedor['Ciudad'],
                    'distrito' => $proveedor['Distrito'],
                    'tiempoEntrega' => (int)$proveedor['TiempoEntrega'],
                    'montoMinimo' => (float)$proveedor['MontoMinimo'],
                    'descuento' => (float)$proveedor['Descuento'],
                    'nota' => $proveedor['Nota'],
                ],
            ]);
        } catch (Throwable $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error al buscar proveedor'], 500);
        }
    }

    /**
     * Actualiza un proveedor existente
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

        $codProveedor = isset($input['codProveedor']) ? (int)$input['codProveedor'] : null;

        if (!$codProveedor) {
            $this->json(['exito' => false, 'mensaje' => 'El código del proveedor es obligatorio'], 400);
            return;
        }

        // Validar campos (igual que en registrar)
        $tipoDoc = trim($input['tipoDoc'] ?? '');
        $numDoc = trim($input['numDoc'] ?? '');
        $razonSocial = trim($input['razonSocial'] ?? '');
        $categoria = trim($input['categoria'] ?? '');
        $telefono = trim($input['telefono'] ?? '');
        $email = trim($input['email'] ?? '');
        $personaContacto = trim($input['personaContacto'] ?? '');
        $direccion = trim($input['direccion'] ?? '');

        if (!$tipoDoc || !$numDoc || !$razonSocial || !$categoria || !$telefono || !$email || !$personaContacto || !$direccion) {
            $this->json(['exito' => false, 'mensaje' => 'Todos los campos obligatorios deben estar completos'], 400);
            return;
        }

        $model = new Proveedor();
        try {
            $resultado = $model->actualizar($codProveedor, [
                'tipoDoc' => $tipoDoc,
                'numDoc' => $numDoc,
                'razonSocial' => $razonSocial,
                'nombreComercial' => $input['nombreComercial'] ?? null,
                'categoria' => $categoria,
                'telefono' => $telefono,
                'telefonoSecundario' => $input['telefonoSecundario'] ?? null,
                'email' => $email,
                'sitioWeb' => $input['sitioWeb'] ?? null,
                'personaContacto' => $personaContacto,
                'direccion' => $direccion,
                'ciudad' => $input['ciudad'] ?? null,
                'distrito' => $input['distrito'] ?? null,
                'tiempoEntrega' => isset($input['tiempoEntrega']) ? (int)$input['tiempoEntrega'] : 0,
                'montoMinimo' => isset($input['montoMinimo']) ? (float)$input['montoMinimo'] : 0.00,
                'descuento' => isset($input['descuento']) ? (float)$input['descuento'] : 0.00,
                'nota' => $input['nota'] ?? null,
                'estado' => $input['estado'] ?? 'activo',
            ]);

            if ($resultado) {
                $this->json([
                    'exito' => true,
                    'mensaje' => 'Proveedor actualizado exitosamente',
                    'razonSocial' => $razonSocial,
                ]);
            } else {
                $this->json(['exito' => false, 'mensaje' => 'No se pudo actualizar el proveedor'], 500);
            }
        } catch (Throwable $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Elimina un proveedor
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

        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;

        if (!$id) {
            $this->json(['exito' => false, 'mensaje' => 'El ID del proveedor es obligatorio'], 400);
            return;
        }

        $model = new Proveedor();
        try {
            $resultado = $model->eliminar($id);

            if ($resultado) {
                $this->json([
                    'exito' => true,
                    'mensaje' => 'Proveedor eliminado exitosamente',
                ]);
            } else {
                $this->json(['exito' => false, 'mensaje' => 'No se pudo eliminar el proveedor'], 500);
            }
        } catch (Throwable $e) {
            $this->json(['exito' => false, 'mensaje' => $e->getMessage()], 400);
        }
    }
}
