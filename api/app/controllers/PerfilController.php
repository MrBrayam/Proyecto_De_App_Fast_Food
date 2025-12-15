<?php
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../models/Perfil.php';

class PerfilController extends Controller
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

        $nombrePerfil = trim($input['nombrePerfil'] ?? '');
        $descripcion = isset($input['descripcion']) && $input['descripcion'] !== '' ? trim($input['descripcion']) : null;
        $nivelAcceso = trim($input['nivelAcceso'] ?? '');
        $estado = trim($input['estado'] ?? 'activo');

        if ($nombrePerfil === '') {
            $this->json(['exito' => false, 'mensaje' => 'El nombre del perfil es obligatorio'], 400);
            return;
        }

        if (!in_array($nivelAcceso, ['1', '2', '3', '4'])) {
            $this->json(['exito' => false, 'mensaje' => 'Nivel de acceso inválido'], 400);
            return;
        }

        if (!in_array($estado, ['activo', 'inactivo'])) {
            $this->json(['exito' => false, 'mensaje' => 'Estado inválido'], 400);
            return;
        }

        $permisos = is_array($input['permisos'] ?? null) ? $input['permisos'] : [];

        // Ventas
        $ventasRegistrar = (bool)($permisos['ventasRegistrar'] ?? false);
        $ventasVisualizar = (bool)($permisos['ventasVisualizar'] ?? false);
        $promocionesRegistrar = (bool)($permisos['promocionesRegistrar'] ?? false);
        $promocionesVisualizar = (bool)($permisos['promocionesVisualizar'] ?? false);
        $mesasRegistrar = (bool)($permisos['mesasRegistrar'] ?? false);
        $mesasVisualizar = (bool)($permisos['mesasVisualizar'] ?? false);
        $pedidosRegistrar = (bool)($permisos['pedidosRegistrar'] ?? false);
        $pedidosVisualizar = (bool)($permisos['pedidosVisualizar'] ?? false);
        $cajaApertura = (bool)($permisos['cajaApertura'] ?? false);
        $cajaVisualizar = (bool)($permisos['cajaVisualizar'] ?? false);
        $cajaCerrar = (bool)($permisos['cajaCerrar'] ?? false);
        // Compras
        $comprasRegistrar = (bool)($permisos['comprasRegistrar'] ?? false);
        $comprasVisualizar = (bool)($permisos['comprasVisualizar'] ?? false);
        $inventarioVisualizar = (bool)($permisos['inventarioVisualizar'] ?? false);
        $proveedoresRegistrar = (bool)($permisos['proveedoresRegistrar'] ?? false);
        $proveedoresVisualizar = (bool)($permisos['proveedoresVisualizar'] ?? false);
        $productoRegistrar = (bool)($permisos['productoRegistrar'] ?? false);
        $productoVisualizar = (bool)($permisos['productoVisualizar'] ?? false);
        // Usuarios
        $usuariosRegistrar = (bool)($permisos['usuariosRegistrar'] ?? false);
        $usuariosVisualizar = (bool)($permisos['usuariosVisualizar'] ?? false);
        // Clientes
        $clientesRegistrar = (bool)($permisos['clientesRegistrar'] ?? false);
        $clientesVisualizar = (bool)($permisos['clientesVisualizar'] ?? false);
        // Reportes
        $reportes = (bool)($permisos['reportes'] ?? false);
        // Seguridad
        $seguridadUsuariosRegistrar = (bool)($permisos['seguridadUsuariosRegistrar'] ?? false);
        $seguridadUsuariosVisualizar = (bool)($permisos['seguridadUsuariosVisualizar'] ?? false);
        $perfilesRegistrar = (bool)($permisos['perfilesRegistrar'] ?? false);
        $perfilesVisualizar = (bool)($permisos['perfilesVisualizar'] ?? false);

        $model = new Perfil();
        try {
            $result = $model->registrar([
                'nombrePerfil' => $nombrePerfil,
                'descripcion' => $descripcion,
                'nivelAcceso' => $nivelAcceso,
                'estado' => $estado,
                'ventasRegistrar' => $ventasRegistrar,
                'ventasVisualizar' => $ventasVisualizar,
                'promocionesRegistrar' => $promocionesRegistrar,
                'promocionesVisualizar' => $promocionesVisualizar,
                'mesasRegistrar' => $mesasRegistrar,
                'mesasVisualizar' => $mesasVisualizar,
                'pedidosRegistrar' => $pedidosRegistrar,
                'pedidosVisualizar' => $pedidosVisualizar,
                'cajaApertura' => $cajaApertura,
                'cajaVisualizar' => $cajaVisualizar,
                'cajaCerrar' => $cajaCerrar,
                'comprasRegistrar' => $comprasRegistrar,
                'comprasVisualizar' => $comprasVisualizar,
                'inventarioVisualizar' => $inventarioVisualizar,
                'proveedoresRegistrar' => $proveedoresRegistrar,
                'proveedoresVisualizar' => $proveedoresVisualizar,
                'productoRegistrar' => $productoRegistrar,
                'productoVisualizar' => $productoVisualizar,
                'usuariosRegistrar' => $usuariosRegistrar,
                'usuariosVisualizar' => $usuariosVisualizar,
                'clientesRegistrar' => $clientesRegistrar,
                'clientesVisualizar' => $clientesVisualizar,
                'reportes' => $reportes,
                'seguridadUsuariosRegistrar' => $seguridadUsuariosRegistrar,
                'seguridadUsuariosVisualizar' => $seguridadUsuariosVisualizar,
                'perfilesRegistrar' => $perfilesRegistrar,
                'perfilesVisualizar' => $perfilesVisualizar,
            ]);
        } catch (Throwable $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error en la base de datos: ' . $e->getMessage()], 500);
            return;
        }

        $idPerfil = isset($result['IdPerfil']) ? (int)$result['IdPerfil'] : null;
        $this->json([
            'exito' => true,
            'mensaje' => 'Perfil registrado exitosamente',
            'idPerfil' => $idPerfil,
        ], 201);
    }

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

        $model = new Perfil();
        try {
            $perfiles = $model->listar();
            $perfilesFormateados = [];
            
            foreach ($perfiles as $perfil) {
                $perfilesFormateados[] = [
                    'idPerfil' => (int)$perfil['IdPerfil'],
                    'nombrePerfil' => $perfil['NombrePerfil'],
                    'descripcion' => $perfil['Descripcion'],
                    'nivelAcceso' => $perfil['NivelAcceso'],
                    'estado' => $perfil['Estado'],
                    'permisos' => [
                        // Ventas
                        'ventasRegistrar' => (bool)$perfil['PermisoVentasRegistrar'],
                        'ventasVisualizar' => (bool)$perfil['PermisoVentasVisualizar'],
                        'promocionesRegistrar' => (bool)$perfil['PermisoPromocionesRegistrar'],
                        'promocionesVisualizar' => (bool)$perfil['PermisoPromocionesVisualizar'],
                        'mesasRegistrar' => (bool)$perfil['PermisoMesasRegistrar'],
                        'mesasVisualizar' => (bool)$perfil['PermisoMesasVisualizar'],
                        'pedidosRegistrar' => (bool)$perfil['PermisoPedidosRegistrar'],
                        'pedidosVisualizar' => (bool)$perfil['PermisoPedidosVisualizar'],
                        'cajaApertura' => (bool)$perfil['PermisoCajaApertura'],
                        'cajaVisualizar' => (bool)$perfil['PermisoCajaVisualizar'],
                        'cajaCerrar' => (bool)$perfil['PermisoCajaCerrar'],
                        // Compras
                        'comprasRegistrar' => (bool)$perfil['PermisoComprasRegistrar'],
                        'comprasVisualizar' => (bool)$perfil['PermisoComprasVisualizar'],
                        'inventarioVisualizar' => (bool)$perfil['PermisoInventarioVisualizar'],
                        'proveedoresRegistrar' => (bool)$perfil['PermisoProveedoresRegistrar'],
                        'proveedoresVisualizar' => (bool)$perfil['PermisoProveedoresVisualizar'],
                        'productoRegistrar' => (bool)$perfil['PermisoProductoRegistrar'],
                        'productoVisualizar' => (bool)$perfil['PermisoProductoVisualizar'],
                        // Usuarios
                        'usuariosRegistrar' => (bool)$perfil['PermisoUsuariosRegistrar'],
                        'usuariosVisualizar' => (bool)$perfil['PermisoUsuariosVisualizar'],
                        // Clientes
                        'clientesRegistrar' => (bool)$perfil['PermisoClientesRegistrar'],
                        'clientesVisualizar' => (bool)$perfil['PermisoClientesVisualizar'],
                        // Reportes
                        'reportes' => (bool)$perfil['PermisoReportes'],
                        // Seguridad
                        'seguridadUsuariosRegistrar' => (bool)$perfil['PermisoSeguridadUsuariosRegistrar'],
                        'seguridadUsuariosVisualizar' => (bool)$perfil['PermisoSeguridadUsuariosVisualizar'],
                        'perfilesRegistrar' => (bool)$perfil['PermisoPerfilesRegistrar'],
                        'perfilesVisualizar' => (bool)$perfil['PermisoPerfilesVisualizar'],
                    ],
                    'fechaCreacion' => $perfil['FechaCreacion'],
                    'fechaActualizacion' => $perfil['FechaActualizacion'],
                ];
            }

            $this->json([
                'exito' => true,
                'perfiles' => $perfilesFormateados,
                'total' => count($perfilesFormateados),
            ]);
        } catch (Throwable $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error en la base de datos'], 500);
        }
    }

    public function buscar(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        $id = $_GET['id'] ?? null;

        if (!$id) {
            $this->json(['exito' => false, 'mensaje' => 'ID no proporcionado'], 400);
            return;
        }

        $model = new Perfil();
        try {
            $perfil = $model->buscar((int)$id);
            
            if (!$perfil) {
                $this->json(['exito' => false, 'mensaje' => 'Perfil no encontrado'], 404);
                return;
            }

            $perfilFormateado = [
                'idPerfil' => (int)$perfil['IdPerfil'],
                'nombrePerfil' => $perfil['NombrePerfil'],
                'descripcion' => $perfil['Descripcion'],
                'nivelAcceso' => $perfil['NivelAcceso'],
                'estado' => $perfil['Estado'],
                'permisos' => [
                    // Ventas
                    'ventasRegistrar' => (bool)$perfil['PermisoVentasRegistrar'],
                    'ventasVisualizar' => (bool)$perfil['PermisoVentasVisualizar'],
                    'promocionesRegistrar' => (bool)$perfil['PermisoPromocionesRegistrar'],
                    'promocionesVisualizar' => (bool)$perfil['PermisoPromocionesVisualizar'],
                    'mesasRegistrar' => (bool)$perfil['PermisoMesasRegistrar'],
                    'mesasVisualizar' => (bool)$perfil['PermisoMesasVisualizar'],
                    'pedidosRegistrar' => (bool)$perfil['PermisoPedidosRegistrar'],
                    'pedidosVisualizar' => (bool)$perfil['PermisoPedidosVisualizar'],
                    'cajaApertura' => (bool)$perfil['PermisoCajaApertura'],
                    'cajaVisualizar' => (bool)$perfil['PermisoCajaVisualizar'],
                    'cajaCerrar' => (bool)$perfil['PermisoCajaCerrar'],
                    // Compras
                    'comprasRegistrar' => (bool)$perfil['PermisoComprasRegistrar'],
                    'comprasVisualizar' => (bool)$perfil['PermisoComprasVisualizar'],
                    'inventarioVisualizar' => (bool)$perfil['PermisoInventarioVisualizar'],
                    'proveedoresRegistrar' => (bool)$perfil['PermisoProveedoresRegistrar'],
                    'proveedoresVisualizar' => (bool)$perfil['PermisoProveedoresVisualizar'],
                    'productoRegistrar' => (bool)$perfil['PermisoProductoRegistrar'],
                    'productoVisualizar' => (bool)$perfil['PermisoProductoVisualizar'],
                    // Usuarios
                    'usuariosRegistrar' => (bool)$perfil['PermisoUsuariosRegistrar'],
                    'usuariosVisualizar' => (bool)$perfil['PermisoUsuariosVisualizar'],
                    // Clientes
                    'clientesRegistrar' => (bool)$perfil['PermisoClientesRegistrar'],
                    'clientesVisualizar' => (bool)$perfil['PermisoClientesVisualizar'],
                    // Reportes
                    'reportes' => (bool)$perfil['PermisoReportes'],
                    // Seguridad
                    'seguridadUsuariosRegistrar' => (bool)$perfil['PermisoSeguridadUsuariosRegistrar'],
                    'seguridadUsuariosVisualizar' => (bool)$perfil['PermisoSeguridadUsuariosVisualizar'],
                    'perfilesRegistrar' => (bool)$perfil['PermisoPerfilesRegistrar'],
                    'perfilesVisualizar' => (bool)$perfil['PermisoPerfilesVisualizar'],
                ],
                'fechaCreacion' => $perfil['FechaCreacion'],
                'fechaActualizacion' => $perfil['FechaActualizacion'],
            ];

            $this->json(['exito' => true, 'perfil' => $perfilFormateado]);
        } catch (Throwable $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error en la base de datos: ' . $e->getMessage()], 500);
        }
    }

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
        $id = $input['idPerfil'] ?? null;

        if (!$id) {
            $this->json(['exito' => false, 'mensaje' => 'ID del perfil no proporcionado'], 400);
            return;
        }

        $nombrePerfil = trim($input['nombrePerfil'] ?? '');
        $descripcion = isset($input['descripcion']) && $input['descripcion'] !== '' ? trim($input['descripcion']) : null;
        $nivelAcceso = trim($input['nivelAcceso'] ?? '');
        $estado = trim($input['estado'] ?? 'activo');

        if ($nombrePerfil === '') {
            $this->json(['exito' => false, 'mensaje' => 'El nombre del perfil es obligatorio'], 400);
            return;
        }

        if (!in_array($nivelAcceso, ['1', '2', '3', '4'])) {
            $this->json(['exito' => false, 'mensaje' => 'Nivel de acceso inválido'], 400);
            return;
        }

        if (!in_array($estado, ['activo', 'inactivo'])) {
            $this->json(['exito' => false, 'mensaje' => 'Estado inválido'], 400);
            return;
        }

        $permisos = is_array($input['permisos'] ?? null) ? $input['permisos'] : [];

        $model = new Perfil();
        try {
            $result = $model->actualizar((int)$id, [
                'nombrePerfil' => $nombrePerfil,
                'descripcion' => $descripcion,
                'nivelAcceso' => $nivelAcceso,
                'estado' => $estado,
                // Ventas
                'ventasRegistrar' => (bool)($permisos['ventasRegistrar'] ?? false),
                'ventasVisualizar' => (bool)($permisos['ventasVisualizar'] ?? false),
                'promocionesRegistrar' => (bool)($permisos['promocionesRegistrar'] ?? false),
                'promocionesVisualizar' => (bool)($permisos['promocionesVisualizar'] ?? false),
                'mesasRegistrar' => (bool)($permisos['mesasRegistrar'] ?? false),
                'mesasVisualizar' => (bool)($permisos['mesasVisualizar'] ?? false),
                'pedidosRegistrar' => (bool)($permisos['pedidosRegistrar'] ?? false),
                'pedidosVisualizar' => (bool)($permisos['pedidosVisualizar'] ?? false),
                'cajaApertura' => (bool)($permisos['cajaApertura'] ?? false),
                'cajaVisualizar' => (bool)($permisos['cajaVisualizar'] ?? false),
                'cajaCerrar' => (bool)($permisos['cajaCerrar'] ?? false),
                // Compras
                'comprasRegistrar' => (bool)($permisos['comprasRegistrar'] ?? false),
                'comprasVisualizar' => (bool)($permisos['comprasVisualizar'] ?? false),
                'inventarioVisualizar' => (bool)($permisos['inventarioVisualizar'] ?? false),
                'proveedoresRegistrar' => (bool)($permisos['proveedoresRegistrar'] ?? false),
                'proveedoresVisualizar' => (bool)($permisos['proveedoresVisualizar'] ?? false),
                'productoRegistrar' => (bool)($permisos['productoRegistrar'] ?? false),
                'productoVisualizar' => (bool)($permisos['productoVisualizar'] ?? false),
                // Usuarios
                'usuariosRegistrar' => (bool)($permisos['usuariosRegistrar'] ?? false),
                'usuariosVisualizar' => (bool)($permisos['usuariosVisualizar'] ?? false),
                // Clientes
                'clientesRegistrar' => (bool)($permisos['clientesRegistrar'] ?? false),
                'clientesVisualizar' => (bool)($permisos['clientesVisualizar'] ?? false),
                // Reportes
                'reportes' => (bool)($permisos['reportes'] ?? false),
                // Seguridad
                'seguridadUsuariosRegistrar' => (bool)($permisos['seguridadUsuariosRegistrar'] ?? false),
                'seguridadUsuariosVisualizar' => (bool)($permisos['seguridadUsuariosVisualizar'] ?? false),
                'perfilesRegistrar' => (bool)($permisos['perfilesRegistrar'] ?? false),
                'perfilesVisualizar' => (bool)($permisos['perfilesVisualizar'] ?? false),
            ]);

            $this->json(['exito' => true, 'mensaje' => 'Perfil actualizado exitosamente']);
        } catch (Throwable $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error en la base de datos: ' . $e->getMessage()], 500);
        }
    }

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

        $id = $_GET['id'] ?? null;

        if (!$id) {
            $this->json(['exito' => false, 'mensaje' => 'ID no proporcionado'], 400);
            return;
        }

        $model = new Perfil();
        try {
            $result = $model->eliminar((int)$id);
            
            if ($result) {
                $this->json(['exito' => true, 'mensaje' => 'Perfil eliminado exitosamente']);
            } else {
                $this->json(['exito' => false, 'mensaje' => 'No se pudo eliminar el perfil'], 400);
            }
        } catch (Exception $e) {
            $this->json(['exito' => false, 'mensaje' => $e->getMessage()], 400);
        } catch (Throwable $e) {
            $this->json(['exito' => false, 'mensaje' => 'Error en la base de datos: ' . $e->getMessage()], 500);
        }
    }
}

