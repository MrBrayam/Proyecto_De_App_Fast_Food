/* ============================================
   JAVASCRIPT PARA REGISTRAR VENTA (Desde Pedidos)
   ============================================ */

let productosAgregados = [];
let pedidoSeleccionado = null;
let idUsuario = null;

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    obtenerUsuarioActual();
    cargarCajasAbiertas();
    inicializarEventos();
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
    
    const fechaElement = document.getElementById('currentDate');
    if (fechaElement) {
        fechaElement.textContent = fechaFormateada + ' ' + horaFormateada;
    }
}

// Obtener usuario actual del sessionStorage
function obtenerUsuarioActual() {
    const sessionUserRaw = sessionStorage.getItem('usuario');
    let usuario = null;

    // Preferir sessionStorage, pero hacer fallback a localStorage si la pestaña se recargó
    if (sessionUserRaw) {
        try {
            usuario = JSON.parse(sessionUserRaw);
        } catch (e) {
            usuario = null;
        }
    }

    if (!usuario) {
        const localUserRaw = localStorage.getItem('userSession') || localStorage.getItem('currentUser');
        if (localUserRaw) {
            try {
                const localUser = JSON.parse(localUserRaw);
                usuario = {
                    IdUsuario: localUser.IdUsuario || localUser.id || localUser.idUsuario,
                    NombreCompleto: localUser.NombreCompleto || localUser.nombre || localUser.nombreCompleto
                };
                sessionStorage.setItem('usuario', JSON.stringify(usuario));
            } catch (e) {
                usuario = null;
            }
        }
    }

    if (usuario && usuario.IdUsuario) {
        idUsuario = usuario.IdUsuario;
    } else {
        alert('No hay usuario autenticado');
        window.location.href = '/Proyecto_De_App_Fast_Food/index.html';
    }
}

// Inicializar eventos
function inicializarEventos() {
    // Buscar pedido con Enter
    const inputBuscarPedido = document.getElementById('buscarPedido');
    if (inputBuscarPedido) {
        inputBuscarPedido.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                buscarPedido();
            }
        });
    }
}

// Cargar cajas abiertas disponibles
async function cargarCajasAbiertas() {
    const selectCaja = document.getElementById('selectCaja');
    if (!selectCaja) return;

    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/caja/listar');
        const data = await response.json();
        
        console.log('[registrar_venta] Cajas recibidas:', data);

        if (data.exito && data.items) {
            const cajasAbiertas = data.items.filter(c => c.Estado === 'abierta');
            
            if (cajasAbiertas.length === 0) {
                selectCaja.innerHTML = '<option value="">No hay cajas abiertas</option>';
                console.warn('[registrar_venta] No hay cajas abiertas disponibles');
            } else {
                selectCaja.innerHTML = '<option value="">Seleccionar caja</option>';
                cajasAbiertas.forEach(caja => {
                    const option = document.createElement('option');
                    option.value = caja.CodCaja;
                    option.textContent = `${caja.CodCaja} - ${caja.Turno || 'Sin turno'}`;
                    selectCaja.appendChild(option);
                });
                console.log(`[registrar_venta] ${cajasAbiertas.length} caja(s) abiertas cargadas`);
            }
        } else {
            selectCaja.innerHTML = '<option value="">Error al cargar cajas</option>';
            console.error('[registrar_venta] Error en respuesta de cajas:', data);
        }
    } catch (error) {
        console.error('[registrar_venta] Error cargando cajas:', error);
        selectCaja.innerHTML = '<option value="">Error de conexión</option>';
    }
}

