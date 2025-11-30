/* ============================================
   JAVASCRIPT PARA VER ADMINISTRADORES
   Solo maneja fecha y hora
   ============================================ */

// Actualizar fecha y hora en tiempo real
function actualizarFechaHora() {
    const ahora = new Date();
    
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const fechaFormateada = ahora.toLocaleDateString('es-ES', opciones);
    
    const opcionesHora = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
    };
    const horaFormateada = ahora.toLocaleTimeString('es-ES', opcionesHora);
    
    document.getElementById('fechaActual').textContent = fechaFormateada;
    document.getElementById('horaActual').textContent = horaFormateada;
}

// Función para manejar navegación de pestañas
function inicializarNavegacionTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Permitir navegación normal
            // No prevenir default para permitir navegación
            console.log('Navegando a:', this.href);
        });
    });
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Inicializar navegación de pestañas
    inicializarNavegacionTabs();
    
    inicializarFuncionalidadesAdministradores();
});
