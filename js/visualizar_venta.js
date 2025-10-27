/* ============================================
   JAVASCRIPT PARA VISUALIZAR VENTAS
   ============================================ */

// Variables globales
let ventaSeleccionada = null;
let todasLasVentas = [];

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    cargarVentas();
    configurarEventos();
});

// Actualizar fecha y hora en tiempo real
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
    
    document.getElementById('fechaActual').textContent = fechaFormateada;
    document.getElementById('horaActual').textContent = horaFormateada;
}

// Configurar eventos
function configurarEventos() {
    // Evento para búsqueda al presionar Enter
    const campoBusqueda = document.getElementById('campoBusqueda');
    if (campoBusqueda) {
        campoBusqueda.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                buscarVenta();
            }
        });
    }
}

// Cargar ventas desde localStorage o crear ejemplos
function cargarVentas() {
    // Intentar cargar desde localStorage
    const ventasGuardadas = localStorage.getItem('ventas');
    
    if (ventasGuardadas) {
        todasLasVentas = JSON.parse(ventasGuardadas);
    } else {
        // Crear ventas de ejemplo
        todasLasVentas = [
            {
                id: 1,
                nroComprobante: '-------',
                fecha: '2025-10-27',
                fechaFormato: '26/10/2025 14:30',
                hora: '14:30:00',
                cliente: 'Juan Pérez',
                mesa: 'Mesa 1',
                tipoPago: 'efectivo',
                productos: [
                    { nombre: 'Pizza Hawaiana', cantidad: 2, precio: 35.00, total: 70.00 }
                ],
                productosTexto: 'Pizza Hawaiana x1',
                total: 70.00,
                estado: 'entregado'
            },
            {
                id: 2,
                nroComprobante: '1234676 136.00',
                fecha: '2025-10-27',
                fechaFormato: '26/10/2025 15:15',
                hora: '15:15:00',
                cliente: 'María González',
                mesa: 'Para llevar',
                tipoPago: 'Tarjeta',
                productos: [
                    { nombre: 'Pizza Pepperoni', cantidad: 1, precio: 40.00, total: 40.00 }
                ],
                productosTexto: 'Pizza Pepperoni x1',
                total: 40.00,
                estado: 'preparando'
            },
            {
                id: 3,
                nroComprobante: '-------',
                fecha: '2025-10-27',
                fechaFormato: '26/10/2025 15:45',
                hora: '16:00:00',
                cliente: 'Carlos Ramírez',
                mesa: 'Mesa 3',
                tipoPago: 'Transferencia',
                productos: [
                    { nombre: 'Pizza Vegetariana', cantidad: 1, precio: 38.00, total: 38.00 },
                    { nombre: 'Coca Cola 1.5L', cantidad: 2, precio: 8.00, total: 16.00 }
                ],
                productosTexto: 'Pizza Vegetariana x1',
                total: 54.00,
                estado: 'pendiente'
            }
        ];
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
