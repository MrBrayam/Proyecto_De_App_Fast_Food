// ===== REGISTRAR CLIENTES - JAVASCRIPT =====

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

// Validar DNI
function validarDocumento() {
    const tipoDoc = document.getElementById('tipoDocumento').value;
    const nroDoc = document.getElementById('nroDocumento').value;
    
    if (tipoDoc === 'DNI' && nroDoc.length !== 8) {
        alert('El DNI debe tener 8 dígitos');
        return false;
    }
    
    if (tipoDoc === 'RUC' && nroDoc.length !== 11) {
        alert('El RUC debe tener 11 dígitos');
        return false;
    }
    
    return true;
}

// Validar teléfono
function validarTelefono() {
    const telefono = document.getElementById('telefono').value;
    
    if (telefono.length !== 9) {
        alert('El teléfono debe tener 9 dígitos');
        return false;
    }
    
    return true;
}

// Validar email
function validarEmail() {
    const email = document.getElementById('email').value;
    
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert('Email inválido');
        return false;
    }
    
    return true;
}

// Guardar cliente
async function guardarCliente() {
    // Validaciones
    if (!validarDocumento() || !validarTelefono() || !validarEmail()) {
        return;
    }
    
    const data = {
        tipoDocumento: document.getElementById('tipoDocumento').value,
        numDocumento: document.getElementById('nroDocumento').value.trim(),
        nombres: document.getElementById('nombres').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        email: document.getElementById('email').value.trim() || null,
        direccion: document.getElementById('direccion').value.trim()
    };
    
    // Validar campos requeridos
    if (!data.numDocumento || !data.nombres || !data.apellidos || !data.telefono || !data.direccion) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/clientes/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.exito) {
            alert(`✅ Cliente registrado exitosamente\n\nID: ${result.idCliente}\nNombre: ${data.nombres} ${data.apellidos}`);
            limpiarFormulario();
        } else {
            alert('❌ Error: ' + result.mensaje);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al registrar el cliente. Verifique su conexión.');
    }
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('formCliente').reset();
    document.getElementById('tipoDocumento').value = 'DNI';
}

// Salir del módulo
function salirModulo() {
    if (confirm('¿Está seguro que desea salir?')) {
        window.location.href = 'visualizar_clientes.html';
    }
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Validación en tiempo real de documento
    document.getElementById('nroDocumento').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    // Validación en tiempo real de teléfono
    document.getElementById('telefono').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    // Manejar formulario
    const formCliente = document.getElementById('formCliente');
    if (formCliente) {
        formCliente.addEventListener('submit', function(e) {
            e.preventDefault();
            guardarCliente();
        });
    }
});
