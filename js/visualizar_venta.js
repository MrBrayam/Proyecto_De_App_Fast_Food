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
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/ventas/listar');
        const datos = await response.json();

        if (datos.exito) {
            ventas = datos.items || [];
            ventasFiltradas = [...ventas];
            renderizarTabla();
        } else {
            alert('Error al cargar ventas');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar ventas');
    }
}

// Renderizar tabla de ventas
function renderizarTabla() {
    const tbody = document.getElementById('tbodyVentas');
    tbody.innerHTML = '';

    if (ventasFiltradas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No hay ventas</td></tr>';
        return;
    }

    ventasFiltradas.forEach(venta => {
        const fecha = new Date(venta.FechaVenta).toLocaleDateString('es-ES');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${venta.CodVenta}</td>
            <td>${fecha}</td>
            <td>${venta.IdCliente ? 'Cliente ID: ' + venta.IdCliente : 'Sin cliente'}</td>
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
    document.getElementById('detalleCliente').textContent = venta.IdCliente ? 'ID: ' + venta.IdCliente : 'Sin cliente registrado';
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
    window.location.href = 'menu_principal.html';
}

        campoBusqueda.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                buscarVenta();
            }
        });
    }
}

// Cargar ventas desde la base de datos
function cargarVentas() {
    // Las ventas se cargan desde la base de datos
    // todasLasVentas = await fetch('/api/ventas').then(r => r.json());
    
    const ventasGuardadas = localStorage.getItem('ventas');
    if (ventasGuardadas) {
        todasLasVentas = JSON.parse(ventasGuardadas);
    } else {
        todasLasVentas = [];
    }
    
    mostrarVentas(todasLasVentas);
}

// Mostrar ventas en la tabla
function mostrarVentas(ventas) {
    const tbody = document.getElementById('tbodyVentas');
    tbody.innerHTML = '';
    
    if (ventas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-inbox" style="font-size: 48px; display: block; margin-bottom: 15px;"></i>
                    No se encontraron ventas
                </td>
            </tr>
        `;
        return;
    }
    
    ventas.forEach((venta, index) => {
        const tr = document.createElement('tr');
        tr.onclick = () => seleccionarVenta(index, venta);
        
        tr.innerHTML = `
            <td>${venta.nroComprobante || '------'}</td>
            <td>${venta.fecha || '------'}</td>
            <td>${venta.cliente || '------'}</td>
            <td>${venta.total ? 'S/ ' + venta.total.toFixed(2) : '------'}</td>
            <td>${venta.tipoPago || '------'}</td>
        `;
        
        tbody.appendChild(tr);
    });
}
// Seleccionar una venta de la tabla
function seleccionarVenta(index, venta) {
    // Remover selección anterior
    const filas = document.querySelectorAll('.tabla-ventas-principal tbody tr');
    filas.forEach(fila => fila.classList.remove('selected'));
    
    // Agregar selección a la fila clickeada
    filas[index].classList.add('selected');
    
    ventaSeleccionada = venta;
    
    // Habilitar botón de detalle
    document.getElementById('btnDetalle').disabled = false;
}

// Buscar venta
function buscarVenta() {
    const valorBusqueda = document.getElementById('campoBusqueda').value.toLowerCase().trim();
    
    if (!valorBusqueda) {
        mostrarVentas(todasLasVentas);
        return;
    }
    
    // Buscar en todos los campos
    const ventasFiltradas = todasLasVentas.filter(v => 
        (v.nroComprobante && v.nroComprobante.toLowerCase().includes(valorBusqueda)) ||
        (v.fecha && v.fecha.includes(valorBusqueda)) ||
        (v.cliente && v.cliente.toLowerCase().includes(valorBusqueda)) ||
        (v.tipoPago && v.tipoPago.toLowerCase().includes(valorBusqueda)) ||
        (v.total && v.total.toString().includes(valorBusqueda))
    );
    
    if (ventasFiltradas.length === 0) {
        alert('No se encontraron ventas con ese criterio de búsqueda');
        mostrarVentas(todasLasVentas);
    } else {
        mostrarVentas(ventasFiltradas);
    }
}

// Mostrar detalle de la venta seleccionada
function mostrarDetalle() {
    if (!ventaSeleccionada) {
        alert('Por favor, seleccione una venta de la tabla');
        return;
    }
    
    // Llenar datos del comprobante
    document.getElementById('detalleNroComprobante').textContent = ventaSeleccionada.nroComprobante;
    document.getElementById('detalleFecha').textContent = ventaSeleccionada.fecha;
    document.getElementById('detalleHora').textContent = ventaSeleccionada.hora || '00:00:00';
    document.getElementById('detalleCliente').textContent = ventaSeleccionada.cliente;
    document.getElementById('detalleTipoPago').textContent = ventaSeleccionada.tipoPago;
    
    // Llenar tabla de productos
    const tbodyProductos = document.getElementById('tablaDetalleProductos');
    tbodyProductos.innerHTML = '';
    
    ventaSeleccionada.productos.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.nombre || producto.producto}</td>
            <td>${producto.cantidad}</td>
            <td>S/ ${producto.precio.toFixed(2)}</td>
            <td>S/ ${producto.total.toFixed(2)}</td>
        `;
        tbodyProductos.appendChild(tr);
    });
    
    // Calcular totales
    const total = ventaSeleccionada.total;
    const subtotal = total / 1.18; // Quitar IGV
    const igv = total - subtotal;
    
    document.getElementById('detalleSubtotal').textContent = `S/ ${subtotal.toFixed(2)}`;
    document.getElementById('detalleIGV').textContent = `S/ ${igv.toFixed(2)}`;
    document.getElementById('detalleTotal').textContent = `S/ ${total.toFixed(2)}`;
    
    // Mostrar modal
    const modal = document.getElementById('modalDetalle');
    modal.classList.add('active');
}

