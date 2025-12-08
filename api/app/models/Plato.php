<?php
require_once __DIR__ . '/../core/Database.php';

class Plato
{
    public function listar()
    {
        $db = Database::connection();
        $stmt = $db->prepare('CALL pa_listar_platos()');
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        while ($stmt->nextRowset()) {}
        return $result;
    }

    public function registrar(array $data)
    {
        $db = Database::connection();
        $stmt = $db->prepare('CALL pa_registrar_plato(?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['codPlato'] ?? null,
            $data['nombre'] ?? null,
            $data['descripcion'] ?? null,
            $data['ingredientes'] ?? null,
            $data['tamano'] ?? 'personal',
            $data['precio'] ?? 0,
            $data['cantidad'] ?? 0,
            $data['estado'] ?? 'disponible',
        ]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        while ($stmt->nextRowset()) {}
        return $result;
    }

    public function buscarPorCodigo(string $codPlato)
    {
        $db = Database::connection();
        $stmt = $db->prepare('CALL pa_buscar_plato(?)');
        $stmt->execute([$codPlato]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        while ($stmt->nextRowset()) {}
        return $result;
    }
}
