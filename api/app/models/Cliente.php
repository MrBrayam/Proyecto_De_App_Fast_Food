<?php
require_once __DIR__ . '/../core/Database.php';

class Cliente
{
    /**
     * Registra un nuevo cliente
     * 
     * @param array $data Datos del cliente
     * @return array Resultado con IdCliente
     */
    public function registrar(array $data): array
    {
        $conn = Database::connection();
        
        $stmt = $conn->prepare("CALL pa_registrar_cliente(?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->bindParam(1, $data['tipoDocumento'], PDO::PARAM_STR);
        $stmt->bindParam(2, $data['numDocumento'], PDO::PARAM_STR);
        $stmt->bindParam(3, $data['nombres'], PDO::PARAM_STR);
        $stmt->bindParam(4, $data['apellidos'], PDO::PARAM_STR);
        $stmt->bindParam(5, $data['telefono'], PDO::PARAM_STR);
        $stmt->bindParam(6, $data['email'], PDO::PARAM_STR);
        $stmt->bindParam(7, $data['direccion'], PDO::PARAM_STR);
        
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $stmt->closeCursor();
        
        if (!$result) {
            throw new Exception('Error al registrar el cliente en la base de datos');
        }
        
        $decoded = json_decode($result['resultado'], true);
        
        if (!is_array($decoded)) {
            throw new Exception('Respuesta inválida de la base de datos');
        }
        
        if (isset($decoded['error'])) {
            throw new Exception($decoded['error']);
        }
        
        if (!isset($decoded['IdCliente'])) {
            throw new Exception('Cliente registrado pero no se obtuvo el ID');
        }
        
        return $decoded;
    }

    /**
     * Lista todos los clientes activos del sistema
     * 
     * @return array
     */
    public function listar(): array
    {
        $conn = Database::connection();
        
        $stmt = $conn->prepare("CALL pa_listar_clientes()");
        $stmt->execute();
        
        $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();
        
        return $clientes ?: [];
    }

    /**
     * Busca un cliente por ID
     * 
     * @param int $idCliente
     * @return array|null
     */
    public function buscarPorId(int $idCliente): ?array
    {
        $conn = Database::connection();
        
        $stmt = $conn->prepare("
            SELECT 
                IdCliente,
                TipoDocumento,
                NumDocumento,
                Nombres,
                Apellidos,
                NombreCompleto,
                Telefono,
                Email,
                Direccion,
                MontoGastado,
                Estado,
                FechaRegistro,
                FechaActualizacion
            FROM Clientes
            WHERE IdCliente = ?
            LIMIT 1
        ");
        
        $stmt->execute([$idCliente]);
        
        $cliente = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $cliente ?: null;
    }

    /**
     * Busca un cliente por número de documento
     * 
     * @param string $numDocumento
     * @return array|null
     */
    public function buscarPorDocumento(string $numDocumento): ?array
    {
        $conn = Database::connection();
        
        $stmt = $conn->prepare("
            SELECT 
                IdCliente,
                TipoDocumento,
                NumDocumento,
                Nombres,
                Apellidos,
                NombreCompleto,
                Telefono,
                Email,
                Direccion,
                MontoGastado,
                Estado,
                FechaRegistro,
                FechaActualizacion
            FROM Clientes
            WHERE NumDocumento = ?
            LIMIT 1
        ");
        
        $stmt->execute([$numDocumento]);
        
        $cliente = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $cliente ?: null;
    }
}
