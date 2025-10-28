/* ============================================
   VISUALIZAR COMPRAS - JavaScript
   ============================================ */

// Actualizar fecha y hora
function actualizarFechaHora() {
    const ahora = new Date();
    
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const fecha = ahora.toLocaleDateString('es-ES', opciones);
    
    const hora = ahora.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    
    const fechaElement = document.getElementById('fechaActual');
    const horaElement = document.getElementById('horaActual');
    
    if (fechaElement) fechaElement.textContent = fecha;
    if (horaElement) horaElement.textContent = hora;
}

// Variable global para la fila seleccionada
let filaSeleccionada = null;

// Seleccionar fila de la tabla
function seleccionarFila(fila) {
    // Remover selección anterior
    const filas = document.querySelectorAll('.tabla-compras tbody tr');
    filas.forEach(f => f.classList.remove('selected'));
    
    // Seleccionar nueva fila
    fila.classList.add('selected');
    filaSeleccionada = fila;
    
    // Habilitar botón de detalle
    const btnDetalle = document.getElementById('btnDetalle');
    if (btnDetalle) {
        btnDetalle.disabled = false;
    }
}

// Buscar compra
function buscarCompra() {
    const busqueda = document.getElementById('busqueda').value.toLowerCase();
    const filas = document.querySelectorAll('.tabla-compras tbody tr');
    
    filas.forEach(fila => {
        const texto = fila.textContent.toLowerCase();
        if (texto.includes(busqueda)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

// Ver detalle de la compra seleccionada
function verDetalle() {
    if (filaSeleccionada) {
        alert('Ver detalle de compra seleccionada');
        // Aquí puedes agregar la lógica para mostrar un modal con los detalles
    }
}

// Exportar compras
function exportarCompras() {
    alert('Exportando compras...');
    // Aquí puedes agregar la lógica para exportar a Excel
}

// Salir del módulo
function salirModulo() {
    if (confirm('¿Desea salir del módulo?')) {
        window.location.href = '../index.html';
    }
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
});
