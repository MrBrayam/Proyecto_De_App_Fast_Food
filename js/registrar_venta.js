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
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    if (usuario) {
        idUsuario = usuario.IdUsuario;
    } else {
        alert('No hay usuario autenticado');
        window.location.href = '/Proyecto_De_App_Fast_Food/index.html';
    }
}

// Inicializar eventos
function inicializarEventos() {
    // Enter en input de cantidad
    document.getElementById('inputCantidad').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            añadirProducto();
        }
    });

    // Validar cantidad mínima
    document.getElementById('inputCantidad').addEventListener('change', function() {
        if (this.value < 1) {
            this.value = 1;
        }
    });

    // Buscar código de producto
    document.getElementById('inputCodigo').addEventListener('blur', function() {
        if (this.value.trim() !== '') {
            buscarProductoPorCodigo(this.value.trim());
        }
    });

    // Buscar pedido con Enter
    document.getElementById('buscarPedido').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarPedido();
        }
    });

    // Buscar producto al presionar Enter en el código
    document.getElementById('inputCodigo').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const codigo = this.value.trim();
            if (codigo !== '') {
                buscarProductoPorCodigo(codigo);
            }
        }
    });
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

        if (datos.exito && datos.pedido) {
            pedidoSeleccionado = datos.pedido;
            
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
                        idDetalle: detalle.IdDetalle
                    });
                });
                actualizarTablaProductos();

                // Pre-cargar los inputs con el primer detalle para facilitar edición
                const primerDetalle = pedidoSeleccionado.Detalles[0];
                if (primerDetalle) {
                    document.getElementById('inputCodigo').value = primerDetalle.CodProducto || '';
                    document.getElementById('inputDescripcion').value = primerDetalle.DescripcionProducto || '';
                    document.getElementById('inputCantidad').value = Number(primerDetalle.Cantidad) || 1;
                    const precioPrimero = Number(primerDetalle.PrecioUnitario) || 0;
                    document.getElementById('inputPrecio').value = precioPrimero ? precioPrimero.toFixed(2) : '';
                }
            }

            // Limpiar inputs
            document.getElementById('inputCodigo').value = '';
            document.getElementById('inputDescripcion').value = '';
            document.getElementById('inputCantidad').value = '1';
            document.getElementById('inputPrecio').value = '';

        } else {
            alert('Error al cargar detalles del pedido');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar pedido');
    }
}

