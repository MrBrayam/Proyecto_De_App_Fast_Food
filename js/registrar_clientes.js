// ===== REGISTRAR CLIENTES - JAVASCRIPT =====

// Actualizar fecha y hora
function actualizarFechaHora() {
    const ahora = new Date();
    
    const fechaElement = document.getElementById('fechaActual');
    if (fechaElement) {
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        fechaElement.textContent = ahora.toLocaleDateString('es-ES', opciones);
    }
    
    const horaElement = document.getElementById('horaActual');
    if (horaElement) {
        horaElement.textContent = ahora.toLocaleTimeString('es-ES');
    }
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Manejar formulario
    const formCliente = document.getElementById('formCliente');
    if (formCliente) {
        formCliente.addEventListener('submit', function(e) {
            e.preventDefault();
            guardarCliente();
        });
    }
});
