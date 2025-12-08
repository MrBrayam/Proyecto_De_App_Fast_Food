/* ============================================
   REGISTRAR PEDIDOS - FRONTEND ONLY
   Solo funcionalidades de interfaz
   ============================================ */

// Variables globales para IDs
let idProductoActual = null;
let idPlatoActual = null;
let tipoItemActual = null; // 'producto' o 'plato'

document.addEventListener('DOMContentLoaded', function() {
    // Actualizar fecha y hora
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Cargar mesas disponibles
    cargarMesasActivas();
    
    // Configurar evento para tipo de servicio
    configurarTipoServicio();

    // Eventos de items
    const btnAgregar = document.getElementById('btnAgregar');
    const btnRegistrar = document.getElementById('btnRegistrar');
    const tablaBody = document.getElementById('tablaPedidoBody');
    const inputCodigo = document.getElementById('searchCodigo');
    const inputDni = document.getElementById('dniCliente');

    if (btnAgregar) btnAgregar.addEventListener('click', agregarItem);
    if (btnRegistrar) btnRegistrar.addEventListener('click', registrarPedido);
    if (inputCodigo) inputCodigo.addEventListener('blur', buscarProductoPorCodigo);
    if (inputDni) {
        inputDni.addEventListener('blur', buscarClientePorDNI);
        inputDni.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') buscarClientePorDNI();
        });
    }

    // Delegar eliminación de items
    if (tablaBody) {
        tablaBody.addEventListener('click', (e) => {
            if (e.target.closest('.btn-delete')) {
                const idx = e.target.closest('.btn-delete').dataset.index;
                eliminarItem(parseInt(idx, 10));
            }
        });
    }
});

// Estado local de items
let itemsPedido = [];
let idClienteEncontrado = null; // Guardar ID del cliente si se encuentra

// Cargar mesas activas desde la API
async function cargarMesasActivas() {
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/mesas/listar');
        const data = await response.json();
        
        console.log('Respuesta API mesas:', data);
        
        if (data.exito && data.items) {
            const selectMesas = document.getElementById('numeroMesa');
            const mesasActivas = data.items.filter(mesa => mesa.Estado === 'disponible');
            
            // Limpiar opciones actuales (excepto la primera)
            while (selectMesas.options.length > 1) {
                selectMesas.remove(1);
            }
            
            // Agregar mesas activas
            mesasActivas.forEach(mesa => {
                const option = document.createElement('option');
                option.value = mesa.NumMesa;
                option.textContent = `Mesa ${mesa.NumMesa} (${mesa.Capacidad} personas)`;
                selectMesas.appendChild(option);
            });
            
            console.log(`Se cargaron ${mesasActivas.length} mesas disponibles`);
        }
    } catch (error) {
        console.error('Error cargando mesas:', error);
    }
}

// Función para configurar el tipo de servicio
function configurarTipoServicio() {
    const tipoServicio = document.getElementById('tipoServicio');
    const mesaSection = document.getElementById('mesaSection');
    const direccionSection = document.getElementById('direccionSection');
    const telefonoSection = document.getElementById('telefonoSection');
    
    // Función para mostrar/ocultar campos según el tipo de servicio
    function actualizarCampos() {
        const valor = tipoServicio.value;
        
        // Ocultar todos los campos opcionales primero
        mesaSection.style.display = 'none';
        direccionSection.style.display = 'none';
        telefonoSection.style.display = 'none';
        
        // Limpiar campos que se ocultan
        document.getElementById('numeroMesa').value = '';
        document.getElementById('direccionCliente').value = '';
        document.getElementById('telefonoCliente').value = '';
        
        // Mostrar campos según el tipo seleccionado
        switch(valor) {
            case 'local':
                mesaSection.style.display = 'block';
                // Hacer el campo mesa requerido
                document.getElementById('numeroMesa').setAttribute('required', 'required');
                document.getElementById('direccionCliente').removeAttribute('required');
                document.getElementById('telefonoCliente').removeAttribute('required');
                break;
                
            case 'delivery':
                direccionSection.style.display = 'block';
                telefonoSection.style.display = 'block';
                // Hacer los campos dirección y teléfono requeridos
                document.getElementById('direccionCliente').setAttribute('required', 'required');
                document.getElementById('telefonoCliente').setAttribute('required', 'required');
                document.getElementById('numeroMesa').removeAttribute('required');
                break;
                
            case 'para-llevar':
                telefonoSection.style.display = 'block';
                // Hacer el campo teléfono requerido
                document.getElementById('telefonoCliente').setAttribute('required', 'required');
                document.getElementById('numeroMesa').removeAttribute('required');
                document.getElementById('direccionCliente').removeAttribute('required');
                break;
        }
    }
    
    // Ejecutar al cargar la página
    actualizarCampos();
    
    // Ejecutar cuando cambie la selección
    tipoServicio.addEventListener('change', actualizarCampos);
}

// Función para actualizar fecha y hora
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

