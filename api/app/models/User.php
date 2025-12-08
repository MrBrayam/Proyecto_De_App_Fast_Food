<?php
class User
{
    public function findActiveByUsername(string $username): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            "SELECT u.IdUsuario, u.Contrasena, u.NombreCompleto, u.IdPerfil, p.NombrePerfil, u.Estado
             FROM Usuarios u
             JOIN Perfiles p ON u.IdPerfil = p.IdPerfil
             WHERE u.NombreUsuario = :usuario AND u.Estado = 'activo'
             LIMIT 1"
        );
        $stmt->bindValue(':usuario', $username, PDO::PARAM_STR);
        $stmt->execute();
        $row = $stmt->fetch();
        return $row ?: null;
    }
}
