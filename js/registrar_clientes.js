// Verificar autenticación
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = '../index.html';
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}

// Validar número de documento según tipo
function validarDocumento() {
    const tipoDoc = document.getElementById('tipoDocumento').value;
    const numeroDoc = document.getElementById('numeroDocumento');
    
    numeroDoc.value = numeroDoc.value.replace(/[^0-9]/g, '');
    
    switch(tipoDoc) {
        case 'DNI':
            numeroDoc.maxLength = 8;
            break;
        case 'RUC':
            numeroDoc.maxLength = 11;
            break;
        case 'Pasaporte':
            numeroDoc.maxLength = 12;
            numeroDoc.value = numeroDoc.value.toUpperCase();
            break;
        case 'Carnet de Extranjería':
            numeroDoc.maxLength = 12;
            break;
        default:
            numeroDoc.maxLength = 15;
    }
}

// Validar teléfono (solo números, 9 dígitos para Perú)
function validarTelefono() {
    const telefono = document.getElementById('telefono');
    telefono.value = telefono.value.replace(/[^0-9]/g, '');
    if (telefono.value.length > 9) {
        telefono.value = telefono.value.substring(0, 9);
    }
}

// Validar formulario
function validarFormulario(formData) {
    const errores = [];
    
    // Validar tipo de documento
    if (!formData.tipoDocumento) {
        errores.push('Debe seleccionar un tipo de documento');
    }
    
    // Validar número de documento
    if (!formData.numeroDocumento) {
        errores.push('Debe ingresar el número de documento');
    } else {
        if (formData.tipoDocumento === 'DNI' && formData.numeroDocumento.length !== 8) {
            errores.push('El DNI debe tener 8 dígitos');
        }
        if (formData.tipoDocumento === 'RUC' && formData.numeroDocumento.length !== 11) {
            errores.push('El RUC debe tener 11 dígitos');
        }
    }
    
    // Validar nombres y apellidos
    if (!formData.nombres || formData.nombres.trim().length < 2) {
        errores.push('Debe ingresar nombres válidos (mínimo 2 caracteres)');
    }
    
    if (!formData.apellidos || formData.apellidos.trim().length < 2) {
        errores.push('Debe ingresar apellidos válidos (mínimo 2 caracteres)');
    }
    
    // Validar teléfono
    if (!formData.telefono) {
        errores.push('Debe ingresar un teléfono');
    } else if (formData.telefono.length !== 9) {
        errores.push('El teléfono debe tener 9 dígitos');
    }
    
    // Validar email si se proporciona
    if (formData.email && formData.email.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            errores.push('El email ingresado no es válido');
        }
    }
    
    return errores;
}

// Verificar si el cliente ya existe
function clienteExiste(numeroDocumento) {
    const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
    return clientes.some(cliente => cliente.numeroDocumento === numeroDocumento);
}

// Registrar cliente
function registrarCliente(e) {
    e.preventDefault();
    
    const formData = {
        tipoDocumento: document.getElementById('tipoDocumento').value,
        numeroDocumento: document.getElementById('numeroDocumento').value,
        nombres: document.getElementById('nombres').value,
        apellidos: document.getElementById('apellidos').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value || '',
        fechaRegistro: new Date().toISOString().split('T')[0],
        estado: 'Activo',
        totalCompras: 0,
        ultimaCompra: null,
        puntosFidelidad: 0
    };
    
    // Validar formulario
    const errores = validarFormulario(formData);
    if (errores.length > 0) {
        alert('Errores en el formulario:\n\n' + errores.join('\n'));
        return;
    }
    
    // Verificar si el cliente ya existe
    if (clienteExiste(formData.numeroDocumento)) {
        alert('Ya existe un cliente registrado con ese número de documento');
        return;
    }
    
    // Obtener clientes existentes
    let clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
    
    // Agregar ID único
    formData.id = Date.now();
    
    // Agregar nuevo cliente
    clientes.push(formData);
    
    // Guardar en localStorage
    localStorage.setItem('clientes', JSON.stringify(clientes));
    
    // Mostrar mensaje de éxito
    alert('✅ Cliente registrado exitosamente\n\n' +
          'Nombre: ' + formData.nombres + ' ' + formData.apellidos + '\n' +
          'Documento: ' + formData.tipoDocumento + ' - ' + formData.numeroDocumento + '\n' +
          'Teléfono: ' + formData.telefono);
    
    // Limpiar formulario
    document.getElementById('formRegistrarCliente').reset();
    document.getElementById('tipoDocumento').focus();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    
    const form = document.getElementById('formRegistrarCliente');
    form.addEventListener('submit', registrarCliente);
    
    // Validar documento al cambiar tipo o escribir
    document.getElementById('tipoDocumento').addEventListener('change', validarDocumento);
    document.getElementById('numeroDocumento').addEventListener('input', validarDocumento);
    
    // Validar teléfono
    document.getElementById('telefono').addEventListener('input', validarTelefono);
    
    // Validar solo letras en nombres y apellidos
    document.getElementById('nombres').addEventListener('input', function() {
        this.value = this.value.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ\s]/g, '');
    });
    
    document.getElementById('apellidos').addEventListener('input', function() {
        this.value = this.value.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ\s]/g, '');
    });
});
