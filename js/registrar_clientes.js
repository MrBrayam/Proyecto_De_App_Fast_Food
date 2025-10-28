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

// Función para guardar cliente
function guardarCliente() {
    const tipoDocumento = document.getElementById('tipoDocumento').value;
    const nroDocumento = document.getElementById('nroDocumento').value;
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    
    if (!tipoDocumento || !nroDocumento || !nombres || !apellidos || !telefono) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    const cliente = {
        tipoDocumento,
        nroDocumento,
        nombres,
        apellidos,
        telefono,
        email,
        fechaRegistro: new Date().toISOString()
    };
    
    console.log('Cliente registrado:', cliente);
    alert('Cliente registrado exitosamente');
    limpiarFormulario();
}

// Función para limpiar formulario
function limpiarFormulario() {
    const formCliente = document.getElementById('formCliente');
    if (formCliente) {
        formCliente.reset();
    }
}

// Función para salir del módulo
function salirModulo() {
    if (confirm('¿Está seguro que desea salir?')) {
        window.location.href = '../index.html';
    }
}
