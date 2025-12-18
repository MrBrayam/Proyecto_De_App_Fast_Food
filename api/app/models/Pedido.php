<?php
require_once __DIR__ . '/../core/Database.php';

class Pedido
{
    /**
     * Registrar pedido usando PA
     */
    public function registrar(array $data)
    {
        try {
            $db = Database::connection();
            $stmt = $db->prepare('CALL pa_registrar_pedido(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

            // Asegurar que el estado sea válido
            $estadoValido = isset($data['estado']) && in_array($data['estado'], ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado']) 
                ? $data['estado'] 
                : 'pendiente';

            error_log("=== PEDIDO MODEL - PARÁMETROS ===");
            error_log("Estado válido: " . $estadoValido);
            error_log("Descuento: " . ($data['descuento'] ?? 0));
            error_log("CostoDelivery: " . ($data['costoDelivery'] ?? 0));
            error_log("Total: " . ($data['total'] ?? 0));
            error_log("IdMesero: " . ($data['idMesero'] ?? 'NULL'));

            $params = [
                $data['numDocumentos'] ?? null,
                $data['tipoServicio'] ?? null,
                $data['numMesa'] ?? null,
                $data['idCliente'] ?? null,
                $data['idMesero'] ?? null,
                $data['nombreCliente'] ?? null,
                $data['direccionCliente'] ?? null,
                $data['telefonoCliente'] ?? null,
                $data['idUsuario'] ?? null,
                $data['subTotal'] ?? 0,
                $data['descuento'] ?? 0,
                $data['costoDelivery'] ?? 0,
                $data['total'] ?? 0,
                $estadoValido,
                $data['observaciones'] ?? null
            ];

            error_log("Parámetros completos: " . print_r($params, true));

            $result = $stmt->execute($params);
            
            if (!$result) {
                $errorInfo = $stmt->errorInfo();
                error_log("=== ERROR SQL ===");
                error_log("SQLSTATE: " . $errorInfo[0]);
                error_log("Error Code: " . $errorInfo[1]);
                error_log("Error Message: " . $errorInfo[2]);
                throw new Exception("Error SQL: " . $errorInfo[2]);
            }

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Cerrar todos los result sets del stored procedure
            while ($stmt->nextRowset()) {}

            if ($result && isset($result['resultado'])) {
                return json_decode($result['resultado'], true);
            }

            return null;
        } catch (PDOException $e) {
            error_log("=== PDO EXCEPTION EN PEDIDO MODEL ===");
            error_log("Mensaje: " . $e->getMessage());
            error_log("Código: " . $e->getCode());
            throw new Exception("Error en la base de datos: " . $e->getMessage());
        }
    }

    /**
     * Registrar detalle de pedido usando PA
     */
    public function registrarDetalle(int $idPedido, array $detalle)
    {
        $db = Database::connection();
        
        error_log("=== REGISTRANDO DETALLE DE PEDIDO ===");
        error_log("IdPedido: " . $idPedido);
        error_log("Detalle completo: " . json_encode($detalle));
        error_log("IdPlato: " . ($detalle['idPlato'] ?? 'NULL') . " (vacío: " . (empty($detalle['idPlato']) ? 'SI' : 'NO') . ")");
        error_log("IdProducto: " . ($detalle['idProducto'] ?? 'NULL') . " (vacío: " . (empty($detalle['idProducto']) ? 'SI' : 'NO') . ")");
        
        try {
            $cantidad = intval($detalle['cantidad'] ?? 0);
            
            // VALIDAR STOCK ANTES de registrar el detalle
            // Si es un plato, verificar stock de platos
            if (!empty($detalle['idPlato']) && intval($detalle['idPlato']) > 0) {
                $stmtStock = $db->prepare('SELECT IdPlato, Nombre, Cantidad FROM Platos WHERE IdPlato = ?');
                $stmtStock->execute([$detalle['idPlato']]);
                $plato = $stmtStock->fetch(PDO::FETCH_ASSOC);
                
                if (!$plato) {
                    throw new Exception("El plato no existe");
                }
                
                $stockActual = intval($plato['Cantidad']);
                
                if ($stockActual < $cantidad) {
                    throw new Exception("Stock insuficiente para '{$plato['Nombre']}'. Disponible: {$stockActual}, Solicitado: {$cantidad}");
                }
            }
            
            // Si es un producto, verificar stock de productos
            if (!empty($detalle['idProducto']) && intval($detalle['idProducto']) > 0) {
                $stmtStock = $db->prepare('SELECT IdProducto, NombreProducto, Stock FROM Productos WHERE IdProducto = ?');
                $stmtStock->execute([$detalle['idProducto']]);
                $producto = $stmtStock->fetch(PDO::FETCH_ASSOC);
                
                if (!$producto) {
                    throw new Exception("El producto no existe");
                }
                
                $stockActual = intval($producto['Stock']);
                
                if ($stockActual < $cantidad) {
                    throw new Exception("Stock insuficiente para '{$producto['NombreProducto']}'. Disponible: {$stockActual}, Solicitado: {$cantidad}");
                }
            }
            
            // Registrar el detalle del pedido
            $stmt = $db->prepare('CALL pa_registrar_detalle_pedido(?, ?, ?, ?, ?, ?, ?)');
            
            $stmt->execute([
                $idPedido,
                $detalle['idProducto'] ?? null,
                $detalle['idPlato'] ?? null,
                $detalle['codProducto'] ?? null,
                $detalle['descripcionProducto'] ?? null,
                $cantidad,
                $detalle['precioUnitario'] ?? 0
            ]);

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Cerrar cursor del stored procedure
            $stmt->closeCursor();
            
            // DESCONTAR STOCK después de registrar exitosamente
            // Si es un plato, descontar stock
            if (!empty($detalle['idPlato']) && intval($detalle['idPlato']) > 0 && $cantidad > 0) {
                error_log("Intentando descontar stock de plato. IdPlato: {$detalle['idPlato']}, Cantidad: {$cantidad}");
                $stmtUpdate = $db->prepare('UPDATE Platos SET Cantidad = Cantidad - ? WHERE IdPlato = ?');
                $stmtUpdate->execute([$cantidad, $detalle['idPlato']]);
                $filasAfectadas = $stmtUpdate->rowCount();
                error_log("Stock descontado de Plato ID {$detalle['idPlato']}, Cantidad: {$cantidad}, Filas afectadas: {$filasAfectadas}");
            }
            
            // Si es un producto, descontar stock
            if (!empty($detalle['idProducto']) && intval($detalle['idProducto']) > 0 && $cantidad > 0) {
                error_log("Intentando descontar stock de producto. IdProducto: {$detalle['idProducto']}, Cantidad: {$cantidad}");
                $stmtUpdate = $db->prepare('UPDATE Productos SET Stock = Stock - ? WHERE IdProducto = ?');
                $stmtUpdate->execute([$cantidad, $detalle['idProducto']]);
                $filasAfectadas = $stmtUpdate->rowCount();
                error_log("Stock descontado de Producto ID {$detalle['idProducto']}, Cantidad: {$cantidad}, Filas afectadas: {$filasAfectadas}");
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

    /**
     * Eliminar pedido
     */
    public function eliminar(int $idPedido)
    {
        $db = Database::connection();
        
        try {
            // Verificar que el pedido existe
            $stmt = $db->prepare('SELECT IdPedido FROM Pedidos WHERE IdPedido = ?');
            $stmt->execute([$idPedido]);
            $pedido = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$pedido) {
                return false;
            }
            
            // Eliminar el pedido (los detalles se eliminan automáticamente por ON DELETE CASCADE)
            $stmt = $db->prepare('DELETE FROM Pedidos WHERE IdPedido = ?');
            $stmt->execute([$idPedido]);
            
            return $stmt->rowCount() > 0;
        } catch (Exception $e) {
            error_log('Error al eliminar pedido: ' . $e->getMessage());
            throw $e;
        }
    }
}
