# SQL para "King's Pizza" (instrucciones)

Este directorio contiene dos scripts principales:

- `create_database.sql` — crea la base de datos `kings_pizza` y todas las tablas necesarias.
- `seed_data.sql` — inserta datos de ejemplo (roles, categorías, productos y un usuario administrador *placeholder*).

Cómo usar (Windows + XAMPP / PowerShell):

1) Abrir PowerShell y situarte en la carpeta del proyecto, por ejemplo:

```powershell
cd C:\xampp\htdocs\Proyecto_De_App_Fast_Food
```

2) Importar la estructura (create_database.sql):

```powershell
# Si mysql está en el PATH
mysql -u root -p < .\sql\create_database.sql

# O usando el ejecutable de XAMPP directamente
&C:\\xampp\\mysql\\bin\\mysql.exe -u root -p < .\sql\create_database.sql
```

3) Importar los datos de ejemplo:

```powershell
mysql -u root -p < .\sql\seed_data.sql
# o
&C:\\xampp\\mysql\\bin\\mysql.exe -u root -p < .\sql\seed_data.sql
```

Generar un hash bcrypt para la contraseña del admin (recomendado):

Si tienes PHP instalado, puedes generar un hash con este comando (PowerShell):

```powershell
php -r "echo password_hash('TuContraseñaSegura', PASSWORD_BCRYPT) . PHP_EOL;"
```

Copiar el valor mostrado y reemplazar `REPLACE_WITH_BCRYPT_HASH` en `seed_data.sql` o actualizar directamente el usuario en la BD:

```sql
USE kings_pizza;
UPDATE users SET password_hash = 'EL_HASH_GENERADO' WHERE username = 'admin';
```

Notas de seguridad y recomendaciones:
- Nunca uses contraseñas en texto plano en la BD. Usa bcrypt (PHP `password_hash`) o el mecanismo de tu stack.
- Ajusta permisos del usuario de la base de datos según el entorno (no uses root en producción).
- Revisa y adapta los tipos, longitudes y requerimientos a tus necesidades reales antes de poner en producción.

Si quieres, puedo:
- Añadir triggers para mantener el stock automático al procesar `purchase_items` o `sale_items`.
- Añadir vistas/índices extra para reportes (ventas por día, productos más vendidos).
