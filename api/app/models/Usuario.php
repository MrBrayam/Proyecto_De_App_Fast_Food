<?php
require_once __DIR__ . '/../core/Database.php';

class Usuario
{
    /**
     * Registra un nuevo usuario del sistema
     * 
     * @param array $data Datos del usuario
     * @return array Resultado con IdUsuario
     */
    public function registrar(array $data): array
    {
        $conn = Database::connection();
        
        $stmt = $conn->prepare("CALL pa_registrar_usuario(?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->bindParam(1, $data['dni'], PDO::PARAM_STR);
        $stmt->bindParam(2, $data['nombreCompleto'], PDO::PARAM_STR);
        $stmt->bindParam(3, $data['telefono'], PDO::PARAM_STR);
        $stmt->bindParam(4, $data['email'], PDO::PARAM_STR);
        $stmt->bindParam(5, $data['nombreUsuario'], PDO::PARAM_STR);
        $stmt->bindParam(6, $data['contrasena'], PDO::PARAM_STR);
        $stmt->bindParam(7, $data['idPerfil'], PDO::PARAM_INT);
        $stmt->bindParam(8, $data['estado'], PDO::PARAM_STR);
        
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $stmt->closeCursor();
        
        if (!$result) {
            throw new Exception('Error al registrar el usuario en la base de datos');
        }
        
        $decoded = json_decode($result['resultado'], true);
        
        if (!is_array($decoded)) {
            throw new Exception('Respuesta invalida de la base de datos');
        }
        
        if (isset($decoded['error'])) {
            throw new Exception($decoded['error']);
        }
        
        if (!isset($decoded['IdUsuario'])) {
            throw new Exception('Usuario registrado pero no se obtuvo el ID');
        }
        
        return $decoded;
    }

    /**
     * Busca un usuario activo por nombre de usuario
     * 
     * @param string $nombreUsuario
     * @return array|null
     */
    public function findActiveByUsername(string $nombreUsuario): ?array
    {
        $conn = Database::connection();
        
        $stmt = $conn->prepare("
            SELECT 
                u.IdUsuario,
                u.Dni,
                u.NombreCompleto,
                u.Telefono,
                u.Email,
                u.NombreUsuario,
                u.Contrasena,
                u.IdPerfil,
                u.Estado,
                p.NombrePerfil,
                p.NivelAcceso
            FROM Usuarios u
            INNER JOIN Perfiles p ON u.IdPerfil = p.IdPerfil
            WHERE u.NombreUsuario = ?
            AND u.Estado = 'activo'
            LIMIT 1
        ");
        
        $stmt->execute([$nombreUsuario]);
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $user ?: null;
    }

    /**
     * Lista todos los usuarios del sistema
     * 
     * @return array
     */
    public function listar(): array
    {
        $conn = Database::connection();
        
        $stmt = $conn->query("
            SELECT 
                u.IdUsuario,
                u.Dni,
                u.NombreCompleto,
                u.Telefono,
                u.Email,
                u.NombreUsuario,
                u.IdPerfil,
                p.NombrePerfil,
                p.NivelAcceso,
                u.Estado,
                u.FechaCreacion,
                u.FechaActualizacion
            FROM Usuarios u
            INNER JOIN Perfiles p ON u.IdPerfil = p.IdPerfil
            ORDER BY u.IdUsuario DESC
        ");
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Busca un usuario por ID
     * 
     * @param int $id
     * @return array|null
     */
    public function buscar(int $id): ?array
    {
        $conn = Database::connection();
        
        $stmt = $conn->prepare("
            SELECT 
                u.IdUsuario,
                u.Dni,
                u.NombreCompleto,
                u.Telefono,
                u.Email,
                u.NombreUsuario,
                u.IdPerfil,
                p.NombrePerfil,
                p.NivelAcceso,
                u.Estado,
                u.FechaCreacion,
                u.FechaActualizacion
            FROM Usuarios u
            INNER JOIN Perfiles p ON u.IdPerfil = p.IdPerfil
            WHERE u.IdUsuario = ?
            LIMIT 1
        ");
        
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $result ?: null;
    }

    /**
     * Actualiza un usuario existente
     * 
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function actualizar(int $id, array $data): bool
    {
        $conn = Database::connection();
        
        $stmt = $conn->prepare("
            UPDATE Usuarios 
            SET Dni = :dni,
                NombreCompleto = :nombreCompleto,
                Telefono = :telefono,
                Email = :email,
                NombreUsuario = :nombreUsuario,
                IdPerfil = :idPerfil,
                Estado = :estado
            WHERE IdUsuario = :id
        ");
        
        return $stmt->execute([
            ':id' => $id,
            ':dni' => $data['dni'],
            ':nombreCompleto' => $data['nombreCompleto'],
            ':telefono' => $data['telefono'],
            ':email' => $data['email'],
            ':nombreUsuario' => $data['nombreUsuario'],
            ':idPerfil' => $data['idPerfil'],
            ':estado' => $data['estado']
        ]);
    }

    /**
     * Cambia el estado de un usuario
     * 
     * @param int $id
     * @param string $estado
     * @return bool
     */
    public function cambiarEstado(int $id, string $estado): bool
    {
        $conn = Database::connection();
        
        $stmt = $conn->prepare("
            UPDATE Usuarios 
            SET Estado = :estado
            WHERE IdUsuario = :id
        ");
        
        return $stmt->execute([
            ':id' => $id,
            ':estado' => $estado
        ]);
    }

    /**
     * Elimina un usuario
     * 
     * @param int $id
     * @return bool
     */
    public function eliminar(int $id): bool
    {
        $conn = Database::connection();
        
        $stmt = $conn->prepare("DELETE FROM Usuarios WHERE IdUsuario = ?");
        return $stmt->execute([$id]);
    }
}

