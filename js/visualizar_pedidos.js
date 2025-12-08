// ===== VISUALIZAR PEDIDOS - JAVASCRIPT =====

// Variables globales
let pedidos = [];
let pedidosFiltrados = [];
let pedidoActualEnModal = null; // Para guardar el ID del pedido en el modal

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

// Cargar pedidos desde la API
async function cargarPedidos() {
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/pedidos/listar');
        const data = await response.json();
        
        if (data.exito) {
            pedidos = data.items || [];
            pedidosFiltrados = [...pedidos];
            renderizarPedidos(pedidosFiltrados);
        } else {
            console.error('Error al cargar pedidos:', data.mensaje);
            mostrarMensaje('Error al cargar los pedidos', 'error');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarMensaje('Error de conexión con el servidor', 'error');
    }
}

// Renderizar pedidos en la tabla
function renderizarPedidos(datosPedidos) {
    const tbody = document.getElementById('tablaPedidosBody');
    
    if (!tbody) return;
    
    if (datosPedidos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay pedidos registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = datosPedidos.map((pedido, index) => {
        const badgeClass = `badge-${pedido.TipoServicio || 'local'}`;
        
        // Parsear fecha correctamente
        let fechaFormato = 'Sin fecha';
        if (pedido.FechaPedido) {
            try {
                const fecha = new Date(pedido.FechaPedido);
                if (!isNaN(fecha.getTime())) {
                    fechaFormato = fecha.toLocaleDateString('es-PE');
                }
            } catch (e) {
                console.error('Error parseando fecha:', e);
            }
        }
        
        return `
            <tr>
                <td>${pedido.IdPedido || index + 1}</td>
                <td>${pedido.NumDocumentos || '-'}</td>
                <td>${pedido.NombreCliente || 'Sin nombre'}</td>
                <td>${fechaFormato}</td>
                <td><span class="badge ${badgeClass}">${pedido.TipoServicio || 'local'}</span></td>
                <td>
                    <button class="btn-info" title="Ver detalles" onclick="verDetallesPedido(${pedido.IdPedido})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Ver detalles de un pedido
async function verDetallesPedido(idPedido) {
    try {
        const response = await fetch(`/Proyecto_De_App_Fast_Food/api/pedidos/buscar?id=${idPedido}`);
        const data = await response.json();
        
        if (data.exito && data.pedido) {
            const pedido = data.pedido;
            
            // Guardar ID del pedido actual para la función marcarComoEntregado
            pedidoActualEnModal = pedido.IdPedido;
            
            // Llenar modal con detalles
            document.getElementById('detallePedidoNum').textContent = pedido.IdPedido || '-';
            document.getElementById('detalleTipoServicio').textContent = pedido.TipoServicio || '-';
            document.getElementById('detalleCliente').textContent = pedido.NombreCliente || '-';
            document.getElementById('detalleDNI').textContent = pedido.NumDocumentos || '-';
            
            // Parsear fecha correctamente
            let fechaFormato = '';
            let horaFormato = '';
            if (pedido.FechaPedido) {
                try {
                    const fecha = new Date(pedido.FechaPedido);
                    if (!isNaN(fecha.getTime())) {
                        fechaFormato = fecha.toLocaleDateString('es-PE');
                        horaFormato = fecha.toLocaleTimeString('es-PE');
                    }
                } catch (e) {
                    console.error('Error parseando fecha:', e);
                }
            }
            
            document.getElementById('detalleFecha').textContent = fechaFormato;
            document.getElementById('detalleHora').textContent = horaFormato;
            
            // Llenar tabla de productos
            const tbody = document.getElementById('detalleProductosBody');
            if (pedido.Detalles && Array.isArray(pedido.Detalles) && pedido.Detalles.length > 0) {
                tbody.innerHTML = pedido.Detalles.map(detalle => {
                    const cantidad = parseFloat(detalle.Cantidad) || 0;
                    const precio = parseFloat(detalle.PrecioUnitario) || 0;
                    const subtotal = cantidad * precio;
                    
                    return `
                        <tr>
                            <td>${detalle.DescripcionProducto || 'Producto'}</td>
                            <td>${cantidad}</td>
                            <td>S/ ${precio.toFixed(2)}</td>
                            <td>S/ ${subtotal.toFixed(2)}</td>
                        </tr>
                    `;
                }).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="4">Sin productos</td></tr>';
            }
            
            // Calcular total
            const total = (pedido.Detalles || []).reduce((sum, d) => {
                const cantidad = parseFloat(d.Cantidad) || 0;
                const precio = parseFloat(d.PrecioUnitario) || 0;
                return sum + (cantidad * precio);
            }, 0);
            
            
            document.getElementById('detalleTotal').textContent = total.toFixed(2);
            
            // Mostrar modal
            const modal = document.getElementById('modalDetalle');
            if (modal) {
                modal.classList.add('active');
            }
        } else {
            mostrarMensaje('No se pudieron cargar los detalles del pedido', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error al cargar detalles del pedido', 'error');
    }
}

// Filtrar pedidos
function filtrarPedidos() {
    const busqueda = document.getElementById('buscarPedido').value.toLowerCase().trim();
    const tipoServicio = document.getElementById('filtroTipoServicio').value;
    
    pedidosFiltrados = pedidos.filter(pedido => {
        const coincideBusqueda = !busqueda || 
            (pedido.NombreCliente && pedido.NombreCliente.toLowerCase().includes(busqueda)) ||
            (pedido.NumDocumentos && pedido.NumDocumentos.includes(busqueda));
        
        const coincideTipo = !tipoServicio || pedido.TipoServicio === tipoServicio;
        
        return coincideBusqueda && coincideTipo;
    });
    
    renderizarPedidos(pedidosFiltrados);
}

// Mostrar mensaje de alerta
function mostrarMensaje(mensaje, tipo = 'info') {
    // Puedes implementar un sistema de notificaciones aquí
    console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
}

// Cerrar modal
function cerrarModal() {
    const modal = document.getElementById('modalDetalle');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Marcar pedido como entregado
async function marcarComoEntregado() {
    if (!pedidoActualEnModal) {
        alert('No hay pedido seleccionado');
        return;
    }

    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/pedidos/actualizar-estado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idPedido: pedidoActualEnModal,
                estado: 'entregado'
            })
        });

        const data = await response.json();

        if (data.exito) {
            alert('Pedido marcado como entregado');
            
            // Actualizar la lista de pedidos
            cargarPedidos();
            
            // Cerrar modal
            cerrarModal();
        } else {
            alert(data.mensaje || 'No se pudo actualizar el pedido');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar el pedido');
    }
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Cargar pedidos desde API
    cargarPedidos();
    
    // Event listeners para filtros
    const inputBusqueda = document.getElementById('buscarPedido');
    const selectTipo = document.getElementById('filtroTipoServicio');
    const btnBuscar = document.getElementById('btnBuscar');
    
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', filtrarPedidos);
    }
    
    if (selectTipo) {
        selectTipo.addEventListener('change', filtrarPedidos);
    }
    
    if (btnBuscar) {
        btnBuscar.addEventListener('click', filtrarPedidos);
    }
    
    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('modalDetalle');
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                cerrarModal();
            }
        });
    }
});
