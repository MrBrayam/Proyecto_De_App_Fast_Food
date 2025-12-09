// ===== VISUALIZAR COMPRAS - JAVASCRIPT =====

// Variables globales
let comprasData = [];
let compraSeleccionada = null;

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    cargarCompras();
    configurarEventListeners();
});

// Configurar event listeners
function configurarEventListeners() {
    const busquedaInput = document.getElementById('busqueda');
    if (busquedaInput) {
        busquedaInput.addEventListener('input', aplicarFiltros);
    }
}

// Cargar compras desde la API
async function cargarCompras() {
    try {
        mostrarCargando(true);
        
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/compras/listar', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.exito) {
            comprasData = data.compras || [];
            mostrarCompras(comprasData);
            actualizarEstadisticas(comprasData);
        } else {
            mostrarMensajeError('Error al cargar las compras: ' + (data.mensaje || 'Error desconocido'));
        }
        
    } catch (error) {
        console.error('Error al cargar compras:', error);
        mostrarMensajeError('Error de conexión al cargar las compras');
    } finally {
        mostrarCargando(false);
    }
}

// Mostrar compras en la tabla
function mostrarCompras(compras) {
    const tbody = document.querySelector('#tablaCompras tbody');
    
    if (!tbody) {
        console.error('No se encontró el tbody de la tabla');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (!compras || compras.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="mensaje-vacio">
                    <i class="fas fa-inbox"></i>
                    <p>No hay compras registradas</p>
                </td>
            </tr>
        `;
        return;
    }
    
    compras.forEach(compra => {
        const row = document.createElement('tr');
        row.classList.add('compra-row');
        row.setAttribute('data-id', compra.IdCompra);
        
        // Generar badge de estado
        const estadoBadge = generarBadgeEstado(compra.Estado);
        
        // Generar botón Pagar (solo si está pendiente)
        const botonPagar = compra.Estado === 'pendiente' 
            ? `<button class="btn-pagar" onclick="confirmPago(${compra.IdCompra})" title="Confirmar pago">
                <i class="fas fa-check"></i> Pagar
               </button>`
            : `<span class="sin-accion">-</span>`;
        
        row.innerHTML = `
            <td>${compra.IdCompra || '-'}</td>
            <td>${compra.FechaCompra || '-'}</td>
            <td>${compra.RazonSocial || '-'}</td>
            <td>S/ ${parseFloat(compra.Total || 0).toFixed(2)}</td>
            <td>${estadoBadge}</td>
            <td>${botonPagar}</td>
        `;
        
        row.addEventListener('click', function() {
            seleccionarFila(this, compra);
        });
        
        tbody.appendChild(row);
    });
}

// Generar badge de estado con estilos
function generarBadgeEstado(estado) {
    const estados = {
        'pendiente': { class: 'badge-pendiente', label: 'Pendiente' },
        'recibido': { class: 'badge-recibido', label: 'Recibido' },
        'cancelado': { class: 'badge-cancelado', label: 'Pagado' }
    };
    
    const info = estados[estado] || { class: 'badge-pendiente', label: estado };
    return `<span class="badge-estado ${info.class}">${info.label}</span>`;
}

// Confirmar pago de compra
async function confirmPago(idCompra) {
    if (!confirm('¿Está seguro que desea marcar esta compra como pagada?')) {
        return;
    }
    
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/compras/actualizar-estado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                IdCompra: idCompra,
                Estado: 'cancelado'
            })
        });
        
        const data = await response.json();
        
        if (data.exito) {
            mostrarNotificacion('Pago confirmado exitosamente', 'success');
            cargarCompras(); // Recargar tabla
        } else {
            mostrarNotificacion('Error al confirmar pago: ' + (data.mensaje || 'Error desconocido'), 'error');
        }
    } catch (error) {
        console.error('Error al confirmar pago:', error);
        mostrarNotificacion('Error de conexión al confirmar pago', 'error');
    }
}

// Mostrar notificación (toast)
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${tipo}`;
    notification.textContent = mensaje;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${tipo === 'success' ? '#4CAF50' : tipo === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-in;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Seleccionar fila de la tabla
function seleccionarFila(fila, compra) {
    // Remover selección previa
    document.querySelectorAll('.compra-row').forEach(row => {
        row.classList.remove('selected');
    });
    
    // Agregar selección a la fila actual
    fila.classList.add('selected');
    
    // Guardar compra seleccionada
    compraSeleccionada = compra;
    
    // Habilitar botón detalle
    const btnDetalle = document.getElementById('btnDetalle');
    if (btnDetalle) {
        btnDetalle.disabled = false;
    }
}

// Actualizar estadísticas (opcional - puede expandirse)
function actualizarEstadisticas(compras) {
    // Calcular total gastado
    const totalGastado = compras.reduce((sum, compra) => {
        return sum + parseFloat(compra.Total || 0);
    }, 0);
    
    console.log(`Total de compras: ${compras.length}`);
    console.log(`Total gastado: S/ ${totalGastado.toFixed(2)}`);
}

// Aplicar filtros de búsqueda
function aplicarFiltros() {
    const busqueda = document.getElementById('busqueda').value.toLowerCase().trim();
    
    let comprasFiltradas = [...comprasData];
    
    // Filtrar por búsqueda
    if (busqueda) {
        comprasFiltradas = comprasFiltradas.filter(compra => {
            const id = (compra.IdCompra || '').toString().toLowerCase();
            const fecha = (compra.FechaCompra || '').toLowerCase();
            const proveedor = (compra.RazonSocial || '').toLowerCase();
            const total = (compra.Total || '').toString().toLowerCase();
            
            return id.includes(busqueda) || 
                   fecha.includes(busqueda) || 
                   proveedor.includes(busqueda) ||
                   total.includes(busqueda);
        });
    }
    
    mostrarCompras(comprasFiltradas);
}

// Buscar compra específica
function buscarCompra() {
    aplicarFiltros();
}

// Ver detalle de compra
function verDetalle() {
    if (!compraSeleccionada) {
        alert('Por favor, seleccione una compra de la tabla');
        return;
    }
    
    // Mostrar información detallada
    const mensaje = `
        DETALLE DE COMPRA
        
        ID: ${compraSeleccionada.IdCompra || '-'}
        Fecha: ${compraSeleccionada.FechaCompra || '-'}
        Proveedor: ${compraSeleccionada.RazonSocial || '-'}
        RUC: ${compraSeleccionada.RUC || '-'}
        Comprobante: ${compraSeleccionada.TipoComprobante || '-'} - ${compraSeleccionada.NumeroComprobante || '-'}
        Teléfono: ${compraSeleccionada.Telefono || '-'}
        Dirección: ${compraSeleccionada.Direccion || '-'}
        
        SubTotal: S/ ${parseFloat(compraSeleccionada.SubTotal || 0).toFixed(2)}
        IGV: S/ ${parseFloat(compraSeleccionada.IGV || 0).toFixed(2)}
        Total: S/ ${parseFloat(compraSeleccionada.Total || 0).toFixed(2)}
        
        Estado: ${compraSeleccionada.Estado || '-'}
        Observaciones: ${compraSeleccionada.Observaciones || 'Ninguna'}
    `;
    
    alert(mensaje);
}

// Exportar compras (función placeholder)
function exportarCompras() {
    if (!comprasData || comprasData.length === 0) {
        alert('No hay compras para exportar');
        return;
    }
    
    alert('Función de exportación en desarrollo');
    console.log('Compras a exportar:', comprasData);
}

// Mostrar/ocultar indicador de carga
function mostrarCargando(mostrar) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = mostrar ? 'flex' : 'none';
    }
}

// Mostrar mensaje de error
function mostrarMensajeError(mensaje) {
    alert(mensaje);
    console.error(mensaje);
}

// Salir del módulo
function salirModulo() {
    if (confirm('¿Está seguro que desea salir del módulo de compras?')) {
        window.location.href = 'menu_principal.html';
    }
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
