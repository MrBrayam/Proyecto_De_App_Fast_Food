<?php
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../models/Plato.php';

// Sanitiza nombres para archivos evitando caracteres problemáticos
function sanitizeFilename($filename)
{
    $filename = preg_replace('/[^a-zA-Z0-9._-]/', '', $filename);
    $filename = preg_replace('/([._-])+/', '$1', $filename);
    return trim($filename, '._-');
}

class PlatoController extends Controller
{
    public function listar(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $model = new Plato();
        try {
            $platos = $model->listar();
            $respuesta = array_map(function ($plato) {
                return [
                    'IdPlato' => (int)($plato['IdPlato'] ?? 0),
                    'CodPlato' => $plato['CodPlato'],
                    'Nombre' => $plato['Nombre'],
                    'Descripcion' => $plato['Descripcion'],
                    'Ingredientes' => $plato['Ingredientes'],
                    'Tamano' => $plato['Tamano'],
                    'Precio' => (float)$plato['Precio'],
                    'Cantidad' => (int)$plato['Cantidad'],
                    'StockMinimo' => (int)($plato['StockMinimo'] ?? 10),
                    'RutaImg' => $plato['RutaImg'] ?? null,
                    'Estado' => $plato['Estado'],
                    'FechaCreacion' => $plato['FechaCreacion'],
                    'FechaActualizacion' => $plato['FechaActualizacion'],
                ];
            }, $platos);

            $this->json(['exito' => true, 'platos' => $respuesta, 'total' => count($respuesta)], 200);
        } catch (Exception $e) {
            error_log('Error en PlatoController::listar: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al obtener platos', 'error' => $e->getMessage()], 500);
        }
    }

    public function registrar(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $codPlato = trim($input['codPlato'] ?? '');
        $nombre = trim($input['nombre'] ?? '');
        $tamano = trim($input['tamano'] ?? 'personal');
        $precio = isset($input['precio']) ? (float)$input['precio'] : 0;
        $cantidad = isset($input['cantidad']) ? (int)$input['cantidad'] : 0;
        $stockMinimo = isset($input['stockMinimo']) ? (int)$input['stockMinimo'] : 10;
        $estado = trim($input['estado'] ?? 'disponible');

        if ($codPlato === '' || $nombre === '') {
            $this->json(['exito' => false, 'mensaje' => 'Código y nombre del plato son requeridos'], 400);
            return;
        }

        $tamanoPermitido = ['personal', 'mediana', 'familiar', 'grande'];
        if (!in_array($tamano, $tamanoPermitido, true)) {
            $this->json(['exito' => false, 'mensaje' => 'Tamaño de plato no válido'], 400);
            return;
        }

        if ($precio < 0) {
            $this->json(['exito' => false, 'mensaje' => 'El precio debe ser mayor o igual a 0'], 400);
            return;
        }

        $model = new Plato();
        try {
            $model->registrar([
                'codPlato' => $codPlato,
                'nombre' => $nombre,
                'descripcion' => $input['descripcion'] ?? null,
                'ingredientes' => $input['ingredientes'] ?? null,
                'tamano' => $tamano,
                'precio' => $precio,
                'cantidad' => $cantidad,
                'stockMinimo' => $stockMinimo,
                'rutaImg' => $input['rutaImg'] ?? null,
                'estado' => $estado,
            ]);

            $this->json(['exito' => true, 'CodPlato' => $codPlato, 'mensaje' => 'Plato registrado exitosamente'], 201);
        } catch (Exception $e) {
            error_log('Error en PlatoController::registrar: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al registrar plato', 'error' => $e->getMessage()], 500);
        }
    }

    public function subirImagen(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        try {
            // Validar que exista el archivo
            if (!isset($_FILES['imagen'])) {
                error_log('No file received in $_FILES');
                $this->json(['exito' => false, 'mensaje' => 'No se envió ningún archivo'], 400);
                return;
            }

            $file = $_FILES['imagen'];
            $codPlato = $_POST['codPlato'] ?? 'plato_' . time();

            // Log inicial
            error_log('Upload iniciado: codPlato=' . $codPlato . ', fileName=' . $file['name'] . ', size=' . $file['size']);

            // Validar que no haya error en la subida
            if ($file['error'] !== UPLOAD_ERR_OK) {
                $errorMsg = $this->getUploadErrorMessage($file['error']);
                error_log('Upload error: ' . $errorMsg);
                $this->json(['exito' => false, 'mensaje' => 'Error al subir el archivo: ' . $errorMsg], 500);
                return;
            }

            // Validar tipo de archivo
            $tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!in_array($file['type'], $tiposPermitidos)) {
                                error_log('Invalid file type: ' . $file['type']);
                $this->json(['exito' => false, 'mensaje' => 'Tipo de archivo no permitido. Solo se aceptan: JPG, PNG, GIF, WEBP'], 400);
                return;
            }

            // Validar tamaño (máximo 5MB)
            $tamanoMaximo = 5 * 1024 * 1024;
            if ($file['size'] > $tamanoMaximo) {
                                error_log('File too large: ' . $file['size']);
                $this->json(['exito' => false, 'mensaje' => 'El archivo es demasiado grande. Máximo: 5MB'], 400);
                return;
            }

            // Crear directorio si no existe
            $directorioDestino = __DIR__ . '/../../../img/platos/';
            
            // Crear directorio con permisos adecuados
            if (!is_dir($directorioDestino)) {
                if (!mkdir($directorioDestino, 0777, true)) {
                    error_log('Could not create directory: ' . $directorioDestino);
                    $this->json(['exito' => false, 'mensaje' => 'No se puede crear el directorio de destino'], 500);
                    return;
                }
                chmod($directorioDestino, 0777);
            }

            // Verificar que el directorio es escribible
            if (!is_writable($directorioDestino)) {
                error_log('Directory not writable: ' . $directorioDestino);
                error_log('Directory permissions: ' . substr(sprintf('%o', fileperms($directorioDestino)), -4));
                $this->json(['exito' => false, 'mensaje' => 'El directorio de destino no tiene permisos de escritura'], 500);
                return;
            }

            // Generar nombre único para el archivo
            $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $nombreArchivo = 'plato_' . sanitizeFilename($codPlato) . '_' . time() . '.' . $extension;
            $rutaCompleta = $directorioDestino . $nombreArchivo;
            $rutaRelativa = '/Proyecto_De_App_Fast_Food/img/platos/' . $nombreArchivo;
            error_log('Attempting to move file from: ' . $file['tmp_name']);
            error_log('Attempting to move file to: ' . $rutaCompleta);


            // Mover archivo al destino
            if (!move_uploaded_file($file['tmp_name'], $rutaCompleta)) {
                error_log('move_uploaded_file failed for: ' . $file['tmp_name']);

                // Intentar copia como alternativa
                if (!copy($file['tmp_name'], $rutaCompleta)) {
                    error_log('copy() also failed');
                    $this->json(['exito' => false, 'mensaje' => 'Error al guardar el archivo en el servidor'], 500);
                    return;
                }

                // Si copy funcionó, eliminar el archivo temporal
                @unlink($file['tmp_name']);
            }

            // Verificar que el archivo se guardó
            if (!file_exists($rutaCompleta)) {
                error_log('File does not exist after upload: ' . $rutaCompleta);
                $this->json(['exito' => false, 'mensaje' => 'Error al guardar el archivo en el servidor'], 500);
                return;
            }

            // Dar permisos de lectura
            chmod($rutaCompleta, 0644);

            error_log('File uploaded successfully: ' . $rutaCompleta);

            // Retornar éxito con la ruta de la imagen
            $this->json([
                'exito' => true,
                'mensaje' => 'Imagen subida correctamente',
                'rutaImg' => $rutaRelativa,
                'nombreArchivo' => $nombreArchivo
            ], 200);

        } catch (Exception $e) {
            error_log('Error en PlatoController::subirImagen: ' . $e->getMessage());
                        error_log('Stack trace: ' . $e->getTraceAsString());
            $this->json(['exito' => false, 'mensaje' => 'Error interno', 'error' => $e->getMessage()], 500);
        }
    }

    public function buscar(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $codPlato = $_GET['codPlato'] ?? '';
        if (trim($codPlato) === '') {
            $this->json(['exito' => false, 'mensaje' => 'Código de plato requerido'], 400);
            return;
        }

        $model = new Plato();
        try {
            $plato = $model->buscarPorCodigo($codPlato);
            if (!$plato) {
                $this->json(['exito' => false, 'mensaje' => 'Plato no encontrado'], 404);
                return;
            }

            $this->json(['exito' => true, 'plato' => $plato], 200);
        } catch (Exception $e) {
            error_log('Error en PlatoController::buscar: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al buscar plato', 'error' => $e->getMessage()], 500);
        }
    }

    public function actualizar(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $codPlato = trim($input['codPlato'] ?? '');
        $nombre = trim($input['nombre'] ?? '');
        $tamano = trim($input['tamano'] ?? 'personal');
        $precio = isset($input['precio']) ? (float)$input['precio'] : 0;
        $cantidad = isset($input['cantidad']) ? (int)$input['cantidad'] : 0;
        $stockMinimo = isset($input['stockMinimo']) ? (int)$input['stockMinimo'] : 10;
        $estado = trim($input['estado'] ?? 'disponible');

        if ($codPlato === '' || $nombre === '') {
            $this->json(['exito' => false, 'mensaje' => 'Código y nombre del plato son requeridos'], 400);
            return;
        }

        $tamanoPermitido = ['personal', 'mediana', 'familiar', 'grande'];
        if (!in_array($tamano, $tamanoPermitido, true)) {
            $this->json(['exito' => false, 'mensaje' => 'Tamaño de plato no válido'], 400);
            return;
        }

        if ($precio < 0) {
            $this->json(['exito' => false, 'mensaje' => 'El precio debe ser mayor o igual a 0'], 400);
            return;
        }

        $model = new Plato();
        try {
            $model->actualizar([
                'codPlato' => $codPlato,
                'nombre' => $nombre,
                'descripcion' => $input['descripcion'] ?? null,
                'ingredientes' => $input['ingredientes'] ?? null,
                'tamano' => $tamano,
                'precio' => $precio,
                'cantidad' => $cantidad,
                'stockMinimo' => $stockMinimo,
                'rutaImg' => $input['rutaImg'] ?? null,
                'estado' => $estado,
            ]);

            $this->json(['exito' => true, 'CodPlato' => $codPlato, 'mensaje' => 'Plato actualizado exitosamente'], 200);
        } catch (Exception $e) {
            error_log('Error en PlatoController::actualizar: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al actualizar plato', 'error' => $e->getMessage()], 500);
        }
    }

    private function getUploadErrorMessage($errorCode): string
    {
        $errorMessages = [
            UPLOAD_ERR_OK => 'No hay error',
            UPLOAD_ERR_INI_SIZE => 'El archivo es mayor que el permitido por el servidor (php.ini)',
            UPLOAD_ERR_FORM_SIZE => 'El archivo es mayor que el permitido en el formulario HTML',
            UPLOAD_ERR_PARTIAL => 'El archivo solo fue subido parcialmente',
            UPLOAD_ERR_NO_FILE => 'No se subió ningún archivo',
            UPLOAD_ERR_NO_TMP_DIR => 'Falta la carpeta temporal',
            UPLOAD_ERR_CANT_WRITE => 'No se pudo escribir el archivo en el disco',
            UPLOAD_ERR_EXTENSION => 'Una extensión de PHP detuvo la subida'
        ];
        
        return $errorMessages[$errorCode] ?? 'Error desconocido: ' . $errorCode;
    }
}