// Cerrar modal
function cerrarModal() {
    const modal = document.getElementById('modalDetalle');
    modal.classList.remove('active');
}

// Imprimir comprobante
function imprimirComprobante() {
    // Seleccionar solo el contenido del comprobante
    const comprobante = document.querySelector('.comprobante');
    const ventanaImpresion = window.open('', '_blank', 'width=800,height=600');
    
    ventanaImpresion.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Comprobante - ${ventaSeleccionada.nroComprobante}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }
                .comprobante-header {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    padding-bottom: 25px;
                    border-bottom: 3px solid #2c2f3e;
                    margin-bottom: 25px;
                }
                .empresa-info h3 {
                    color: #ff5733;
                    font-size: 24px;
                }
                .comprobante-numero {
                    text-align: right;
                }
                .tabla-detalle {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                .tabla-detalle th,
                .tabla-detalle td {
                    padding: 10px;
                    border: 1px solid #ddd;
                }
                .tabla-detalle th {
                    background: #2c2f3e;
                    color: white;
                }
                .comprobante-totales {
                    text-align: right;
                    margin-top: 20px;
                }
                .total-final {
                    font-size: 20px;
                    font-weight: bold;
                    color: #ff5733;
                }
                @media print {
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            ${comprobante.innerHTML}
        </body>
        </html>
    `);
    
    ventanaImpresion.document.close();
    setTimeout(() => {
        ventanaImpresion.print();
    }, 250);
}

// Descargar como PDF
function descargarPDF() {
    alert('Funcionalidad de descarga de PDF en desarrollo.\nEn producción, se integrará con una librería como jsPDF o html2pdf.');
    
    // Aquí iría la integración con jsPDF o similar
    console.log('Descargando PDF de venta:', ventaSeleccionada);
}

// Exportar ventas
function exportarVentas() {
    if (todasLasVentas.length === 0) {
        alert('No hay ventas para exportar');
        return;
    }
    
    // Crear CSV
    let csv = 'Nro Comprobante,Fecha,Hora,Cliente,Tipo Pago,Total\n';
    
    todasLasVentas.forEach(venta => {
        csv += `${venta.nroComprobante},${venta.fecha},${venta.hora || ''},${venta.cliente},${venta.tipoPago},${venta.total}\n`;
    });
    
    // Descargar archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `ventas_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Salir
function salir() {
    if (confirm('¿Desea regresar al menú principal?')) {
        window.location.href = '../index.html';
    }
}

// Volver al menú
function volverMenu() {
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
