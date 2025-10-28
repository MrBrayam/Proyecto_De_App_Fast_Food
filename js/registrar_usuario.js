// ===== REGISTRAR USUARIO - JAVASCRIPT =====

// Actualizar fecha y hora
function actualizarFechaHora() {
    const ahora = new Date();
    
    const fechaElement = document.getElementById('fechaActual');
    if (fechaElement) {
        const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const fechaFormateada = ahora.toLocaleDateString('es-ES', opciones);
        fechaElement.textContent = fechaFormateada;
    }
    
    const horaElement = document.getElementById('horaActual');
    if (horaElement) {
        const horaFormateada = ahora.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false 
        });
        horaElement.textContent = horaFormateada;
    }
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Generar nombre de usuario automáticamente
    document.getElementById('nombres').addEventListener('blur', generarNombreUsuario);
    document.getElementById('apellidos').addEventListener('blur', generarNombreUsuario);
    
    // Validación solo números para teléfono
    document.getElementById('telefono').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});

// Función para salir del módulo
function salirModulo() {
    if (confirm('¿Está seguro que desea salir? Los cambios no guardados se perderán.')) {
        window.location.href = 'menu_principal.html';
    }
}
