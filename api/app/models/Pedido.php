<?php
require_once __DIR__ . '/../core/Database.php';

class Pedido
{
    /**
     * Registrar pedido usando PA
     */
    public function registrar(array $data)
    {
        $db = Database::connection();
        $stmt = $db->prepare('CALL pa_registrar_pedido(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

        $stmt->execute([
            $data['numDocumentos'] ?? null,
            $data['tipoServicio'] ?? null,
            $data['numMesa'] ?? null,
            $data['idCliente'] ?? null,
            $data['nombreCliente'] ?? null,
            $data['direccionCliente'] ?? null,
            $data['telefonoCliente'] ?? null,
            $data['idUsuario'] ?? null,
            $data['subTotal'] ?? 0,
            $data['descuento'] ?? 0,
            $data['total'] ?? 0,
            $data['estado'] ?? 'pendiente',
            $data['observaciones'] ?? null
        ]);

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Cerrar todos los result sets del stored procedure
        while ($stmt->nextRowset()) {}

        if ($result && isset($result['resultado'])) {
            return json_decode($result['resultado'], true);
        }

        return null;
    }

    /**
     * Registrar detalle de pedido usando PA
     */
    public function registrarDetalle(int $idPedido, array $detalle)
    {
        $db = Database::connection();
        $stmt = $db->prepare('CALL pa_registrar_detalle_pedido(?, ?, ?, ?, ?, ?, ?)');
        
        $stmt->execute([
            $idPedido,
            $detalle['idProducto'] ?? null,
            $detalle['idPlato'] ?? null,
            $detalle['codProducto'] ?? null,
            $detalle['descripcionProducto'] ?? null,
            $detalle['cantidad'] ?? 0,
            $detalle['precioUnitario'] ?? 0
        ]);

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Cerrar todos los result sets del stored procedure
        while ($stmt->nextRowset()) {}        if ($result && isset($result['resultado'])) {
            return json_decode($result['resultado'], true);
        }

        return null;
    }

    public function listar()
    {
        $db = Database::connection();
        $stmt = $db->prepare('CALL pa_listar_pedidos()');
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        while ($stmt->nextRowset()) {}
        return $rows;
    }

    public function buscarPorId(int $idPedido)
    {
        $db = Database::connection();
        
        try {
            // Obtener el pedido directamente de la tabla
            $sql = 'SELECT 
                        IdPedido,
                        NumDocumentos,
                        TipoServicio,
                        NumMesa,
                        IdCliente,
                        NombreCliente,
                        DireccionCliente,
                        TelefonoCliente,
                        IdUsuario,
                        SubTotal,
                        Descuento,
                        Total,
                        Estado,
                        FechaPedido,
                        Observaciones
                    FROM Pedidos
                    WHERE IdPedido = ' . intval($idPedido);
            
            $stmt = $db->query($sql);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$row) {
                return null;
            }
            
            // Obtener detalles
            $sqlDetalles = 'SELECT 
                        IdDetalle,
                        IdPedido,
                        IdProducto,
                        IdPlato,
                        CodProducto,
                        DescripcionProducto,
                        Cantidad,
                        PrecioUnitario,
                        Subtotal
                    FROM DetallePedido
                    WHERE IdPedido = ' . intval($idPedido) . '
                    ORDER BY IdDetalle ASC';
            
            $stmtDetalles = $db->query($sqlDetalles);
            $detalles = $stmtDetalles->fetchAll(PDO::FETCH_ASSOC);
            
            $row['Detalles'] = is_array($detalles) ? $detalles : [];
            return $row;
        } catch (Exception $e) {
            error_log('Error en buscarPorId: ' . $e->getMessage());
            return null;
        }
    }

    public function actualizarEstado(int $idPedido, string $nuevoEstado)
    {
        $db = Database::connection();
        
        // Si el estado es "entregado", también establecer FechaEntrega
        if ($nuevoEstado === 'entregado') {
            $stmt = $db->prepare('
                UPDATE Pedidos 
                SET Estado = ?, FechaEntrega = NOW()
                WHERE IdPedido = ?
            ');
        } else {
            $stmt = $db->prepare('
                UPDATE Pedidos 
                SET Estado = ?
                WHERE IdPedido = ?
            ');
        }
        
        $stmt->execute([$nuevoEstado, $idPedido]);
        
        return $stmt->rowCount() > 0;
    }
}
