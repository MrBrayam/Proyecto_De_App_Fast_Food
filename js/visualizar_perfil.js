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
                <button class="btn-action btn-delete" onclick="eliminarPerfil(${index})">
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
    
    // VENTAS
    permisosHTML += '<div class="permission-category"><h4>Ventas</h4>';
    if (perfil.permisos.ventasRegistrar) permisosHTML += '<div class="permission-item active">✓ Registrar Venta</div>';
    if (perfil.permisos.ventasVisualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Venta</div>';
    if (perfil.permisos.promocionesRegistrar) permisosHTML += '<div class="permission-item active">✓ Registrar Promociones</div>';
    if (perfil.permisos.promocionesVisualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Promociones</div>';
    if (perfil.permisos.mesasRegistrar) permisosHTML += '<div class="permission-item active">✓ Registrar Mesas</div>';
    if (perfil.permisos.mesasVisualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Mesas</div>';
    if (perfil.permisos.pedidosRegistrar) permisosHTML += '<div class="permission-item active">✓ Registrar Pedidos</div>';
    if (perfil.permisos.pedidosVisualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Pedidos</div>';
    if (perfil.permisos.cajaApertura) permisosHTML += '<div class="permission-item active">✓ Apertura Caja</div>';
    if (perfil.permisos.cajaVisualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Caja</div>';
    if (perfil.permisos.cajaCerrar) permisosHTML += '<div class="permission-item active">✓ Cerrar Caja</div>';
    permisosHTML += '</div>';
    
    // COMPRAS
    permisosHTML += '<div class="permission-category"><h4>Compras</h4>';
    if (perfil.permisos.comprasRegistrar) permisosHTML += '<div class="permission-item active">✓ Registrar Compras</div>';
    if (perfil.permisos.comprasVisualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Compras</div>';
    if (perfil.permisos.inventarioVisualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Inventario</div>';

    if (perfil.permisos.proveedoresRegistrar) permisosHTML += '<div class="permission-item active">✓ Registrar Proveedores</div>';
    if (perfil.permisos.proveedoresVisualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Proveedores</div>';
    if (perfil.permisos.productoRegistrar) permisosHTML += '<div class="permission-item active">✓ Registrar Producto</div>';
    if (perfil.permisos.productoVisualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Producto</div>';
    permisosHTML += '</div>';
    
    // USUARIOS
    permisosHTML += '<div class="permission-category"><h4>Usuarios</h4>';
    if (perfil.permisos.usuariosRegistrar) permisosHTML += '<div class="permission-item active">✓ Registrar Usuario</div>';
    if (perfil.permisos.usuariosVisualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Usuarios</div>';
    permisosHTML += '</div>';
    
    // CLIENTES
    permisosHTML += '<div class="permission-category"><h4>Clientes</h4>';
    if (perfil.permisos.clientesRegistrar) permisosHTML += '<div class="permission-item active">✓ Registrar Clientes</div>';
    if (perfil.permisos.clientesVisualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Clientes</div>';
    permisosHTML += '</div>';
    
    // REPORTES
    permisosHTML += '<div class="permission-category"><h4>Reportes</h4>';
    if (perfil.permisos.reportes) permisosHTML += '<div class="permission-item active">✓ Generar Reportes</div>';
    permisosHTML += '</div>';
    
    // SEGURIDAD
    permisosHTML += '<div class="permission-category"><h4>Seguridad</h4>';
    if (perfil.permisos.seguridadUsuariosRegistrar) permisosHTML += '<div class="permission-item active">✓ Registrar Usuarios (Seguridad)</div>';
    if (perfil.permisos.seguridadUsuariosVisualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Usuarios (Seguridad)</div>';
    if (perfil.permisos.perfilesRegistrar) permisosHTML += '<div class="permission-item active">✓ Registrar Tipo de Perfil</div>';
    if (perfil.permisos.perfilesVisualizar) permisosHTML += '<div class="permission-item active">✓ Visualizar Perfil</div>';
    permisosHTML += '</div>';
    
    permisosHTML += '</div>';
    document.getElementById('permisosDetalle').innerHTML = permisosHTML;
    document.getElementById('modalPermisos').style.display = 'flex';
}

function editarPerfil(index) {
    const perfil = perfiles[index];
    if (perfil && perfil.idPerfil) {
        // Redirigir a la página de registrar perfil con parámetro de edición
        window.location.href = `registrar_perfil.html?editar=${perfil.idPerfil}`;
    }
}

async function eliminarPerfil(index) {
    const perfil = perfiles[index];
    
    if (!perfil || !perfil.idPerfil) {
        alert('Error: No se pudo identificar el perfil');
        return;
    }
    
    // Confirmación del usuario
    const confirmacion = confirm(
        `¿Estás seguro de que deseas eliminar el perfil "${perfil.nombrePerfil}"?\n\n` +
        `Esta acción no se puede deshacer.`
    );
    
    if (!confirmacion) {
        return;
    }
    
    try {
        const response = await fetch(`/Proyecto_De_App_Fast_Food/api/perfiles/eliminar?id=${perfil.idPerfil}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.exito) {
            alert('✅ ' + data.mensaje);
            // Recargar la lista de perfiles
            cargarPerfiles();
        } else {
            alert('❌ Error: ' + data.mensaje);
        }
    } catch (error) {
        console.error('Error al eliminar perfil:', error);
        alert('❌ Error de conexión al servidor');
    }
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
