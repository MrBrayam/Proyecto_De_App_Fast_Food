// ===== REGISTRAR COMPRAS - JAVASCRIPT =====

// Variables globales
let lineasCompra = [];
let proveedorSeleccionado = null;
let numeroLinea = 0;

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Event listeners
    document.getElementById('ruc').addEventListener('blur', buscarProveedorPorRuc);
    document.getElementById('cantidad').addEventListener('change', calcularTotal);
    document.getElementById('precioUnitario').addEventListener('change', calcularTotal);
});

// Buscar proveedor por RUC
async function buscarProveedorPorRuc() {
    const ruc = document.getElementById('ruc').value.trim();
    
    if (!ruc || ruc.length < 8) {
        limpiarDatosProveedor();
        return;
    }
    
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/proveedores/buscar?numDoc=' + ruc, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.exito && data.proveedor) {
            // Autocompletar el formulario
            const proveedor = data.proveedor;
            document.getElementById('razonSocial').value = proveedor.razonSocial || '';
            document.getElementById('telefono').value = proveedor.telefono || '';
            document.getElementById('direccion').value = proveedor.direccion || '';
            
            proveedorSeleccionado = proveedor;
            
            console.log('Proveedor encontrado:', proveedor);
        } else {
            limpiarDatosProveedor();
            mostrarMensaje('Proveedor no encontrado', 'warning');
        }
        
    } catch (error) {
        console.error('Error al buscar proveedor:', error);
        limpiarDatosProveedor();
    }
}

// Limpiar datos del proveedor
function limpiarDatosProveedor() {
    document.getElementById('razonSocial').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('direccion').value = '';
    proveedorSeleccionado = null;
}

// Agregar nueva línea de compra
function agregarLineaCompra() {
    const formulario = document.getElementById('formularioLinea');
    formulario.style.display = formulario.style.display === 'none' ? 'block' : 'none';
    
    if (formulario.style.display === 'block') {
        document.getElementById('codigo').focus();
    }
}