// Buscar producto por código
async function buscarProductoPorCodigo(codigo) {
    try {
        const response = await fetch(`/Proyecto_De_App_Fast_Food/api/platos/buscar?cod=${codigo}`);
        const datos = await response.json();

        if (datos.exito && datos.plato) {
            document.getElementById('inputDescripcion').value = datos.plato.Nombre;
            document.getElementById('inputPrecio').value = datos.plato.Precio.toFixed(2);
            if (!document.getElementById('inputCantidad').value || document.getElementById('inputCantidad').value === '0') {
                document.getElementById('inputCantidad').value = '1';
            }
        } else {
            // Intentar buscar en productos
            const responseProducto = await fetch(`/Proyecto_De_App_Fast_Food/api/productos/buscar?cod=${codigo}`);
            const datosProducto = await responseProducto.json();
            
            if (datosProducto.exito && datosProducto.producto) {
                document.getElementById('inputDescripcion').value = datosProducto.producto.NombreProducto;
                document.getElementById('inputPrecio').value = datosProducto.producto.Precio.toFixed(2);
                if (!document.getElementById('inputCantidad').value || document.getElementById('inputCantidad').value === '0') {
                    document.getElementById('inputCantidad').value = '1';
                }
            } else {
                alert('Producto no encontrado');
                document.getElementById('inputDescripcion').value = '';
                document.getElementById('inputPrecio').value = '';
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al buscar producto');
    }
}

// Añadir producto a la tabla
function añadirProducto() {
    const codigo = document.getElementById('inputCodigo').value.trim();
    const descripcion = document.getElementById('inputDescripcion').value.trim();
    const cantidad = parseInt(document.getElementById('inputCantidad').value) || 1;
    const precio = parseFloat(document.getElementById('inputPrecio').value) || 0;

    if (codigo === '' || descripcion === '' || precio === 0) {
        alert('Ingrese datos válidos del producto');
        return;
    }

    productosAgregados.push({
        codProducto: codigo,
        descripcion: descripcion,
        cantidad: cantidad,
        precio: Number(precio) || 0
    });

    actualizarTablaProductos();

    // Limpiar inputs
    document.getElementById('inputCodigo').value = '';
    document.getElementById('inputDescripcion').value = '';
    document.getElementById('inputCantidad').value = '1';
    document.getElementById('inputPrecio').value = '';
    document.getElementById('inputCodigo').focus();
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
    const descuento = parseFloat(document.getElementById('inputDescuento').value) || 0;
    const total = subTotal - descuento;

    document.getElementById('subtotalVenta').textContent = 'S/ ' + subTotal.toFixed(2);
    document.getElementById('descuentoVenta').textContent = 'S/ ' + descuento.toFixed(2);
    document.getElementById('totalVenta').textContent = 'S/ ' + total.toFixed(2);
}

// Eliminar producto de la tabla
function eliminarProducto(index) {
    productosAgregados.splice(index, 1);
    actualizarTablaProductos();
}

// Registrar venta
async function registrarVenta() {
    const tipoPago = document.getElementById('tipoPago').value.trim();
    
    if (tipoPago === '') {
        alert('Seleccione tipo de pago');
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
        precio: p.precio
    }));

    const subTotal = productosAgregados.reduce((sum, p) => sum + (p.cantidad * p.precio), 0);
    const descuento = parseFloat(document.getElementById('inputDescuento').value) || 0;
    const total = subTotal - descuento;

    const datosVenta = {
        idCliente: pedidoSeleccionado?.IdCliente || null,
        tipoPago: tipoPago,
        subTotal: subTotal,
        descuento: descuento,
        total: total,
        idUsuario: idUsuario,
        detalles: detalles
    };

    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/ventas/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosVenta)
        });

        const datos = await response.json();

        if (datos.exito) {
            alert('Venta registrada exitosamente');
            
            // Si viene de un pedido, marcar como entregado
            if (pedidoSeleccionado) {
                await marcarPedidoEntregado(pedidoSeleccionado.IdPedido);
            }

            // Limpiar formulario
            limpiarFormulario();
        } else {
            alert('Error: ' + datos.mensaje);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar venta');
    }
}

// Marcar pedido como entregado
async function marcarPedidoEntregado(idPedido) {
    try {
        await fetch('/Proyecto_De_App_Fast_Food/api/pedidos/actualizar-estado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idPedido: idPedido,
                estado: 'entregado'
            })
        });
    } catch (error) {
        console.error('Error al marcar pedido:', error);
    }
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('buscarPedido').value = '';
    document.getElementById('tipoPago').value = '';
    document.getElementById('inputCodigo').value = '';
    document.getElementById('inputDescripcion').value = '';
    document.getElementById('inputCantidad').value = '1';
    document.getElementById('inputPrecio').value = '';
    document.getElementById('inputDescuento').value = '';
    
    productosAgregados = [];
    pedidoSeleccionado = null;
    
    document.getElementById('pedidoInfo').style.display = 'none';
    document.querySelector('.venta-tabla tbody').innerHTML = '';
    
    document.getElementById('subtotalVenta').textContent = 'S/ 0.00';
    document.getElementById('descuentoVenta').textContent = 'S/ 0.00';
    document.getElementById('totalVenta').textContent = 'S/ 0.00';
}

// Nuevo registro (sin pedido)
function nuevoRegistro() {
    limpiarFormulario();
    pedidoSeleccionado = null;
    document.getElementById('buscarPedido').focus();
}
