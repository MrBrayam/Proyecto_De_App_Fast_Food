<?php
require_once __DIR__ . '/controllers/AuthController.php';

return [
    'login' => [AuthController::class, 'login'],
];
