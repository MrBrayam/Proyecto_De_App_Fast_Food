// Visualizar Perfiles
let perfiles = [];

document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    cargarPerfiles();
    
    document.getElementById('buscarPerfil').addEventListener('input', filtrarPerfiles);
    document.getElementById('filtrarEstado').addEventListener('change', filtrarPerfiles);
    document.getElementById('filtrarNivel').addEventListener('change', filtrarPerfiles);
});

async function cargarPerfiles() {
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/perfiles/listar');
        const data = await response.json();
        
        if (data.exito) {
            perfiles = data.perfiles;
            mostrarPerfiles(perfiles);
        } else {
            console.error('Error al cargar perfiles:', data.mensaje);
            perfiles = [];
            mostrarPerfiles(perfiles);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        perfiles = [];
        mostrarPerfiles(perfiles);
    }
}

function mostrarPerfiles(data) {
    const container = document.getElementById('perfilesContainer');
    const noDataMessage = document.getElementById('noDataMessage');
    
    if (data.length === 0) {
        container.innerHTML = '';
        noDataMessage.style.display = 'block';
        return;
    }
    
    noDataMessage.style.display = 'none';
    
    container.innerHTML = data.map((perfil, index) => `
        <div class="profile-card">
            <div class="profile-header">
                <div class="profile-title">
                    <div class="profile-info">
                        <h3>${perfil.nombrePerfil}</h3>
                        <div class="profile-nivel">Nivel ${perfil.nivelAcceso} - ${getNivelNombre(perfil.nivelAcceso)}</div>
                    </div>
                </div>
                <span class="profile-status status-${perfil.estado}">${perfil.estado}</span>
            </div>
            <p class="profile-description">${perfil.descripcion || 'Sin descripción'}</p>
            <div class="profile-stats">
                <div class="stat-item">
                    <div class="stat-value">${contarPermisos(perfil.permisos)}</div>
                    <div class="stat-label">Permisos</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${perfil.nivelAcceso}</div>
                    <div class="stat-label">Nivel</div>
                </div>
            </div>
            <div class="profile-actions">
                <button class="btn-action btn-view" onclick="verPermisos(${index})">
                    <i class="fas fa-eye"></i> Ver
                </button>
                <button class="btn-action btn-edit" onclick="editarPerfil(${index})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-action btn-delete" onclick="return false;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function getNivelNombre(nivel) {
    const niveles = {
        '1': 'Básico',
        '2': 'Intermedio',
        '3': 'Avanzado',
        '4': 'Administrador'
    };
    return niveles[nivel] || 'Desconocido';
}

function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function contarPermisos(permisos) {
    let count = 0;
    
    function contarRecursivo(obj) {
        for (let key in obj) {
            if (typeof obj[key] === 'boolean' && obj[key]) {
                count++;
            } else if (typeof obj[key] === 'object') {
                contarRecursivo(obj[key]);
            }
        }
    }
    
    contarRecursivo(permisos);
    return count;
}

function filtrarPerfiles() {
    const busqueda = document.getElementById('buscarPerfil').value.toLowerCase();
    const estadoFiltro = document.getElementById('filtrarEstado').value;
    const nivelFiltro = document.getElementById('filtrarNivel').value;
    
    let perfilesFiltrados = perfiles.filter(perfil => {
        const coincideBusqueda = perfil.nombrePerfil.toLowerCase().includes(busqueda);
        const coincideEstado = !estadoFiltro || perfil.estado === estadoFiltro;
        const coincideNivel = !nivelFiltro || perfil.nivelAcceso === nivelFiltro;
        
        return coincideBusqueda && coincideEstado && coincideNivel;
    });
    
    mostrarPerfiles(perfilesFiltrados);
}

function verPermisos(index) {
    const perfil = perfiles[index];
    document.getElementById('modalPerfilNombre').textContent = perfil.nombrePerfil;
    
    let permisosHTML = '<div class="permissions-grid">';
    
    if (perfil.permisos.accesoCompleto) {
        permisosHTML += '<div class="permission-item active"><strong>✓ Acceso Completo al Sistema</strong></div>';
    } else {
        // Ventas
        permisosHTML += '<div class="permission-category"><h4>Ventas</h4>';
        if (perfil.permisos.ventasRegistrar) permisosHTML += '<div class="permission-item active">✓ Registrar Ventas</div>';
        if (perfil.permisos.ventasVisualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Ventas</div>';
        if (perfil.permisos.ventasModificar) permisosHTML += '<div class="permission-item active">✓ Modificar Ventas</div>';
        if (perfil.permisos.ventasEliminar) permisosHTML += '<div class="permission-item active">✓ Eliminar Ventas</div>';
        permisosHTML += '</div>';
        
        // Compras
        permisosHTML += '<div class="permission-category"><h4>Compras</h4>';
        if (perfil.permisos.comprasRegistrar) permisosHTML += '<div class="permission-item active">✓ Registrar Compras</div>';
        if (perfil.permisos.comprasVisualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Compras</div>';
        if (perfil.permisos.comprasInventario) permisosHTML += '<div class="permission-item active">✓ Gestionar Inventario</div>';
        permisosHTML += '</div>';
        
        // Usuarios
        permisosHTML += '<div class="permission-category"><h4>Usuarios</h4>';
        if (perfil.permisos.usuariosRegistrar) permisosHTML += '<div class="permission-item active">✓ Registrar Usuarios</div>';
        if (perfil.permisos.usuariosVisualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Usuarios</div>';
        if (perfil.permisos.usuariosModificar) permisosHTML += '<div class="permission-item active">✓ Modificar Usuarios</div>';
        if (perfil.permisos.usuariosEliminar) permisosHTML += '<div class="permission-item active">✓ Eliminar Usuarios</div>';
        permisosHTML += '</div>';
        
        // Reportes
        permisosHTML += '<div class="permission-category"><h4>Reportes</h4>';
        if (perfil.permisos.reportesVentas) permisosHTML += '<div class="permission-item active">✓ Reportes de Ventas</div>';
        if (perfil.permisos.reportesCompras) permisosHTML += '<div class="permission-item active">✓ Reportes de Compras</div>';
        if (perfil.permisos.reportesFinancieros) permisosHTML += '<div class="permission-item active">✓ Reportes Financieros</div>';
        permisosHTML += '</div>';
        
        // Otros
        permisosHTML += '<div class="permission-category"><h4>Otros</h4>';
        if (perfil.permisos.clientes) permisosHTML += '<div class="permission-item active">✓ Gestionar Clientes</div>';
        if (perfil.permisos.proveedores) permisosHTML += '<div class="permission-item active">✓ Gestionar Proveedores</div>';
        if (perfil.permisos.perfiles) permisosHTML += '<div class="permission-item active">✓ Gestionar Perfiles</div>';
        permisosHTML += '</div>';
    }
    
    permisosHTML += '</div>';
    document.getElementById('permisosDetalle').innerHTML = permisosHTML;
    document.getElementById('modalPermisos').style.display = 'flex';
}

function editarPerfil(index) {
    alert('Funcionalidad de edición en desarrollo');
}

function cerrarModal() {
    document.getElementById('modalPermisos').style.display = 'none';
}

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
