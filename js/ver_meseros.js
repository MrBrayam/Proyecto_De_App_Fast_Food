/* ============================================
   JAVASCRIPT PARA VER MESEROS
   Maneja la visualización y gestión de usuarios meseros
   ============================================ */

let todosLosUsuarios = [];
let meserosFiltrados = [];

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

// Cargar meseros desde el API
async function cargarMeseros() {
    try {
        // Cargar usuarios meseros
        const responseUsuarios = await fetch('/Proyecto_De_App_Fast_Food/api/usuarios/listar');
        const dataUsuarios = await responseUsuarios.json();
        
        // Cargar estadísticas de meseros
        const responseEstadisticas = await fetch('/Proyecto_De_App_Fast_Food/api/usuarios/estadisticas-meseros');
        const dataEstadisticas = await responseEstadisticas.json();
        
        if (dataUsuarios.exito && dataUsuarios.usuarios && dataEstadisticas.exito) {
            todosLosUsuarios = dataUsuarios.usuarios;
            meserosFiltrados = todosLosUsuarios.filter(usuario => 
                usuario.nombrePerfil.toLowerCase() === 'mesero'
            );
            
            // Crear mapa de estadísticas por IdUsuario
            const estadisticasMap = new Map();
            if (dataEstadisticas.datos) {
                dataEstadisticas.datos.forEach(stat => {
                    estadisticasMap.set(stat.IdUsuario, stat);
                });
            }
            
            mostrarMeseros(meserosFiltrados, estadisticasMap);
            actualizarEstadisticas(meserosFiltrados);
        } else {
            console.error('Error al cargar meseros:', dataUsuarios.mensaje);
            mostrarMensajeVacio('Error al cargar los datos');
        }
    } catch (error) {
        console.error('Error en la petición:', error);
        mostrarMensajeVacio('Error al conectar con el servidor');
    }
}

