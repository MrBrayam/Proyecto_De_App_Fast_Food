/* ============================================
   JAVASCRIPT PARA VER ADMINISTRADORES
   Maneja la visualización y gestión de usuarios administradores
   ============================================ */

let todosLosUsuarios = [];
let administradoresFiltrados = [];

// Actualizar fecha y hora en tiempo real
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

// Cargar administradores desde el API
async function cargarAdministradores() {
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/usuarios/listar');
        const data = await response.json();
        
        if (data.exito && data.usuarios) {
            todosLosUsuarios = data.usuarios;
            
            // Filtrar solo administradores
            administradoresFiltrados = todosLosUsuarios.filter(usuario => 
                usuario.nombrePerfil.toLowerCase() === 'administrador'
            );
            
            mostrarAdministradores(administradoresFiltrados);
            actualizarEstadisticas(administradoresFiltrados);
        } else {
            console.error('Error al cargar administradores:', data.mensaje);
            mostrarMensajeVacio('Error al cargar los datos');
        }
    } catch (error) {
        console.error('Error en la petición:', error);
        mostrarMensajeVacio('Error al conectar con el servidor');
    }
}

// Mostrar administradores en la tabla
function mostrarAdministradores(administradores) {
    const tbody = document.getElementById('tbodyAdministradores');
    
    if (!administradores || administradores.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-inbox" style="font-size: 3rem; color: #666; margin-bottom: 1rem;"></i>
                    <p>No se encontraron administradores</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = administradores.map(admin => {
        const estadoClass = admin.estado === 'activo' ? 'badge-activo' : 'badge-inactivo';
        const estadoIcon = admin.estado === 'activo' ? 'fa-check-circle' : 'fa-times-circle';
        
        return `
            <tr>
                <td>
                    <div class="usuario-info">
                        <div class="avatar">
                            <i class="fas fa-user-shield"></i>
                        </div>
                        <div>
                            <strong>${admin.nombreUsuario}</strong>
                            <small>ID: ${admin.idUsuario}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div>
                        <strong>${admin.nombreCompleto}</strong><br>
                        <small><i class="fas fa-id-card"></i> DNI: ${admin.dni}</small>
                    </div>
                </td>
                <td>
                    <div>
                        <i class="fas fa-phone"></i> ${admin.telefono}<br>
                        ${admin.email ? `<i class="fas fa-envelope"></i> ${admin.email}` : '<small>Sin email</small>'}
                    </div>
                </td>
                <td>
                    <span class="badge badge-info">
                        <i class="fas fa-store"></i> Principal
                    </span>
                </td>
                <td>
                    <small>${formatearFecha(admin.fechaActualizacion || admin.fechaCreacion)}</small>
                </td>
                <td>
                    <span class="badge ${estadoClass}">
                        <i class="fas ${estadoIcon}"></i> ${admin.estado}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-info" onclick="verDetalles(${admin.idUsuario})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-warning" onclick="editarAdmin(${admin.idUsuario})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-danger" onclick="cambiarEstadoAdmin(${admin.idUsuario}, '${admin.estado}')" title="${admin.estado === 'activo' ? 'Desactivar' : 'Activar'}">
                            <i class="fas fa-${admin.estado === 'activo' ? 'ban' : 'check'}"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Formatear fecha
function formatearFecha(fechaString) {
    if (!fechaString) return 'N/A';
    
    const fecha = new Date(fechaString);
    const ahora = new Date();
    const diffMs = ahora - fecha;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Actualizar estadísticas
function actualizarEstadisticas(administradores) {
    const total = administradores.length;
    const activos = administradores.filter(a => a.estado === 'activo').length;
    
    // Calcular nuevos este mes
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const nuevos = administradores.filter(a => {
        const fechaCreacion = new Date(a.fechaCreacion);
        return fechaCreacion >= inicioMes;
    }).length;
    
    // Simulación de en línea (últimas 24 horas de actividad)
    const hace24h = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);
    const enLinea = administradores.filter(a => {
        const ultimaActividad = new Date(a.fechaActualizacion || a.fechaCreacion);
        return ultimaActividad >= hace24h && a.estado === 'activo';
    }).length;
    
    document.getElementById('totalAdmins').textContent = total;
    document.getElementById('adminsActivos').textContent = activos;
    document.getElementById('adminsEnLinea').textContent = enLinea;
    document.getElementById('adminsNuevos').textContent = nuevos;
}

// Mostrar mensaje cuando no hay datos
function mostrarMensajeVacio(mensaje) {
    const tbody = document.getElementById('tbodyAdministradores');
    tbody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff9800; margin-bottom: 1rem;"></i>
                <p>${mensaje}</p>
            </td>
        </tr>
    `;
}

// Filtrar administradores
function filtrarAdministradores() {
    const busqueda = document.getElementById('buscarAdmin').value.toLowerCase();
    const estadoFiltro = document.getElementById('filtrarEstado').value;
    
    let resultado = todosLosUsuarios.filter(usuario => 
        usuario.nombrePerfil.toLowerCase() === 'administrador'
    );
    
    // Filtrar por búsqueda
    if (busqueda) {
        resultado = resultado.filter(admin => 
            admin.nombreCompleto.toLowerCase().includes(busqueda) ||
            admin.dni.includes(busqueda) ||
            admin.nombreUsuario.toLowerCase().includes(busqueda) ||
            (admin.email && admin.email.toLowerCase().includes(busqueda)) ||
            admin.telefono.includes(busqueda)
        );
    }
    
    // Filtrar por estado
    if (estadoFiltro) {
        resultado = resultado.filter(admin => admin.estado === estadoFiltro);
    }
    
    administradoresFiltrados = resultado;
    mostrarAdministradores(resultado);
    actualizarEstadisticas(resultado);
}

// Ver detalles del administrador
function verDetalles(idUsuario) {
    const admin = todosLosUsuarios.find(u => u.idUsuario === idUsuario);
    if (!admin) return;
    
    alert(`
DETALLES DEL ADMINISTRADOR

Nombre: ${admin.nombreCompleto}
Usuario: ${admin.nombreUsuario}
DNI: ${admin.dni}
Teléfono: ${admin.telefono}
Email: ${admin.email || 'No especificado'}
Estado: ${admin.estado}
Perfil: ${admin.nombrePerfil}
Nivel de Acceso: ${admin.nivelAcceso}
Fecha de Registro: ${new Date(admin.fechaCreacion).toLocaleString('es-ES')}
Última Actualización: ${new Date(admin.fechaActualizacion || admin.fechaCreacion).toLocaleString('es-ES')}
    `);
}

// Editar administrador
function editarAdmin(idUsuario) {
    // Redirigir a página de edición de usuario
    window.location.href = `../html/registrar_usuario.html?editar=${idUsuario}`;
}

// Cambiar estado del administrador
async function cambiarEstadoAdmin(idUsuario, estadoActual) {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    const accion = nuevoEstado === 'activo' ? 'activar' : 'desactivar';
    
    if (!confirm(`¿Está seguro que desea ${accion} este administrador?`)) {
        return;
    }
    
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/usuarios/cambiar-estado', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idUsuario: idUsuario,
                estado: nuevoEstado
            })
        });
        
        const data = await response.json();
        
        if (data.exito) {
            alert('✅ ' + data.mensaje);
            cargarAdministradores();
        } else {
            alert('❌ Error: ' + data.mensaje);
        }
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        alert('❌ Error de conexión al servidor');
    }
}

