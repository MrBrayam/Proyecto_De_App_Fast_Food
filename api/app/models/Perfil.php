<?php
class Perfil
{
    public function registrar(array $data): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'CALL pa_registrar_perfil(
                :nombrePerfil, :descripcion, :nivelAcceso, :estado,
                :ventasRegistrar, :ventasVisualizar, :ventasModificar, :ventasEliminar,
                :comprasRegistrar, :comprasVisualizar, :comprasInventario,
                :usuariosRegistrar, :usuariosVisualizar, :usuariosModificar, :usuariosEliminar,
                :reportesVentas, :reportesCompras, :reportesFinancieros,
                :clientes, :proveedores, :perfiles, :accesoCompleto
            )'
        );

        $stmt->bindValue(':nombrePerfil', $data['nombrePerfil'], PDO::PARAM_STR);
        $stmt->bindValue(':descripcion', $data['descripcion'], $data['descripcion'] === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindValue(':nivelAcceso', $data['nivelAcceso'], PDO::PARAM_STR);
        $stmt->bindValue(':estado', $data['estado'], PDO::PARAM_STR);
        $stmt->bindValue(':ventasRegistrar', $data['ventasRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':ventasVisualizar', $data['ventasVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':ventasModificar', $data['ventasModificar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':ventasEliminar', $data['ventasEliminar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':comprasRegistrar', $data['comprasRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':comprasVisualizar', $data['comprasVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':comprasInventario', $data['comprasInventario'], PDO::PARAM_BOOL);
        $stmt->bindValue(':usuariosRegistrar', $data['usuariosRegistrar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':usuariosVisualizar', $data['usuariosVisualizar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':usuariosModificar', $data['usuariosModificar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':usuariosEliminar', $data['usuariosEliminar'], PDO::PARAM_BOOL);
        $stmt->bindValue(':reportesVentas', $data['reportesVentas'], PDO::PARAM_BOOL);
        $stmt->bindValue(':reportesCompras', $data['reportesCompras'], PDO::PARAM_BOOL);
        $stmt->bindValue(':reportesFinancieros', $data['reportesFinancieros'], PDO::PARAM_BOOL);
        $stmt->bindValue(':clientes', $data['clientes'], PDO::PARAM_BOOL);
        $stmt->bindValue(':proveedores', $data['proveedores'], PDO::PARAM_BOOL);
        $stmt->bindValue(':perfiles', $data['perfiles'], PDO::PARAM_BOOL);
        $stmt->bindValue(':accesoCompleto', $data['accesoCompleto'], PDO::PARAM_BOOL);

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
}
