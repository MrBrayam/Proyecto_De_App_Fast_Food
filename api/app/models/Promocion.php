<?php
require_once __DIR__ . '/../core/Database.php';

class Promocion
{
    public function registrar(array $data)
    {
        try {
            $db = Database::connection();
            $stmt = $db->prepare('CALL pa_promocion_registrar(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([
                $data['nombre'] ?? null,
                $data['tipo'] ?? null,
                $data['descuento'] ?? null,
                $data['estado'] ?? 'activa',
                $data['fechaInicio'] ?? null,
                $data['fechaFin'] ?? null,
                $data['diasAplicables'] ?? null,
                $data['horario'] ?? null,
                $data['montoMinimo'] ?? 0,
                $data['usosMaximos'] ?? null,
                $data['acumulable'] ?? false,
                $data['descripcion'] ?? null
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
        try {
            $db = Database::connection();
            $stmt = $db->prepare('CALL pa_promocion_listar()');
            $stmt->execute();
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
            while ($stmt->nextRowset()) {}
            return $items ?: [];
        } catch (PDOException $e) {
            return [];
        }
    }

    public function actualizar(array $data)
    {
        try {
            $db = Database::connection();
            $stmt = $db->prepare('CALL pa_promocion_actualizar(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([
                $data['idPromocion'] ?? null,
                $data['nombre'] ?? null,
                $data['tipo'] ?? null,
                $data['descuento'] ?? null,
                $data['estado'] ?? 'activa',
                $data['fechaInicio'] ?? null,
                $data['fechaFin'] ?? null,
                $data['diasAplicables'] ?? null,
                $data['horario'] ?? null,
                $data['montoMinimo'] ?? 0,
                $data['usosMaximos'] ?? null,
                $data['acumulable'] ?? false,
                $data['descripcion'] ?? null
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

    public function buscar($idPromocion)
    {
        try {
            $db = Database::connection();
            $stmt = $db->prepare('CALL pa_promocion_buscar(?)');
            $stmt->execute([$idPromocion]);
            $promocion = $stmt->fetch(PDO::FETCH_ASSOC);
            while ($stmt->nextRowset()) {}
            return $promocion ?: null;
        } catch (PDOException $e) {
            return null;
        }
    }

    public function buscarPorCodigo($codigo)
    {
        try {
            $db = Database::connection();
            $stmt = $db->prepare('SELECT * FROM promociones WHERE NombrePromocion = ? LIMIT 1');
            $stmt->execute([$codigo]);
            $promocion = $stmt->fetch(PDO::FETCH_ASSOC);
            return $promocion ?: null;
        } catch (PDOException $e) {
            return null;
        }
    }

    public function eliminar($idPromocion)
    {
        try {
            $db = Database::connection();
            $stmt = $db->prepare('CALL pa_promocion_eliminar(?)');
            $stmt->execute([$idPromocion]);
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
}
