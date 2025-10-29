-- Script: seed_data.sql
-- Propósito: datos iniciales de ejemplo (roles, usuario admin placeholder, categorías y productos)
-- IMPORTANTE: Reemplaza el valor de password_hash por un hash bcrypt real antes de usar en producción.

USE `kings_pizza`;

-- Roles básicos (INSERT IGNORE para re-ejecuciones seguras)
INSERT IGNORE INTO roles (name, description) VALUES
('admin', 'Administrador con todos los permisos'),
('cajero', 'Encargado de caja'),
('mesero', 'Atiende mesas y toma pedidos'),
('repartidor', 'Realiza entregas');

-- Usuario administrador (REEMPLAZAR password_hash)
-- Genera un hash bcrypt y pégalo en el campo password_hash.
-- Usamos SELECT para obtener role_id dinámicamente
INSERT INTO users (username, password_hash, role_id, full_name, email, phone, is_active)
SELECT 'admin', '$2a$12$gL6qewuqw8Bbbo/biokEMeqSaqhJY67cZ6UNYblLwj.yvFRskAzl6', r.id, 'Administrador Principal', 'marco21reategui@gmail.com', '', 1
FROM roles r
WHERE r.name = 'admin'
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), email = VALUES(email), is_active = VALUES(is_active);

-- Categorías de ejemplo
INSERT IGNORE INTO categories (name, description) VALUES
('Pizzas', 'Pizzas tradicionales y gourmet'),
('Bebidas', 'Refrescos, jugos y aguas'),
('Postres', 'Postres y complementos');

-- Productos de ejemplo
-- Usamos INSERT ... SELECT para mapear category_id; si la categoría no existe, la fila no se insertará
INSERT IGNORE INTO products (category_id, name, description, price, stock, is_active)
SELECT c.id, p.name, p.description, p.price, p.stock, p.is_active
FROM (SELECT 'Pizza Margarita' AS name, 'Tomate, mozzarella y albahaca' AS description, 8.50 AS price, 20 AS stock, 1 AS is_active, 'Pizzas' AS cat UNION ALL
	SELECT 'Pizza Pepperoni','Pepperoni y queso',9.50,15,1,'Pizzas' UNION ALL
	SELECT 'Coca-Cola 500ml','Refresco',1.50,50,1,'Bebidas' UNION ALL
	SELECT 'Tiramisú','Postre tradicional italiano',3.00,10,1,'Postres'
     ) p
JOIN categories c ON c.name = p.cat;

-- Impresora de ejemplo (opcional)
INSERT IGNORE INTO printers (name, ip_address, port, is_active) VALUES ('Impresora Cocina', '192.168.0.100', 9100, 1);

-- Fin del script de ejemplo