// Exportar administradores a Excel
function exportarAdministradores() {
    if (administradoresFiltrados.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    // Crear CSV
    let csv = 'ID,Nombre Completo,DNI,Usuario,Teléfono,Email,Estado,Fecha Registro\n';
    
    administradoresFiltrados.forEach(admin => {
        csv += `${admin.idUsuario},"${admin.nombreCompleto}",${admin.dni},${admin.nombreUsuario},${admin.telefono},"${admin.email || ''}",${admin.estado},"${admin.fechaCreacion}"\n`;
    });
    
    // Descargar archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `administradores_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Función para manejar navegación de pestañas
function inicializarNavegacionTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Navegando a:', this.href);
        });
    });
}

// Inicializar funcionalidades
function inicializarFuncionalidadesAdministradores() {
    // Cargar datos
    cargarAdministradores();
    
    // Event listeners para filtros
    const buscarInput = document.getElementById('buscarAdmin');
    const estadoSelect = document.getElementById('filtrarEstado');
    
    if (buscarInput) {
        buscarInput.addEventListener('input', filtrarAdministradores);
    }
    
    if (estadoSelect) {
        estadoSelect.addEventListener('change', filtrarAdministradores);
    }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    inicializarNavegacionTabs();
    inicializarFuncionalidadesAdministradores();
});
