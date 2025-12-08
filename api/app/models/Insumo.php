<?php
require_once __DIR__ . '/../core/Database.php';

class Insumo
{
    /**
     * Registra un nuevo insumo
     */
    public function registrar($data)
    {
        $db = Database::connection();
        
        $stmt = $db->prepare('CALL pa_registrar_insumo(?, ?, ?, ?, ?, ?, ?)');
        
        $stmt->execute([
            $data['nombreInsumo'] ?? null,
            $data['ubicacion'] ?? null,
            $data['precioUnitario'] ?? 0,
            $data['vencimiento'] ?? null,
            $data['estado'] ?? 'disponible',
            $data['codProveedor'] ?? null,
            $data['observacion'] ?? null
        ]);
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Close the cursor
        while ($stmt->nextRowset()) {}
        
        // Extract the actual data from the JSON result
        if ($result && isset($result['resultado'])) {
            $json = json_decode($result['resultado'], true);
            if (isset($json['CodInsumo'])) {
                return $this->buscarPorId($json['CodInsumo']);
            }
        }
        
        return null;
    }

    /**
     * Lista todos los insumos
     */
    public function listar()
    {
        $db = Database::connection();
        $stmt = $db->prepare('
            SELECT 
                CodInsumo,
                NombreInsumo,
                Ubicacion,
                Observacion,
                PrecioUnitario,
                DATE_FORMAT(Vencimiento, "%Y-%m-%d") as Vencimiento,
                Estado,
                CodProveedor,
                DATE_FORMAT(FechaCreacion, "%Y-%m-%d") as FechaCreacion,
                DATE_FORMAT(FechaActualizacion, "%Y-%m-%d") as FechaActualizacion
            FROM Insumos
            ORDER BY CodInsumo DESC
        ');
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    /**
     * Busca un insumo por ID
     */
    public function buscarPorId($id)
    {
        $db = Database::connection();
        $stmt = $db->prepare('
            SELECT 
                CodInsumo,
                NombreInsumo,
                Ubicacion,
                Observacion,
                PrecioUnitario,
                DATE_FORMAT(Vencimiento, "%Y-%m-%d") as Vencimiento,
                Estado,
                CodProveedor,
                DATE_FORMAT(FechaCreacion, "%Y-%m-%d") as FechaCreacion,
                DATE_FORMAT(FechaActualizacion, "%Y-%m-%d") as FechaActualizacion
            FROM Insumos
            WHERE CodInsumo = ?
        ');
        $stmt->execute([$id]);
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
