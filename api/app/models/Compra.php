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
                    Codigo, 
                    Descripcion, 
                    Empaque, 
                    Cantidad, 
                    PrecioUnitario, 
                    Total
                ) VALUES (
                    :idCompra, 
                    :codigo, 
                    :descripcion, 
                    :empaque, 
                    :cantidad, 
                    :precioUnitario, 
                    :total
                )";
                
                $stmt = $db->prepare($sql);
                $stmt->bindValue(':idCompra', $idCompra, PDO::PARAM_INT);
                $stmt->bindValue(':codigo', $linea['codigo'] ?? '', PDO::PARAM_STR);
                $stmt->bindValue(':descripcion', $linea['descripcion'] ?? '', PDO::PARAM_STR);
                $stmt->bindValue(':empaque', $linea['empaque'] ?? '', PDO::PARAM_STR);
                $stmt->bindValue(':cantidad', $linea['cantidad'] ?? 0, PDO::PARAM_STR);
                $stmt->bindValue(':precioUnitario', $linea['precioUnitario'] ?? 0, PDO::PARAM_STR);
                $stmt->bindValue(':total', $linea['total'] ?? 0, PDO::PARAM_STR);
                
                error_log("Insertando detalle: " . json_encode([
                    'idCompra' => $idCompra,
                    'codigo' => $linea['codigo'] ?? '',
                    'descripcion' => $linea['descripcion'] ?? '',
                    'empaque' => $linea['empaque'] ?? '',
                    'cantidad' => $linea['cantidad'] ?? 0,
                    'precioUnitario' => $linea['precioUnitario'] ?? 0,
                    'total' => $linea['total'] ?? 0
                ]));
                
                $stmt->execute();
            }
            
            return true;
        } catch (PDOException $e) {
            error_log("Error en Compra::registrarDetalles() - " . $e->getMessage());
            return false;
        }
    }
}
