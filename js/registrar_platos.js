// ===== REGISTRAR PLATOS - FRONTEND ONLY =====
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
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    };
    const fechaFormateada = ahora.toLocaleDateString('es-PE', opciones);
    
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');
    const horaFormateada = `${horas}:${minutos}:${segundos}`;
    
    document.getElementById('fecha-actual').textContent = fechaFormateada;
    document.getElementById('hora-actual').textContent = horaFormateada;
}