// Mostrar meseros en la tabla
function mostrarMeseros(meseros, estadisticasMap = new Map()) {
    const tbody = document.getElementById('tablaMeseros');
    
    if (!meseros || meseros.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-inbox" style="font-size: 3rem; color: #666;"></i>
                    <p>No se encontraron meseros</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = meseros.map(mesero => {
        const estadoClass = mesero.estado === 'activo' ? 'badge-activo' : 'badge-inactivo';
        const estadoIcon = mesero.estado === 'activo' ? 'fa-check-circle' : 'fa-times-circle';
        
        // Obtener estadísticas reales o valores por defecto
        const stats = estadisticasMap.get(mesero.idUsuario) || {
            MesasAsignadas: 0,
            PedidosHoy: 0,
            PropinasMes: 0.00
        };
        
        const mesasAsignadas = stats.MesasAsignadas || 0;
        const pedidosHoy = stats.PedidosHoy || 0;
        const propinasMes = parseFloat(stats.PropinasMes || 0).toFixed(2);
        const turno = Math.random() > 0.5 ? 'Mañana' : 'Tarde'; // TODO: agregar campo Turno en BD
        
        return `
            <tr>
                <td>
                    <div class="usuario-info">
                        <div class="avatar"><i class="fas fa-utensils"></i></div>
                        <div>
                            <strong>${mesero.nombreCompleto}</strong><br>
                            <small><i class="fas fa-id-card"></i> DNI: ${mesero.dni}</small><br>
                            <small><i class="fas fa-user"></i> ${mesero.nombreUsuario}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge badge-info"><i class="fas fa-store"></i> Principal</span></td>
                <td style="text-align: center;">
                    <strong style="font-size: 1.2rem; color: #2196F3;">${mesasAsignadas}</strong><br>
                    <small>mesas</small>
                </td>
                <td style="text-align: center;">
                    <strong style="font-size: 1.2rem; color: #4CAF50;">${pedidosHoy}</strong><br>
                    <small>pedidos</small>
                </td>
                <td style="text-align: center;">
                    <strong style="font-size: 1.2rem; color: #FF9800;">S/. ${propinasMes}</strong><br>
                    <small>este mes</small>
                </td>
                <td>
                    <span class="badge ${turno === 'Mañana' ? 'badge-warning' : 'badge-info'}">
                        <i class="fas fa-clock"></i> ${turno}
                    </span>
                </td>
                <td style="text-align: center;">
                    <span class="badge ${estadoClass}"><i class="fas ${estadoIcon}"></i> ${mesero.estado}</span>
                </td>
                <td style="text-align: center;">
                    <div class="action-buttons">
                        <button class="btn-icon btn-info" onclick="verDetallesMesero(${mesero.idUsuario})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-warning" onclick="editarMesero(${mesero.idUsuario})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-danger" onclick="cambiarEstadoMesero(${mesero.idUsuario}, '${mesero.estado}')" title="${mesero.estado === 'activo' ? 'Desactivar' : 'Activar'}">
                            <i class="fas fa-${mesero.estado === 'activo' ? 'ban' : 'check'}"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function actualizarEstadisticas(meseros) {
    const total = meseros.length;
    const activos = meseros.filter(m => m.estado === 'activo').length;
    document.getElementById('totalMeseros').textContent = total;
    document.getElementById('meserosActivos').textContent = activos;
    document.getElementById('meserosEnServicio').textContent = Math.floor(activos * 0.6);
    document.getElementById('promedioPedidos').textContent = total > 0 ? Math.floor(Math.random() * 10) + 15 : 0;
}

function mostrarMensajeVacio(mensaje) {
    document.getElementById('tablaMeseros').innerHTML = `
        <tr><td colspan="8" style="text-align: center; padding: 2rem;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff9800;"></i>
            <p>${mensaje}</p>
        </td></tr>
    `;
}

function filtrarMeseros() {
    const busqueda = document.getElementById('buscarMesero').value.toLowerCase();
    const estadoFiltro = document.getElementById('filtroEstado').value;
    
    let resultado = todosLosUsuarios.filter(usuario => 
        usuario.nombrePerfil.toLowerCase() === 'mesero'
    );
    
    if (busqueda) {
        resultado = resultado.filter(mesero => 
            mesero.nombreCompleto.toLowerCase().includes(busqueda) ||
            mesero.dni.includes(busqueda) ||
            mesero.nombreUsuario.toLowerCase().includes(busqueda)
        );
    }
    
    if (estadoFiltro) {
        resultado = resultado.filter(mesero => mesero.estado === estadoFiltro);
    }
    
    meserosFiltrados = resultado;
    mostrarMeseros(resultado);
    actualizarEstadisticas(resultado);
}

function verDetallesMesero(idUsuario) {
    const mesero = todosLosUsuarios.find(u => u.idUsuario === idUsuario);
    if (mesero) {
        alert(`DETALLES DEL MESERO\n\nNombre: ${mesero.nombreCompleto}\nUsuario: ${mesero.nombreUsuario}\nDNI: ${mesero.dni}\nTeléfono: ${mesero.telefono}\nEmail: ${mesero.email || 'No especificado'}\nEstado: ${mesero.estado}`);
    }
}

function editarMesero(idUsuario) {
    window.location.href = `../html/registrar_usuario.html?editar=${idUsuario}`;
}

async function cambiarEstadoMesero(idUsuario, estadoActual) {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    if (!confirm(`¿Está seguro que desea ${nuevoEstado === 'activo' ? 'activar' : 'desactivar'} este mesero?`)) {
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
            cargarMeseros();
        } else {
            alert('❌ Error: ' + data.mensaje);
        }
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        alert('❌ Error de conexión al servidor');
    }
}

function exportarMeseros() {
    if (meserosFiltrados.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    let csv = 'ID,Nombre Completo,DNI,Usuario,Teléfono,Email,Estado\n';
    meserosFiltrados.forEach(mesero => {
        csv += `${mesero.idUsuario},"${mesero.nombreCompleto}",${mesero.dni},${mesero.nombreUsuario},${mesero.telefono},"${mesero.email || ''}",${mesero.estado}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `meseros_${new Date().toISOString().split('T')[0]}.csv`);
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
            // Permitir navegación normal
            // No prevenir default para permitir navegación
            console.log('Navegando a:', this.href);
        });
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar fecha y hora inmediatamente
    actualizarFechaHora();
    
    // Actualizar cada segundo
    setInterval(actualizarFechaHora, 1000);
    
    // Inicializar navegación de pestañas
    inicializarNavegacionTabs();
    
    // Cargar meseros
    cargarMeseros();
    
    // Event listeners
    const buscarInput = document.getElementById('buscarMesero');
    const estadoSelect = document.getElementById('filtroEstado');
    const btnBuscar = document.getElementById('btnBuscar');
    
    if (buscarInput) buscarInput.addEventListener('input', filtrarMeseros);
    if (estadoSelect) estadoSelect.addEventListener('change', filtrarMeseros);
    if (btnBuscar) btnBuscar.addEventListener('click', filtrarMeseros);
});