// Guardar línea de compra
function guardarLineaCompra() {
    const codigo = document.getElementById('codigo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const empaque = document.getElementById('empaque').value.trim();
    const cantidad = parseFloat(document.getElementById('cantidad').value);
    const precioUnitario = parseFloat(document.getElementById('precioUnitario').value);
    
    // Validaciones
    if (!codigo) {
        mostrarMensaje('El código del producto es requerido', 'error');
        document.getElementById('codigo').focus();
        return;
    }
    
    if (!descripcion) {
        mostrarMensaje('La descripción es requerida', 'error');
        document.getElementById('descripcion').focus();
        return;
    }
    
    if (!cantidad || cantidad <= 0) {
        mostrarMensaje('La cantidad debe ser mayor a 0', 'error');
        document.getElementById('cantidad').focus();
        return;
    }
    
    if (!precioUnitario || precioUnitario <= 0) {
        mostrarMensaje('El precio unitario debe ser mayor a 0', 'error');
        document.getElementById('precioUnitario').focus();
        return;
    }
    
    // Crear línea
    numeroLinea++;
    const total = cantidad * precioUnitario;
    
    const linea = {
        numero: numeroLinea,
        codigo,
        descripcion,
        empaque,
        cantidad,
        precioUnitario,
        total
    };
    
    lineasCompra.push(linea);
    
    // Limpiar formulario
    limpiarFormularioLinea();
    document.getElementById('formularioLinea').style.display = 'none';
    
    // Actualizar tabla
    actualizarTablaCompra();
    actualizarTotales();
    
    mostrarMensaje('Producto agregado correctamente', 'success');
}

// Cancelar agregar línea
function cancelarLineaCompra() {
    limpiarFormularioLinea();
    document.getElementById('formularioLinea').style.display = 'none';
}

// Limpiar formulario de línea
function limpiarFormularioLinea() {
    document.getElementById('codigo').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('empaque').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('precioUnitario').value = '';
}

// Actualizar tabla de compra
function actualizarTablaCompra() {
    const tbody = document.getElementById('tablaProductosBody');
    tbody.innerHTML = '';
    
    lineasCompra.forEach((linea) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${linea.numero}</td>
            <td>${linea.codigo}</td>
            <td>${linea.descripcion}</td>
            <td>${linea.empaque}</td>
            <td>${parseFloat(linea.cantidad).toFixed(2)}</td>
            <td>S/ ${parseFloat(linea.precioUnitario).toFixed(2)}</td>
            <td>S/ ${parseFloat(linea.total).toFixed(2)}</td>
            <td>
                <button type="button" class="btn-eliminar" onclick="eliminarLineaCompra(${linea.numero})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Eliminar línea de compra
function eliminarLineaCompra(numero) {
    if (confirm('¿Desea eliminar esta línea?')) {
        lineasCompra = lineasCompra.filter(l => l.numero !== numero);
        actualizarTablaCompra();
        actualizarTotales();
        mostrarMensaje('Línea eliminada correctamente', 'success');
    }
}

// Calcular total de línea
function calcularTotal() {
    const cantidad = parseFloat(document.getElementById('cantidad').value) || 0;
    const precioUnitario = parseFloat(document.getElementById('precioUnitario').value) || 0;
    // Se calcula automáticamente cuando se guarda
}

// Actualizar totales
function actualizarTotales() {
    const subtotal = lineasCompra.reduce((sum, linea) => sum + linea.total, 0);
    const igv = subtotal * 0.18;
    const total = subtotal + igv;
    
    document.getElementById('subtotal').textContent = 'S/ ' + subtotal.toFixed(2);
    document.getElementById('igv').textContent = 'S/ ' + igv.toFixed(2);
    document.getElementById('total').textContent = 'S/ ' + total.toFixed(2);
}

// Validar formulario principal
function validarFormularioPrincipal() {
    const ruc = document.getElementById('ruc').value.trim();
    const tipoComprobante = document.getElementById('tipoComprobante').value;
    const razonSocial = document.getElementById('razonSocial').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    
    if (!ruc) {
        mostrarMensaje('El RUC es requerido', 'error');
        return false;
    }
    
    if (!tipoComprobante) {
        mostrarMensaje('Debe seleccionar un tipo de comprobante', 'error');
        return false;
    }
    
    if (!razonSocial) {
        mostrarMensaje('La razón social es requerida', 'error');
        return false;
    }
    
    if (!telefono) {
        mostrarMensaje('El teléfono es requerido', 'error');
        return false;
    }
    
    if (!direccion) {
        mostrarMensaje('La dirección es requerida', 'error');
        return false;
    }
    
    if (lineasCompra.length === 0) {
        mostrarMensaje('Debe agregar al menos un producto', 'error');
        return false;
    }
    
    return true;
}

// Registrar compra
async function registrarCompra() {
    if (!validarFormularioPrincipal()) {
        return;
    }
    
    const subtotal = lineasCompra.reduce((sum, linea) => sum + linea.total, 0);
    const igv = subtotal * 0.18;
    const total = subtotal + igv;
    
    const datosCompra = {
        codProveedor: proveedorSeleccionado?.CodProveedor || 0,
        ruc: document.getElementById('ruc').value.trim(),
        tipoComprobante: document.getElementById('tipoComprobante').value,
        numeroComprobante: '',
        razonSocial: document.getElementById('razonSocial').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        direccion: document.getElementById('direccion').value.trim(),
        subTotal: subtotal,
        igv: igv,
        total: total,
        fechaCompra: new Date().toISOString().split('T')[0],
        estado: 'pendiente',
        idUsuario: 1, // Cambiar según usuario logueado
        observaciones: ''
    };
    
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/compras/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosCompra)
        });
        
        const data = await response.json();
        
        if (data.exito) {
            mostrarMensaje('Compra registrada correctamente', 'success');
            
            // Limpiar formulario después de 2 segundos
            setTimeout(() => {
                limpiarTodoFormulario();
            }, 2000);
        } else {
            mostrarMensaje('Error al registrar: ' + (data.mensaje || 'Error desconocido'), 'error');
        }
        
    } catch (error) {
        console.error('Error al registrar compra:', error);
        mostrarMensaje('Error de conexión al registrar', 'error');
    }
}

// Limpiar todo el formulario
function limpiarTodoFormulario() {
    document.getElementById('formRegistrarCompra').reset();
    document.getElementById('formularioLinea').style.display = 'none';
    limpiarFormularioLinea();
    lineasCompra = [];
    numeroLinea = 0;
    proveedorSeleccionado = null;
    actualizarTablaCompra();
    actualizarTotales();
}

// Mostrar mensaje
function mostrarMensaje(mensaje, tipo) {
    alert(mensaje); // Cambiar por un toast/notificación más elegante si desea
    console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
}

// Salir del módulo
function salirModulo() {
    if (lineasCompra.length > 0) {
        if (!confirm('Tiene productos sin guardar. ¿Está seguro que desea salir?')) {
            return;
        }
    }
    window.location.href = 'menu_principal.html';
}

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
