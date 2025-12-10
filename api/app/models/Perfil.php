<?php
class Perfil
{
    public function registrar(array $data): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'CALL pa_registrar_perfil(
                :nombrePerfil, :descripcion, :nivelAcceso, :estado,
                :ventasRegistrar, :ventasVisualizar,
                :promocionesRegistrar, :promocionesVisualizar,
                :mesasRegistrar, :mesasVisualizar,
                :pedidosRegistrar, :pedidosVisualizar,
                :cajaApertura, :cajaVisualizar, :cajaCerrar,
                :comprasRegistrar, :comprasVisualizar,
                :inventarioVisualizar, :insumoRegistrar,
                :proveedoresRegistrar, :proveedoresVisualizar,
                :productoRegistrar, :productoVisualizar,
                :usuariosRegistrar, :usuariosVisualizar,
                :clientesRegistrar, :clientesVisualizar,
                :reportes,
                :seguridadUsuariosRegistrar, :seguridadUsuariosVisualizar,
                :perfilesRegistrar, :perfilesVisualizar
            )'
        );

        $stmt->bindValue(':nombrePerfil', $data['nombrePerfil'], PDO::PARAM_STR);
        $stmt->bindValue(':descripcion', $data['descripcion'], $data['descripcion'] === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindValue(':nivelAcceso', $data['nivelAcceso'], PDO::PARAM_STR);
        $stmt->bindValue(':estado', $data['estado'], PDO::PARAM_STR);
        // Ventas
        $stmt->bindValue(':ventasRegistrar', $data['ventasRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':ventasVisualizar', $data['ventasVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':promocionesRegistrar', $data['promocionesRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':promocionesVisualizar', $data['promocionesVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':mesasRegistrar', $data['mesasRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':mesasVisualizar', $data['mesasVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':pedidosRegistrar', $data['pedidosRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':pedidosVisualizar', $data['pedidosVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':cajaApertura', $data['cajaApertura'], PDO::PARAM_BOOL);
        $stmt->bindValue(':cajaVisualizar', $data['cajaVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':cajaCerrar', $data['cajaCerrar'], PDO::PARAM_BOOL);
        // Compras
        $stmt->bindValue(':comprasRegistrar', $data['comprasRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':comprasVisualizar', $data['comprasVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':inventarioVisualizar', $data['inventarioVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':insumoRegistrar', $data['insumoRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':proveedoresRegistrar', $data['proveedoresRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':proveedoresVisualizar', $data['proveedoresVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':productoRegistrar', $data['productoRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':productoVisualizar', $data['productoVisualizar'], PDO::PARAM_BOOL);
        // Usuarios
        $stmt->bindValue(':usuariosRegistrar', $data['usuariosRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':usuariosVisualizar', $data['usuariosVisualizar'], PDO::PARAM_BOOL);
        // Clientes
        $stmt->bindValue(':clientesRegistrar', $data['clientesRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':clientesVisualizar', $data['clientesVisualizar'], PDO::PARAM_BOOL);
        // Reportes
        $stmt->bindValue(':reportes', $data['reportes'], PDO::PARAM_BOOL);
        // Seguridad
        $stmt->bindValue(':seguridadUsuariosRegistrar', $data['seguridadUsuariosRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':seguridadUsuariosVisualizar', $data['seguridadUsuariosVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':perfilesRegistrar', $data['perfilesRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':perfilesVisualizar', $data['perfilesVisualizar'], PDO::PARAM_BOOL);

        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
        while ($stmt->nextRowset()) { /* limpiar más resultsets */ }
        return $result;
    }

    public function listar(): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('CALL pa_listar_perfiles()');
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        while ($stmt->nextRowset()) { /* limpiar más resultsets */ }
        return $results;
    }

    public function buscar(int $id): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT IdPerfil, NombrePerfil, Descripcion, NivelAcceso, Estado,
                    PermisoVentasRegistrar, PermisoVentasVisualizar,
                    PermisoPromocionesRegistrar, PermisoPromocionesVisualizar,
                    PermisoMesasRegistrar, PermisoMesasVisualizar,
                    PermisoPedidosRegistrar, PermisoPedidosVisualizar,
                    PermisoCajaApertura, PermisoCajaVisualizar, PermisoCajaCerrar,
                    PermisoComprasRegistrar, PermisoComprasVisualizar,
                    PermisoInventarioVisualizar, PermisoInsumoRegistrar,
                    PermisoProveedoresRegistrar, PermisoProveedoresVisualizar,
                    PermisoProductoRegistrar, PermisoProductoVisualizar,
                    PermisoUsuariosRegistrar, PermisoUsuariosVisualizar,
                    PermisoClientesRegistrar, PermisoClientesVisualizar,
                    PermisoReportes,
                    PermisoSeguridadUsuariosRegistrar, PermisoSeguridadUsuariosVisualizar,
                    PermisoPerfilesRegistrar, PermisoPerfilesVisualizar,
                    FechaCreacion, FechaActualizacion
             FROM Perfiles
             WHERE IdPerfil = :id'
        );
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    public function actualizar(int $id, array $data): bool
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'UPDATE Perfiles SET
                NombrePerfil = :nombrePerfil,
                Descripcion = :descripcion,
                NivelAcceso = :nivelAcceso,
                Estado = :estado,
                PermisoVentasRegistrar = :ventasRegistrar,
                PermisoVentasVisualizar = :ventasVisualizar,
                PermisoPromocionesRegistrar = :promocionesRegistrar,
                PermisoPromocionesVisualizar = :promocionesVisualizar,
                PermisoMesasRegistrar = :mesasRegistrar,
                PermisoMesasVisualizar = :mesasVisualizar,
                PermisoPedidosRegistrar = :pedidosRegistrar,
                PermisoPedidosVisualizar = :pedidosVisualizar,
                PermisoCajaApertura = :cajaApertura,
                PermisoCajaVisualizar = :cajaVisualizar,
                PermisoCajaCerrar = :cajaCerrar,
                PermisoComprasRegistrar = :comprasRegistrar,
                PermisoComprasVisualizar = :comprasVisualizar,
                PermisoInventarioVisualizar = :inventarioVisualizar,
                PermisoInsumoRegistrar = :insumoRegistrar,
                PermisoProveedoresRegistrar = :proveedoresRegistrar,
                PermisoProveedoresVisualizar = :proveedoresVisualizar,
                PermisoProductoRegistrar = :productoRegistrar,
                PermisoProductoVisualizar = :productoVisualizar,
                PermisoUsuariosRegistrar = :usuariosRegistrar,
                PermisoUsuariosVisualizar = :usuariosVisualizar,
                PermisoClientesRegistrar = :clientesRegistrar,
                PermisoClientesVisualizar = :clientesVisualizar,
                PermisoReportes = :reportes,
                PermisoSeguridadUsuariosRegistrar = :seguridadUsuariosRegistrar,
                PermisoSeguridadUsuariosVisualizar = :seguridadUsuariosVisualizar,
                PermisoPerfilesRegistrar = :perfilesRegistrar,
                PermisoPerfilesVisualizar = :perfilesVisualizar
             WHERE IdPerfil = :id'
        );

        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':nombrePerfil', $data['nombrePerfil'], PDO::PARAM_STR);
        $stmt->bindValue(':descripcion', $data['descripcion'], $data['descripcion'] === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindValue(':nivelAcceso', $data['nivelAcceso'], PDO::PARAM_STR);
        $stmt->bindValue(':estado', $data['estado'], PDO::PARAM_STR);
        // Ventas
        $stmt->bindValue(':ventasRegistrar', $data['ventasRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':ventasVisualizar', $data['ventasVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':promocionesRegistrar', $data['promocionesRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':promocionesVisualizar', $data['promocionesVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':mesasRegistrar', $data['mesasRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':mesasVisualizar', $data['mesasVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':pedidosRegistrar', $data['pedidosRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':pedidosVisualizar', $data['pedidosVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':cajaApertura', $data['cajaApertura'], PDO::PARAM_BOOL);
        $stmt->bindValue(':cajaVisualizar', $data['cajaVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':cajaCerrar', $data['cajaCerrar'], PDO::PARAM_BOOL);
        // Compras
        $stmt->bindValue(':comprasRegistrar', $data['comprasRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':comprasVisualizar', $data['comprasVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':inventarioVisualizar', $data['inventarioVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':insumoRegistrar', $data['insumoRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':proveedoresRegistrar', $data['proveedoresRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':proveedoresVisualizar', $data['proveedoresVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':productoRegistrar', $data['productoRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':productoVisualizar', $data['productoVisualizar'], PDO::PARAM_BOOL);
        // Usuarios
        $stmt->bindValue(':usuariosRegistrar', $data['usuariosRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':usuariosVisualizar', $data['usuariosVisualizar'], PDO::PARAM_BOOL);
        // Clientes
        $stmt->bindValue(':clientesRegistrar', $data['clientesRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':clientesVisualizar', $data['clientesVisualizar'], PDO::PARAM_BOOL);
        // Reportes
        $stmt->bindValue(':reportes', $data['reportes'], PDO::PARAM_BOOL);
        // Seguridad
        $stmt->bindValue(':seguridadUsuariosRegistrar', $data['seguridadUsuariosRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':seguridadUsuariosVisualizar', $data['seguridadUsuariosVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':perfilesRegistrar', $data['perfilesRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':perfilesVisualizar', $data['perfilesVisualizar'], PDO::PARAM_BOOL);

        return $stmt->execute();
    }

    public function eliminar(int $id): bool
    {
        $pdo = Database::connection();
        
        // Verificar si hay usuarios usando este perfil
        $stmtCheck = $pdo->prepare('SELECT COUNT(*) as total FROM Usuarios WHERE IdPerfil = :id');
        $stmtCheck->bindValue(':id', $id, PDO::PARAM_INT);
        $stmtCheck->execute();
        $result = $stmtCheck->fetch(PDO::FETCH_ASSOC);
        
        if ($result['total'] > 0) {
            throw new Exception('No se puede eliminar el perfil porque hay ' . $result['total'] . ' usuario(s) asignado(s) a este perfil');
        }
        
        // Eliminar el perfil
        $stmt = $pdo->prepare('DELETE FROM Perfiles WHERE IdPerfil = :id');
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}

