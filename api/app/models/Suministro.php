<?php
require_once __DIR__ . '/../core/Database.php';

class Suministro
{
    /**
     * Registra un nuevo suministro
     */
    public function registrar($data)
    {
        $db = Database::connection();
        
        $stmt = $db->prepare('CALL pa_registrar_suministro(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        
        $stmt->execute([
            $data['tipoSuministro'] ?? null,
            $data['nombreSuministro'] ?? null,
            $data['codProveedor'] ?? null,
            $data['proveedor'] ?? null,
            $data['cantidad'] ?? 0,
            $data['unidadMedida'] ?? 'unidad',
            $data['precioUnitario'] ?? 0,
            $data['fechaCompra'] ?? null,
            $data['numeroFactura'] ?? null,
            $data['estado'] ?? 'disponible',
            $data['ubicacion'] ?? null,
            $data['observaciones'] ?? null
        ]);
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Close the cursor
        while ($stmt->nextRowset()) {}
        
        // Extract the actual data from the JSON result
        if ($result && isset($result['resultado'])) {
            $json = json_decode($result['resultado'], true);
            if (isset($json['IdSuministro'])) {
                return $this->buscarPorId($json['IdSuministro']);
            }
        }
        
        return null;
    }

    /**
     * Lista todos los suministros
     */
    public function listar()
    {
        $db = Database::connection();
        $stmt = $db->prepare('
            SELECT 
                IdSuministro,
                TipoSuministro,
                NombreSuministro,
                Proveedor,
                Cantidad,
                UnidadMedida,
                PrecioUnitario,
                DATE_FORMAT(FechaCompra, "%Y-%m-%d") as FechaCompra,
                NumeroFactura,
                Estado,
                Ubicacion,
                Observaciones,
                DATE_FORMAT(FechaCreacion, "%Y-%m-%d") as FechaCreacion,
                DATE_FORMAT(FechaActualizacion, "%Y-%m-%d") as FechaActualizacion
            FROM Suministros
            ORDER BY FechaCreacion DESC
        ');
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Busca un suministro por ID
     */
    public function buscarPorId($id)
    {
        $db = Database::connection();
        $stmt = $db->prepare('
            SELECT 
                IdSuministro,
                TipoSuministro,
                NombreSuministro,
                Proveedor,
                Cantidad,
                UnidadMedida,
                PrecioUnitario,
                DATE_FORMAT(FechaCompra, "%Y-%m-%d") as FechaCompra,
                NumeroFactura,
                Estado,
                Ubicacion,
                Observaciones,
                DATE_FORMAT(FechaCreacion, "%Y-%m-%d") as FechaCreacion,
                DATE_FORMAT(FechaActualizacion, "%Y-%m-%d") as FechaActualizacion
            FROM Suministros
            WHERE IdSuministro = ?
            LIMIT 1
        ');
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
