// ===== VISUALIZAR PRODUCTOS - JAVASCRIPT BÁSICO =====

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
});

// Actualizar fecha y hora
function actualizarFechaHora() {
    const ahora = new Date();
    
    const fechaElement = document.getElementById('fechaActual');
    const horaElement = document.getElementById('horaActual');
    
    if (fechaElement) {
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = ahora.toLocaleDateString('es-ES', opciones);
        fechaElement.textContent = fechaFormateada;
    }
    
    if (horaElement) {
        const opcionesHora = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const horaFormateada = ahora.toLocaleTimeString('es-ES', opcionesHora);
        horaElement.textContent = horaFormateada;
    }
}

// Función para buscar producto
function buscarProducto() {
    const busqueda = document.getElementById('busqueda').value;
    const categoria = document.getElementById('categoriaFiltro').value;
    console.log('Buscando:', busqueda, 'Categoría:', categoria);
    // Aquí iría la lógica de búsqueda
}

// Función para exportar productos
function exportarProductos() {
    alert('Exportando productos...');
    // Aquí iría la lógica de exportación
}

// Función para volver
function volverModulo() {
    window.history.back();
}
