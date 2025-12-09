// ============================================
// MENÚ PRINCIPAL - KING'S PIZZA
// Funcionalidad del dashboard con sidebar y métricas
// ============================================

const API_BASE = '/Proyecto_De_App_Fast_Food/api';
const DEBUG_DASHBOARD = true; // poner en false para silenciar logs

document.addEventListener('DOMContentLoaded', function() {
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
    cargarMetricasDashboard();
    

// ------------------------------------------------
// DASHBOARD DATA LOADING
// ------------------------------------------------

function logDebug(...args) {
    if (DEBUG_DASHBOARD) {
        console.debug('[dashboard]', ...args);
    }
}

async function cargarMetricasDashboard() {
    logDebug('Cargando métricas del dashboard...');
    setTextoSeguro('statVentasHoy', 'Cargando...');
    setTextoSeguro('statPedidosActivos', 'Cargando...');
    setTextoSeguro('statClientes', 'Cargando...');
    setTextoSeguro('statPlatos', 'Cargando...');

    try {
        const [ventasResp, pedidosResp, clientesResp, platosResp] = await Promise.all([
            fetch(`${API_BASE}/ventas/listar`)
                .then(r => {
                    logDebug('Ventas response status:', r.status);
                    return r.json();
                })
                .then(data => {
                    logDebug('Ventas data:', data);
                    return data;
                }),
            fetch(`${API_BASE}/pedidos/listar`).then(r => r.json()),
            fetch(`${API_BASE}/clientes/listar`).then(r => r.json()),
            fetch(`${API_BASE}/platos/listar`).then(r => r.json())
        ]);

        actualizarVentasHoy(ventasResp);
        actualizarPedidos(pedidosResp);
        actualizarClientes(clientesResp);
        actualizarPlatos(platosResp);
        renderPedidosRecientes(pedidosResp);
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
    const ventas = obtenerLista(dataVentas, 'items', 'ventas');
    logDebug('Ventas recibidas:', ventas.length);
    const hoyISO = new Date().toISOString().slice(0, 10);
    const ventasHoy = ventas.filter(v => (v.FechaVenta || '').slice(0, 10) === hoyISO);
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
    // MOSTRAR FECHA ACTUAL
    // ============================================
    if (currentDateElement) {
        updateCurrentDate();
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
        currentDateElement.textContent = formattedDate;
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
    setInterval(updateCurrentDate, 60000); // Actualizar cada minuto
    
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