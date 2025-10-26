// Verificar autenticación
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = '../index.html';
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}

// Cargar clientes
function cargarClientes() {
    const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
    return clientes;
}

// Actualizar estadísticas
function actualizarEstadisticas() {
    const clientes = cargarClientes();
    
    document.getElementById('totalClientes').textContent = clientes.length;
    document.getElementById('clientesVIP').textContent = clientes.filter(c => c.tipoCliente === 'VIP').length;
    document.getElementById('clientesActivos').textContent = clientes.filter(c => c.estado === 'Activo').length;
    document.getElementById('clientesCorporativos').textContent = clientes.filter(c => c.tipoCliente === 'Corporativo').length;
}

// Mostrar clientes en la tabla
function mostrarClientes(clientesFiltrados = null) {
    const clientes = clientesFiltrados || cargarClientes();
    const tbody = document.getElementById('tablaClientes');
    
    if (clientes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 2rem; color: #666;">
                    No hay clientes registrados. <a href="registrar_clientes.html">Registrar nuevo cliente</a>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = clientes.map(cliente => `
        <tr>
            <td>
                <strong>${cliente.tipoDocumento}</strong><br>
                <small>${cliente.numeroDocumento}</small>
            </td>
            <td>
                <strong>${cliente.nombres} ${cliente.apellidos}</strong>
            </td>
            <td>
                <a href="tel:${cliente.telefono}">${cliente.telefono}</a>
            </td>
            <td>
                ${cliente.email ? `<a href="mailto:${cliente.email}">${cliente.email}</a>` : '<span style="color: #999;">No registrado</span>'}
            </td>
            <td>
                <small>${cliente.direccion}${cliente.distrito ? ', ' + cliente.distrito : ''}</small>
            </td>
            <td>
                <span class="badge ${getBadgeClass(cliente.tipoCliente)}">${cliente.tipoCliente}</span>
            </td>
            <td>
                <strong>S/. ${(cliente.totalCompras || 0).toFixed(2)}</strong>
            </td>
            <td>
                <span class="badge badge-warning">⭐ ${cliente.puntosFidelidad || 0}</span>
            </td>
            <td>
                <span class="badge ${cliente.estado === 'Activo' ? 'badge-success' : 'badge-danger'}">
                    ${cliente.estado}
                </span>
            </td>
            <td class="actions">
                <button onclick="editarCliente(${cliente.id})" class="btn-action btn-edit" title="Editar">
                    ✏️
                </button>
                <button onclick="verDetalles(${cliente.id})" class="btn-action btn-view" title="Ver detalles">
                    👁️
                </button>
                <button onclick="eliminarCliente(${cliente.id})" class="btn-action btn-delete" title="Eliminar">
                    🗑️
                </button>
            </td>
        </tr>
    `).join('');
}

// Obtener clase de badge según tipo de cliente
function getBadgeClass(tipo) {
    switch(tipo) {
        case 'VIP':
            return 'badge-warning';
        case 'Corporativo':
            return 'badge-info';
        case 'Regular':
        default:
            return 'badge-secondary';
    }
}

// Filtrar clientes
function filtrarClientes() {
    const busqueda = document.getElementById('buscarCliente').value.toLowerCase();
    const tipoCliente = document.getElementById('filtroTipoCliente').value;
    const estado = document.getElementById('filtroEstado').value;
    
    let clientes = cargarClientes();
    
    // Filtrar por búsqueda
    if (busqueda) {
        clientes = clientes.filter(cliente => 
            cliente.nombres.toLowerCase().includes(busqueda) ||
            cliente.apellidos.toLowerCase().includes(busqueda) ||
            cliente.numeroDocumento.includes(busqueda) ||
            cliente.telefono.includes(busqueda) ||
            (cliente.email && cliente.email.toLowerCase().includes(busqueda))
        );
    }
    
    // Filtrar por tipo de cliente
    if (tipoCliente) {
        clientes = clientes.filter(cliente => cliente.tipoCliente === tipoCliente);
    }
    
    // Filtrar por estado
    if (estado) {
        clientes = clientes.filter(cliente => cliente.estado === estado);
    }
    
    mostrarClientes(clientes);
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('buscarCliente').value = '';
    document.getElementById('filtroTipoCliente').value = '';
    document.getElementById('filtroEstado').value = '';
    mostrarClientes();
}

// Editar cliente
function editarCliente(id) {
    const clientes = cargarClientes();
    const cliente = clientes.find(c => c.id === id);
    
    if (!cliente) {
        alert('Cliente no encontrado');
        return;
    }
    
    // Llenar formulario de edición
    document.getElementById('editId').value = cliente.id;
    document.getElementById('editTipoDocumento').value = cliente.tipoDocumento;
    document.getElementById('editNumeroDocumento').value = cliente.numeroDocumento;
    document.getElementById('editNombres').value = cliente.nombres;
    document.getElementById('editApellidos').value = cliente.apellidos;
    document.getElementById('editTelefono').value = cliente.telefono;
    document.getElementById('editEmail').value = cliente.email || '';
    document.getElementById('editDireccion').value = cliente.direccion;
    document.getElementById('editDistrito').value = cliente.distrito || '';
    document.getElementById('editCiudad').value = cliente.ciudad || '';
    document.getElementById('editTipoCliente').value = cliente.tipoCliente;
    document.getElementById('editEstado').value = cliente.estado;
    document.getElementById('editRecibePromociones').checked = cliente.recibePromociones;
    
    // Mostrar modal
    document.getElementById('modalEditarCliente').style.display = 'flex';
}

// Guardar cambios del cliente
function guardarCambios(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editId').value);
    let clientes = cargarClientes();
    const index = clientes.findIndex(c => c.id === id);
    
    if (index === -1) {
        alert('Cliente no encontrado');
        return;
    }
    
    // Actualizar datos
    clientes[index] = {
        ...clientes[index],
        tipoDocumento: document.getElementById('editTipoDocumento').value,
        numeroDocumento: document.getElementById('editNumeroDocumento').value,
        nombres: document.getElementById('editNombres').value,
        apellidos: document.getElementById('editApellidos').value,
        telefono: document.getElementById('editTelefono').value,
        email: document.getElementById('editEmail').value,
        direccion: document.getElementById('editDireccion').value,
        distrito: document.getElementById('editDistrito').value,
        ciudad: document.getElementById('editCiudad').value,
        tipoCliente: document.getElementById('editTipoCliente').value,
        estado: document.getElementById('editEstado').value,
        recibePromociones: document.getElementById('editRecibePromociones').checked
    };
    
    // Guardar en localStorage
    localStorage.setItem('clientes', JSON.stringify(clientes));
    
    // Cerrar modal y recargar
    cerrarModal();
    mostrarClientes();
    actualizarEstadisticas();
    
    alert('✅ Cliente actualizado exitosamente');
}

// Ver detalles del cliente
function verDetalles(id) {
    const clientes = cargarClientes();
    const cliente = clientes.find(c => c.id === id);
    
    if (!cliente) {
        alert('Cliente no encontrado');
        return;
    }
    
    const detalles = `
═══════════════════════════════════════
           DETALLES DEL CLIENTE
═══════════════════════════════════════

📋 INFORMACIÓN PERSONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nombre Completo: ${cliente.nombres} ${cliente.apellidos}
Tipo Doc.: ${cliente.tipoDocumento}
N° Documento: ${cliente.numeroDocumento}
Fecha Nac.: ${cliente.fechaNacimiento || 'No registrada'}

📞 CONTACTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Teléfono: ${cliente.telefono}
Email: ${cliente.email || 'No registrado'}

📍 UBICACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dirección: ${cliente.direccion}
Distrito: ${cliente.distrito || 'No especificado'}
Ciudad: ${cliente.ciudad || 'No especificado'}

💼 INFORMACIÓN COMERCIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tipo Cliente: ${cliente.tipoCliente}
Estado: ${cliente.estado}
Recibe Promociones: ${cliente.recibePromociones ? 'Sí' : 'No'}

📊 ESTADÍSTICAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Compras: S/. ${(cliente.totalCompras || 0).toFixed(2)}
Puntos Fidelidad: ${cliente.puntosFidelidad || 0}
Última Compra: ${cliente.ultimaCompra || 'Sin compras'}
Fecha Registro: ${cliente.fechaRegistro}

📝 OBSERVACIONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${cliente.observaciones || 'Sin observaciones'}

═══════════════════════════════════════
    `;
    
    alert(detalles);
}

// Eliminar cliente
function eliminarCliente(id) {
    const clientes = cargarClientes();
    const cliente = clientes.find(c => c.id === id);
    
    if (!cliente) {
        alert('Cliente no encontrado');
        return;
    }
    
    if (confirm(`¿Está seguro de eliminar al cliente?\n\n${cliente.nombres} ${cliente.apellidos}\n${cliente.tipoDocumento}: ${cliente.numeroDocumento}\n\n⚠️ Esta acción no se puede deshacer.`)) {
        const clientesActualizados = clientes.filter(c => c.id !== id);
        localStorage.setItem('clientes', JSON.stringify(clientesActualizados));
        
        mostrarClientes();
        actualizarEstadisticas();
        
        alert('✅ Cliente eliminado exitosamente');
    }
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modalEditarCliente').style.display = 'none';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    mostrarClientes();
    actualizarEstadisticas();
    
    // Búsqueda y filtros
    document.getElementById('buscarCliente').addEventListener('input', filtrarClientes);
    document.getElementById('filtroTipoCliente').addEventListener('change', filtrarClientes);
    document.getElementById('filtroEstado').addEventListener('change', filtrarClientes);
    
    // Formulario de edición
    document.getElementById('formEditarCliente').addEventListener('submit', guardarCambios);
    
    // Cerrar modal al hacer click fuera
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('modalEditarCliente');
        if (e.target === modal) {
            cerrarModal();
        }
    });
});
