// ============================================
// MENÚ PRINCIPAL - KING'S PIZZA
// Funcionalidad del dashboard con sidebar
// ============================================

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
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            
            // Guardar estado en localStorage
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        });
    }
    
    // ============================================
    // TOGGLE SIDEBAR (Mobile)
    // ============================================
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Cerrar sidebar en mobile al hacer click fuera
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);
            
            if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });
    
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
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
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
