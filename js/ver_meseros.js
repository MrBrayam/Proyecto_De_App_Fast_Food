// ============================================
// VER MESEROS - SOLO FECHA Y HORA
// ============================================

// Función para actualizar fecha y hora
function actualizarFechaHora() {
    const ahora = new Date();
    
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const fechaFormateada = ahora.toLocaleDateString('es-ES', opciones);
    
    const horaFormateada = ahora.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const fechaElement = document.getElementById('currentDate');
    if (fechaElement) {
        fechaElement.textContent = fechaFormateada + ' ' + horaFormateada;
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
