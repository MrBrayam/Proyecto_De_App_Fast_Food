<?php
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/VentaController.php';
require_once __DIR__ . '/controllers/PerfilController.php';
require_once __DIR__ . '/controllers/UsuarioController.php';

return [
    'login' => [AuthController::class, 'login'],
    'ventas/registrar' => [VentaController::class, 'registrar'],
    'perfiles/registrar' => [PerfilController::class, 'registrar'],
    'perfiles/listar' => [PerfilController::class, 'listar'],
    'usuarios/registrar' => [UsuarioController::class, 'registrar'],
    'usuarios/listar' => [UsuarioController::class, 'listar'],
];
