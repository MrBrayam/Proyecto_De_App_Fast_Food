/* ============================================
   JAVASCRIPT PARA REGISTRAR PROVEEDOR
   Maneja el registro completo de proveedores con validaciones
   ============================================ */

let proveedorEditando = null;

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
    // Limpiar espacios y caracteres no numéricos
    const telefonoLimpio = telefono.trim().replace(/\s+/g, '');
    const esValido = /^\d{9}$/.test(telefonoLimpio);
    
    // Debug
    console.log('Validando teléfono:', {
        original: telefono,
        limpio: telefonoLimpio,
        longitud: telefonoLimpio.length,
        esValido: esValido
    });
    
    return esValido;
}

// Validar email
function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Enviar formulario
async function submitForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const tipoDocumento = document.getElementById('tipoDocumento').value;
    const numeroDocumento = document.getElementById('numeroDocumento').value.trim();
    const razonSocial = document.getElementById('razonSocial').value.trim();
    const nombreComercial = document.getElementById('nombreComercial').value.trim() || '';
    const categoria = document.getElementById('categoria').value;
    const telefono = document.getElementById('telefono').value.trim().replace(/\s+/g, '');
    const telefonoSecundario = document.getElementById('telefonoSecundario').value.trim().replace(/\s+/g, '') || '';
    const email = document.getElementById('email').value.trim();
    const sitioWeb = document.getElementById('sitioWeb').value.trim() || '';
    const personaContacto = document.getElementById('personaContacto').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim() || '';
    const distrito = document.getElementById('distrito').value.trim() || '';
    const tiempoEntrega = document.getElementById('tiempoEntrega').value || '0';
    const montoMinimo = document.getElementById('montoMinimo').value || '0.00';
    const descuento = document.getElementById('descuento').value || '0.00';
    const observaciones = document.getElementById('observaciones').value.trim() || '';
    const estado = document.getElementById('estado').value;
    
    // Validaciones
    if (!tipoDocumento) {
        alert('Debe seleccionar un tipo de documento');
        return;
    }
    
    if (!numeroDocumento) {
        alert('Debe ingresar un número de documento');
        return;
    }
    
    if (!validarDocumento()) return;
    
    if (!razonSocial) {
        alert('Debe ingresar la razón social');
        return;
    }
    
    if (!categoria) {
        alert('Debe seleccionar una categoría');
        return;
    }
    
    if (!telefono) {
        alert('Debe ingresar un teléfono');
        return;
    }
    
    if (!validarTelefono(telefono)) {
        alert(`El teléfono debe tener exactamente 9 dígitos numéricos.\nTeléfono ingresado: "${telefono}" (${telefono.length} caracteres)`);
        document.getElementById('telefono').focus();
        return;
    }
    
    if (!email) {
        alert('Debe ingresar un email');
        return;
    }
    
    if (!validarEmail(email)) {
        alert('El email no es válido');
        return;
    }
    
    if (!personaContacto) {
        alert('Debe ingresar el nombre de la persona contacto');
        return;
    }
    
    if (!direccion) {
        alert('Debe ingresar una dirección');
        return;
    }
    
    // Deshabilitar botón
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = proveedorEditando 
            ? '<i class="fas fa-spinner fa-spin"></i> Actualizando...'
            : '<i class="fas fa-spinner fa-spin"></i> Registrando...';
    }
    
    const data = {
        tipoDoc: tipoDocumento,
        numDoc: numeroDocumento,
        razonSocial: razonSocial,
        nombreComercial: nombreComercial || null,
        categoria: categoria,
        telefono: telefono,
        telefonoSecundario: telefonoSecundario || null,
        email: email,
        sitioWeb: sitioWeb || null,
        personaContacto: personaContacto,
        direccion: direccion,
        ciudad: ciudad || null,
        distrito: distrito || null,
        tiempoEntrega: parseInt(tiempoEntrega) || 0,
        montoMinimo: parseFloat(montoMinimo) || 0.00,
        descuento: parseFloat(descuento) || 0.00,
        nota: observaciones || null,
        estado: estado
    };
    
    // Si estamos editando, agregar el ID
    if (proveedorEditando) {
        data.codProveedor = proveedorEditando;
    }
    
    try {
        const url = proveedorEditando 
            ? '/Proyecto_De_App_Fast_Food/api/proveedores/actualizar'
            : '/Proyecto_De_App_Fast_Food/api/proveedores/registrar';
            
        const response = await fetch(url, {
            method: proveedorEditando ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.exito) {
            alert(proveedorEditando 
                ? `¡Proveedor actualizado exitosamente!\n${result.razonSocial || razonSocial}`
                : `¡Éxito!\nProveedor: ${result.razonSocial}\nCódigo: ${result.codProveedor}`
            );
            sessionStorage.removeItem('editarProveedorData');
            window.location.href = 'visualizar_proveedores.html';
        } else {
            alert('Error: ' + (result.mensaje || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al ' + (proveedorEditando ? 'actualizar' : 'registrar') + ' el proveedor. Por favor, intente nuevamente.');
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-save"></i> Registrar Proveedor';
        }
    }
}

// Limpiar formulario
function limpiarFormulario() {
    if (confirm('¿Está seguro que desea limpiar el formulario?')) {
        document.getElementById('formProveedor').reset();
        
        // Limpiar modo edición
        proveedorEditando = null;
        sessionStorage.removeItem('editarProveedorData');
        
        // Restaurar título y botón
        const titulo = document.querySelector('h1');
        if (titulo) {
            titulo.textContent = 'Registrar Nuevo Proveedor';
        }
        
        const btnGuardar = document.querySelector('.btn-guardar, button[type="submit"]');
        if (btnGuardar) {
            btnGuardar.innerHTML = '<i class="fas fa-save"></i> Registrar Proveedor';
        }
    }
}

// Cargar proveedor para editar
function cargarProveedorParaEditar() {
    const proveedorData = sessionStorage.getItem('editarProveedorData');
    if (!proveedorData) return;
    
    try {
        const proveedor = JSON.parse(proveedorData);
        
        // Guardar ID del proveedor editando
        proveedorEditando = proveedor.codProveedor || proveedor.CodProveedor;
        
        // Cambiar título y botón
        const titulo = document.querySelector('h1');
        if (titulo) {
            titulo.textContent = 'Editar Proveedor';
        }
        
        const btnGuardar = document.querySelector('.btn-guardar, button[type="submit"]');
        if (btnGuardar) {
            btnGuardar.innerHTML = '<i class="fas fa-save"></i> Actualizar Proveedor';
        }
        
        // Cargar datos en el formulario
        document.getElementById('tipoDocumento').value = proveedor.tipoDoc || proveedor.TipoDoc || '';
        document.getElementById('numeroDocumento').value = proveedor.numDoc || proveedor.NumDoc || '';
        document.getElementById('razonSocial').value = proveedor.razonSocial || proveedor.RazonSocial || '';
        document.getElementById('nombreComercial').value = proveedor.nombreComercial || proveedor.NombreComercial || '';
        document.getElementById('categoria').value = proveedor.categoria || proveedor.Categoria || '';
        document.getElementById('telefono').value = proveedor.telefono || proveedor.Telefono || '';
        document.getElementById('telefonoSecundario').value = proveedor.telefonoSecundario || proveedor.TelefonoSecundario || '';
        document.getElementById('email').value = proveedor.email || proveedor.Email || '';
        document.getElementById('sitioWeb').value = proveedor.sitioWeb || proveedor.Sitio_Web || '';
        document.getElementById('personaContacto').value = proveedor.personaContacto || proveedor.PersonaContacto || '';
        document.getElementById('direccion').value = proveedor.direccion || proveedor.Direccion || '';
        document.getElementById('ciudad').value = proveedor.ciudad || proveedor.Ciudad || '';
        document.getElementById('distrito').value = proveedor.distrito || proveedor.Distrito || '';
        document.getElementById('tiempoEntrega').value = proveedor.tiempoEntrega || proveedor.TiempoEntrega || '0';
        document.getElementById('montoMinimo').value = proveedor.montoMinimo || proveedor.MontoMinimo || '0.00';
        document.getElementById('descuento').value = proveedor.descuento || proveedor.Descuento || '0.00';
        document.getElementById('observaciones').value = proveedor.nota || proveedor.Nota || '';
        document.getElementById('estado').value = proveedor.estado || proveedor.Estado || 'activo';
        
    } catch (err) {
        console.error('Error al cargar proveedor para editar:', err);
    }
}

// Salir del módulo
function salirModulo() {
    if (confirm('¿Está seguro que desea salir? Se perderán los datos no guardados')) {
        window.location.href = 'visualizar_proveedores.html';
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
    
    // Verificar si estamos en modo edición
    const proveedorData = sessionStorage.getItem('editarProveedorData');
    if (proveedorData) {
        cargarProveedorParaEditar();
    }
    
    // Event listener para el formulario
    const form = document.getElementById('formProveedor');
    if (form) {
        form.addEventListener('submit', submitForm);
    }
    
    // Event listener para el botón limpiar
    const btnLimpiar = document.querySelector('.btn-limpiar');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarFormulario);
    }
    
    // Event listener para el botón salir
    const btnSalir = document.querySelector('.btn-salir');
    if (btnSalir) {
        btnSalir.addEventListener('click', salirModulo);
    }
    
    // Validación solo números para documento y teléfonos
    const numeroDocumento = document.getElementById('numeroDocumento');
    const telefono = document.getElementById('telefono');
    const telefonoSecundario = document.getElementById('telefonoSecundario');
    const tiempoEntrega = document.getElementById('tiempoEntrega');
    const montoMinimo = document.getElementById('montoMinimo');
    const descuento = document.getElementById('descuento');
    
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
    
    if (tiempoEntrega) {
        tiempoEntrega.addEventListener('keypress', soloNumeros);
        tiempoEntrega.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    if (montoMinimo) {
        montoMinimo.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9.]/g, '');
        });
    }
    
    if (descuento) {
        descuento.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9.]/g, '');
            if (parseFloat(this.value) > 100) {
                this.value = '100';
            }
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
