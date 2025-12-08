<?php
require_once __DIR__ . '/../core/Database.php';

class Venta
{
    public function registrar(array $data): array
    {
        $db = Database::connection();
        
        // Preparar parámetros
        $idCliente = $data['idCliente'] ?? null;
        $tipoPago = $data['tipoPago'] ?? 'efectivo';
        $subTotal = $data['subTotal'] ?? 0;
        $descuento = $data['descuento'] ?? 0;
        $total = $data['total'] ?? 0;
        $idUsuario = $data['idUsuario'] ?? 0;
        $codCaja = $data['codCaja'] ?? null;
        $observaciones = $data['observaciones'] ?? null;
        $detalles = !empty($data['detalles']) ? json_encode($data['detalles'], JSON_UNESCAPED_UNICODE) : '[]';

        try {
            $stmt = $db->prepare('CALL pa_registrar_venta(?, ?, ?, ?, ?, ?, ?, ?, ?)');
            
            $stmt->execute([
                $idCliente,
                $tipoPago,
                $subTotal,
                $descuento,
                $total,
                $idUsuario,
                $codCaja,
                $observaciones,
                $detalles
            ]);

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Limpiar result sets
            while ($stmt->nextRowset()) {}

            return $result ? $this->parsearResultado($result) : [];
        } catch (Exception $e) {
            error_log('Error en registrar venta: ' . $e->getMessage());
            return ['error' => 'Error al registrar venta'];
        }
    }

    public function listar(): array
    {
        $db = Database::connection();
        
        try {
            $stmt = $db->prepare('CALL pa_listar_ventas()');
            $stmt->execute();
            
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Limpiar result sets
            while ($stmt->nextRowset()) {}

            return $rows;
        } catch (Exception $e) {
            error_log('Error en listar ventas: ' . $e->getMessage());
            return [];
        }
    }

    public function buscarPorId(int $codVenta): ?array
    {
        $db = Database::connection();
        
        try {
            $stmt = $db->prepare('CALL pa_buscar_venta(?)');
            $stmt->execute([$codVenta]);
            
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Limpiar result sets
            while ($stmt->nextRowset()) {}

            return $row ?: null;
        } catch (Exception $e) {
            error_log('Error en buscar venta: ' . $e->getMessage());
            return null;
        }
    }

    public function buscarDetalles(int $codVenta): array
    {
        $db = Database::connection();
        
        try {
            $stmt = $db->prepare('
                SELECT 
                    IdDetalleVenta,
                    CodVenta,
                    CodProducto,
                    Linea,
                    Descripcion,
                    Cantidad,
                    Precio,
                    Subtotal,
                    IdProducto
                FROM DetalleVenta
                WHERE CodVenta = ?
                ORDER BY IdDetalleVenta ASC
            ');
            $stmt->execute([$codVenta]);
            
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $rows;
        } catch (Exception $e) {
            error_log('Error en buscar detalles venta: ' . $e->getMessage());
            return [];
        }
    }

    private function parsearResultado(array $resultado): array
    {
        // Si viene como JSON string, decodificar
        if (isset($resultado['resultado']) && is_string($resultado['resultado'])) {
            return json_decode($resultado['resultado'], true) ?? $resultado;
        }
        return $resultado;
    }
}
