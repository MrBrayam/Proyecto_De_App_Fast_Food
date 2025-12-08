// Variables globales
let proveedoresActuales = [];

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarFecha();
    cargarProveedores();
    
    // Event listeners
    document.getElementById('btnBuscar').addEventListener('click', aplicarFiltros);
    document.getElementById('btnLimpiar').addEventListener('click', limpiarFiltros);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') aplicarFiltros();
    });
});

// Función para actualizar la fecha y hora
function actualizarFecha() {
    const elementoFecha = document.getElementById('currentDate');
    if (elementoFecha) {
        const ahora = new Date();
        const opciones = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        elementoFecha.textContent = ahora.toLocaleDateString('es-ES', opciones);
    }
}

// Cargar proveedores desde la API
async function cargarProveedores() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noDataMessage = document.getElementById('noDataMessage');
    
    try {
        loadingSpinner.style.display = 'flex';
        noDataMessage.style.display = 'none';
        
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/proveedores/listar');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Respuesta API:', result);
        
        if (result.exito && result.proveedores) {
            proveedoresActuales = result.proveedores;
            mostrarProveedores(proveedoresActuales);
            actualizarEstadisticas();
            llenarFiltrosCategorias();
        } else {
            console.error('Error: No se encontraron proveedores');
            noDataMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error al cargar proveedores:', error);
        noDataMessage.style.display = 'block';
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

// Mostrar proveedores en la tabla
function mostrarProveedores(proveedores) {
    const tabla = document.getElementById('proveedoresTableBody');
    const noDataMessage = document.getElementById('noDataMessage');
    
    tabla.innerHTML = '';
    
    if (proveedores.length === 0) {
        noDataMessage.style.display = 'block';
        return;
    }
    
    noDataMessage.style.display = 'none';
    
    proveedores.forEach(proveedor => {
        const fila = document.createElement('tr');
        
        // Normalizar a camelCase para acceso consistente
        const p = {
            codProveedor: proveedor.CodProveedor || proveedor.codProveedor,
            razonSocial: proveedor.RazonSocial || proveedor.razonSocial || '-',
            nombreComercial: proveedor.NombreComercial || proveedor.nombreComercial || '-',
            categoria: proveedor.Categoria || proveedor.categoria || '-',
            telefono: proveedor.Telefono || proveedor.telefono || '-',
            email: proveedor.Email || proveedor.email || '-',
            personaContacto: proveedor.PersonaContacto || proveedor.personaContacto || '-',
            ciudad: proveedor.Ciudad || proveedor.ciudad || '-',
            estado: proveedor.Estado || proveedor.estado || 'activo',
            descuento: proveedor.Descuento || proveedor.descuento || '0'
        };
        
        const estadoBadge = p.estado === 'activo' 
            ? '<span class="badge badge-activo">Activo</span>' 
            : '<span class="badge badge-inactivo">Inactivo</span>';
        
        fila.innerHTML = `
            <td>${p.codProveedor}</td>
            <td>${p.razonSocial}</td>
            <td>${p.nombreComercial}</td>
            <td>${p.categoria}</td>
            <td>${p.telefono}</td>
            <td>${p.email}</td>
            <td>${p.personaContacto}</td>
            <td>${p.ciudad}</td>
            <td>${estadoBadge}</td>
            <td>${p.descuento}%</td>
            <td>
                <button class="btn-info" title="Ver detalles" onclick="verDetalles(${p.codProveedor})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        tabla.appendChild(fila);
    });
}

// Actualizar estadísticas
function actualizarEstadisticas() {
    const total = proveedoresActuales.length;
    const activos = proveedoresActuales.filter(p => {
        const estado = p.Estado || p.estado;
        return estado === 'activo';
    }).length;
    const inactivos = proveedoresActuales.filter(p => {
        const estado = p.Estado || p.estado;
        return estado === 'inactivo';
    }).length;
    
    document.getElementById('totalProveedores').textContent = total;
    document.getElementById('activosCount').textContent = activos;
    document.getElementById('inactivosCount').textContent = inactivos;
}

// Llenar filtro de categorías
function llenarFiltrosCategorias() {
    const categorias = new Set(proveedoresActuales
        .map(p => p.Categoria || p.categoria)
        .filter(c => c && c !== 'null'));
    
    const selectCategoria = document.getElementById('filterCategoria');
    
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectCategoria.appendChild(option);
    });
}

// Aplicar filtros
function aplicarFiltros() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const categoria = document.getElementById('filterCategoria').value;
    const estado = document.getElementById('filterEstado').value;
    
    let proveedoresFiltrados = proveedoresActuales.filter(proveedor => {
        const razonSocial = (proveedor.RazonSocial || proveedor.razonSocial || '').toLowerCase();
        const telefono = (proveedor.Telefono || proveedor.telefono || '').toLowerCase();
        const email = (proveedor.Email || proveedor.email || '').toLowerCase();
        const personaContacto = (proveedor.PersonaContacto || proveedor.personaContacto || '').toLowerCase();
        const pCategoria = proveedor.Categoria || proveedor.categoria;
        const pEstado = proveedor.Estado || proveedor.estado;
        
        const cumpleTexto = !searchText || 
            razonSocial.includes(searchText) ||
            telefono.includes(searchText) ||
            email.includes(searchText) ||
            personaContacto.includes(searchText);
        
        const cumpleCategoria = !categoria || pCategoria === categoria;
        const cumpleEstado = !estado || pEstado === estado;
        
        return cumpleTexto && cumpleCategoria && cumpleEstado;
    });
    
    mostrarProveedores(proveedoresFiltrados);
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCategoria').value = '';
    document.getElementById('filterEstado').value = '';
    mostrarProveedores(proveedoresActuales);
}

// Ver detalles (placeholder)
function verDetalles(codProveedor) {
    const proveedor = proveedoresActuales.find(p => p.codProveedor === codProveedor);
    if (proveedor) {
        console.log('Detalles del proveedor:', proveedor);
        alert(`Detalles de ${proveedor.razonSocial}\n\nImplementar modal de detalles`);
    }
}