// Buscar pedido por ID o nombre de cliente
async function buscarPedido() {
    const busqueda = document.getElementById('buscarPedido').value.trim();
    
    if (busqueda === '') {
        alert('Ingrese el ID del pedido o nombre del cliente');
        return;
    }

    try {
        // Listar todos los pedidos y buscar
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/pedidos/listar');
        const datos = await response.json();

        if (!datos.exito && !datos.items) {
            alert('Error al cargar pedidos');
            return;
        }

        const pedidos = datos.items || [];
        
        // Buscar por ID o nombre
        const pedidoEncontrado = pedidos.find(p => 
            p.IdPedido.toString() === busqueda || 
            p.NombreCliente.toLowerCase().includes(busqueda.toLowerCase())
        );

        if (pedidoEncontrado && pedidoEncontrado.Estado !== 'entregado') {
            // Cargar detalles del pedido
            cargarDetallePedido(pedidoEncontrado.IdPedido);
        } else if (pedidoEncontrado && pedidoEncontrado.Estado === 'entregado') {
            alert('Este pedido ya fue entregado');
        } else {
            alert('Pedido no encontrado');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al buscar pedido');
    }
}

// Cargar detalles del pedido
async function cargarDetallePedido(idPedido) {
    try {
        const response = await fetch(`/Proyecto_De_App_Fast_Food/api/pedidos/buscar?id=${idPedido}`);
        const datos = await response.json();

        console.log('[registrar_venta] Respuesta búsqueda pedido:', datos);

        if (datos.exito && datos.pedido) {
            pedidoSeleccionado = datos.pedido;
            console.log('[registrar_venta] Pedido cargado:', pedidoSeleccionado);
            
            // Mostrar info del pedido
            document.getElementById('pedidoInfo').style.display = 'block';
            document.getElementById('infoPedidoId').textContent = pedidoSeleccionado.IdPedido;
            document.getElementById('infoPedidoCliente').textContent = pedidoSeleccionado.NombreCliente;
            document.getElementById('infoPedidoTipo').textContent = pedidoSeleccionado.TipoServicio;
            document.getElementById('infoPedidoFecha').textContent = new Date(pedidoSeleccionado.FechaPedido).toLocaleDateString('es-ES');

            // Limpiar tabla actual
            productosAgregados = [];
            
            // Cargar detalles del pedido en la tabla
            if (pedidoSeleccionado.Detalles && pedidoSeleccionado.Detalles.length > 0) {
                pedidoSeleccionado.Detalles.forEach(detalle => {
                    productosAgregados.push({
                        codProducto: detalle.CodProducto,
                        descripcion: detalle.DescripcionProducto,
                        cantidad: detalle.Cantidad,
                        precio: Number(detalle.PrecioUnitario) || 0,
                        idDetalle: detalle.IdDetalle,
                        idPlato: detalle.IdPlato || 0
                    });
                });
            }
            
            // Mostrar totales del pedido directamente
            const subtotal = parseFloat(pedidoSeleccionado.SubTotal) || 0;
            const descuento = parseFloat(pedidoSeleccionado.Descuento) || 0;
            const total = parseFloat(pedidoSeleccionado.Total) || 0;
            
            // Calcular delivery (Total = SubTotal - Descuento + Delivery)
            const delivery = total - (subtotal - descuento);
            
            document.getElementById('subtotalVenta').textContent = 'S/ ' + subtotal.toFixed(2);
            document.getElementById('descuentoVenta').textContent = descuento > 0 ? '-S/ ' + descuento.toFixed(2) : 'S/ 0.00';
            document.getElementById('deliveryVenta').textContent = 'S/ ' + (delivery > 0 ? delivery.toFixed(2) : '0.00');
            document.getElementById('totalVenta').textContent = 'S/ ' + total.toFixed(2);

        } else {
            alert('Error al cargar detalles del pedido');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar pedido');
    }
}

// Actualizar tabla de productos
function actualizarTablaProductos() {
    const tbody = document.querySelector('.venta-tabla tbody');
    tbody.innerHTML = '';

    let subTotal = 0;

    productosAgregados.forEach((producto, index) => {
            const precio = Number(producto.precio) || 0;
            const cantidad = Number(producto.cantidad) || 0;
            const total = cantidad * precio;
        subTotal += total;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto.descripcion}</td>
                <td>${cantidad}</td>
                <td>S/ ${precio.toFixed(2)}</td>
                <td>S/ ${total.toFixed(2)}</td>
            <td><button class="btn-eliminar" onclick="eliminarProducto(${index})">
                <i class="fas fa-trash"></i>
            </button></td>
        `;
        tbody.appendChild(row);
    });

    // Actualizar totales
    // Si hay un pedido cargado, usar sus valores directos
    if (pedidoSeleccionado) {
        const subtotal = parseFloat(pedidoSeleccionado.SubTotal) || 0;
        const descuento = parseFloat(pedidoSeleccionado.Descuento) || 0;
        const total = parseFloat(pedidoSeleccionado.Total) || 0;
        const delivery = total - (subtotal - descuento);
        
        document.getElementById('subtotalVenta').textContent = 'S/ ' + subtotal.toFixed(2);
        document.getElementById('descuentoVenta').textContent = descuento > 0 ? '-S/ ' + descuento.toFixed(2) : 'S/ 0.00';
        document.getElementById('deliveryVenta').textContent = 'S/ ' + (delivery > 0 ? delivery.toFixed(2) : '0.00');
        document.getElementById('totalVenta').textContent = 'S/ ' + total.toFixed(2);
    } else {
        // Si no hay pedido, calcular normalmente
        document.getElementById('subtotalVenta').textContent = 'S/ ' + subTotal.toFixed(2);
        document.getElementById('descuentoVenta').textContent = 'S/ 0.00';
        document.getElementById('deliveryVenta').textContent = 'S/ 0.00';
        document.getElementById('totalVenta').textContent = 'S/ ' + subTotal.toFixed(2);
    }
}

// Eliminar producto de la tabla
function eliminarProducto(index) {
    productosAgregados.splice(index, 1);
    actualizarTablaProductos();
}

// Registrar venta
async function registrarVenta() {
    const tipoPago = document.getElementById('tipoPago').value.trim();
    const codCaja = document.getElementById('selectCaja').value.trim();
    
    if (tipoPago === '') {
        alert('Seleccione tipo de pago');
        return;
    }

    if (codCaja === '') {
        alert('Seleccione una caja');
        return;
    }

    if (productosAgregados.length === 0) {
        alert('Agregue al menos un producto');
        return;
    }

    if (!idUsuario) {
        alert('No hay usuario autenticado');
        return;
    }

    // Preparar detalles para enviar
    const detalles = productosAgregados.map(p => ({
        codProducto: p.codProducto,
        linea: p.descripcion,
        descripcion: p.descripcion,
        cantidad: p.cantidad,
        precio: p.precio,
        idPlato: p.idPlato || 0
    }));

    // Usar valores del pedido si existe, sino calcular
    let subTotal, descuento, total;
    
    if (pedidoSeleccionado) {
        // Usar valores del pedido original
        subTotal = parseFloat(pedidoSeleccionado.SubTotal) || 0;
        descuento = parseFloat(pedidoSeleccionado.Descuento) || 0;
        total = parseFloat(pedidoSeleccionado.Total) || 0;
    } else {
        // Calcular desde los productos agregados
        subTotal = productosAgregados.reduce((sum, p) => sum + (p.cantidad * p.precio), 0);
        descuento = 0;
        total = subTotal;
    }

    const datosVenta = {
        idCliente: pedidoSeleccionado?.IdCliente || null,
        tipoPago: tipoPago,
        subTotal: subTotal,
        descuento: descuento,
        total: total,
        idUsuario: idUsuario,
        codCaja: codCaja,
        detalles: detalles
    };

    console.log('[registrar_venta] Enviando venta:', datosVenta);
    console.log('[registrar_venta] Detalles con IdPlato:', detalles.map(d => ({desc: d.descripcion, idPlato: d.idPlato})));

    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/ventas/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosVenta)
        });

        const datos = await response.json();
        console.log('[registrar_venta] Respuesta del servidor:', datos);

        if (datos.exito) {
            // Si viene de un pedido, marcar como entregado y liberar mesa PRIMERO
            if (pedidoSeleccionado) {
                console.log('[registrar_venta] Pedido seleccionado:', JSON.stringify(pedidoSeleccionado));
                console.log('[registrar_venta] NumMesa del pedido:', pedidoSeleccionado.NumMesa);
                console.log('[registrar_venta] Tipo de NumMesa:', typeof pedidoSeleccionado.NumMesa);
                
                try {
                    await marcarPedidoEntregado(pedidoSeleccionado.IdPedido);
                    console.log('[registrar_venta] Pedido marcado como entregado');
                } catch (e) {
                    console.error('[registrar_venta] Error marcando pedido:', e);
                }
                
                // Si tiene mesa asociada, marcarla como disponible
                const numMesa = parseInt(pedidoSeleccionado.NumMesa, 10);
                console.log('[registrar_venta] NumMesa convertido a int:', numMesa);
                
                if (numMesa && numMesa > 0) {
                    console.log('[registrar_venta] Intentando actualizar mesa', numMesa, 'a disponible');
                    try {
                        await actualizarEstadoMesaVenta(numMesa, 'disponible');
                        console.log('[registrar_venta] Mesa actualizada exitosamente');
                    } catch (e) {
                        console.error('[registrar_venta] Error actualizando mesa:', e);
                    }
                } else {
                    console.warn('[registrar_venta] No hay NumMesa válido en el pedido seleccionado. NumMesa:', pedidoSeleccionado.NumMesa);
                }
            } else {
                console.warn('[registrar_venta] No hay pedidoSeleccionado');
            }

            // Mostrar mensaje de éxito DESPUÉS de actualizar la mesa
            alert('Venta registrada exitosamente');
            
            // Limpiar formulario
            limpiarFormulario();
        } else {
            alert('Error: ' + datos.mensaje);
        }
    } catch (error) {
        console.error('[registrar_venta] Error:', error);
        alert('Error al registrar venta');
    }
}

// Marcar pedido como entregado
async function marcarPedidoEntregado(idPedido) {
    try {
        console.log('Marcando pedido ' + idPedido + ' como entregado');
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/pedidos/actualizar-estado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idPedido: idPedido,
                estado: 'entregado'
            })
        });
        
        const datos = await response.json();
        console.log('Respuesta del servidor:', datos);
        
        if (datos.exito) {
            console.log('Pedido marcado como entregado correctamente');
        } else {
            console.error('Error al marcar pedido:', datos.mensaje);
        }
    } catch (error) {
        console.error('Error al marcar pedido:', error);
    }
}

// Actualizar estado de la mesa
async function actualizarEstadoMesaVenta(numMesa, estado) {
    try {
        console.log(`[registrar_venta] Actualizando mesa ${numMesa} a estado: ${estado}`);
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/mesas/actualizar-estado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                numMesa: numMesa,
                estado: estado
            })
        });

        const datos = await response.json();
        console.log(`[registrar_venta] Respuesta actualizar mesa:`, datos);

        if (datos.exito) {
            console.log(`[registrar_venta] Mesa ${numMesa} actualizada a ${estado}`);
        } else {
            console.error(`[registrar_venta] Error al actualizar mesa:`, datos.mensaje);
        }
    } catch (error) {
        console.error(`[registrar_venta] Error al actualizar mesa ${numMesa}:`, error);
    }
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('buscarPedido').value = '';
    const tipoPagoSelect = document.getElementById('tipoPago');
    if (tipoPagoSelect) {
        tipoPagoSelect.value = '';
    }
    const selectCaja = document.getElementById('selectCaja');
    if (selectCaja && selectCaja.options.length > 1) {
        selectCaja.selectedIndex = 0;
    }
    const inputDescuento = document.getElementById('inputDescuento');
    if (inputDescuento) {
        inputDescuento.value = '0';
    }
    
    productosAgregados = [];
    pedidoSeleccionado = null;
    
    document.getElementById('pedidoInfo').style.display = 'none';
    const tbody = document.querySelector('.venta-tabla tbody');
    if (tbody) {
        tbody.innerHTML = '';
    }
    
    document.getElementById('subtotalVenta').textContent = 'S/ 0.00';
    document.getElementById('descuentoVenta').textContent = 'S/ 0.00';
    document.getElementById('deliveryVenta').textContent = 'S/ 0.00';
    document.getElementById('totalVenta').textContent = 'S/ 0.00';
}

// Nuevo registro (sin pedido)
function nuevoRegistro() {
    limpiarFormulario();
    pedidoSeleccionado = null;
    document.getElementById('buscarPedido').focus();
}
