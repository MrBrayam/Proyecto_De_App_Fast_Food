/* ============================================
   JAVASCRIPT PARA VISUALIZAR VENTAS
   ============================================ */

let ventas = [];
let ventasFiltradas = [];
let ventaActualEnModal = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    cargarVentas();
});

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
    
    document.getElementById('currentDate').textContent = fechaFormateada + ' ' + horaFormateada;
}

// Cargar todas las ventas
async function cargarVentas() {
    try {
        console.log('Iniciando cargarVentas()');
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/ventas/listar');
        console.log('Response received:', response.status, response.statusText);
        
        const datos = await response.json();
        console.log('Response JSON:', datos);

        if (datos.exito) {
            ventas = datos.items || [];
            ventasFiltradas = [...ventas];
            console.log('Ventas cargadas:', ventas.length);
            renderizarTabla();
        } else {
            console.error('Error en respuesta API:', datos);
            alert('Error al cargar ventas: ' + (datos.mensaje || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error en cargarVentas:', error);
        alert('Error al cargar ventas: ' + error.message);
    }
}

// Renderizar tabla de ventas
function renderizarTabla() {
    console.log('Iniciando renderizarTabla()');
    const tbody = document.getElementById('tbodyVentas');
    
    if (!tbody) {
        console.error('Elemento tbody#tbodyVentas no encontrado');
        return;
    }
    
    tbody.innerHTML = '';
    console.log('ventasFiltradas:', ventasFiltradas.length);

    if (ventasFiltradas.length === 0) {
        console.log('No hay ventas para mostrar');
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No hay ventas</td></tr>';
        return;
    }

    ventasFiltradas.forEach(venta => {
        const fecha = new Date(venta.FechaVenta).toLocaleDateString('es-ES');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${venta.CodVenta}</td>
            <td>${fecha}</td>
            <td>${venta.NombreCliente || 'Sin cliente'}</td>
            <td>S/ ${parseFloat(venta.SubTotal).toFixed(2)}</td>
            <td>S/ ${parseFloat(venta.Descuento).toFixed(2)}</td>
            <td><strong>S/ ${parseFloat(venta.Total).toFixed(2)}</strong></td>
            <td>${capitalizar(venta.TipoPago)}</td>
            <td>
                <button class="btn-ver" onclick="verDetalleVenta(${venta.CodVenta})" title="Ver detalle">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Capitalizar texto
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Ver detalle de venta
async function verDetalleVenta(codVenta) {
    try {
        const response = await fetch(`/Proyecto_De_App_Fast_Food/api/ventas/buscar?id=${codVenta}`);
        const datos = await response.json();

        if (datos.exito && datos.venta) {
            ventaActualEnModal = datos.venta;
            mostrarModalDetalle(datos.venta);
        } else {
            alert('Error al cargar detalle de venta');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar venta');
    }
}

// Mostrar modal con detalle
async function mostrarModalDetalle(venta) {
    // Información de la venta
    document.getElementById('detalleIdVenta').textContent = venta.CodVenta;
    document.getElementById('detalleFecha').textContent = new Date(venta.FechaVenta).toLocaleDateString('es-ES');
    document.getElementById('detalleCliente').textContent = venta.NombreCliente || 'Sin cliente registrado';
    document.getElementById('detalleUsuario').textContent = 'Usuario ID: ' + venta.IdUsuario;
    document.getElementById('detalleTipoPago').textContent = capitalizar(venta.TipoPago);
    document.getElementById('detalleEstado').textContent = venta.Estado;

    // Cargar detalles de la venta (productos)
    // Aquí necesitaríamos un endpoint que devuelva los detalles de venta
    // Por ahora, mostraremos los totales
    document.getElementById('detalleSubtotal').textContent = 'S/ ' + parseFloat(venta.SubTotal).toFixed(2);
    document.getElementById('detalleDescuento').textContent = 'S/ ' + parseFloat(venta.Descuento).toFixed(2);
    document.getElementById('detalleTotal').textContent = 'S/ ' + parseFloat(venta.Total).toFixed(2);

    // Cargar productos desde API (próxima mejora: crear endpoint para detalles)
    const tbody = document.getElementById('detalleProductos');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Cargando productos...</td></tr>';

    // Por ahora mostrar mensaje simple
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Detalles de productos disponibles en próxima versión</td></tr>';

    // Mostrar modal
    document.getElementById('modalDetalle').style.display = 'block';
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modalDetalle').style.display = 'none';
    ventaActualEnModal = null;
}

// Buscar venta
function buscarVenta() {
    const busqueda = document.getElementById('campoBusqueda').value.trim().toLowerCase();
    const filtroTipoPago = document.getElementById('filtroTipoPago').value;

    if (busqueda === '' && filtroTipoPago === '') {
        ventasFiltradas = [...ventas];
    } else {
        ventasFiltradas = ventas.filter(venta => {
            const coincideBusqueda = 
                venta.CodVenta.toString().includes(busqueda) ||
                venta.TipoPago.toLowerCase().includes(busqueda);
            
            const coincideFiltro = filtroTipoPago === '' || venta.TipoPago === filtroTipoPago;
            
            return coincideBusqueda && coincideFiltro;
        });
    }

    renderizarTabla();
}

// Limpiar búsqueda
function limpiarBusqueda() {
    document.getElementById('campoBusqueda').value = '';
    document.getElementById('filtroTipoPago').value = '';
    ventasFiltradas = [...ventas];
    renderizarTabla();
}

// Salir
function salir() {
    if (confirm('¿Desea regresar al menú principal?')) {
        window.location.href = '../index.html';
    }
}

// Cerrar modal al hacer click fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('modalDetalle');
    if (event.target === modal) {
        cerrarModal();
    }
}

// Cerrar modal con la tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarModal();
    }
});
