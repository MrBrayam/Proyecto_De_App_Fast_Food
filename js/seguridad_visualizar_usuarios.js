// Visualizar Usuarios - Seguridad
let usuarios = [];

document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    cargarUsuarios();
    
    // Event listeners para filtros
    document.getElementById('buscarUsuario').addEventListener('input', filtrarUsuarios);
    document.getElementById('filtrarPerfil').addEventListener('change', filtrarUsuarios);
    document.getElementById('filtrarEstado').addEventListener('change', filtrarUsuarios);
    
    // Form editar
    const formEditar = document.getElementById('formEditarUsuario');
    if (formEditar) {
        formEditar.addEventListener('submit', guardarEdicion);
    }
});

// Cargar usuarios desde la API
async function cargarUsuarios() {
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/usuarios/listar');
        const data = await response.json();
        
        if (data.exito) {
            usuarios = data.usuarios || [];
            mostrarUsuarios(usuarios);
        } else {
            console.error('Error al cargar usuarios:', data.mensaje);
            usuarios = [];
            mostrarUsuarios(usuarios);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        usuarios = [];
        mostrarUsuarios(usuarios);
    }
}

function mostrarUsuarios(data) {
    const tbody = document.getElementById('tbodyUsuarios');
    const noDataMessage = document.getElementById('noDataMessage');
    
    if (data.length === 0) {
        tbody.innerHTML = '';
        noDataMessage.style.display = 'block';
        return;
    }
    
    noDataMessage.style.display = 'none';
    
    tbody.innerHTML = data.map((usuario, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${usuario.nombreCompleto}</td>
            <td>${usuario.dni}</td>
            <td>${usuario.nombreUsuario}</td>
            <td>${usuario.email || '-'}</td>
            <td><span class="badge badge-perfil">${usuario.nombrePerfil}</span></td>
            <td><span class="badge badge-${usuario.estado}">${usuario.estado}</span></td>
            <td>${formatearFecha(usuario.fechaCreacion)}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editarUsuario('${usuario.idUsuario}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete" onclick="eliminarUsuario('${usuario.idUsuario}')" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    });
}

// Filtrar usuarios
function filtrarUsuarios() {
    const buscar = document.getElementById('buscarUsuario').value.toLowerCase();
    const perfil = document.getElementById('filtrarPerfil').value.toLowerCase();
    const estado = document.getElementById('filtrarEstado').value.toLowerCase();
    
    const usuariosFiltrados = usuarios.filter(usuario => {
        const coincideNombre = usuario.nombreCompleto.toLowerCase().includes(buscar) ||
                              usuario.dni.includes(buscar) ||
                              usuario.nombreUsuario.toLowerCase().includes(buscar);
        const coincidePerfil = !perfil || usuario.nombrePerfil.toLowerCase() === perfil;
        const coincideEstado = !estado || usuario.estado.toLowerCase() === estado;
        
        return coincideNombre && coincidePerfil && coincideEstado;
    });
    
    mostrarUsuarios(usuariosFiltrados);
}

// Editar usuario
function editarUsuario(idUsuario) {
    console.log('Editando usuario:', idUsuario);
    // Redirigir a la página de registro con parámetro de edición
    window.location.href = `seguridad_registrar_usuarios.html?editar=${idUsuario}`;
}

// Eliminar usuario (placeholder)
function eliminarUsuario(idUsuario) {
    if (confirm('¿Está seguro que desea eliminar este usuario?')) {
        alert('Función eliminar usuario en desarrollo');
    }
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

// Cerrar modal
function cerrarModal() {
    const modal = document.getElementById('modalEditarUsuario');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Guardar edición (placeholder)
function guardarEdicion(event) {
    event.preventDefault();
    alert('Función guardar edición en desarrollo');
}
