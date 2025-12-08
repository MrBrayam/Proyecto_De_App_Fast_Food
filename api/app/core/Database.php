<?php
class Database
{
    private static ?PDO $conn = null;

    public static function connection(): PDO
    {
        if (self::$conn instanceof PDO) {
            return self::$conn;
        }

        $config = require __DIR__ . '/../config/config.php';
        $db = $config['db'];

        $dsn = sprintf(
            'mysql:host=%s;dbname=%s;charset=%s',
            $db['host'],
            $db['name'],
            $db['charset']
        );

        self::$conn = new PDO($dsn, $db['user'], $db['pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);

        return self::$conn;
    }
}
