<?php
require_once __DIR__ . '/../core/Database.php';

class Compra {
    
    public static function registrar($data) {
        try {
            $db = Database::connection();
            
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
            
            $sql = "SELECT 
                        IdCompra,
                        CodProveedor,
                        RUC,
                        TipoComprobante,
                        NumeroComprobante,
                        RazonSocial,
                        Telefono,
                        Direccion,
                        SubTotal,
                        IGV,
                        Total,
                        DATE_FORMAT(FechaCompra, '%Y-%m-%d') as FechaCompra,
                        Estado,
                        IdUsuario,
                        Observaciones
                    FROM Compras
                    ORDER BY FechaCompra DESC, IdCompra DESC";
            
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
}
