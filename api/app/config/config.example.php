<?php
/**
 * Archivo de configuración de ejemplo para King's Pizza
 * 
 * INSTRUCCIONES:
 * 1. Copiar este archivo como 'config.php' en el mismo directorio
 * 2. Reemplazar los valores de ejemplo con tus credenciales reales
 * 3. NO subir el archivo 'config.php' a GitHub (está en .gitignore)
 */

return [
    'db' => [
        'host' => 'localhost',           // Host de la base de datos
        'name' => 'kings_pizza_db',      // Nombre de la base de datos
        'user' => 'root',                // Usuario de la base de datos
        'pass' => '',                    // ⚠️ COLOCAR TU CONTRASEÑA AQUÍ
        'charset' => 'utf8mb4',
    ],
    'auth' => [
        'secret' => 'CAMBIAR_POR_TU_CLAVE_SECRETA',  // ⚠️ Cambiar por una clave segura
        'ttl' => 86400, // Tiempo de vida del token en segundos (24 horas)
    ],
];
