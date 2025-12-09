<?php
/**
 * Controlador para la subida de imágenes de platos
 * Ruta: /api/app/Controllers/PlatosController.php
 */

namespace Controllers;

use Models\PlatosModel;

class PlatosController {
    private $model;

    public function __construct() {
        $this->model = new PlatosModel();
    }

    /**
     * Subir imagen de un plato
     * POST /api/platos/subir-imagen
     */
    public function subirImagen() {
        try {
            // Validar que sea una solicitud POST
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                http_response_code(405);
                echo json_encode([
                    'exito' => false,
                    'mensaje' => 'Método no permitido'
                ]);
                return;
            }

            // Validar que exista el archivo
            if (!isset($_FILES['imagen'])) {
                http_response_code(400);
                echo json_encode([
                    'exito' => false,
                    'mensaje' => 'No se envió ningún archivo'
                ]);
                return;
            }

            $file = $_FILES['imagen'];
            $codPlato = $_POST['codPlato'] ?? 'plato_' . time();

            // Validar tipo de archivo
            $tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!in_array($file['type'], $tiposPermitidos)) {
                http_response_code(400);
                echo json_encode([
                    'exito' => false,
                    'mensaje' => 'Tipo de archivo no permitido. Solo se aceptan: JPG, PNG, GIF, WEBP'
                ]);
                return;
            }

            // Validar tamaño (máximo 5MB)
            $tamanoMaximo = 5 * 1024 * 1024; // 5MB
            if ($file['size'] > $tamanoMaximo) {
                http_response_code(400);
                echo json_encode([
                    'exito' => false,
                    'mensaje' => 'El archivo es demasiado grande. Máximo: 5MB'
                ]);
                return;
            }

            // Validar que no haya error en la subida
            if ($file['error'] !== UPLOAD_ERR_OK) {
                http_response_code(500);
                echo json_encode([
                    'exito' => false,
                    'mensaje' => 'Error al subir el archivo: ' . $file['error']
                ]);
                return;
            }

            // Crear directorio si no existe
            $directorioDestino = __DIR__ . '/../../img/platos/';
            if (!is_dir($directorioDestino)) {
                mkdir($directorioDestino, 0755, true);
            }

            // Generar nombre único para el archivo
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $nombreArchivo = 'plato_' . $codPlato . '_' . time() . '.' . $extension;
            $rutaCompleta = $directorioDestino . $nombreArchivo;
            $rutaRelativa = '/Proyecto_De_App_Fast_Food/img/platos/' . $nombreArchivo;

            // Mover archivo al destino
            if (!move_uploaded_file($file['tmp_name'], $rutaCompleta)) {
                http_response_code(500);
                echo json_encode([
                    'exito' => false,
                    'mensaje' => 'Error al guardar el archivo en el servidor'
                ]);
                return;
            }

            // Retornar éxito con la ruta de la imagen
            http_response_code(200);
            echo json_encode([
                'exito' => true,
                'mensaje' => 'Imagen subida correctamente',
                'rutaImg' => $rutaRelativa,
                'nombreArchivo' => $nombreArchivo
            ]);

        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'exito' => false,
                'mensaje' => 'Error interno: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Registrar un nuevo plato
     * POST /api/platos/registrar
     */
    public function registrar() {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                http_response_code(405);
                echo json_encode([
                    'exito' => false,
                    'mensaje' => 'Método no permitido'
                ]);
                return;
            }

            $datos = json_decode(file_get_contents('php://input'), true);

            // Validar datos requeridos
            if (empty($datos['codPlato']) || empty($datos['nombre'])) {
                http_response_code(400);
                echo json_encode([
                    'exito' => false,
                    'mensaje' => 'Código y nombre son obligatorios'
                ]);
                return;
            }

            // Insertar en la base de datos
            $resultado = $this->model->registrarPlato([
                'codPlato' => $datos['codPlato'],
                'nombre' => $datos['nombre'],
                'descripcion' => $datos['descripcion'] ?? '',
                'ingredientes' => $datos['ingredientes'] ?? '',
                'tamano' => $datos['tamano'] ?? '',
                'precio' => $datos['precio'] ?? 0,
                'cantidad' => $datos['cantidad'] ?? 0,
                'rutaImg' => $datos['rutaImg'] ?? null,
                'estado' => $datos['estado'] ?? 'disponible'
            ]);

            if ($resultado) {
                http_response_code(201);
                echo json_encode([
                    'exito' => true,
                    'mensaje' => 'Plato registrado correctamente',
                    'id' => $resultado
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    'exito' => false,
                    'mensaje' => 'No se pudo registrar el plato'
                ]);
            }

        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'exito' => false,
                'mensaje' => 'Error interno: ' . $e->getMessage()
            ]);
        }
    }
}
?>
