<?php
require_once __DIR__ . '/../core/Database.php';

class Proveedor
{
    /**
     * Registra un nuevo proveedor
     */
    public function registrar(array $data): array
    {
        $db = Database::connection();
        
        $stmt = $db->prepare('CALL pa_registrar_proveedor(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        
        $stmt->execute([
            $data['tipoDoc'],
            $data['numDoc'],
            $data['razonSocial'],
            $data['nombreComercial'] ?? null,
            $data['categoria'],
            $data['telefono'],
            $data['telefonoSecundario'] ?? null,
            $data['email'],
            $data['sitioWeb'] ?? null,
            $data['personaContacto'],
            $data['direccion'],
            $data['ciudad'] ?? null,
            $data['distrito'] ?? null,
            $data['tiempoEntrega'] ?? 0,
            $data['montoMinimo'] ?? 0.00,
            $data['descuento'] ?? 0.00,
            $data['nota'] ?? null,
            $data['estado'] ?? 'activo'
        ]);
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $decoded = json_decode($result['resultado'], true);
        
        if (isset($decoded['error'])) {
            throw new Exception($decoded['error']);
        }
        
        return $decoded;
    }

    /**
     * Lista todos los proveedores
     */
    public function listar(): array
    {
        $db = Database::connection();
        
        $stmt = $db->prepare('CALL pa_listar_proveedores()');
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Busca un proveedor por ID
     */
    public function buscarPorId(int $id): ?array
    {
        $db = Database::connection();
        
        $stmt = $db->prepare('SELECT * FROM Proveedores WHERE CodProveedor = ?');
        $stmt->execute([$id]);
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    /**
     * Busca un proveedor por número de documento
     */
    public function buscarPorDocumento(string $numDoc): ?array
    {
        $db = Database::connection();
        
        $stmt = $db->prepare('SELECT * FROM Proveedores WHERE NumDoc = ?');
        $stmt->execute([$numDoc]);
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    /**
     * Actualiza un proveedor existente
     */
    public function actualizar(int $codProveedor, array $data): bool
    {
        $db = Database::connection();
        
        $stmt = $db->prepare('
            UPDATE Proveedores 
            SET 
                TipoDoc = ?,
                NumDoc = ?,
                RazonSocial = ?,
                NombreComercial = ?,
                Categoria = ?,
                Telefono = ?,
                TelefonoSecundario = ?,
                Email = ?,
                Sitio_Web = ?,
                PersonaContacto = ?,
                Direccion = ?,
                Ciudad = ?,
                Distrito = ?,
                TiempoEntrega = ?,
                MontoMinimo = ?,
                Descuento = ?,
                Nota = ?,
                Estado = ?
            WHERE CodProveedor = ?
        ');
        
        return $stmt->execute([
            $data['tipoDoc'],
            $data['numDoc'],
            $data['razonSocial'],
            $data['nombreComercial'] ?? null,
            $data['categoria'],
            $data['telefono'],
            $data['telefonoSecundario'] ?? null,
            $data['email'],
            $data['sitioWeb'] ?? null,
            $data['personaContacto'],
            $data['direccion'],
            $data['ciudad'] ?? null,
            $data['distrito'] ?? null,
            $data['tiempoEntrega'] ?? 0,
            $data['montoMinimo'] ?? 0.00,
            $data['descuento'] ?? 0.00,
            $data['nota'] ?? null,
            $data['estado'] ?? 'activo',
            $codProveedor
        ]);
    }

    /**
     * Elimina un proveedor
     */
    public function eliminar(int $codProveedor): bool
    {
        $db = Database::connection();
        
        // Verificar que el proveedor no tenga compras asociadas
        $stmt = $db->prepare('SELECT COUNT(*) as total FROM Compras WHERE CodProveedor = ?');
        $stmt->execute([$codProveedor]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result['total'] > 0) {
            throw new Exception('No se puede eliminar el proveedor porque tiene compras asociadas');
        }
        
        // Eliminar el proveedor
        $stmt = $db->prepare('DELETE FROM Proveedores WHERE CodProveedor = ?');
        return $stmt->execute([$codProveedor]);
    }
}
