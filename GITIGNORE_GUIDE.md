# Guía de Archivos a Ignorar en Git

## ✅ Archivos/Carpetas QUE DEBEN SUBIRSE al repositorio

### Código fuente
- `index.html` - Página principal
- `html/` - Todas las páginas HTML
- `js/` - Archivos JavaScript (excepto credenciales)
- `css/` - Todos los estilos CSS
- `sql/DataBase.sql` - Schema de la base de datos
- `sql/InsertarAdministrador.sql` - Datos iniciales
- `api/login.php` - Endpoint de login
- `api/` - Todos los endpoints de la API (sin config.php)
- `README.md` - Documentación
- `.gitignore` - Archivo de configuración de git
- `.htaccess` - Configuración de Apache
- `LICENSE` - Licencia del proyecto

## ❌ Archivos/Carpetas QUE NO DEBEN SUBIRSE

### Información Sensible
- `BD/` - Carpeta con:
  - `TestConexion.java` - Contiene credenciales
  - `VerificarCredenciales.java` - Contiene credenciales
  - `ActualizarContraseñas.java` - Contiene credenciales
  - `InsertarAdministrador.java` - Contiene credenciales
  - `EjecutarSQL.java` - Contiene credenciales
  - `mysql-connector-j-9.5.0/` - Driver MySQL
  - `*.class` - Archivos compilados Java
  - `.jar` - Archivos JAR
  - `README.md` - Instrucciones locales

### Configuración Local
- `api/config.php` - Contiene credenciales de BD
- `.env` - Variables de entorno
- `.env.local` - Variables locales

### Archivos de Desarrollo
- `/referencias/` - Archivos de referencia personales
- `/funcionalidades/` - Análisis de funcionalidades
- `node_modules/` - Dependencias npm
- `vendor/` - Dependencias PHP composer
- `.vscode/` - Configuración de VS Code
- `.idea/` - Configuración de PhpStorm/IntelliJ

### Archivos Temporales
- `*.log` - Archivos de log
- `*.tmp`, `*.bak` - Archivos temporales
- `*.swp`, `*.swo` - Archivos swap de vim
- `__pycache__/` - Caché de Python
- `cache/` - Caché general

### Otros
- `.DS_Store` - Archivos de macOS
- `Thumbs.db` - Archivos de Windows
- `*.pyc` - Bytecode Python

## 📝 Configuración en .gitignore

El archivo `.gitignore` ya está configurado para ignorar estos archivos automáticamente.

## 🔒 Credenciales de Base de Datos

**IMPORTANTE**: Las credenciales de la BD están en:
- `BD/` (archivos Java - NO subir)
- `api/config.php` (NO subir si se crea)
- `api/login.php` (credenciales hardcodeadas - se pueden eliminar después)

Para producción:
1. Crear un archivo `.env` con las credenciales
2. No incluir credenciales directas en el código
3. Usar variables de entorno

## 📋 Lista Completa del .gitignore

```
# Carpetas a ignorar
/BD/
/referencias/
/funcionalidades/
node_modules/
vendor/
composer_vendors/
cache/
__pycache__/

# Archivos a ignorar
*.log
*.tmp
*.bak
*.swp
*.swo
*~
api/config.php
.env
.env.local
.vscode/
.idea/
*.db
*.sqlite
```

## ✨ Recomendaciones

1. **Credenciales**: Mover todas las credenciales a variables de entorno (.env)
2. **Config.php**: Crear un `config.example.php` para mostrar la estructura
3. **BD/**: Mantener solo el `DataBase.sql` y `InsertarAdministrador.sql` en sql/
4. **Documentación**: Incluir instrucciones de setup en README.md

## 🚀 Para Nuevo Desarrollador

1. Clonar el repositorio
2. Descargar MySQL Connector desde: https://dev.mysql.com/downloads/connector/j/
3. Crear archivo `.env` con credenciales locales
4. Crear base de datos ejecutando `sql/DataBase.sql`
5. Ejecutar `sql/InsertarAdministrador.sql` para datos iniciales
6. Acceder a `http://localhost/Proyecto_De_App_Fast_Food/index.html`
