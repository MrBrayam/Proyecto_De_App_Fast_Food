<?php
require_once __DIR__ . '/../core/Database.php';

class Compra {
    
    public static function registrar($data) {
        try {
            $db = Database::connection();
            
            // Log para debug
            error_log("Datos recibidos en Compra::registrar: " . json_encode($data));
            
            $sql = "CALL pa_registrar_compra(
                :codProveedor, :ruc, :tipoComprobante, :numeroComprobante,
                :razonSocial, :telefono, :direccion, :subTotal,
                :igv, :total, :fechaCompra, :estado, :idUsuario, :observaciones
            )";
            
            $stmt = $db->prepare($sql);
            
            $stmt->bindValue(':codProveedor', $data['codProveedor'] ?? null, PDO::PARAM_STR);
            $stmt->bindValue(':ruc', $data['ruc'] ?? null, PDO::PARAM_STR);
            $stmt->bindValue(':tipoComprobante', $data['tipoComprobante'] ?? null, PDO::PARAM_STR);
            $stmt->bindValue(':numeroComprobante', $data['numeroComprobante'] ?? null, PDO::PARAM_STR);
            $stmt->bindValue(':razonSocial', $data['razonSocial'] ?? null, PDO::PARAM_STR);
            $stmt->bindValue(':telefono', $data['telefono'] ?? null, PDO::PARAM_STR);
            $stmt->bindValue(':direccion', $data['direccion'] ?? null, PDO::PARAM_STR);
            $stmt->bindValue(':subTotal', $data['subTotal'] ?? null, PDO::PARAM_STR);
            $stmt->bindValue(':igv', $data['igv'] ?? null, PDO::PARAM_STR);
            $stmt->bindValue(':total', $data['total'] ?? null, PDO::PARAM_STR);
            $stmt->bindValue(':fechaCompra', $data['fechaCompra'] ?? null, PDO::PARAM_STR);
            $stmt->bindValue(':estado', $data['estado'] ?? 'pendiente', PDO::PARAM_STR);
            $stmt->bindValue(':idUsuario', $data['idUsuario'] ?? null, PDO::PARAM_INT);
            $stmt->bindValue(':observaciones', $data['observaciones'] ?? null, PDO::PARAM_STR);
            
            $stmt->execute();
            
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Cerrar el cursor para permitir nuevas consultas
            $stmt->closeCursor();
            
            // El PA devuelve un JSON en el campo 'resultado'
            if (isset($result['resultado'])) {
                $resultadoJson = json_decode($result['resultado'], true);
                $idCompra = $resultadoJson['IdCompra'] ?? null;
                
                error_log("IdCompra obtenido: " . $idCompra);
                error_log("Lineas de compra: " . json_encode($data['lineasCompra'] ?? []));
                
                // Si hay detalles de compra, insertarlos
                if ($idCompra && !empty($data['lineasCompra']) && is_array($data['lineasCompra'])) {
                    error_log("Registrando " . count($data['lineasCompra']) . " líneas de detalle");
                    $detalleResult = self::registrarDetalles($db, $idCompra, $data['lineasCompra']);
                    error_log("Resultado de registrar detalles: " . ($detalleResult ? 'true' : 'false'));
                } else {
                    error_log("No se registrarán detalles. IdCompra: $idCompra, lineasCompra: " . (empty($data['lineasCompra']) ? 'vacío' : 'no es array'));
                }
                
                return [
                    'exito' => true,
                    'idCompra' => $idCompra,
                    'mensaje' => $resultadoJson['mensaje'] ?? 'Compra registrada exitosamente'
                ];
            }
            
            return [
                'exito' => true,
                'idCompra' => $result['IdCompra'] ?? null,
                'mensaje' => 'Compra registrada exitosamente'
            ];
            
        } catch (PDOException $e) {
            error_log("Error en Compra::registrar() - " . $e->getMessage());
            return [
                'exito' => false,
                'mensaje' => 'Error al registrar la compra: ' . $e->getMessage()
            ];
        }
    }
    
    public static function listar() {
        try {
            $db = Database::connection();
            
            $sql = "CALL pa_listar_compras()";
            
            $stmt = $db->prepare($sql);
            $stmt->execute();
            
            $compras = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return [
                'exito' => true,
                'compras' => $compras,
                'total' => count($compras)
            ];
            
        } catch (PDOException $e) {
            error_log("Error en Compra::listar() - " . $e->getMessage());
            return [
                'exito' => false,
                'mensaje' => 'Error al listar compras: ' . $e->getMessage(),
                'compras' => [],
                'total' => 0
            ];
        }
    }
    
    public static function buscarPorId($idCompra) {
        try {
            $db = Database::connection();
            
            $sql = "SELECT * FROM Compras WHERE IdCompra = :idCompra";
            $stmt = $db->prepare($sql);
            $stmt->bindValue(':idCompra', $idCompra, PDO::PARAM_INT);
            $stmt->execute();
            
            $compra = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return [
                'exito' => true,
                'compra' => $compra
            ];
            
        } catch (PDOException $e) {
            error_log("Error en Compra::buscarPorId() - " . $e->getMessage());
            return [
                'exito' => false,
                'mensaje' => 'Error al buscar compra: ' . $e->getMessage()
            ];
        }
    }
    
    private static function registrarDetalles($db, $idCompra, $lineas) {
        try {
            foreach ($lineas as $linea) {
                $sql = "INSERT INTO DetalleCompra (
                    IdCompra, 
                    TipoItem,
                    Codigo, 
                    Descripcion, 
                    Empaque, 
                    Cantidad, 
                    PrecioUnitario, 
                    Total
                ) VALUES (
                    :idCompra,
                    :tipoItem, 
                    :codigo, 
                    :descripcion, 
                    :empaque, 
                    :cantidad, 
                    :precioUnitario, 
                    :total
                )";
                
                $stmt = $db->prepare($sql);
                $stmt->bindValue(':idCompra', $idCompra, PDO::PARAM_INT);
                $stmt->bindValue(':tipoItem', 'producto', PDO::PARAM_STR);
                $stmt->bindValue(':codigo', $linea['codigo'] ?? '', PDO::PARAM_STR);
                $stmt->bindValue(':descripcion', $linea['descripcion'] ?? '', PDO::PARAM_STR);
                $stmt->bindValue(':empaque', $linea['empaque'] ?? '', PDO::PARAM_STR);
                $stmt->bindValue(':cantidad', $linea['cantidad'] ?? 0, PDO::PARAM_STR);
                $stmt->bindValue(':precioUnitario', $linea['precioUnitario'] ?? 0, PDO::PARAM_STR);
                $stmt->bindValue(':total', $linea['total'] ?? 0, PDO::PARAM_STR);
                
                error_log("Insertando detalle: " . json_encode([
                    'idCompra' => $idCompra,
                    'tipoItem' => 'producto',
                    'codigo' => $linea['codigo'] ?? '',
                    'descripcion' => $linea['descripcion'] ?? '',
                    'empaque' => $linea['empaque'] ?? '',
                    'cantidad' => $linea['cantidad'] ?? 0,
                    'precioUnitario' => $linea['precioUnitario'] ?? 0,
                    'total' => $linea['total'] ?? 0
                ]));
                
                $stmt->execute();
                
                // Actualizar stock inmediatamente al registrar el detalle
                if ($linea['codigo']) {
                    $sqlUpdateStock = "UPDATE Productos 
                                      SET Stock = Stock + :cantidad 
                                      WHERE CodProducto = :codigo";
                    $stmtStock = $db->prepare($sqlUpdateStock);
                    $stmtStock->bindValue(':cantidad', $linea['cantidad'] ?? 0, PDO::PARAM_STR);
                    $stmtStock->bindValue(':codigo', $linea['codigo'] ?? '', PDO::PARAM_STR);
                    $stmtStock->execute();
                    
                    error_log("Stock actualizado para producto {$linea['codigo']}: +{$linea['cantidad']} unidades");
                }
            }
            
            return true;
        } catch (PDOException $e) {
            error_log("Error en Compra::registrarDetalles() - " . $e->getMessage());
            return false;
        }
    }
    
    // Actualizar estado de compra
    public static function actualizarEstado($idCompra, $estado) {
        try {
            $db = Database::connection();
            
            // Primero obtener el estado actual
            $sqlEstadoActual = "SELECT Estado FROM Compras WHERE IdCompra = :idCompra";
            $stmtEstado = $db->prepare($sqlEstadoActual);
            $stmtEstado->bindValue(':idCompra', $idCompra, PDO::PARAM_INT);
            $stmtEstado->execute();
            $estadoActual = $stmtEstado->fetch(PDO::FETCH_ASSOC);
            
            if (!$estadoActual) {
                return [
                    'exito' => false,
                    'mensaje' => 'No se encontró la compra'
                ];
            }
            
            // Actualizar el estado
            $sql = "UPDATE Compras SET Estado = :estado WHERE IdCompra = :idCompra";
            $stmt = $db->prepare($sql);
            $stmt->bindValue(':estado', $estado, PDO::PARAM_STR);
            $stmt->bindValue(':idCompra', $idCompra, PDO::PARAM_INT);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                // Si el estado cambió a 'pagado' o 'completado', aumentar stock
                if (($estado === 'pagado' || $estado === 'completado') && 
                    $estadoActual['Estado'] !== 'pagado' && 
                    $estadoActual['Estado'] !== 'completado') {
                    
                    error_log("Actualizando stock para compra #$idCompra");
                    self::actualizarStockPorCompra($db, $idCompra);
                }
                
                return [
                    'exito' => true,
                    'mensaje' => 'Estado actualizado correctamente'
                ];
            } else {
                return [
                    'exito' => false,
                    'mensaje' => 'No se encontró la compra o el estado ya era ese'
                ];
            }
        } catch (PDOException $e) {
            error_log("Error en Compra::actualizarEstado() - " . $e->getMessage());
            return [
                'exito' => false,
                'mensaje' => 'Error al actualizar el estado: ' . $e->getMessage()
            ];
        }
    }
    
    // Método para actualizar stock de productos al confirmar compra
    private static function actualizarStockPorCompra($db, $idCompra) {
        try {
            // Obtener todos los detalles de la compra
            $sql = "SELECT Codigo, Cantidad, TipoItem FROM DetalleCompra WHERE IdCompra = :idCompra";
            $stmt = $db->prepare($sql);
            $stmt->bindValue(':idCompra', $idCompra, PDO::PARAM_INT);
            $stmt->execute();
            $detalles = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            foreach ($detalles as $detalle) {
                $codigo = $detalle['Codigo'];
                $cantidad = floatval($detalle['Cantidad']);
                $tipoItem = $detalle['TipoItem'];
                
                // Actualizar stock de productos
                if ($tipoItem === 'producto') {
                    $sqlUpdate = "UPDATE Productos 
                                 SET Stock = Stock + :cantidad 
                                 WHERE CodProducto = :codigo";
                    $stmtUpdate = $db->prepare($sqlUpdate);
                    $stmtUpdate->bindValue(':cantidad', $cantidad, PDO::PARAM_STR);
                    $stmtUpdate->bindValue(':codigo', $codigo, PDO::PARAM_STR);
                    $stmtUpdate->execute();
                    
                    error_log("Stock actualizado para producto $codigo: +$cantidad unidades");
                }
            }
            
            return true;
        } catch (PDOException $e) {
            error_log("Error en Compra::actualizarStockPorCompra() - " . $e->getMessage());
            return false;
        }
    }
}
