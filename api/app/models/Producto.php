<?php
require_once __DIR__ . '/../core/Database.php';

class Producto
{
    /**
     * Obtiene la lista de todos los productos
     */
    public function listar()
    {
        $db = Database::connection();
        $stmt = $db->prepare('CALL pa_listar_productos()');
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Ensure we close the cursor
        while ($stmt->nextRowset()) {}
        
        return $result;
    }

    /**
     * Registra un nuevo producto
     */
    public function registrar($data)
    {
        $db = Database::connection();
        $stmt = $db->prepare('CALL pa_registrar_producto(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        
        $stmt->execute([
            $data['codProducto'] ?? null,
            $data['nombreProducto'] ?? null,
            $data['categoria'] ?? null,
            $data['tamano'] ?? 'na',
            $data['precio'] ?? 0,
            $data['costo'] ?? 0,
            $data['stock'] ?? 0,
            $data['stockMinimo'] ?? 0,
            $data['tiempoPreparacion'] ?? 0,
            $data['codigoBarras'] ?? null,
            $data['descripcion'] ?? null,
            $data['codProveedor'] ?? null,
        ]);
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Close the cursor
        while ($stmt->nextRowset()) {}
        
        return $result;
    }

    /**
     * Obtiene un producto por su código
     */
    public function obtenerPorCodigo($codProducto)
    {
        $db = Database::connection();
        $stmt = $db->prepare('SELECT * FROM Productos WHERE CodProducto = ? LIMIT 1');
        $stmt->execute([$codProducto]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Actualiza un producto
     */
    public function actualizar($codProducto, $data)
    {
        $db = Database::connection();
        $updates = [];
        $bindings = [];

        if (isset($data['nombreProducto'])) {
            $updates[] = 'NombreProducto = ?';
            $bindings[] = $data['nombreProducto'];
        }
        if (isset($data['categoria'])) {
            $updates[] = 'Categoria = ?';
            $bindings[] = $data['categoria'];
        }
        if (isset($data['precio'])) {
            $updates[] = 'Precio = ?';
            $bindings[] = $data['precio'];
        }
        if (isset($data['stock'])) {
            $updates[] = 'Stock = ?';
            $bindings[] = $data['stock'];
        }
        if (isset($data['estado'])) {
            $updates[] = 'Estado = ?';
            $bindings[] = $data['estado'];
        }

        if (empty($updates)) {
            return false;
        }

        $bindings[] = $codProducto;

        $query = 'UPDATE Productos SET ' . implode(', ', $updates) . ' WHERE CodProducto = ?';
        $stmt = $db->prepare($query);

        return $stmt->execute($bindings);
    }

    /**
     * Elimina un producto
     */
    public function eliminar($codProducto)
    {
        $db = Database::connection();
        $stmt = $db->prepare('DELETE FROM Productos WHERE CodProducto = ?');
        return $stmt->execute([$codProducto]);
    }
}
?>
