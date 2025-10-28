// ===== VISUALIZAR PEDIDOS - FRONTEND ONLY =====
// Solo funcionalidades de interfaz básica

document.addEventListener('DOMContentLoaded', function() {
    // Actualizar fecha y hora
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
});

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
    
    const opcionesHora = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
    };
    const horaFormateada = ahora.toLocaleTimeString('es-ES', opcionesHora);
    
    document.getElementById('fecha-actual').textContent = fechaFormateada;
    document.getElementById('hora-actual').textContent = horaFormateada;
}

// Función placeholder para cerrar modal (se implementará en funcionalidades)
function cerrarModal() {
    const modal = document.getElementById('modalDetalle');
    if (modal) {
        modal.classList.remove('active');
    }
}