// Buscar producto por código y autocompletar descripción y precio
async function buscarProductoPorCodigo() {
    const codigo = document.getElementById('searchCodigo').value.trim();
    if (!codigo) return;

    try {
        // Primero buscar en platos
        const respPlatos = await fetch(`/Proyecto_De_App_Fast_Food/api/platos/buscar?codPlato=${encodeURIComponent(codigo)}`);
        const dataPlatos = await respPlatos.json();

        if (dataPlatos.exito && dataPlatos.plato) {
            idPlatoActual = dataPlatos.plato.IdPlato || null;
            idProductoActual = null;
            tipoItemActual = 'plato';
            document.getElementById('searchDescripcion').value = dataPlatos.plato.Nombre || '';
            document.getElementById('precioUnitario').value = dataPlatos.plato.Precio || '0';
            return;
        }

        // Si no encontró en platos, buscar en productos
        const respProductos = await fetch(`/Proyecto_De_App_Fast_Food/api/productos/buscar?codProducto=${encodeURIComponent(codigo)}`);
        const dataProductos = await respProductos.json();

        if (dataProductos.exito && dataProductos.producto) {
            idProductoActual = dataProductos.producto.IdProducto || null;
            idPlatoActual = null;
            tipoItemActual = 'producto';
            document.getElementById('searchDescripcion').value = dataProductos.producto.NombreProducto || '';
            document.getElementById('precioUnitario').value = dataProductos.producto.Precio || '0';
        } else {
            idProductoActual = null;
            idPlatoActual = null;
            tipoItemActual = null;
            alert('Producto no encontrado');
            document.getElementById('searchDescripcion').value = '';
            document.getElementById('precioUnitario').value = '';
        }
    } catch (error) {
        console.error('Error buscando producto:', error);
        alert('Error al buscar el producto');
    }
}

// Buscar cliente por DNI y autocompletar nombre, teléfono y dirección
async function buscarClientePorDNI() {
    const dniInput = document.getElementById('dniCliente');
    const nombreInput = document.getElementById('nombreCliente');
    const telefonoInput = document.getElementById('telefonoCliente');
    const direccionInput = document.getElementById('direccionCliente');
    
    const dni = dniInput.value.trim();
    
    console.log('Buscando cliente con DNI:', dni);
    
    // Validar DNI
    if (!dni || dni.length < 8) {
        console.log('DNI inválido o vacío');
        return;
    }

    try {
        const url = `/Proyecto_De_App_Fast_Food/api/clientes/buscar-por-dni?dni=${encodeURIComponent(dni)}`;
        console.log('URL de búsqueda:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Respuesta JSON completa:', data);

        if (data.exito && data.cliente) {
            const cliente = data.cliente;
            console.log('✓ Cliente encontrado:', cliente);
            
            // Guardar ID del cliente
            idClienteEncontrado = cliente.idCliente || null;
            console.log('ID cliente guardado:', idClienteEncontrado);
            
            // Llenar campos con datos del cliente
            nombreInput.value = cliente.nombreCompleto || '';
            telefonoInput.value = cliente.telefono || '';
            direccionInput.value = cliente.direccion || '';
            
            console.log('Campos actualizados:');
            console.log('  Nombre:', nombreInput.value);
            console.log('  Teléfono:', telefonoInput.value);
            console.log('  Dirección:', direccionInput.value);
        } else {
            // Si no encuentra, limpiar campos e ID
            console.log('✗ Cliente no encontrado:', data.mensaje);
            idClienteEncontrado = null;
            nombreInput.value = '';
            telefonoInput.value = '';
            direccionInput.value = '';
        }
    } catch (error) {
        console.error('✗ Error en fetch:', error);
        // Limpiar campos en caso de error
        idClienteEncontrado = null;
        nombreInput.value = '';
        telefonoInput.value = '';
        direccionInput.value = '';
    }
}

// Añadir item al pedido
function agregarItem() {
    const codigo = document.getElementById('searchCodigo').value.trim();
    const descripcion = document.getElementById('searchDescripcion').value.trim();
    const precioUnitario = parseFloat(document.getElementById('precioUnitario').value || '0');
    const cantidad = parseInt(document.getElementById('cantidad').value || '0', 10);

    if (!codigo || !descripcion) {
        alert('Ingresa código y descripción del producto');
        return;
    }
    if (!cantidad || cantidad <= 0) {
        alert('La cantidad debe ser mayor a 0');
        return;
    }
    if (isNaN(precioUnitario) || precioUnitario < 0) {
        alert('Ingresa un precio válido');
        return;
    }

    itemsPedido.push({
        idProducto: idProductoActual,
        idPlato: idPlatoActual,
        codProducto: codigo,
        descripcionProducto: descripcion,
        cantidad,
        precioUnitario,
        subtotal: cantidad * precioUnitario
    });

    renderizarTabla();

    // Limpiar entradas rápidas (menos la cantidad)
    document.getElementById('searchCodigo').value = '';
    document.getElementById('searchDescripcion').value = '';
    document.getElementById('precioUnitario').value = '';
    document.getElementById('cantidad').value = 1;
    
    // Limpiar IDs
    idProductoActual = null;
    idPlatoActual = null;
    tipoItemActual = null;
}

