/* ============================================
   JAVASCRIPT PARA BOLETA
   ============================================ */

// Obtener parámetros de la URL
function obtenerParametros() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        tipo: urlParams.get('tipo'), // 'venta' o 'pedido'
        id: urlParams.get('id')
    };
}

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', async function() {
    const params = obtenerParametros();
    
    if (params.tipo && params.id) {
        if (params.tipo === 'venta') {
            await cargarDatosVenta(params.id);
        } else if (params.tipo === 'pedido') {
            await cargarDatosPedido(params.id);
        }
    } else {
        alert('No se especificaron los datos de la boleta');
        window.close();
    }
});

// Cargar datos de una venta
async function cargarDatosVenta(codVenta) {
    console.log('[boleta] Cargando venta ID:', codVenta);
    
    try {
        const response = await fetch(`/Proyecto_De_App_Fast_Food/api/ventas/buscar?id=${codVenta}`);
        const datos = await response.json();
        
        console.log('[boleta] Respuesta venta:', datos);

        if (datos.exito && datos.venta) {
            // Cargar detalles por separado
            console.log('[boleta] Cargando detalles de venta...');
            const responseDetalles = await fetch(`/Proyecto_De_App_Fast_Food/api/ventas/detalles?id=${codVenta}`);
            const datosDetalles = await responseDetalles.json();
            
            console.log('[boleta] Respuesta detalles:', datosDetalles);
            
            if (datosDetalles.exito && datosDetalles.detalles) {
                datos.venta.Detalles = datosDetalles.detalles.map(d => ({
                    Cantidad: d.Cantidad,
                    DescripcionProducto: d.Descripcion,
                    PrecioUnitario: d.Precio,
                    Subtotal: d.Subtotal
                }));
                console.log('[boleta] Detalles mapeados:', datos.venta.Detalles.length, 'items');
            } else {
                console.warn('[boleta] No se pudieron cargar detalles');
                datos.venta.Detalles = [];
            }
            
            mostrarBoleta(datos.venta, 'venta');
        } else {
            console.error('[boleta] Error en respuesta:', datos);
            alert('Error al cargar los datos de la venta: ' + (datos.mensaje || 'Error desconocido'));
            window.close();
        }
    } catch (error) {
        console.error('[boleta] Error de conexión:', error);
        alert('Error de conexión al cargar la venta: ' + error.message);
        window.close();
    }
}

// Cargar datos de un pedido
async function cargarDatosPedido(idPedido) {
    console.log('[boleta] Cargando pedido ID:', idPedido);
    
    try {
        const response = await fetch(`/Proyecto_De_App_Fast_Food/api/pedidos/buscar?id=${idPedido}`);
        const datos = await response.json();
        
        console.log('[boleta] Respuesta pedido:', datos);

        if (datos.exito && datos.pedido) {
            // Los pedidos ya traen los detalles
            if (!datos.pedido.Detalles) {
                datos.pedido.Detalles = [];
            }
            mostrarBoleta(datos.pedido, 'pedido');
        } else {
            console.error('[boleta] Error en respuesta pedido:', datos);
            alert('Error al cargar los datos del pedido: ' + (datos.mensaje || 'Error desconocido'));
            window.close();
        }
    } catch (error) {
        console.error('[boleta] Error de conexión:', error);
        alert('Error de conexión al cargar el pedido: ' + error.message);
        window.close();
    }
}

// Mostrar boleta con los datos
function mostrarBoleta(datos, tipo) {
    console.log('[boleta] Datos recibidos:', datos);
    
    // Tipo de comprobante
    const tipoComprobanteElement = document.getElementById('tipoComprobante');
    const tipoComprobante = datos.TipoComprobante || 'boleta';
    if (tipoComprobante.toLowerCase() === 'factura') {
        tipoComprobanteElement.textContent = 'FACTURA ELECTRÓNICA';
    } else {
        tipoComprobanteElement.textContent = 'BOLETA DE VENTA ELECTRÓNICA';
    }

    // Número de comprobante
    document.getElementById('numeroComprobante').textContent = datos.NumeroComprobante || 'Sin número';

    // Fecha
    const fecha = tipo === 'venta' ? datos.FechaVenta : datos.FechaPedido;
    document.getElementById('fechaVenta').textContent = formatearFecha(fecha);

    // Cliente
    document.getElementById('nombreCliente').textContent = datos.NombreCliente || 'Cliente General';
    document.getElementById('documentoCliente').textContent = datos.DNI || datos.RUC || '-';
    
    // Mostrar dirección solo si es delivery
    const tipoServicio = datos.TipoServicio || '';
    const direccionRow = document.getElementById('direccionRow');
    if (tipoServicio.toLowerCase() === 'delivery') {
        direccionRow.style.display = 'block';
        document.getElementById('direccionCliente').textContent = datos.DireccionCliente || '-';
    } else {
        direccionRow.style.display = 'none';
    }

    // Tipo de pago (solo en ventas)
    if (tipo === 'venta') {
        document.getElementById('tipoPago').textContent = formatearTipoPago(datos.TipoPago);
    } else {
        document.getElementById('tipoPago').textContent = 'Por pagar';
    }

    // Mesero
    document.getElementById('nombreMesero').textContent = datos.NombreMesero || datos.NombreUsuario || 'N/A';

    // Detalles
    const tbody = document.getElementById('detalleItems');
    tbody.innerHTML = '';

    if (datos.Detalles && datos.Detalles.length > 0) {
        datos.Detalles.forEach(detalle => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align: center;">${detalle.Cantidad}</td>
                <td>${detalle.DescripcionProducto || detalle.Descripcion}</td>
                <td style="text-align: right;">S/ ${parseFloat(detalle.PrecioUnitario || detalle.Precio).toFixed(2)}</td>
                <td style="text-align: right;">S/ ${parseFloat(detalle.Subtotal).toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="4" style="text-align: center;">Sin detalles disponibles</td>';
        tbody.appendChild(tr);
    }

    // Totales
    document.getElementById('subtotal').textContent = `S/ ${parseFloat(datos.SubTotal || 0).toFixed(2)}`;
    
    if (datos.Descuento && parseFloat(datos.Descuento) > 0) {
        document.getElementById('descuentoRow').style.display = 'flex';
        document.getElementById('descuento').textContent = `S/ ${parseFloat(datos.Descuento).toFixed(2)}`;
    }
    
    // Mostrar costo de delivery solo si es delivery y tiene costo
    if (tipoServicio.toLowerCase() === 'delivery' && datos.CostoDelivery && parseFloat(datos.CostoDelivery) > 0) {
        document.getElementById('deliveryRow').style.display = 'flex';
        document.getElementById('costoDelivery').textContent = `S/ ${parseFloat(datos.CostoDelivery).toFixed(2)}`;
    }
    
    document.getElementById('total').textContent = `S/ ${parseFloat(datos.Total || 0).toFixed(2)}`;
}

// Formatear fecha
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
}

// Formatear tipo de pago
function formatearTipoPago(tipo) {
    const tipos = {
        'efectivo': 'Efectivo',
        'tarjeta': 'Tarjeta',
        'yape': 'Yape',
        'plin': 'Plin'
    };
    return tipos[tipo] || tipo;
}

// Imprimir boleta
function imprimirBoleta() {
    window.print();
}

// Descargar como PDF (usando la función de impresión del navegador)
function descargarPDF() {
    alert('Use la opción "Guardar como PDF" en el diálogo de impresión');
    window.print();
}
