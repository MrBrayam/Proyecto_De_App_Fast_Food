// Visualizar Usuarios - Seguridad
let usuarios = [];

document.addEventListener('DOMContentLoaded', function() {
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

function cargarUsuarios() {
    usuarios = JSON.parse(localStorage.getItem('usuarios_sistema') || '[]');
    
    if (usuarios.length === 0) {
        // Usuarios de ejemplo
        usuarios = [
            {
                nombre: 'Juan Pérez García',
                dni: '12345678',
                email: 'juan.perez@kingspizza.com',
                telefono: '987654321',
                usuario: 'jperez',
                perfil: 'administrador',
                estado: 'activo',
                fechaRegistro: '2025-10-15T10:30:00'
            },
            {
                nombre: 'María González López',
                dni: '87654321',
                email: 'maria.gonzalez@kingspizza.com',
                telefono: '912345678',
                usuario: 'mgonzalez',
                perfil: 'cajero',
                estado: 'activo',
                fechaRegistro: '2025-10-20T14:20:00'
            },
            {
                nombre: 'Carlos Ramírez Torres',
                dni: '45678912',
                email: 'carlos.ramirez@kingspizza.com',
                telefono: '998877665',
                usuario: 'cramirez',
                perfil: 'mesero',
                estado: 'activo',
                fechaRegistro: '2025-10-22T09:15:00'
            }
        ];
        localStorage.setItem('usuarios_sistema', JSON.stringify(usuarios));
    }
    
    mostrarUsuarios(usuarios);
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
            <td>${usuario.nombre}</td>
            <td>${usuario.dni}</td>
            <td>${usuario.usuario}</td>
            <td>${usuario.email}</td>
            <td><span class="badge badge-${getBadgeClass(usuario.perfil)}">${usuario.perfil}</span></td>
            <td><span class="badge badge-${usuario.estado === 'activo' ? 'success' : 'danger'}">${usuario.estado}</span></td>
            <td>${formatearFecha(usuario.fechaRegistro)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editarUsuario(${index})" title="Editar">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${index})" title="Eliminar">🗑️</button>
                <button class="btn btn-sm btn-info" onclick="verDetalles(${index})" title="Ver detalles">👁️</button>
            </td>
        </tr>
    `).join('');
}

function getBadgeClass(perfil) {
    const classes = {
        'administrador': 'danger',
        'supervisor': 'warning',
        'cajero': 'info',
        'mesero': 'success',
        'repartidor': 'primary'
    };
    return classes[perfil] || 'info';
}

function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    });
}

function filtrarUsuarios() {
    const busqueda = document.getElementById('buscarUsuario').value.toLowerCase();
    const perfilFiltro = document.getElementById('filtrarPerfil').value;
    const estadoFiltro = document.getElementById('filtrarEstado').value;
    
    let usuariosFiltrados = usuarios.filter(usuario => {
        const coincideBusqueda = usuario.nombre.toLowerCase().includes(busqueda) ||
                                 usuario.dni.includes(busqueda) ||
                                 usuario.usuario.toLowerCase().includes(busqueda);
        
        const coincidePerfil = !perfilFiltro || usuario.perfil === perfilFiltro;
        const coincideEstado = !estadoFiltro || usuario.estado === estadoFiltro;
        
        return coincideBusqueda && coincidePerfil && coincideEstado;
    });
    
    mostrarUsuarios(usuariosFiltrados);
}

function editarUsuario(index) {
    const usuario = usuarios[index];
    document.getElementById('editIndex').value = index;
    document.getElementById('editNombre').value = usuario.nombre;
    document.getElementById('editEmail').value = usuario.email;
    document.getElementById('editPerfil').value = usuario.perfil;
    document.getElementById('editEstado').value = usuario.estado;
    
    document.getElementById('modalEditarUsuario').style.display = 'flex';
}

function guardarEdicion(e) {
    e.preventDefault();
    
    const index = document.getElementById('editIndex').value;
    usuarios[index].nombre = document.getElementById('editNombre').value;
    usuarios[index].email = document.getElementById('editEmail').value;
    usuarios[index].perfil = document.getElementById('editPerfil').value;
    usuarios[index].estado = document.getElementById('editEstado').value;
    
    localStorage.setItem('usuarios_sistema', JSON.stringify(usuarios));
    cerrarModal();
    cargarUsuarios();
    alert('Usuario actualizado correctamente');
}

function eliminarUsuario(index) {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
        usuarios.splice(index, 1);
        localStorage.setItem('usuarios_sistema', JSON.stringify(usuarios));
        cargarUsuarios();
        alert('Usuario eliminado correctamente');
    }
}

function verDetalles(index) {
    const usuario = usuarios[index];
    alert(`Detalles del Usuario:\n\n` +
          `Nombre: ${usuario.nombre}\n` +
          `DNI: ${usuario.dni}\n` +
          `Usuario: ${usuario.usuario}\n` +
          `Email: ${usuario.email}\n` +
          `Teléfono: ${usuario.telefono || 'No registrado'}\n` +
          `Perfil: ${usuario.perfil}\n` +
          `Estado: ${usuario.estado}\n` +
          `Fecha Registro: ${formatearFecha(usuario.fechaRegistro)}`);
}

function cerrarModal() {
    document.getElementById('modalEditarUsuario').style.display = 'none';
}
