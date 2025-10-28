/* ============================================
   JAVASCRIPT PARA REGISTRAR VENTA
   ============================================ */

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    inicializarEventos();
    cargarProductosEjemplo();
});

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
    
    const horaFormateada = ahora.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    document.getElementById('fechaActual').textContent = fechaFormateada;
    document.getElementById('horaActual').textContent = horaFormateada;
}

