function actualizarFechaHora() {
    const ahora = new Date();
    
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaActual = ahora.toLocaleDateString('es-ES', opciones);
    
    const horaActual = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const fechaElement = document.getElementById('fechaActual');
    const horaElement = document.getElementById('horaActual');
    
    if (fechaElement) {
        fechaElement.textContent = fechaActual;
    }
    
    if (horaElement) {
        horaElement.textContent = horaActual;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    
    setInterval(actualizarFechaHora, 1000);
    
    if (typeof inicializarFuncionalidadesCajeros === 'function') {
        inicializarFuncionalidadesCajeros();
    }
});
