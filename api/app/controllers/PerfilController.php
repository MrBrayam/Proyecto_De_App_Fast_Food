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

        $ventasRegistrar = (bool)($permisos['ventasRegistrar'] ?? false);
        $ventasVisualizar = (bool)($permisos['ventasVisualizar'] ?? false);
        $ventasModificar = (bool)($permisos['ventasModificar'] ?? false);
        $ventasEliminar = (bool)($permisos['ventasEliminar'] ?? false);
        $comprasRegistrar = (bool)($permisos['comprasRegistrar'] ?? false);
        $comprasVisualizar = (bool)($permisos['comprasVisualizar'] ?? false);
        $comprasInventario = (bool)($permisos['comprasInventario'] ?? false);
        $usuariosRegistrar = (bool)($permisos['usuariosRegistrar'] ?? false);
        $usuariosVisualizar = (bool)($permisos['usuariosVisualizar'] ?? false);
        $usuariosModificar = (bool)($permisos['usuariosModificar'] ?? false);
        $usuariosEliminar = (bool)($permisos['usuariosEliminar'] ?? false);
        $reportesVentas = (bool)($permisos['reportesVentas'] ?? false);
        $reportesCompras = (bool)($permisos['reportesCompras'] ?? false);
        $reportesFinancieros = (bool)($permisos['reportesFinancieros'] ?? false);
        $clientes = (bool)($permisos['clientes'] ?? false);
        $proveedores = (bool)($permisos['proveedores'] ?? false);
        $perfilesGestionar = (bool)($permisos['perfiles'] ?? false);
        $accesoCompleto = (bool)($permisos['accesoCompleto'] ?? false);

        $model = new Perfil();
        try {
            $result = $model->registrar([
                'nombrePerfil' => $nombrePerfil,
                'descripcion' => $descripcion,
                'nivelAcceso' => $nivelAcceso,
                'estado' => $estado,
                'ventasRegistrar' => $ventasRegistrar,
                'ventasVisualizar' => $ventasVisualizar,
                'ventasModificar' => $ventasModificar,
                'ventasEliminar' => $ventasEliminar,
                'comprasRegistrar' => $comprasRegistrar,
                'comprasVisualizar' => $comprasVisualizar,
                'comprasInventario' => $comprasInventario,
                'usuariosRegistrar' => $usuariosRegistrar,
                'usuariosVisualizar' => $usuariosVisualizar,
                'usuariosModificar' => $usuariosModificar,
                'usuariosEliminar' => $usuariosEliminar,
                'reportesVentas' => $reportesVentas,
                'reportesCompras' => $reportesCompras,
                'reportesFinancieros' => $reportesFinancieros,
                'clientes' => $clientes,
                'proveedores' => $proveedores,
                'perfiles' => $perfilesGestionar,
                'accesoCompleto' => $accesoCompleto,
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
                        'ventasRegistrar' => (bool)$perfil['PermisoVentasRegistrar'],
                        'ventasVisualizar' => (bool)$perfil['PermisoVentasVisualizar'],
                        'ventasModificar' => (bool)$perfil['PermisoVentasModificar'],
                        'ventasEliminar' => (bool)$perfil['PermisoVentasEliminar'],
                        'comprasRegistrar' => (bool)$perfil['PermisoComprasRegistrar'],
                        'comprasVisualizar' => (bool)$perfil['PermisoComprasVisualizar'],
                        'comprasInventario' => (bool)$perfil['PermisoComprasInventario'],
                        'usuariosRegistrar' => (bool)$perfil['PermisoUsuariosRegistrar'],
                        'usuariosVisualizar' => (bool)$perfil['PermisoUsuariosVisualizar'],
                        'usuariosModificar' => (bool)$perfil['PermisoUsuariosModificar'],
                        'usuariosEliminar' => (bool)$perfil['PermisoUsuariosEliminar'],
                        'reportesVentas' => (bool)$perfil['PermisoReportesVentas'],
                        'reportesCompras' => (bool)$perfil['PermisoReportesCompras'],
                        'reportesFinancieros' => (bool)$perfil['PermisoReportesFinancieros'],
                        'clientes' => (bool)$perfil['PermisoClientes'],
                        'proveedores' => (bool)$perfil['PermisoProveedores'],
                        'perfiles' => (bool)$perfil['PermisoPerfiles'],
                        'accesoCompleto' => (bool)$perfil['AccesoCompleto'],
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
}