function eliminarItem(index) {
    if (index >= 0 && index < itemsPedido.length) {
        itemsPedido.splice(index, 1);
        renderizarTabla();
    }
}

function renderizarTabla() {
    const tbody = document.getElementById('tablaPedidoBody');
    const totalEl = document.getElementById('totalPedido');
    if (!tbody || !totalEl) return;

    tbody.innerHTML = '';

    itemsPedido.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td>${new Date().toLocaleDateString()}</td>
            <td>${item.codProducto}</td>
            <td>${item.descripcionProducto}</td>
            <td>${item.cantidad}</td>
            <td>S/ ${item.precioUnitario.toFixed(2)}</td>
            <td>S/ ${(item.subtotal).toFixed(2)}</td>
            <td>
                <button class="btn-delete" data-index="${idx}" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>`;
        tbody.appendChild(tr);
    });

    const total = itemsPedido.reduce((acc, it) => acc + it.subtotal, 0);
    totalEl.textContent = total.toFixed(2);
}

async function registrarPedido() {
    const tipoServicio = document.getElementById('tipoServicio').value;
    const numeroMesa = document.getElementById('numeroMesa').value.trim();
    const nombreCliente = document.getElementById('nombreCliente').value.trim();
    const direccionCliente = document.getElementById('direccionCliente').value.trim();
    const telefonoCliente = document.getElementById('telefonoCliente').value.trim();
    const dniCliente = document.getElementById('dniCliente').value.trim();

    if (!nombreCliente) {
        alert('El nombre del cliente es obligatorio');
        return;
    }
    if (tipoServicio === 'local' && !numeroMesa) {
        alert('Para servicio local, la mesa es obligatoria');
        return;
    }
    if (tipoServicio === 'delivery' && (!direccionCliente || !telefonoCliente)) {
        alert('Dirección y teléfono son obligatorios para delivery');
        return;
    }
    if (tipoServicio === 'para-llevar' && !telefonoCliente) {
        alert('Teléfono es obligatorio para para-llevar');
        return;
    }
    if (itemsPedido.length === 0) {
        alert('Agrega al menos un producto al pedido');
        return;
    }

    const subTotal = itemsPedido.reduce((acc, it) => acc + it.subtotal, 0);
    const payload = {
        numDocumentos: dniCliente || '',
        tipoServicio,
        numMesa: numeroMesa ? parseInt(numeroMesa, 10) : null,
        idCliente: idClienteEncontrado || null,
        nombreCliente,
        direccionCliente: direccionCliente || null,
        telefonoCliente: telefonoCliente || null,
        idUsuario: 1, // TODO: obtener del login actual
        subTotal,
        descuento: 0,
        total: subTotal,
        estado: 'pendiente',
        observaciones: '',
        detalles: itemsPedido.map(it => ({
            idProducto: it.idProducto || null,
            idPlato: it.idPlato || null,
            codProducto: it.codProducto,
            descripcionProducto: it.descripcionProducto,
            cantidad: it.cantidad,
            precioUnitario: it.precioUnitario
        }))
    };

    try {
        const resp = await fetch('/Proyecto_De_App_Fast_Food/api/pedidos/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await resp.json();
        if (data.exito) {
            alert('Pedido registrado exitosamente');
            
            // Actualizar estado de la mesa si es servicio local
            if (tipoServicio === 'local' && numeroMesa) {
                await actualizarEstadoMesa(parseInt(numeroMesa, 10), 'ocupada');
            }
            
            itemsPedido = [];
            idClienteEncontrado = null;
            renderizarTabla();
            // limpiar formulario básico
            document.getElementById('dniCliente').value = '';
            document.getElementById('nombreCliente').value = '';
            document.getElementById('direccionCliente').value = '';
            document.getElementById('telefonoCliente').value = '';
            document.getElementById('numeroMesa').value = '';
            
            // Recargar mesas disponibles
            cargarMesasActivas();
        } else {
            alert(data.mensaje || 'No se pudo registrar el pedido');
        }
    } catch (err) {
        console.error('Error registrando pedido:', err);
        alert('Error al registrar el pedido');
    }
}

// Actualizar estado de la mesa
async function actualizarEstadoMesa(numMesa, estado) {
    try {
        console.log(`[registrar_pedidos] Actualizando mesa ${numMesa} a estado: ${estado}`);
        const resp = await fetch('/Proyecto_De_App_Fast_Food/api/mesas/actualizar-estado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                numMesa: numMesa,
                estado: estado
            })
        });

        const data = await resp.json();
        if (data.exito) {
            console.log(`[registrar_pedidos] Mesa ${numMesa} actualizada a ${estado}`);
        } else {
            console.warn(`[registrar_pedidos] Error al actualizar mesa: ${data.mensaje}`);
        }
    } catch (err) {
        console.error(`[registrar_pedidos] Error actualizando mesa ${numMesa}:`, err);
    }
}
