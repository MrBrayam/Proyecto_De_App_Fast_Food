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
        
        error_log("Registrando detalle de pedido: " . json_encode([
            'idPedido' => $idPedido,
            'detalle' => $detalle
        ]));
        
        try {
            // Registrar el detalle del pedido
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
            
            // Cerrar cursor del stored procedure
            $stmt->closeCursor();
            
            // Debug: mostrar idPlato recibido
            error_log("IdPlato recibido: " . ($detalle['idPlato'] ?? 'NULL') . " (tipo: " . gettype($detalle['idPlato'] ?? null) . ")");
            
            // Si el detalle tiene un plato (IdPlato), descontar del stock
            if (!empty($detalle['idPlato']) && intval($detalle['idPlato']) > 0) {
                $cantidad = intval($detalle['cantidad'] ?? 0);
                
                if ($cantidad > 0) {
                    // Verificar stock disponible
                    $stmtStock = $db->prepare('SELECT Cantidad FROM Platos WHERE IdPlato = ?');
                    $stmtStock->execute([$detalle['idPlato']]);
                    $plato = $stmtStock->fetch(PDO::FETCH_ASSOC);
                    
                    if ($plato) {
                        $stockActual = intval($plato['Cantidad']);
                        
                        if ($stockActual >= $cantidad) {
                            // Descontar del stock
                            $stmtUpdate = $db->prepare('UPDATE Platos SET Cantidad = Cantidad - ? WHERE IdPlato = ?');
                            $stmtUpdate->execute([$cantidad, $detalle['idPlato']]);
                            
                            error_log("Stock descontado: Plato ID {$detalle['idPlato']}, Cantidad: {$cantidad}");
                        } else {
                            // Stock insuficiente
                            error_log("Stock insuficiente para plato ID {$detalle['idPlato']}. Disponible: {$stockActual}, Solicitado: {$cantidad}");
                            // Retornar el resultado del stored procedure pero con advertencia de stock
                            if ($result && isset($result['resultado'])) {
                                $resultData = json_decode($result['resultado'], true);
                                $resultData['advertencia'] = 'Stock insuficiente, pedido registrado pero stock no descontado';
                                return $resultData;
                            }
                        }
                    }
                }
            }
            
            error_log("Resultado de registrar detalle: " . json_encode($result));
            
            if ($result && isset($result['resultado'])) {
                return json_decode($result['resultado'], true);
            }

            return null;
            
        } catch (Exception $e) {
            error_log("Error al registrar detalle de pedido: " . $e->getMessage());
            throw $e;
        }
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

    public function listarPorCliente(int $idCliente)
    {
        $db = Database::connection();
        
        try {
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
                    WHERE IdCliente = ' . intval($idCliente) . '
                    ORDER BY FechaPedido DESC';
            
            $stmt = $db->query($sql);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return $rows;
        } catch (Exception $e) {
            error_log('Error en listarPorCliente: ' . $e->getMessage());
            return [];
        }
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
