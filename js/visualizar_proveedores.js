// ===== VISUALIZAR PROVEEDORES =====
// Gestiona la carga, visualización y filtrado de proveedores desde la API

let proveedoresData = []; // Almacena todos los proveedores

document.addEventListener('DOMContentLoaded', function() {
    // Actualizar fecha y hora
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Cargar proveedores desde API
    cargarProveedores();
    
    // Event listeners
    document.getElementById('btnRegistrar').addEventListener('click', function() {
        window.location.href = 'registrar_proveedor.html';
    });
    
    document.getElementById('btnBuscar').addEventListener('click', aplicarFiltros);
    document.getElementById('btnLimpiar').addEventListener('click', limpiarFiltros);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') aplicarFiltros();
    });
    
    // Event listeners para filtros
    document.getElementById('filterCategoria').addEventListener('change', aplicarFiltros);
    document.getElementById('filterEstado').addEventListener('change', aplicarFiltros);
});

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
    
    const opcionesHora = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
    };
    const horaFormateada = ahora.toLocaleTimeString('es-ES', opcionesHora);
    
    const fechaElement = document.getElementById('currentDate');
    if (fechaElement) {
        fechaElement.textContent = fechaFormateada + ' - ' + horaFormateada;
    }
}

// Cargar proveedores desde API
async function cargarProveedores() {
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (loadingSpinner) loadingSpinner.style.display = 'flex';
    
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/proveedores/listar');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.exito && Array.isArray(data.proveedores)) {
            proveedoresData = data.proveedores;
            mostrarProveedores(proveedoresData);
            actualizarEstadisticas(proveedoresData);
            llenarFiltrosCategorias(proveedoresData);
        } else {
            console.error('Error en respuesta API:', data);
            mostrarMensajeVacio();
        }
    } catch (error) {
        console.error('Error cargando proveedores:', error);
        mostrarMensajeVacio();
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

// Mostrar proveedores en la tabla
function mostrarProveedores(proveedores) {
    const tableBody = document.querySelector('table tbody');
    if (!tableBody) {
        console.warn('Tabla no encontrada en HTML');
        return;
    }
    
    tableBody.innerHTML = '';
    
    if (proveedores.length === 0) {
        mostrarMensajeVacio();
        return;
    }
    
    const noDataMsg = document.querySelector('.no-data-message');
    if (noDataMsg) noDataMsg.style.display = 'none';
    
    proveedores.forEach(proveedor => {
        const row = document.createElement('tr');
        const estado = (proveedor.Estado || proveedor.estado || 'activo').toLowerCase();
        const estadoBadgeClass = estado === 'activo' ? 'badge-activo' : 'badge-inactivo';
        
        row.innerHTML = `
            <td>${proveedor.CodProveedor || proveedor.codProveedor || '-'}</td>
            <td>${proveedor.RazonSocial || proveedor.razonSocial || '-'}</td>
            <td>${proveedor.Categoria || proveedor.categoria || '-'}</td>
            <td>${proveedor.Telefono || proveedor.telefono || '-'}</td>
            <td>${proveedor.Email || proveedor.email || '-'}</td>
            <td><span class="badge ${estadoBadgeClass}">${estado.charAt(0).toUpperCase() + estado.slice(1)}</span></td>
            <td>
                <button class="btn-icon btn-edit" onclick="editarProveedor(${proveedor.CodProveedor || proveedor.codProveedor})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="eliminarProveedor(${proveedor.CodProveedor || proveedor.codProveedor})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Actualizar estadísticas
function actualizarEstadisticas(proveedores) {
    const total = proveedores.length;
    const activos = proveedores.filter(p => (p.Estado || p.estado || 'activo').toLowerCase() === 'activo').length;
    const inactivos = total - activos;
    
    document.getElementById('totalProveedores').textContent = total;
    document.getElementById('activosCount').textContent = activos;
    document.getElementById('inactivosCount').textContent = inactivos;
}

// Llenar dropdown de categorías
function llenarFiltrosCategorias(proveedores) {
    const filterCategoria = document.getElementById('filterCategoria');
    if (!filterCategoria) return;
    
    const categoriasSet = new Set();
    proveedores.forEach(p => {
        const cat = p.Categoria || p.categoria;
        if (cat) categoriasSet.add(cat);
    });
    
    const categoriasArray = Array.from(categoriasSet).sort();
    const opcionesActuales = filterCategoria.querySelectorAll('option');
    
    // Mantener opción "Todas las categorías"
    for (let i = opcionesActuales.length - 1; i > 0; i--) {
        opcionesActuales[i].remove();
    }
    
    categoriasArray.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        filterCategoria.appendChild(option);
    });
}

// Aplicar filtros
function aplicarFiltros() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const filtroCategoria = document.getElementById('filterCategoria').value;
    const filtroEstado = document.getElementById('filterEstado').value;
    
    const proveedoresFiltrados = proveedoresData.filter(proveedor => {
        const cumpleCategoria = !filtroCategoria || (proveedor.Categoria || proveedor.categoria) === filtroCategoria;
        const cumpleEstado = !filtroEstado || (proveedor.Estado || proveedor.estado || 'activo').toLowerCase() === filtroEstado.toLowerCase();
        
        const cumpleBusqueda = !searchText || 
            (proveedor.RazonSocial || proveedor.razonSocial || '').toLowerCase().includes(searchText) ||
            (proveedor.NombreComercial || proveedor.nombreComercial || '').toLowerCase().includes(searchText) ||
            (proveedor.Telefono || proveedor.telefono || '').toLowerCase().includes(searchText) ||
            (proveedor.Email || proveedor.email || '').toLowerCase().includes(searchText);
        
        return cumpleCategoria && cumpleEstado && cumpleBusqueda;
    });
    
    mostrarProveedores(proveedoresFiltrados);
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCategoria').value = '';
    document.getElementById('filterEstado').value = '';
    mostrarProveedores(proveedoresData);
}

// Mostrar mensaje cuando no hay datos
function mostrarMensajeVacio() {
    const tableBody = document.querySelector('table tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
    }
    
    let noDataMsg = document.querySelector('.no-data-message');
    if (!noDataMsg) {
        noDataMsg = document.createElement('div');
        noDataMsg.className = 'no-data-message';
        noDataMsg.innerHTML = '<p><i class="fas fa-info-circle"></i> No hay proveedores registrados</p>';
        const tableContainer = document.querySelector('.tabla-proveedores') || document.querySelector('.proveedores-visualizar-container');
        if (tableContainer) tableContainer.appendChild(noDataMsg);
    } else {
        noDataMsg.style.display = 'block';
    }
}

// Editar proveedor
async function editarProveedor(codProveedor) {
    try {
        // Buscar el proveedor en los datos cargados
        const proveedor = proveedoresData.find(p => 
            (p.CodProveedor || p.codProveedor) == codProveedor
        );
        
        if (proveedor) {
            // Guardar en sessionStorage para cargar en el formulario
            sessionStorage.setItem('editarProveedorData', JSON.stringify(proveedor));
            window.location.href = 'registrar_proveedor.html';
        } else {
            alert('No se encontró el proveedor');
        }
    } catch (error) {
        console.error('Error al editar proveedor:', error);
        alert('Error al cargar los datos del proveedor');
    }
}

// Eliminar proveedor
async function eliminarProveedor(codProveedor) {
    if (!confirm('¿Está seguro que desea eliminar este proveedor?\n\nEsta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        const response = await fetch(`/Proyecto_De_App_Fast_Food/api/proveedores/eliminar?id=${codProveedor}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.exito) {
            alert('Proveedor eliminado correctamente');
            // Recargar la lista
            cargarProveedores();
        } else {
            alert(data.mensaje || 'No se pudo eliminar el proveedor');
        }
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        alert('Error al eliminar el proveedor');
    }
}

// Hacer las funciones globales
window.editarProveedor = editarProveedor;
window.eliminarProveedor = eliminarProveedor;

// Función placeholder para cerrar modal
function cerrarModal() {
    const modal = document.getElementById('modalDetalle');
    if (modal) {
        modal.classList.remove('active');
    }
}
