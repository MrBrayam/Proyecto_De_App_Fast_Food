<?php
require_once __DIR__ . '/../core/Database.php';

class Mesa
{
    /**
     * Registra una nueva mesa o actualiza una existente
     */
    public function registrar($data)
    {
        $db = Database::connection();
        
        $stmt = $db->prepare('CALL pa_registrar_mesa(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        
        $stmt->execute([
            $data['numeroMesa'] ?? null,
            $data['capacidad'] ?? null,
            $data['ubicacion'] ?? 'salon-principal',
            $data['tipo'] ?? 'cuadrada',
            $data['estado'] ?? 'disponible',
            $data['prioridad'] ?? 'normal',
            isset($data['ventana']) ? (int)(bool)$data['ventana'] : 0,
            isset($data['sillaBebe']) ? (int)(bool)$data['sillaBebe'] : 0,
            isset($data['accesible']) ? (int)(bool)$data['accesible'] : 0,
            isset($data['silenciosa']) ? (int)(bool)$data['silenciosa'] : 0,
            $data['observaciones'] ?? null
        ]);
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Close the cursor
        while ($stmt->nextRowset()) {}
        
        // Extract the actual data from the JSON result
        if ($result && isset($result['resultado'])) {
            $json = json_decode($result['resultado'], true);
            if (isset($json['NumMesa'])) {
                return $this->buscarPorId($json['NumMesa']);
            }
        }
        
        return null;
    }

    /**
     * Lista todas las mesas
     */
    public function listar()
    {
        $db = Database::connection();
        $stmt = $db->prepare('CALL pa_listar_mesas()');
        $stmt->execute();
        $mesas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Close the cursor
        while ($stmt->nextRowset()) {}
        
        return $mesas;
    }

    /**
     * Busca una mesa por número
     */
    public function buscarPorId($numeroMesa)
    {
        $db = Database::connection();
        $stmt = $db->prepare('
            SELECT 
                NumMesa AS IdMesa,
                NumMesa,
                Cantidad AS Capacidad,
                Ubicacion,
                TipoMesa AS Tipo,
                Estado,
                Prioridad,
                Ventana,
                SillaBebe,
                Accesible,
                Silenciosa,
                Observacion AS Observaciones,
                DATE_FORMAT(FechaCreacion, "%Y-%m-%d") AS FechaCreacion
            FROM Mesas
            WHERE NumMesa = ?
            LIMIT 1
        ');
        $stmt->execute([$numeroMesa]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Obtiene todas las mesas con formato normalizado
     */
    public function obtenerTodas()
    {
        $db = Database::connection();
        $stmt = $db->prepare('
            SELECT 
                NumMesa AS IdMesa,
                NumMesa,
                Cantidad AS Capacidad,
                Ubicacion,
                TipoMesa AS Tipo,
                Estado,
                Prioridad,
                Ventana,
                SillaBebe,
                Accesible,
                Silenciosa,
                Observacion AS Observaciones,
                DATE_FORMAT(FechaCreacion, "%Y-%m-%d") AS FechaCreacion
            FROM Mesas
            ORDER BY NumMesa ASC
        ');
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Actualiza el estado de una mesa
     */
    public function actualizarEstado($numeroMesa, $estado)
    {
        $db = Database::connection();
        
        // Primero verificar que la mesa existe
        $mesaExiste = $this->buscarPorId($numeroMesa);
        if (!$mesaExiste) {
            return null;
        }
        
        $stmt = $db->prepare('
            UPDATE Mesas
            SET Estado = ?
            WHERE NumMesa = ?
        ');
        
        $resultado = $stmt->execute([$estado, $numeroMesa]);
        
        if ($resultado) {
            return $this->buscarPorId($numeroMesa);
        }
        
        return null;
    }
}
