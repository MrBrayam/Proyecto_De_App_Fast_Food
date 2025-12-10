// ============================================
// MENÚ PRINCIPAL - KING'S PIZZA
// Funcionalidad del dashboard con sidebar y métricas
// ============================================

console.log('menu_principal.js cargado correctamente');

const API_BASE = '/Proyecto_De_App_Fast_Food/api';
const DEBUG_DASHBOARD = true; // poner en false para silenciar logs

console.log('DEBUG_DASHBOARD:', DEBUG_DASHBOARD);

// ============================================
// SISTEMA DE PERMISOS
// ============================================
function aplicarPermisos() {
    // Obtener permisos del usuario - pueden estar en userPermisos o dentro de userSession
    let userPermisos = JSON.parse(localStorage.getItem('userPermisos') || '{}');
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    
    // Si no hay permisos en userPermisos, intentar obtenerlos de userSession
    if (Object.keys(userPermisos).length === 0 && userSession.permisos) {
        userPermisos = userSession.permisos;
    }
    
    console.log('=== SISTEMA DE PERMISOS ===');
    console.log('Usuario:', userSession.nombre, '- Perfil:', userSession.perfil);
    console.log('Permisos del usuario:', userPermisos);
    console.log('Total de permisos:', Object.keys(userPermisos).length);
    
    // Si no hay permisos, mostrar advertencia y salir
    if (Object.keys(userPermisos).length === 0) {
        console.warn('⚠️ No se encontraron permisos para el usuario. Mostrando todo el menú por defecto.');
        return;
    }
    
    // Mapeo de data-permiso a permiso del backend
    const permisoMap = {
        'registrar-venta': 'registrarVenta',
        'visualizar-venta': 'visualizarVenta',
        'registrar-promociones': 'registrarPromociones',
        'visualizar-promociones': 'visualizarPromociones',
        'registrar-mesas': 'registrarMesas',
        'visualizar-mesas': 'visualizarMesas',
        'registrar-pedidos': 'registrarPedidos',
        'visualizar-pedidos': 'visualizarPedidos',
        'apertura-caja': 'aperturaCaja',
        'visualizar-caja': 'visualizarCaja',
        'cerrar-caja': 'cerrarCaja',
        'registrar-compras': 'registrarCompras',
        'visualizar-compras': 'visualizarCompras',
        'registrar-inventario': 'registrarInventario',
        'visualizar-inventario': 'visualizarInventario',
        'registrar-insumo': 'registrarInsumo',
        'registrar-proveedores': 'registrarProveedores',
        'visualizar-proveedores': 'visualizarProveedores',
        'registrar-producto': 'registrarProducto',
        'registrar-usuarios': 'registrarUsuarios',
        'visualizar-usuarios': 'visualizarUsuarios',
        'registrar-clientes': 'registrarClientes',
        'visualizar-clientes': 'visualizarClientes',
        'generar-reportes': 'generarReportes',
        'seguridad-registrar-usuarios': 'seguridadRegistrarUsuarios',
        'seguridad-visualizar-usuarios': 'seguridadVisualizarUsuarios',
        'seguridad-registrar-perfiles': 'seguridadRegistrarPerfiles',
        'seguridad-visualizar-perfiles': 'seguridadVisualizarPerfiles'
    };
    
    // Obtener todos los elementos con data-permiso
    const elementosConPermiso = document.querySelectorAll('[data-permiso]');
    
    console.log(`Encontrados ${elementosConPermiso.length} elementos con permisos`);
    
    let ocultados = 0;
    let mostrados = 0;
    
    elementosConPermiso.forEach(elemento => {
        const permisoRequerido = elemento.getAttribute('data-permiso');
        const permisoKey = permisoMap[permisoRequerido];
        
        if (!permisoKey) {
            console.warn(`⚠️ Permiso no mapeado: ${permisoRequerido}`);
            return;
        }
        
        // Si el usuario NO tiene el permiso, ocultar el elemento
        if (!userPermisos[permisoKey]) {
            elemento.style.display = 'none';
            ocultados++;
            console.log(`❌ Permiso denegado: ${permisoRequerido} → ${permisoKey} = ${userPermisos[permisoKey]}`);
        } else {
            elemento.style.display = '';
            mostrados++;
            console.log(`✅ Permiso concedido: ${permisoRequerido} → ${permisoKey} = ${userPermisos[permisoKey]}`);
        }
    });
    
    console.log(`📊 Resumen: ${mostrados} elementos mostrados, ${ocultados} elementos ocultados`);
    
    // Ocultar secciones de menú si no tienen elementos visibles
    const navItems = document.querySelectorAll('.nav-item.has-submenu');
    navItems.forEach(navItem => {
        const submenu = navItem.querySelector('.submenu');
        if (submenu) {
            // Revisar submenús de nivel 2 primero
            const submenuItems = submenu.querySelectorAll('.submenu-item.has-submenu');
            submenuItems.forEach(submenuItem => {
                const submenuLevel2 = submenuItem.querySelector('.submenu.level-2');
                if (submenuLevel2) {
                    const elementosVisiblesLevel2 = Array.from(submenuLevel2.children).filter(
                        child => child.style.display !== 'none'
                    );
                    
                    // Si no hay elementos visibles en nivel 2, ocultar el submenu-item padre
                    if (elementosVisiblesLevel2.length === 0) {
                        submenuItem.style.display = 'none';
                    }
                }
            });
            
            // Ahora revisar el submenú principal
            const elementosVisibles = Array.from(submenu.children).filter(
                child => child.style.display !== 'none'
            );
            
            // Si no hay elementos visibles en el submenú, ocultar todo el nav-item
            if (elementosVisibles.length === 0) {
                navItem.style.display = 'none';
                console.log('Ocultando sección de menú sin permisos:', navItem.querySelector('.nav-link')?.textContent);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded ejecutado en menu_principal');
    
    // Esperar a que el sidebar se cargue antes de aplicar permisos
    setTimeout(() => {
        aplicarPermisos();
    }, 100);
    
    // Elementos del DOM
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const logoutBtn = document.getElementById('logoutBtn');
    const currentDateElement = document.getElementById('currentDate');
    
    // ============================================
    // TOGGLE SIDEBAR (Desktop)
    // ============================================
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            sidebar.classList.toggle('collapsed');
            
            // Si se colapsa, cerrar todos los submenús abiertos
            if (sidebar.classList.contains('collapsed')) {
                const openItems = document.querySelectorAll('.nav-item.open, .submenu-item.open');
                openItems.forEach(item => item.classList.remove('open'));
            }
            
            // Guardar estado en localStorage
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        });
    }
    
    // ============================================
    // MENÚ DESPLEGABLE (ACCORDION)
    // ============================================
    
    // Manejar clicks en items con submenú
    const navItemsWithSubmenu = document.querySelectorAll('.nav-item.has-submenu > .nav-link');
    
    navItemsWithSubmenu.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // No hacer nada si el sidebar está colapsado
            if (sidebar && sidebar.classList.contains('collapsed')) {
                return;
            }
            
            const parentItem = this.parentElement;
            if (!parentItem) {
                return;
            }
            
            const isOpen = parentItem.classList.contains('open');
            
            // Cerrar otros items del mismo nivel
            const siblings = Array.from(parentItem.parentElement.children).filter(
                item => item !== parentItem && item.classList.contains('has-submenu')
            );
            siblings.forEach(sibling => sibling.classList.remove('open'));
            
            // Toggle del item actual
            parentItem.classList.toggle('open');
        });
    });
    
    // Manejar clicks en submenu items con submenu (nivel 2)
    const submenuItemsWithSubmenu = document.querySelectorAll('.submenu-item.has-submenu > .submenu-link');
    
    submenuItemsWithSubmenu.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const parentItem = this.parentElement;
            if (!parentItem) {
                return;
            }
            
            const isOpen = parentItem.classList.contains('open');
            
            // Cerrar otros items del mismo nivel
            const siblings = Array.from(parentItem.parentElement.children).filter(
                item => item !== parentItem && item.classList.contains('has-submenu')
            );
            siblings.forEach(sibling => sibling.classList.remove('open'));
            
            // Toggle del item actual
            parentItem.classList.toggle('open');
        });
    });
    
    // Marcar como activo el enlace actual
    const currentPath = window.location.pathname;
    const allLinks = document.querySelectorAll('.nav-link, .submenu-link');
    
    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href)) {
            link.classList.add('active');
            
            // Abrir todos los padres
            let parent = link.closest('.submenu-item');
            while (parent) {
                const parentNavItem = parent.closest('.nav-item, .submenu-item');
                if (parentNavItem) {
                    parentNavItem.classList.add('open');
                }
                parent = parentNavItem?.parentElement?.closest('.submenu-item');
            }
            
            // Abrir el nav-item principal
            const mainNavItem = link.closest('.nav-item');
            if (mainNavItem) {
                mainNavItem.classList.add('open');
            }
        }
        
        // Cerrar sidebar en móvil al hacer clic en un enlace real
        if (href && href !== '#') {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
            });
        }
    });
    
    // ============================================
    // TOGGLE SIDEBAR (Mobile)
    // ============================================
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            sidebar.classList.toggle('active');
            
            // En móviles, asegurar que no esté colapsado
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('collapsed');
            }
        });
    }
    
    // Cerrar sidebar en mobile al hacer click fuera
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnToggle = mobileMenuToggle && mobileMenuToggle.contains(event.target);
            
            if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });

    // ============================================
    // MÉTRICAS DEL DASHBOARD
    // ============================================
    console.log('Llamando a cargarMetricasDashboard...');
    
    // Esperar un momento para que el DOM esté completamente listo
    setTimeout(() => {
        console.log('Ejecutando cargarMetricasDashboard después de timeout');
        cargarMetricasDashboard();
    }, 100);
    

