// Visualizar Perfiles
let perfiles = [];

document.addEventListener('DOMContentLoaded', function() {
    cargarPerfiles();
    
    document.getElementById('buscarPerfil').addEventListener('input', filtrarPerfiles);
    document.getElementById('filtrarEstado').addEventListener('change', filtrarPerfiles);
    document.getElementById('filtrarNivel').addEventListener('change', filtrarPerfiles);
});

function cargarPerfiles() {
    perfiles = JSON.parse(localStorage.getItem('perfiles_sistema') || '[]');
    
    if (perfiles.length === 0) {
        // Perfiles de ejemplo
        perfiles = [
            {
                nombre: 'Administrador',
                descripcion: 'Acceso completo al sistema',
                estado: 'activo',
                nivelAcceso: '4',
                permisos: { accesoCompleto: true },
                fechaCreacion: '2025-10-01T10:00:00'
            },
            {
                nombre: 'Cajero',
                descripcion: 'Gestión de ventas y caja',
                estado: 'activo',
                nivelAcceso: '2',
                permisos: {
                    ventas: { registrar: true, visualizar: true },
                    clientes: true
                },
                fechaCreacion: '2025-10-05T14:30:00'
            },
            {
                nombre: 'Mesero',
                descripcion: 'Toma de pedidos y gestión de mesas',
                estado: 'activo',
                nivelAcceso: '1',
                permisos: {
                    ventas: { registrar: true, visualizar: true }
                },
                fechaCreacion: '2025-10-10T09:00:00'
            },
            {
                nombre: 'Repartidor',
                descripcion: 'Gestión de entregas a domicilio',
                estado: 'activo',
                nivelAcceso: '1',
                permisos: {
                    ventas: { visualizar: true },
                    clientes: true
                },
                fechaCreacion: '2025-10-12T11:00:00'
            }
        ];
        localStorage.setItem('perfiles_sistema', JSON.stringify(perfiles));
    }
    
    mostrarPerfiles(perfiles);
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
                <div class="profile-icon">${getIconoPerfil(perfil.nivelAcceso)}</div>
                <h3 class="profile-title">${perfil.nombre}</h3>
                <span class="badge badge-${perfil.estado === 'activo' ? 'success' : 'danger'}">${perfil.estado}</span>
            </div>
            <div class="profile-body">
                <p class="profile-description">${perfil.descripcion || 'Sin descripción'}</p>
                <div class="profile-info">
                    <div class="info-item">
                        <span class="info-label">Nivel de Acceso:</span>
                        <span class="info-value">Nivel ${perfil.nivelAcceso}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Fecha Creación:</span>
                        <span class="info-value">${formatearFecha(perfil.fechaCreacion)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Permisos:</span>
                        <span class="info-value">${contarPermisos(perfil.permisos)} configurados</span>
                    </div>
                </div>
            </div>
            <div class="profile-actions">
                <button class="btn btn-sm btn-info" onclick="verPermisos(${index})">
                    <span>👁️</span> Ver Permisos
                </button>
                <button class="btn btn-sm btn-primary" onclick="editarPerfil(${index})">
                    <span>✏️</span> Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarPerfil(${index})">
                    <span>🗑️</span> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function getIconoPerfil(nivel) {
    const iconos = {
        '1': '👤',
        '2': '👨‍💼',
        '3': '👨‍💻',
        '4': '👑'
    };
    return iconos[nivel] || '👤';
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
        const coincideBusqueda = perfil.nombre.toLowerCase().includes(busqueda);
        const coincideEstado = !estadoFiltro || perfil.estado === estadoFiltro;
        const coincideNivel = !nivelFiltro || perfil.nivelAcceso === nivelFiltro;
        
        return coincideBusqueda && coincideEstado && coincideNivel;
    });
    
    mostrarPerfiles(perfilesFiltrados);
}

