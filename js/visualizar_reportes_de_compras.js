// ===== VISUALIZAR REPORTES DE COMPRAS - JAVASCRIPT =====

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
    
    cargarReportes();
});

// Función para cargar reportes
function cargarReportes() {
    const tbody = document.getElementById('tbodyReportes');
    if (!tbody) return;
    
    // Aquí se cargarían los datos reales desde localStorage o una API
    // Por ahora mantiene las filas vacías del HTML
    console.log('Reportes de compras cargados');
}

// Función para salir del módulo
function salirModulo() {
    if (confirm('¿Está seguro que desea salir?')) {
        window.location.href = '../index.html';
    }
}