// ------------------------------------------------
// DASHBOARD DATA LOADING
// ------------------------------------------------

function logDebug(...args) {
    if (DEBUG_DASHBOARD) {
        console.log('[dashboard]', ...args);
    }
}

async function cargarMetricasDashboard() {
    console.log('[dashboard] *** INICIO cargarMetricasDashboard ***');
    logDebug('Cargando métricas del dashboard...');
    setTextoSeguro('statVentasHoy', 'Cargando...');
    setTextoSeguro('statPedidosActivos', 'Cargando...');
    setTextoSeguro('statClientes', 'Cargando...');
    setTextoSeguro('statPlatos', 'Cargando...');

    try {
        logDebug('Iniciando fetch de ventas...');
        const ventasResp = await fetch(`${API_BASE}/ventas/listar`)
            .then(r => {
                logDebug('Ventas response status:', r.status);
                if (!r.ok) {
                    throw new Error(`HTTP error! status: ${r.status}`);
                }
                return r.json();
            })
            .then(data => {
                logDebug('Ventas data recibida:', data);
                return data;
            });

        logDebug('Iniciando fetch de pedidos, clientes y platos...');
        const [pedidosResp, clientesResp, platosResp] = await Promise.all([
            fetch(`${API_BASE}/pedidos/listar`).then(r => r.json()),
            fetch(`${API_BASE}/clientes/listar`).then(r => r.json()),
            fetch(`${API_BASE}/platos/listar`).then(r => r.json())
        ]);

        logDebug('Actualizando métricas...');
        actualizarVentasHoy(ventasResp);
        actualizarPedidos(pedidosResp);
        actualizarClientes(clientesResp);
        actualizarPlatos(platosResp);
        renderPedidosRecientes(pedidosResp);
        logDebug('Métricas actualizadas correctamente');
    } catch (error) {
        console.error('Error cargando métricas del dashboard:', error);
        setTextoSeguro('statVentasHoy', '--');
        setTextoSeguro('statPedidosActivos', '--');
        setTextoSeguro('statClientes', '--');
        setTextoSeguro('statPlatos', '--');
        setTextoSeguro('statVentasChange', 'Error al cargar');
        setTextoSeguro('statPedidosChange', 'Error al cargar');
        setTextoSeguro('statClientesChange', 'Error al cargar');
        setTextoSeguro('statPlatosChange', 'Error al cargar');
        const tbody = document.getElementById('recentPedidosBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Error al cargar</td></tr>';
    }
}

function setTextoSeguro(id, valor) {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
}

function obtenerLista(data, clavePrincipal, claveAlterna) {
    return (data && (data[clavePrincipal] || data[claveAlterna] || data.items)) || [];
}

function actualizarVentasHoy(dataVentas) {
    logDebug('Data ventas completa:', dataVentas);
    
    // Obtener el array de ventas
    let ventas = [];
    if (dataVentas) {
        if (Array.isArray(dataVentas.items)) {
            ventas = dataVentas.items;
        } else if (Array.isArray(dataVentas.ventas)) {
            ventas = dataVentas.ventas;
        } else if (Array.isArray(dataVentas)) {
            ventas = dataVentas;
        }
    }
    
    logDebug('Ventas recibidas:', ventas.length);
    
    if (ventas.length > 0) {
        logDebug('Primera venta ejemplo:', ventas[0]);
    }
    
    // Obtener fecha de hoy en formato local YYYY-MM-DD
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    const hoyISO = `${year}-${month}-${day}`;
    
    logDebug('Fecha hoy (local):', hoyISO);
    
    // Filtrar ventas del día
    const ventasHoy = ventas.filter(v => {
        const fechaVenta = v.FechaVenta || '';
        const fechaVentaISO = fechaVenta.slice(0, 10);
        const coincide = fechaVentaISO === hoyISO;
        if (coincide) {
            logDebug('Venta del día:', v.CodVenta, fechaVentaISO, 'Total:', v.Total);
        }
        return coincide;
    });
    
    logDebug('Ventas de hoy encontradas:', ventasHoy.length);
    
    const totalHoy = ventasHoy.reduce((acc, v) => acc + (parseFloat(v.Total) || 0), 0);
    setTextoSeguro('statVentasHoy', `S/ ${totalHoy.toFixed(2)}`);
    setTextoSeguro('statVentasChange', `${ventasHoy.length} venta(s) hoy`);
}

function actualizarPedidos(dataPedidos) {
    const pedidos = obtenerLista(dataPedidos, 'items', 'pedidos');
    logDebug('Pedidos recibidos:', pedidos.length);
    const activos = pedidos.filter(p => !['entregado', 'cancelado'].includes((p.Estado || '').toLowerCase()));
    setTextoSeguro('statPedidosActivos', activos.length.toString());
    setTextoSeguro('statPedidosChange', `${activos.length} en curso`);
}

function actualizarClientes(dataClientes) {
    const clientes = obtenerLista(dataClientes, 'clientes', 'items');
    logDebug('Clientes recibidos:', clientes.length);
    setTextoSeguro('statClientes', clientes.length.toString());
    setTextoSeguro('statClientesChange', 'Total registrados');
}

function actualizarPlatos(dataPlatos) {
    const platos = obtenerLista(dataPlatos, 'platos', 'items');
    logDebug('Platos recibidos:', platos.length);
    setTextoSeguro('statPlatos', platos.length.toString());
    setTextoSeguro('statPlatosChange', 'Disponibles en menú');
    
    // Actualizar alertas de stock bajo
    actualizarAlertasStockBajo(platos);
}

function actualizarAlertasStockBajo(platos) {
    const alertList = document.querySelector('.alert-list');
    const notificationBadge = document.querySelector('.notification-badge');
    
    // Filtrar platos con stock bajo (cantidad <= stockMinimo)
    const platosStockBajo = platos.filter(p => {
        const cantidad = parseInt(p.Cantidad || 0);
        const stockMinimo = parseInt(p.StockMinimo || 10);
        return cantidad <= stockMinimo && cantidad >= 0;
    });
    
    // Actualizar badge de la campana
    if (notificationBadge) {
        if (platosStockBajo.length > 0) {
            notificationBadge.textContent = platosStockBajo.length;
            notificationBadge.style.display = 'inline-block';
        } else {
            notificationBadge.style.display = 'none';
        }
    }
    
    // Actualizar panel de alertas
    if (!alertList) return;
    
    // Limpiar alertas de stock existentes (conservar otras alertas)
    const alertasExistentes = alertList.querySelectorAll('.alert-item:not([data-type="stock"])');
    alertList.innerHTML = '';
    
    // Añadir alertas de stock bajo
    if (platosStockBajo.length > 0) {
        // Si hay muchos platos, mostrar resumen
        if (platosStockBajo.length > 3) {
            const alertItem = document.createElement('div');
            alertItem.className = 'alert-item alert-warning';
            alertItem.setAttribute('data-type', 'stock');
            alertItem.innerHTML = `
                <span class="alert-icon"><i class="fas fa-exclamation-triangle"></i></span>
                <span class="alert-text"><strong>${platosStockBajo.length} platos</strong> con stock bajo</span>
            `;
            alertItem.style.cursor = 'pointer';
            alertItem.title = 'Click para ver inventario';
            alertItem.addEventListener('click', () => {
                window.location.href = 'visualizar_platos.html';
            });
            alertList.appendChild(alertItem);
        } else {
            // Mostrar cada plato individualmente
            platosStockBajo.forEach(plato => {
                const alertItem = document.createElement('div');
                alertItem.className = 'alert-item alert-warning';
                alertItem.setAttribute('data-type', 'stock');
                const cantidad = parseInt(plato.Cantidad || 0);
                const stockMinimo = parseInt(plato.StockMinimo || 10);
                alertItem.innerHTML = `
                    <span class="alert-icon"><i class="fas fa-exclamation-triangle"></i></span>
                    <span class="alert-text"><strong>${plato.Nombre}</strong>: Stock bajo (${cantidad}/${stockMinimo})</span>
                `;
                alertItem.style.cursor = 'pointer';
                alertItem.title = 'Click para ver inventario';
                alertItem.addEventListener('click', () => {
                    window.location.href = 'visualizar_platos.html';
                });
                alertList.appendChild(alertItem);
            });
        }
    }
    
    // Re-añadir otras alertas que no son de stock
    alertasExistentes.forEach(alerta => alertList.appendChild(alerta));
    
    // Si no hay alertas, mostrar mensaje
    if (alertList.children.length === 0) {
        const alertItem = document.createElement('div');
        alertItem.className = 'alert-item alert-success';
        alertItem.innerHTML = `
            <span class="alert-icon"><i class="fas fa-check-circle"></i></span>
            <span class="alert-text">No hay alertas pendientes</span>
        `;
        alertList.appendChild(alertItem);
    }
}

function renderPedidosRecientes(dataPedidos) {
    const tbody = document.getElementById('recentPedidosBody');
    if (!tbody) return;

    const pedidos = obtenerLista(dataPedidos, 'items', 'pedidos');
    logDebug('Render recientes, pedidos:', pedidos.length);

    if (!pedidos.length) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay pedidos recientes</td></tr>';
        return;
    }

    const recientes = [...pedidos]
        .sort((a, b) => new Date(b.FechaPedido) - new Date(a.FechaPedido))
        .slice(0, 5);

    tbody.innerHTML = recientes.map(p => {
        const estado = (p.Estado || '').toLowerCase();
        const badgeClass = estado === 'entregado' ? 'badge-success'
            : estado === 'cancelado' ? 'badge-danger'
            : estado === 'listo' ? 'badge-info'
            : 'badge-warning';
        const total = parseFloat(p.Total) || 0;
        return `
            <tr>
                <td>#${p.IdPedido}</td>
                <td>${p.NombreCliente || 'Sin cliente'}</td>
                <td>${p.TipoServicio || '-'}</td>
                <td>S/ ${total.toFixed(2)}</td>
                <td><span class="badge ${badgeClass}">${p.Estado || '-'}</span></td>
            </tr>
        `;
    }).join('');
}
    // ============================================
    // RESTAURAR ESTADO DEL SIDEBAR
    // ============================================
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
    if (sidebarCollapsed === 'true') {
        sidebar.classList.add('collapsed');
    }
    
    // ============================================
    // MOSTRAR FECHA ACTUAL Y HORA
    // ============================================
    if (currentDateElement) {
        updateCurrentDate();
        // Actualizar cada segundo
        setInterval(updateCurrentDate, 1000);
    }
    
    function updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = now.toLocaleDateString('es-ES', options);
        const formattedTime = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        currentDateElement.textContent = formattedDate + ' ' + formattedTime;
    }
    
    // ============================================
    // CERRAR SESIÓN
    // ============================================
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('¿Está seguro que desea cerrar sesión?')) {
                // Limpiar datos de sesión
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');
                
                // Redirigir a la página de login
                window.location.href = '../index.html';
            }
        });
    }
    
    // ============================================
    // VERIFICAR AUTENTICACIÓN
    // ============================================
    function checkAuthentication() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (!isLoggedIn || isLoggedIn !== 'true') {
            // Si no está autenticado, redirigir al login
            window.location.href = '../index.html';
        }
    }
    
    // Verificar autenticación al cargar la página
    checkAuthentication();
    
    // ============================================
    // CARGAR DATOS DEL USUARIO
    // ============================================
    function loadUserData() {
        const currentUser = localStorage.getItem('currentUser');
        
        if (currentUser) {
            const userData = JSON.parse(currentUser);
            
            // Actualizar nombre de usuario en el sidebar
            const userNameElement = document.querySelector('.user-name');
            const userRoleElement = document.querySelector('.user-role');
            
            if (userNameElement && userData.name) {
                userNameElement.textContent = userData.name;
            }
            
            if (userRoleElement && userData.role) {
                userRoleElement.textContent = userData.role;
            }
        }
    }
    
    loadUserData();
    
    // ============================================
    // ANIMACIÓN DE ENTRADA
    // ============================================
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'fadeIn 0.5s ease forwards';
        }, index * 100);
    });
    
    // ============================================
    // NOTIFICACIONES
    // ============================================
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            alert('Tienes 3 notificaciones nuevas:\n\n' +
                  '1. Stock bajo de queso mozzarella\n' +
                  '2. 3 pedidos pendientes de entrega\n' +
                  '3. Sistema actualizado correctamente');
        });
    }
    
    // ============================================
    // ACTUALIZACIÓN AUTOMÁTICA DE LA HORA
    // ============================================
    // Ya está configurado arriba para actualizar cada segundo
    
    // ============================================
    // RESPONSIVE - Ajustes al redimensionar
    // ============================================
    window.addEventListener('resize', function() {
        // Si la página actual no tiene sidebar, evitar errores
        if (!sidebar) return;

        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            
            // Restaurar estado colapsado si estaba guardado
            const sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
            if (sidebarCollapsed === 'true') {
                sidebar.classList.add('collapsed');
            }
        } else {
            // En móviles, remover collapsed si está activo
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('collapsed');
            }
        }
    });
    
    // ============================================
    // PREVENIR ACCESO NO AUTORIZADO
    // ============================================
    window.addEventListener('storage', function(e) {
        if (e.key === 'isLoggedIn' && e.newValue !== 'true') {
            // Si el estado de sesión cambia en otra pestaña, cerrar sesión
            window.location.href = '../index.html';
        }
    });
});