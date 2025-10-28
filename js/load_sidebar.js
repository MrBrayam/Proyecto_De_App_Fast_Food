/* ============================================
   CARGADOR AUTOMÁTICO DE SIDEBAR
   Inyecta el sidebar en todas las páginas
   ============================================ */

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    cargarSidebar();
});

function cargarSidebar() {
    const sidebarHTML = `
    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <div class="sidebar-logo">
                <i class="fas fa-pizza-slice"></i>
            </div>
            <h2 class="sidebar-title">King's Pizza</h2>
            <button class="sidebar-toggle" id="sidebarToggle" aria-label="Contraer menú">
                <i class="fas fa-bars"></i>
            </button>
        </div>

        <nav class="sidebar-nav">
            <ul class="nav-list">
                <!-- Dashboard -->
                <li class="nav-item" data-title="Dashboard">
                    <a href="menu_principal.html" class="nav-link">
                        <span class="nav-icon"><i class="fas fa-home"></i></span>
                        <span class="nav-text">Dashboard</span>
                    </a>
                </li>
                
                <!-- 1. Ventas -->
                <li class="nav-item has-submenu" data-title="Ventas">
                    <a href="#" class="nav-link">
                        <span class="nav-icon"><i class="fas fa-dollar-sign"></i></span>
                        <span class="nav-text">Ventas</span>
                        <span class="nav-arrow">▼</span>
                    </a>
                    <ul class="submenu">
                        <li class="submenu-item has-submenu">
                            <a href="#" class="submenu-link">
                                <span class="submenu-text">Venta</span>
                                <span class="nav-arrow">▼</span>
                            </a>
                            <ul class="submenu level-2">
                                <li class="submenu-item"><a href="registrar_venta.html" class="submenu-link">Registrar Venta</a></li>
                                <li class="submenu-item"><a href="visualizar_venta.html" class="submenu-link">Visualizar Venta</a></li>
                            </ul>
                        </li>
                        <li class="submenu-item has-submenu">
                            <a href="#" class="submenu-link">
                                <span class="submenu-text">Impresoras</span>
                                <span class="nav-arrow">▼</span>
                            </a>
                            <ul class="submenu level-2">
                                <li class="submenu-item"><a href="registrar_impresoras.html" class="submenu-link">Registrar Impresoras</a></li>
                                <li class="submenu-item"><a href="visualizar_impresoras.html" class="submenu-link">Visualizar Impresoras</a></li>
                            </ul>
                        </li>
                        <li class="submenu-item has-submenu">
                            <a href="#" class="submenu-link">
                                <span class="submenu-text">Promociones</span>
                                <span class="nav-arrow">▼</span>
                            </a>
                            <ul class="submenu level-2">
                                <li class="submenu-item"><a href="registrar_promociones.html" class="submenu-link">Registrar Promociones</a></li>
                                <li class="submenu-item"><a href="visualizar_promociones.html" class="submenu-link">Visualizar Promociones</a></li>
                            </ul>
                        </li>
                        <li class="submenu-item has-submenu">
                            <a href="#" class="submenu-link">
                                <span class="submenu-text">Mesas</span>
                                <span class="nav-arrow">▼</span>
                            </a>
                            <ul class="submenu level-2">
                                <li class="submenu-item"><a href="registrar_mesas.html" class="submenu-link">Registrar Mesas</a></li>
                                <li class="submenu-item"><a href="visualizar_mesas.html" class="submenu-link">Visualizar Mesas</a></li>
                            </ul>
                        </li>
                        <li class="submenu-item has-submenu">
                            <a href="#" class="submenu-link">
                                <span class="submenu-text">Pedidos</span>
                                <span class="nav-arrow">▼</span>
                            </a>
                            <ul class="submenu level-2">
                                <li class="submenu-item"><a href="registrar_pedidos.html" class="submenu-link">Registrar Pedidos</a></li>
                                <li class="submenu-item"><a href="visualizar_pedidos.html" class="submenu-link">Visualizar Pedidos</a></li>
                            </ul>
                        </li>
                        <li class="submenu-item has-submenu">
                            <a href="#" class="submenu-link">
                                <span class="submenu-text">Platos</span>
                                <span class="nav-arrow">▼</span>
                            </a>
                            <ul class="submenu level-2">
                                <li class="submenu-item"><a href="registrar_platos.html" class="submenu-link">Registrar Platos</a></li>
                                <li class="submenu-item"><a href="visualizar_platos.html" class="submenu-link">Visualizar Platos</a></li>
                            </ul>
                        </li>
                        <li class="submenu-item has-submenu">
                            <a href="#" class="submenu-link">
                                <span class="submenu-text">Caja</span>
                                <span class="nav-arrow">▼</span>
                            </a>
                            <ul class="submenu level-2">
                                <li class="submenu-item"><a href="apertura_caja.html" class="submenu-link">Apertura Caja</a></li>
                                <li class="submenu-item"><a href="visualizar_caja.html" class="submenu-link">Visualizar Cajas</a></li>
                                <li class="submenu-item"><a href="cerrar_caja.html" class="submenu-link">Cerrar Caja</a></li>
                            </ul>
                        </li>
                    </ul>
                </li>
                
                <!-- 2. Compras -->
                <li class="nav-item has-submenu" data-title="Compras">
                    <a href="#" class="nav-link">
                        <span class="nav-icon"><i class="fas fa-shopping-cart"></i></span>
                        <span class="nav-text">Compras</span>
                        <span class="nav-arrow">▼</span>
                    </a>
                    <ul class="submenu">
                        <li class="submenu-item has-submenu">
                            <a href="#" class="submenu-link">
                                <span class="submenu-text">Compras</span>
                                <span class="nav-arrow">▼</span>
                            </a>
                            <ul class="submenu level-2">
                                <li class="submenu-item"><a href="registrar_compras.html" class="submenu-link">Registrar Compras</a></li>
                                <li class="submenu-item"><a href="visualizar_compras.html" class="submenu-link">Visualizar Compras</a></li>
                            </ul>
                        </li>
                        <li class="submenu-item has-submenu">
                            <a href="#" class="submenu-link">
                                <span class="submenu-text">Inventario</span>
                                <span class="nav-arrow">▼</span>
                            </a>
                            <ul class="submenu level-2">
                                <li class="submenu-item"><a href="visualizar_inventario.html" class="submenu-link">Visualizar Inventario</a></li>
                                <li class="submenu-item"><a href="registrar_insumo.html" class="submenu-link">Registrar Insumo</a></li>
                                <li class="submenu-item"><a href="registrar_suministros.html" class="submenu-link">Registrar Suministro</a></li>
                            </ul>
                        </li>
                        <li class="submenu-item has-submenu">
                            <a href="#" class="submenu-link">
                                <span class="submenu-text">Proveedores</span>
                                <span class="nav-arrow">▼</span>
                            </a>
                            <ul class="submenu level-2">
                                <li class="submenu-item"><a href="registrar_proveedor.html" class="submenu-link">Registrar Proveedor</a></li>
                                <li class="submenu-item"><a href="visualizar_proveedores.html" class="submenu-link">Visualizar Proveedor</a></li>
                            </ul>
                        </li>
                        <li class="submenu-item has-submenu">
                            <a href="#" class="submenu-link">
                                <span class="submenu-text">Productos</span>
                                <span class="nav-arrow">▼</span>
                            </a>
                            <ul class="submenu level-2">
                                <li class="submenu-item"><a href="registrar_producto.html" class="submenu-link">Registrar Producto</a></li>
                                <li class="submenu-item"><a href="visualizar_productos.html" class="submenu-link">Visualizar Producto</a></li>
                            </ul>
                        </li>
                    </ul>
                </li>
                
                <!-- 3. Usuarios -->
                <li class="nav-item has-submenu" data-title="Usuarios">
                    <a href="#" class="nav-link">
                        <span class="nav-icon"><i class="fas fa-users"></i></span>
                        <span class="nav-text">Usuarios</span>
                        <span class="nav-arrow">▼</span>
                    </a>
                    <ul class="submenu">
                        <li class="submenu-item"><a href="registrar_usuario.html" class="submenu-link">Registrar Usuario</a></li>
                        <li class="submenu-item has-submenu">
                            <a href="#" class="submenu-link">
                                <span class="submenu-text">Visualizar Usuarios</span>
                                <span class="nav-arrow">▼</span>
                            </a>
                            <ul class="submenu level-2">
                                <li class="submenu-item"><a href="ver_administradores.html" class="submenu-link">Ver Administradores</a></li>
                                <li class="submenu-item"><a href="ver_meseros.html" class="submenu-link">Ver Meseros</a></li>
                                <li class="submenu-item"><a href="ver_cajero.html" class="submenu-link">Ver Cajero</a></li>
                                <li class="submenu-item"><a href="ver_repartidores.html" class="submenu-link">Ver Repartidores</a></li>
                            </ul>
                        </li>
                    </ul>
                </li>
                
                <!-- 5. Clientes -->
                <li class="nav-item has-submenu" data-title="Clientes">
                    <a href="#" class="nav-link">
                        <span class="nav-icon"><i class="fas fa-users"></i></span>
                        <span class="nav-text">Clientes</span>
                        <span class="nav-arrow">▼</span>
                    </a>
                    <ul class="submenu">
                        <li class="submenu-item"><a href="registrar_clientes.html" class="submenu-link">Registrar Clientes</a></li>
                        <li class="submenu-item"><a href="visualizar_clientes.html" class="submenu-link">Visualizar Clientes</a></li>
                    </ul>
                </li>
                
                <!-- 6. Reportes -->
                <li class="nav-item has-submenu" data-title="Reportes">
                    <a href="#" class="nav-link">
                        <span class="nav-icon"><i class="fas fa-chart-line"></i></span>
                        <span class="nav-text">Reportes</span>
                        <span class="nav-arrow">▼</span>
                    </a>
                    <ul class="submenu">
                        <li class="submenu-item"><a href="visualizar_reportes_de_compras.html" class="submenu-link">Visualizar Reporte de Compras</a></li>
                        <li class="submenu-item"><a href="visualizar_ganancias.html" class="submenu-link">Visualizar Ganancias</a></li>
                        <li class="submenu-item"><a href="reporte_ventas.html" class="submenu-link">Visualizar Reporte de Ventas</a></li>
                        <li class="submenu-item"><a href="rendimiento_trabajador.html" class="submenu-link">Visualizar Rendimiento de Trabajador</a></li>
                        <li class="submenu-item"><a href="generar_reportes.html" class="submenu-link">Generar Reportes de Ventas</a></li>
                    </ul>
                </li>
                
                <!-- 7. Seguridad -->
                <li class="nav-item has-submenu" data-title="Seguridad">
                    <a href="#" class="nav-link">
                        <span class="nav-icon"><i class="fas fa-shield-alt"></i></span>
                        <span class="nav-text">Seguridad</span>
                        <span class="nav-arrow">▼</span>
                    </a>
                    <ul class="submenu">
                        <li class="submenu-item has-submenu">
                            <a href="#" class="submenu-link">
                                <span class="submenu-text">Usuarios</span>
                                <span class="nav-arrow">▼</span>
                            </a>
                            <ul class="submenu level-2">
                                <li class="submenu-item"><a href="seguridad_registrar_usuarios.html" class="submenu-link">Registrar Usuarios</a></li>
                                <li class="submenu-item"><a href="seguridad_visualizar_usuarios.html" class="submenu-link">Visualizar Usuarios</a></li>
                            </ul>
                        </li>
                        <li class="submenu-item has-submenu">
                            <a href="#" class="submenu-link">
                                <span class="submenu-text">Tipo de Perfil</span>
                                <span class="nav-arrow">▼</span>
                            </a>
                            <ul class="submenu level-2">
                                <li class="submenu-item"><a href="registrar_perfil.html" class="submenu-link">Registrar Tipo de Perfil</a></li>
                                <li class="submenu-item"><a href="visualizar_perfil.html" class="submenu-link">Visualizar Perfil</a></li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>

        <div class="sidebar-footer">
            <div class="user-info">
                <div class="user-avatar"><i class="fas fa-user-circle"></i></div>
                <div class="user-details">
                    <p class="user-name">Usuario Admin</p>
                    <p class="user-role">Administrador</p>
                </div>
            </div>
            <button class="logout-btn" id="logoutBtn" title="Cerrar sesión">
                <span class="logout-icon"><i class="fas fa-sign-out-alt"></i></span>
                <span class="logout-text">Cerrar Sesión</span>
            </button>
        </div>
    </aside>
    `;
    
    // Insertar el sidebar al inicio del body
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
    
    // Después de cargar el sidebar, inicializar el menu_principal.js si existe
    if (typeof initializeSidebar === 'function') {
        initializeSidebar();
    }
}
