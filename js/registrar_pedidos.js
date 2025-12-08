/* ============================================
   REGISTRAR PEDIDOS - FRONTEND ONLY
   Solo funcionalidades de interfaz
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Actualizar fecha y hora
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Configurar evento para tipo de servicio
    configurarTipoServicio();

    // Eventos de items
    const btnAgregar = document.getElementById('btnAgregar');
    const btnRegistrar = document.getElementById('btnRegistrar');
    const tablaBody = document.getElementById('tablaPedidoBody');

    if (btnAgregar) btnAgregar.addEventListener('click', agregarItem);
    if (btnRegistrar) btnRegistrar.addEventListener('click', registrarPedido);

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
        numDocumentos: '',
        tipoServicio,
        numMesa: numeroMesa ? parseInt(numeroMesa, 10) : null,
        idCliente: null,
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
            idProducto: null,
            idPlato: null,
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
            itemsPedido = [];
            renderizarTabla();
            // limpiar formulario básico
            document.getElementById('nombreCliente').value = '';
            document.getElementById('direccionCliente').value = '';
            document.getElementById('telefonoCliente').value = '';
            document.getElementById('numeroMesa').value = '';
        } else {
            alert(data.mensaje || 'No se pudo registrar el pedido');
        }
    } catch (err) {
        console.error('Error registrando pedido:', err);
        alert('Error al registrar el pedido');
    }
}
