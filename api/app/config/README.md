# Configuración de la API

## Archivos de Configuración

### `config.example.php` (Template)
Este archivo es un ejemplo y **SÍ se sube a GitHub**. Contiene la estructura de configuración sin credenciales sensibles.

### `config.php` (Archivo real)
Este archivo contiene tus credenciales reales y **NO debe subirse a GitHub** (protegido por .gitignore).

## Configuración Inicial

1. Copiar el archivo de ejemplo:
   ```bash
   cp config.example.php config.php
   ```

2. Editar `config.php` con tus credenciales:
   ```php
   'db' => [
       'host' => 'localhost',
       'name' => 'kings_pizza_db',
       'user' => 'root',
       'pass' => 'TU_CONTRASEÑA_AQUI',  // ⚠️ Cambiar
       'charset' => 'utf8mb4',
   ],
   'auth' => [
       'secret' => 'TU_CLAVE_SECRETA',   // ⚠️ Cambiar
       'ttl' => 86400,
   ],
   ```

3. **Verificar que `config.php` esté en .gitignore**

## Seguridad

⚠️ **NUNCA subas el archivo `config.php` a GitHub**
- Contiene credenciales de base de datos
- Contiene claves secretas de autenticación
- Está protegido por `.gitignore`

✅ **Solo sube `config.example.php`**
- No contiene credenciales reales
- Sirve como documentación para otros desarrolladores
