// ============================================
// VER MESEROS - SOLO FECHA Y HORA
// ============================================

// Función para actualizar fecha y hora
function actualizarFechaHora() {
    const ahora = new Date();
    
    // Fecha
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaActual = ahora.toLocaleDateString('es-ES', opciones);
    
    // Hora
    const horaActual = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Actualizar elementos del DOM
    const fechaElement = document.getElementById('fechaActual');
    const horaElement = document.getElementById('horaActual');
    
    if (fechaElement) {
        fechaElement.textContent = fechaActual;
    }
    
    if (horaElement) {
        horaElement.textContent = horaActual;
    }
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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar fecha y hora inmediatamente
    actualizarFechaHora();
    
    // Actualizar cada segundo
    setInterval(actualizarFechaHora, 1000);
    
    // Inicializar navegación de pestañas
    inicializarNavegacionTabs();
    
    // Inicializar funcionalidades de meseros
    if (typeof inicializarFuncionalidadesMeseros === 'function') {
        inicializarFuncionalidadesMeseros();
    }
});
