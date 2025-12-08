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
                <td colspan="4" class="mensaje-vacio">
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
        
        row.innerHTML = `
            <td>${compra.IdCompra || '-'}</td>
            <td>${compra.FechaCompra || '-'}</td>
            <td>${compra.RazonSocial || '-'}</td>
            <td>S/ ${parseFloat(compra.Total || 0).toFixed(2)}</td>
        `;
        
        row.addEventListener('click', function() {
            seleccionarFila(this, compra);
        });
        
        tbody.appendChild(row);
    });
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
