/* ============================================
   REGISTRAR PEDIDOS - FRONTEND ONLY
   Solo funcionalidades de interfaz
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Actualizar fecha y hora
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Configurar evento para tipo de servicio
    configurarTipoServicio();
});

// Función para configurar el tipo de servicio
function configurarTipoServicio() {
    const tipoServicio = document.getElementById('tipoServicio');
    const mesaSection = document.getElementById('mesaSection');
    const direccionSection = document.getElementById('direccionSection');
    const telefonoSection = document.getElementById('telefonoSection');
    
    // Función para mostrar/ocultar campos según el tipo de servicio
    function actualizarCampos() {
        const valor = tipoServicio.value;
        
        // Ocultar todos los campos opcionales primero
        mesaSection.style.display = 'none';
        direccionSection.style.display = 'none';
        telefonoSection.style.display = 'none';
        
        // Limpiar campos que se ocultan
        document.getElementById('numeroMesa').value = '';
        document.getElementById('direccionCliente').value = '';
        document.getElementById('telefonoCliente').value = '';
        
        // Mostrar campos según el tipo seleccionado
        switch(valor) {
            case 'local':
                mesaSection.style.display = 'block';
                // Hacer el campo mesa requerido
                document.getElementById('numeroMesa').setAttribute('required', 'required');
                document.getElementById('direccionCliente').removeAttribute('required');
                document.getElementById('telefonoCliente').removeAttribute('required');
                break;
                
            case 'delivery':
                direccionSection.style.display = 'block';
                telefonoSection.style.display = 'block';
                // Hacer los campos dirección y teléfono requeridos
                document.getElementById('direccionCliente').setAttribute('required', 'required');
                document.getElementById('telefonoCliente').setAttribute('required', 'required');
                document.getElementById('numeroMesa').removeAttribute('required');
                break;
                
            case 'para-llevar':
                telefonoSection.style.display = 'block';
                // Hacer el campo teléfono requerido
                document.getElementById('telefonoCliente').setAttribute('required', 'required');
                document.getElementById('numeroMesa').removeAttribute('required');
                document.getElementById('direccionCliente').removeAttribute('required');
                break;
        }
    }
    
    // Ejecutar al cargar la página
    actualizarCampos();
    
    // Ejecutar cuando cambie la selección
    tipoServicio.addEventListener('change', actualizarCampos);
}

// Función para actualizar fecha y hora
function actualizarFechaHora() {
    const ahora = new Date();
    
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const fechaFormateada = ahora.toLocaleDateString('es-ES', opciones);
    
    const opcionesHora = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
    };
    const horaFormateada = ahora.toLocaleTimeString('es-ES', opcionesHora);
    
    document.getElementById('fecha-actual').textContent = fechaFormateada;
    document.getElementById('hora-actual').textContent = horaFormateada;
}
