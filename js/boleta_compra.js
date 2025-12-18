/* ============================================
   JAVASCRIPT PARA BOLETA DE COMPRA
   ============================================ */

// Obtener parámetros de la URL
function obtenerParametros() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        id: urlParams.get('id')
    };
}

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', async function() {
    const params = obtenerParametros();
    
    if (params.id) {
        await cargarDatosCompra(params.id);
    } else {
        alert('No se especificó el ID de la compra');
        window.close();
    }
});

// Cargar datos de la compra
async function cargarDatosCompra(idCompra) {
    console.log('[boleta_compra] Cargando compra ID:', idCompra);
    
    try {
        const response = await fetch(`/Proyecto_De_App_Fast_Food/api/compras/buscar?id=${idCompra}`);
        const datos = await response.json();

        console.log('[boleta_compra] Respuesta API:', datos);

        if (datos.exito && datos.compra) {
            await mostrarBoletaCompra(datos.compra);
        } else {
            alert('Error al cargar los datos de la compra');
            console.error('[boleta_compra] Error en respuesta:', datos);
            window.close();
        }
    } catch (error) {
        console.error('[boleta_compra] Error de conexión:', error);
        alert('Error de conexión al cargar la compra');
        window.close();
    }
}

// Mostrar boleta con los datos de la compra
async function mostrarBoletaCompra(compra) {
    console.log('[boleta_compra] Mostrando datos:', compra);
    
    // Tipo de comprobante
    const tipoComprobanteElement = document.getElementById('tipoComprobante');
    const tipoComprobante = compra.TipoComprobante || 'factura';
    if (tipoComprobante.toLowerCase() === 'factura') {
        tipoComprobanteElement.textContent = 'FACTURA DE COMPRA';
    } else {
        tipoComprobanteElement.textContent = 'BOLETA DE COMPRA';
    }
    console.log('[boleta_compra] Tipo comprobante:', tipoComprobante);

    // Número de comprobante
    const numeroComprobante = compra.NumeroComprobante || 'Sin número';
    document.getElementById('numeroComprobante').textContent = numeroComprobante;
    console.log('[boleta_compra] Número:', numeroComprobante);

    // Fecha
    const fechaCompra = compra.FechaCompra || new Date().toISOString();
    document.getElementById('fechaCompra').textContent = formatearFecha(fechaCompra);
    console.log('[boleta_compra] Fecha:', fechaCompra);

    // Proveedor
    const nombreProveedor = compra.RazonSocial || compra.NombreProveedor || 'Proveedor';
    const rucProveedor = compra.RUC || compra.NumDocProveedor || '-';
    const direccionProveedor = compra.Direccion || '-';
    const telefonoProveedor = compra.Telefono || '-';
    
    document.getElementById('nombreProveedor').textContent = nombreProveedor;
    document.getElementById('rucProveedor').textContent = rucProveedor;
    document.getElementById('direccionProveedor').textContent = direccionProveedor;
    document.getElementById('telefonoProveedor').textContent = telefonoProveedor;
    
    console.log('[boleta_compra] Proveedor:', nombreProveedor, 'RUC:', rucProveedor);

    // Usuario que registró
    const nombreUsuario = compra.NombreUsuario || 'N/A';
    document.getElementById('nombreUsuario').textContent = nombreUsuario;
    console.log('[boleta_compra] Usuario:', nombreUsuario);

    // Observaciones si existen
    if (compra.Observaciones && compra.Observaciones.trim() !== '') {
        document.getElementById('observaciones').textContent = 'Obs: ' + compra.Observaciones;
    }

    // Cargar detalles de la compra
    await cargarDetallesCompra(compra.IdCompra);

    // Totales
    const subtotal = parseFloat(compra.SubTotal || 0);
    const igv = parseFloat(compra.IGV || 0);
    const total = parseFloat(compra.Total || 0);
    
    document.getElementById('subtotal').textContent = `S/ ${subtotal.toFixed(2)}`;
    document.getElementById('igv').textContent = `S/ ${igv.toFixed(2)}`;
    document.getElementById('total').textContent = `S/ ${total.toFixed(2)}`;
    
    console.log('[boleta_compra] Totales - Subtotal:', subtotal, 'IGV:', igv, 'Total:', total);
}

// Cargar detalles de la compra
async function cargarDetallesCompra(idCompra) {
    console.log('[boleta_compra] Cargando detalles para compra:', idCompra);
    
    try {
        const response = await fetch(`/Proyecto_De_App_Fast_Food/api/compras/detalle?id=${idCompra}`);
        const datos = await response.json();
        
        console.log('[boleta_compra] Respuesta detalles:', datos);
        
        const tbody = document.getElementById('detalleItems');
        tbody.innerHTML = '';
        
        if (datos.exito && datos.detalles && datos.detalles.length > 0) {
            console.log('[boleta_compra] Cargando', datos.detalles.length, 'items');
            
            datos.detalles.forEach(detalle => {
                const tr = document.createElement('tr');
                const cantidad = parseFloat(detalle.Cantidad || 0);
                const precio = parseFloat(detalle.PrecioUnitario || 0);
                const totalLinea = parseFloat(detalle.Total || 0);
                const empaque = detalle.Empaque || '-';
                
                tr.innerHTML = `
                    <td style="text-align: center;">${cantidad.toFixed(2)}</td>
                    <td>${detalle.Descripcion || 'Sin descripción'}</td>
                    <td style="text-align: center;">${empaque}</td>
                    <td style="text-align: right;">S/ ${precio.toFixed(2)}</td>
                    <td style="text-align: right;">S/ ${totalLinea.toFixed(2)}</td>
                `;
                tbody.appendChild(tr);
            });
            
            console.log('[boleta_compra] Items cargados exitosamente');
        } else {
            console.warn('[boleta_compra] No hay detalles disponibles');
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="5" style="text-align: center;">Sin detalles disponibles</td>';
            tbody.appendChild(tr);
        }
    } catch (error) {
        console.error('[boleta_compra] Error cargando detalles:', error);
        const tbody = document.getElementById('detalleItems');
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Error al cargar detalles</td></tr>';
    }
}

// Formatear fecha
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

// Imprimir boleta
function imprimirBoleta() {
    window.print();
}

// Descargar PDF
function descargarPDF() {
    // Usar la función de impresión del navegador para guardar como PDF
    window.print();
}