function verPermisos(index) {
    const perfil = perfiles[index];
    document.getElementById('modalPerfilNombre').textContent = perfil.nombre;
    
    let permisosHTML = '<div class="permissions-grid">';
    
    if (perfil.permisos.accesoCompleto) {
        permisosHTML += '<div class="permission-item active"><strong>✓ Acceso Completo al Sistema</strong></div>';
    } else {
        // Ventas
        if (perfil.permisos.ventas) {
            permisosHTML += '<div class="permission-category"><h4>Ventas</h4>';
            if (perfil.permisos.ventas.registrar) permisosHTML += '<div class="permission-item active">✓ Registrar Ventas</div>';
            if (perfil.permisos.ventas.visualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Ventas</div>';
            if (perfil.permisos.ventas.modificar) permisosHTML += '<div class="permission-item active">✓ Modificar Ventas</div>';
            if (perfil.permisos.ventas.eliminar) permisosHTML += '<div class="permission-item active">✓ Eliminar Ventas</div>';
            permisosHTML += '</div>';
        }
        
        // Compras
        if (perfil.permisos.compras) {
            permisosHTML += '<div class="permission-category"><h4>Compras</h4>';
            if (perfil.permisos.compras.registrar) permisosHTML += '<div class="permission-item active">✓ Registrar Compras</div>';
            if (perfil.permisos.compras.visualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Compras</div>';
            if (perfil.permisos.compras.inventario) permisosHTML += '<div class="permission-item active">✓ Gestionar Inventario</div>';
            permisosHTML += '</div>';
        }
        
        // Usuarios
        if (perfil.permisos.usuarios) {
            permisosHTML += '<div class="permission-category"><h4>Usuarios</h4>';
            if (perfil.permisos.usuarios.registrar) permisosHTML += '<div class="permission-item active">✓ Registrar Usuarios</div>';
            if (perfil.permisos.usuarios.visualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Usuarios</div>';
            if (perfil.permisos.usuarios.modificar) permisosHTML += '<div class="permission-item active">✓ Modificar Usuarios</div>';
            if (perfil.permisos.usuarios.eliminar) permisosHTML += '<div class="permission-item active">✓ Eliminar Usuarios</div>';
            permisosHTML += '</div>';
        }
        
        // Reportes
        if (perfil.permisos.reportes) {
            permisosHTML += '<div class="permission-category"><h4>Reportes</h4>';
            if (perfil.permisos.reportes.ventas) permisosHTML += '<div class="permission-item active">✓ Reportes de Ventas</div>';
            if (perfil.permisos.reportes.compras) permisosHTML += '<div class="permission-item active">✓ Reportes de Compras</div>';
            if (perfil.permisos.reportes.financieros) permisosHTML += '<div class="permission-item active">✓ Reportes Financieros</div>';
            permisosHTML += '</div>';
        }
        
        // Otros
        if (perfil.permisos.clientes) {
            permisosHTML += '<div class="permission-item active">✓ Gestionar Clientes</div>';
        }
        if (perfil.permisos.proveedores) {
            permisosHTML += '<div class="permission-item active">✓ Gestionar Proveedores</div>';
        }
        if (perfil.permisos.perfiles) {
            permisosHTML += '<div class="permission-item active">✓ Gestionar Perfiles</div>';
        }
    }
    
    permisosHTML += '</div>';
    document.getElementById('permisosDetalle').innerHTML = permisosHTML;
    document.getElementById('modalPermisos').style.display = 'flex';
}

function editarPerfil(index) {
    alert('Funcionalidad de edición en desarrollo');
}

function eliminarPerfil(index) {
    if (confirm('¿Está seguro de eliminar este perfil?')) {
        perfiles.splice(index, 1);
        localStorage.setItem('perfiles_sistema', JSON.stringify(perfiles));
        cargarPerfiles();
        alert('Perfil eliminado correctamente');
    }
}

function cerrarModal() {
    document.getElementById('modalPermisos').style.display = 'none';
}
