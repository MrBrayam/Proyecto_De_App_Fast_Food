// ===== REGISTRAR USUARIO - JAVASCRIPT =====

// Actualizar fecha y hora
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
