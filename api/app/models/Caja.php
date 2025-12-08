<?php
require_once __DIR__ . '/../core/Database.php';

class Caja
{
    public function abrir(array $data)
    {
        try {
            $db = Database::connection();
            $stmt = $db->prepare('CALL pa_caja_abrir(?, ?, ?, ?, ?)');
            $stmt->execute([
                $data['codCaja'] ?? null,
                $data['montoInicial'] ?? 0,
                $data['turno'] ?? null,
                $data['idUsuario'] ?? null,
                $data['fechaApertura'] ?? date('Y-m-d')
            ]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            while ($stmt->nextRowset()) {}
            if ($result && isset($result['resultado'])) {
                return json_decode($result['resultado'], true);
            }
            return ['exito' => false, 'mensaje' => 'No se obtuvo respuesta del procedimiento'];
        } catch (PDOException $e) {
            return ['exito' => false, 'mensaje' => 'Error BD: ' . $e->getMessage()];
        }
    }

    public function listar()
    {
        $db = Database::connection();
        $stmt = $db->prepare('CALL pa_caja_listar()');
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        while ($stmt->nextRowset()) {}
        return $items ?: [];
    }

    public function obtenerAbierta()
    {
        $db = Database::connection();
        $stmt = $db->prepare('CALL pa_caja_abierta()');
        $stmt->execute();
        $caja = $stmt->fetch(PDO::FETCH_ASSOC);
        while ($stmt->nextRowset()) {}
        return $caja ?: null;
    }

    public function cerrar(array $data)
    {
        $db = Database::connection();
        $stmt = $db->prepare('CALL pa_caja_cerrar(?, ?, ?, ?)');
        $stmt->execute([
            $data['codCaja'] ?? null,
            $data['montoFinal'] ?? 0,
            $data['observaciones'] ?? null,
            $data['idUsuario'] ?? null
        ]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        while ($stmt->nextRowset()) {}
        if ($result && isset($result['resultado'])) {
            return json_decode($result['resultado'], true);
        }
        return null;
    }
}
