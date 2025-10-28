// ===== REGISTRAR COMPRAS - JAVASCRIPT BÁSICO =====

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    actualizarFecha();
});

// Actualizar fecha
function actualizarFecha() {
    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2, '0');
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const anio = ahora.getFullYear();
    
    const fechaElement = document.getElementById('fechaActual');
    if (fechaElement) {
        fechaElement.textContent = `${dia} / ${mes} / ${anio}`;
    }
}
