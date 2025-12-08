/* ============================================
   JAVASCRIPT PARA REGISTRAR PROVEEDOR
   Maneja el registro completo de proveedores con validaciones
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

// Validar número de documento según tipo
function validarDocumento() {
    const tipoDoc = document.getElementById('tipoDocumento').value;
    const numDoc = document.getElementById('numeroDocumento').value;
    
    if (tipoDoc === 'RUC' && numDoc.length !== 11) {
        alert('El RUC debe tener 11 dígitos');
        return false;
    }
    
    if (tipoDoc === 'DNI' && numDoc.length !== 8) {
        alert('El DNI debe tener 8 dígitos');
        return false;
    }
    
    return true;
}

// Validar teléfono
function validarTelefono(telefono) {
    return /^\d{9}$/.test(telefono);
}

// Validar email
function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Registrar proveedor
async function guardarProveedor(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Validaciones
    if (!validarDocumento()) return;
    
    const telefono = formData.get('telefono');
    if (!validarTelefono(telefono)) {
        alert('El teléfono debe tener 9 dígitos');
        return;
    }
    
    const email = formData.get('email');
    if (!validarEmail(email)) {
        alert('El email no es válido');
        return;
    }
    
    const data = {
        tipoDoc: formData.get('tipoDocumento'),
        numDoc: formData.get('numeroDocumento'),
        razonSocial: formData.get('razonSocial'),
        nombreComercial: formData.get('nombreComercial') || null,
        categoria: formData.get('categoria'),
        telefono: telefono,
        telefonoSecundario: formData.get('telefonoSecundario') || null,
        email: email,
        sitioWeb: formData.get('sitioWeb') || null,
        personaContacto: formData.get('personaContacto'),
        direccion: formData.get('direccion'),
        ciudad: formData.get('ciudad') || null,
        distrito: formData.get('distrito') || null,
        tiempoEntrega: parseInt(formData.get('tiempoEntrega')) || 0,
        montoMinimo: parseFloat(formData.get('montoMinimo')) || 0.00,
        descuento: parseFloat(formData.get('descuento')) || 0.00,
        nota: formData.get('observaciones') || null,
        estado: formData.get('estado')
    };
    
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/proveedores/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.exito) {
            alert(`Proveedor registrado exitosamente\nCódigo: ${result.codProveedor}\nRazón Social: ${result.razonSocial}`);
            event.target.reset();
        } else {
            alert('Error: ' + result.mensaje);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar el proveedor. Por favor, intente nuevamente.');
    }
}

// Limpiar formulario
function limpiarFormulario() {
    if (confirm('¿Está seguro que desea limpiar el formulario?')) {
        document.getElementById('formProveedor').reset();
    }
}

// Filtrar solo números en campos numéricos
function soloNumeros(event) {
    const key = event.key;
    if (!/^\d$/.test(key) && key !== 'Backspace' && key !== 'Delete' && key !== 'Tab' && key !== 'ArrowLeft' && key !== 'ArrowRight') {
        event.preventDefault();
    }
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Event listener para el formulario
    const form = document.getElementById('formProveedor');
    if (form) {
        form.addEventListener('submit', guardarProveedor);
    }
    
    // Event listener para el botón limpiar
    const btnLimpiar = document.querySelector('.btn-limpiar');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarFormulario);
    }
    
    // Validación solo números para documento y teléfonos
    const numeroDocumento = document.getElementById('numeroDocumento');
    const telefono = document.getElementById('telefono');
    const telefonoSecundario = document.getElementById('telefonoSecundario');
    
    if (numeroDocumento) {
        numeroDocumento.addEventListener('keypress', soloNumeros);
        numeroDocumento.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    if (telefono) {
        telefono.addEventListener('keypress', soloNumeros);
        telefono.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    if (telefonoSecundario) {
        telefonoSecundario.addEventListener('keypress', soloNumeros);
        telefonoSecundario.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    // Validar longitud según tipo de documento
    const tipoDocumento = document.getElementById('tipoDocumento');
    if (tipoDocumento && numeroDocumento) {
        tipoDocumento.addEventListener('change', function() {
            if (this.value === 'RUC') {
                numeroDocumento.maxLength = 11;
                numeroDocumento.placeholder = 'Ej: 20123456789';
            } else if (this.value === 'DNI') {
                numeroDocumento.maxLength = 8;
                numeroDocumento.placeholder = 'Ej: 12345678';
            } else {
                numeroDocumento.maxLength = 20;
                numeroDocumento.placeholder = 'Ingrese número de documento';
            }
            numeroDocumento.value = '';
        });
    }
});

