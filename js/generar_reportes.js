/* ============================================
   GENERAR REPORTES - ARCHIVO PRINCIPAL
   Solo maneja fecha/hora como estructura estándar
   ============================================ */

// Función para actualizar fecha y hora
function actualizarFechaHora() {
    const ahora = new Date();
    
    // Configurar formato de fecha
    const opcionesFecha = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    // Configurar formato de hora
    const opcionesHora = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    // Actualizar elementos del DOM
    const fechaElement = document.getElementById('fechaActual');
    const horaElement = document.getElementById('horaActual');
    
    if (fechaElement) {
        fechaElement.textContent = ahora.toLocaleDateString('es-ES', opcionesFecha);
    }
    
    if (horaElement) {
        horaElement.textContent = ahora.toLocaleTimeString('es-ES', opcionesHora);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar fecha y hora inmediatamente
    actualizarFechaHora();
    
    // Actualizar cada segundo
    setInterval(actualizarFechaHora, 1000);
    
    // Llamar función de inicialización de funcionalidades
    if (typeof init === 'function') {
        init();
    }
});