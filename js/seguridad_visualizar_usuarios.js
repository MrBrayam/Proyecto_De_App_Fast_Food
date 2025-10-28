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
            <td><span class="badge badge-perfil">${usuario.perfil}</span></td>
            <td><span class="badge badge-${usuario.estado}">${usuario.estado}</span></td>
            <td>${formatearFecha(usuario.fechaRegistro)}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editarUsuario(${index})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete" onclick="eliminarUsuario(${index})" title="Eliminar">
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
    
    document.getElementById('fechaActual').textContent = fechaFormateada;
    document.getElementById('horaActual').textContent = horaFormateada;
}
