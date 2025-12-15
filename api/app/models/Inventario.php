<?php
require_once __DIR__ . '/../core/Database.php';

class Inventario
{
    /**
     * Listar productos del inventario
     */
    public function listarProductos()
    {
        $db = Database::connection();
        $stmt = $db->prepare('CALL pa_listar_productos_inventario()');
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Ensure we close the cursor
        while ($stmt->nextRowset()) {}
        
        return $result;
    }

    /**
     * Listar insumos del inventario
     */
    public function listarInsumos()
    {
        $db = Database::connection();
        $stmt = $db->prepare('CALL pa_listar_insumos_inventario()');
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Ensure we close the cursor
        while ($stmt->nextRowset()) {}
        
        return $result;
    }

    /**
     * Buscar producto por ID
     */
    public function buscarProductoPorId($idProducto)
    {
        $db = Database::connection();
        $stmt = $db->prepare('SELECT * FROM Productos WHERE IdProducto = ?');
        $stmt->execute([$idProducto]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Buscar insumo por ID
     */
    public function buscarInsumoPorId($codInsumo)
    {
        $db = Database::connection();
        $stmt = $db->prepare('SELECT * FROM Insumos WHERE CodInsumo = ?');
        $stmt->execute([$codInsumo]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
