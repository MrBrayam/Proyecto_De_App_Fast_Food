# King's Pizza - Sistema de Gestión Fast Food

Sistema completo de gestión para restaurantes de comida rápida. Permite administrar ventas, pedidos, inventario, personal, clientes y reportes en tiempo real.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![PHP](https://img.shields.io/badge/PHP-8.0+-purple.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Uso](#-uso)
- [API REST](#-api-rest)
- [Base de Datos](#-base-de-datos)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## Características

### Sistema de Autenticación
- Login por empresa con credenciales
- Login de usuarios con roles diferenciados
- Gestión de perfiles y permisos personalizables
- Seguridad mediante sesiones y validaciones

### Gestión de Ventas
- Registro de ventas con múltiples métodos de pago (efectivo, tarjeta, Yape, Plin)
- Sistema de descuentos y promociones
- Gestión de caja (apertura, cierre, cuadre)
- Historial de transacciones

### Gestión de Pedidos
- Pedidos para local, delivery y para llevar
- Asignación de mesas
- Estados de pedidos (pendiente, preparando, listo, entregado)
- Control de tiempos de preparación

### Inventario
- Control de productos y platos
- Gestión de insumos y suministros
- Alertas de stock bajo
- Actualización automática de inventario
- Proveedores y compras

### Gestión de Personal
- Roles: Administrador, Cajero, Mesero, Repartidor
- Permisos granulares por módulo
- Registro de usuarios del sistema
- Historial de actividades

### Gestión de Clientes
- Base de datos de clientes
- Historial de pedidos por cliente
- Monto gastado acumulado
- Tienda online para clientes

### Reportes y Análisis
- Reportes de ventas diarias, semanales, mensuales
- Análisis de productos más vendidos
- Estado de inventario
- Ganancias y pérdidas
- Reportes de compras

### Características Adicionales
- Gestión de mesas con estados
- Promociones con fechas y restricciones
- Sistema de delivery integrado
- Interfaz responsive
- Modo claro/oscuro

---

## Tecnologías

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos personalizados con modo claro/oscuro
- **JavaScript (Vanilla)** - Lógica del cliente
- **Font Awesome** - Iconos

### Backend
- **PHP 8.0+** - Lenguaje del servidor
- **MySQL 8.0+** - Base de datos relacional
- **PDO** - Capa de abstracción de base de datos
- **Stored Procedures** - Lógica de negocio en BD

### Arquitectura
- **API REST** - Comunicación cliente-servidor
- **MVC** - Patrón de diseño
- **Rutas limpias** - Mediante .htaccess
- **JSON** - Formato de intercambio de datos

---

## Requisitos

- **XAMPP** 8.0 o superior (incluye Apache + PHP + MySQL)
- **Navegador web** moderno (Chrome, Firefox, Edge)
- **Git** (opcional, para clonar el repositorio)


---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/MrBrayam/Proyecto_De_App_Fast_Food.git
cd Proyecto_De_App_Fast_Food
```

O descarga el ZIP y extrae en `C:\xampp\htdocs\`

### 2. Iniciar servicios de XAMPP

1. Abre el **Panel de Control de XAMPP**
2. Inicia el servicio **Apache**
3. Inicia el servicio **MySQL**

### 3. Crear la base de datos

**Opción A: Mediante phpMyAdmin**
1. Abre http://localhost/phpmyadmin
2. Crea una nueva base de datos llamada `kings_pizza_db`
3. Importa el archivo `sql/DataBase.sql`

**Opción B: Mediante línea de comandos**
```bash
mysql -u root -p < sql/DataBase.sql
```

Si tienes contraseña en MySQL:
```bash
mysql -u root -p[tu_contraseña] < sql/DataBase.sql
```

### 4. Configurar la conexión a la base de datos

Edita el archivo `api/config.php`:

```php
<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'kings_pizza_db');
define('DB_USER', 'root');
define('DB_PASS', ''); // Tu contraseña de MySQL
define('DB_CHARSET', 'utf8mb4');
```

### 5. Verificar .htaccess

Asegúrate de que los archivos `.htaccess` estén presentes:
- `/Proyecto_De_App_Fast_Food/.htaccess`
- `/Proyecto_De_App_Fast_Food/api/.htaccess`
- `/Proyecto_De_App_Fast_Food/api/public/.htaccess`

---

## ⚙️ Configuración

### Usuarios por defecto

**Empresa:**
- Nombre: `King's Pizza`
- Contraseña: `1234`

**Usuarios del sistema:**

| Usuario | Contraseña | Rol | Email |
|---------|-----------|-----|-------|
| admin | admin123 | Administrador | admin@kingspizza.com |
| cajero | cajero123 | Cajero | jperez@kingspizza.com |
| mesero | mesero123 | Mesero | mgonzalez@kingspizza.com |
| delivery | delivery123 | Repartidor | cramirez@kingspizza.com |

### Configuración de permisos

Edita los permisos por rol en la base de datos, tabla `Perfiles`, o mediante la interfaz de administración en:
- `html/registrar_perfil.html`
- `html/visualizar_perfil.html`

---

## 📁 Estructura del Proyecto

```
Proyecto_De_App_Fast_Food/
│
├── 📄 index.html                 # Login de usuarios (punto de entrada)
│
├── 📁 api/                       # Backend (API REST)
│   ├── 📄 config.php            # Configuración de BD
│   ├── 📁 app/
│   │   ├── 📁 controllers/      # Controladores (PedidoController, VentaController, etc.)
│   │   ├── 📁 models/           # Modelos (Pedido, Venta, Cliente, etc.)
│   │   ├── 📁 core/             # Database.php (Conexión PDO)
│   │   └── 📄 routes.php        # Enrutamiento de API
│   └── 📁 public/
│       └── 📄 index.php         # Entry point API
│
├── 📁 html/                      # Páginas del sistema
│   ├── menu_principal.html
│   ├── tienda.html
│   ├── mis_pedidos.html
│   ├── registrar_*.html
│   └── visualizar_*.html
│
├── 📁 css/                       # Estilos
│   ├── styles.css
│   ├── login.css
│   ├── modo-claro/
│   └── modo-oscuro/
│
├── 📁 js/                        # JavaScript del cliente
│   ├── login.js
│   ├── menu_principal.js
│   ├── tienda.js
│   ├── registrar_*.js
│   └── visualizar_*.js
│
├── 📁 sql/                       # Scripts de base de datos
│   └── DataBase.sql             # Schema + datos iniciales + SPs
│
├── 📁 img/                       # Imágenes del sistema
│   └── platos/                  # Imágenes de productos
│
└── 📄 DOCUMENTACION_SISTEMA.txt  # Documentación técnica completa
```

---

## Uso

### Acceso al Sistema

1. **Abrir el navegador** y navega a:
   ```
   http://localhost/Proyecto_De_App_Fast_Food/index.html
   ```

2. **Login de Empresa:**
   - Nombre: `King's Pizza`
   - Contraseña: `1234`
   - Clic en **Ingresar**

3. **Login de Usuario:**
   - Usuario: `admin`
   - Contraseña: `admin123`
   - Clic en **Iniciar Sesión**

4. **Navegar por el sistema** desde el menú principal

### Tienda Online (Clientes)

Los clientes pueden acceder directamente a:
```
http://localhost/Proyecto_De_App_Fast_Food/html/tienda.html
```

Para realizar pedidos sin necesidad de login del sistema.

---

### Endpoints principales

#### Autenticación
```
POST /api/auth/login-empresa     # Login de empresa
POST /api/auth/login              # Login de usuario
```

#### Pedidos
```
GET  /api/pedidos/listar          # Listar todos los pedidos
POST /api/pedidos/registrar       # Crear nuevo pedido
GET  /api/pedidos/buscar?id=1     # Buscar pedido por ID
POST /api/pedidos/actualizar-estado # Actualizar estado de pedido
```

#### Ventas
```
GET  /api/ventas/listar           # Listar ventas
POST /api/ventas/registrar        # Registrar venta
GET  /api/ventas/buscar?id=1      # Buscar venta por ID
```

#### Productos
```
GET  /api/productos/listar        # Listar productos
POST /api/productos/registrar     # Crear producto
GET  /api/productos/buscar?id=1   # Buscar producto
PUT  /api/productos/actualizar    # Actualizar producto
```

#### Clientes
```
GET  /api/clientes/listar         # Listar clientes
POST /api/clientes/registrar      # Registrar cliente
GET  /api/clientes/buscar?documento=123 # Buscar por documento
```

#### Inventario
```
GET  /api/inventario/productos    # Inventario de productos
GET  /api/inventario/insumos      # Inventario de insumos
GET  /api/inventario/suministros  # Inventario de suministros
```

#### Reportes
```
GET  /api/reportes/ventas-diarias # Reporte de ventas del día
GET  /api/reportes/productos-vendidos # Productos más vendidos
GET  /api/reportes/ganancias      # Reporte de ganancias
```

### Formato de respuesta

```json
{
  "exito": true,
  "mensaje": "Operación exitosa",
  "data": { ... }
}
```

### Manejo de errores

```json
{
  "exito": false,
  "mensaje": "Descripción del error",
  "error": "Detalles técnicos"
}
```

---

## Base de Datos

### Diagrama ER (Entidades principales)

```
Empresas ──┐
           │
Perfiles ──┼── Usuarios ──┬── Pedidos ──── DetallePedido
           │              │
Proveedores┼── Productos ─┤
           │              │
           ├── Platos ────┤
           │              │
           ├── Insumos    └── Ventas ──── DetalleVenta
           │
           ├── Suministros
           │
Clientes ──┤
           │
Mesas ─────┤
           │
Promociones┼── PromocionProducto
           │
Caja ──────┤
           │
Compras ───┴── DetalleCompra
```

### Tablas principales (18 tablas)

1. **Empresas** - Datos de la empresa
2. **Perfiles** - Roles y permisos
3. **Usuarios** - Personal del sistema
4. **Clientes** - Clientes del negocio
5. **Proveedores** - Proveedores de insumos
6. **Mesas** - Mesas del restaurante
7. **Productos** - Productos en venta
8. **Platos** - Platos especiales
9. **Promociones** - Ofertas y descuentos
10. **PromocionProducto** - Relación M:N
11. **Caja** - Movimientos de caja
12. **Pedidos** - Pedidos de clientes
13. **DetallePedido** - Ítems de pedidos
14. **Ventas** - Ventas realizadas
15. **DetalleVenta** - Ítems de ventas
16. **Compras** - Compras a proveedores
17. **DetalleCompra** - Ítems de compras
18. **Insumos** - Inventario de insumos
19. **Suministros** - Artículos operativos

### Stored Procedures (30+)

- `pa_registrar_pedido`
- `pa_registrar_venta`
- `pa_registrar_cliente`
- `pa_registrar_producto`
- `pa_listar_*`
- `pa_buscar_*`
- `pa_actualizar_*`
- Y más...

### Triggers automáticos

- **ActualizarEstadoProductoUpdate** - Actualiza estado según stock
- **ActualizarEstadoPlatoUpdate** - Actualiza estado según cantidad
- **ActualizarMontoCliente** - Acumula gasto del cliente
- **CalcularSubtotal*** - Calcula subtotales automáticamente

