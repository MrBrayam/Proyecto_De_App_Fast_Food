/* ============================================
   JAVASCRIPT PARA VER REPARTIDORES
   Maneja la visualización y gestión de usuarios repartidores
   ============================================ */

let todosLosUsuarios = [];
let repartidoresFiltrados = [];

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

async function cargarRepartidores() {
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/usuarios/listar');
        const data = await response.json();
        
        if (data.exito && data.usuarios) {
            todosLosUsuarios = data.usuarios;
            repartidoresFiltrados = todosLosUsuarios.filter(usuario => 
                usuario.nombrePerfil.toLowerCase() === 'repartidor'
            );
            
            mostrarRepartidores(repartidoresFiltrados);
            actualizarEstadisticas(repartidoresFiltrados);
        } else {
            mostrarMensajeVacio('Error al cargar los datos');
        }
    } catch (error) {
        mostrarMensajeVacio('Error al conectar con el servidor');
    }
}

function mostrarRepartidores(repartidores) {
    const tbody = document.getElementById('tablaRepartidores');
    
    if (!repartidores || repartidores.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem;">
            <i class="fas fa-inbox" style="font-size: 3rem; color: #666;"></i>
            <p>No se encontraron repartidores</p></td></tr>`;
        return;
    }
    
    tbody.innerHTML = repartidores.map(repartidor => {
        const estadoClass = repartidor.estado === 'activo' ? 'badge-activo' : 'badge-inactivo';
        const estadoIcon = repartidor.estado === 'activo' ? 'fa-check-circle' : 'fa-times-circle';
        const vehiculos = ['Moto Honda', 'Moto Yamaha', 'Moto Suzuki', 'Bicicleta'];
        const vehiculo = vehiculos[Math.floor(Math.random() * vehiculos.length)];
        const pedidosHoy = Math.floor(Math.random() * 30) + 5;
        const propinasHoy = (Math.random() * 100 + 20).toFixed(2);
        const turno = Math.random() > 0.5 ? 'Mañana' : 'Tarde';
        
        return `
            <tr>
                <td>
                    <div class="usuario-info">
                        <div class="avatar"><i class="fas fa-motorcycle"></i></div>
                        <div>
                            <strong>${repartidor.nombreCompleto}</strong><br>
                            <small><i class="fas fa-id-card"></i> DNI: ${repartidor.dni}</small><br>
                            <small><i class="fas fa-user"></i> ${repartidor.nombreUsuario}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge badge-info"><i class="fas fa-store"></i> Principal</span></td>
                <td style="text-align: center;">
                    <i class="fas fa-${vehiculo.includes('Moto') ? 'motorcycle' : 'bicycle'}" style="font-size: 1.5rem; color: #2196F3;"></i><br>
                    <small>${vehiculo}</small>
                </td>
                <td style="text-align: center;">
                    <strong style="font-size: 1.2rem; color: #4CAF50;">${pedidosHoy}</strong><br>
                    <small>pedidos</small>
                </td>
                <td style="text-align: center;">
                    <strong style="font-size: 1.2rem; color: #FF9800;">S/. ${propinasHoy}</strong>
                </td>
                <td>
                    <span class="badge ${turno === 'Mañana' ? 'badge-warning' : 'badge-info'}">
                        <i class="fas fa-clock"></i> ${turno}
                    </span>
                </td>
                <td style="text-align: center;">
                    <span class="badge ${estadoClass}"><i class="fas ${estadoIcon}"></i> ${repartidor.estado}</span>
                </td>
                <td style="text-align: center;">
                    <div class="action-buttons">
                        <button class="btn-icon btn-info" onclick="verDetallesRepartidor(${repartidor.idUsuario})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-warning" onclick="editarRepartidor(${repartidor.idUsuario})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-danger" onclick="cambiarEstadoRepartidor(${repartidor.idUsuario}, '${repartidor.estado}')" title="${repartidor.estado === 'activo' ? 'Desactivar' : 'Activar'}">
                            <i class="fas fa-${repartidor.estado === 'activo' ? 'ban' : 'check'}"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function actualizarEstadisticas(repartidores) {
    const total = repartidores.length;
    const activos = repartidores.filter(r => r.estado === 'activo').length;
    document.getElementById('totalRepartidores').textContent = total;
    document.getElementById('repartidoresActivos').textContent = activos;
    document.getElementById('repartidoresEnRuta').textContent = Math.floor(activos * 0.5);
    document.getElementById('totalPedidosHoy').textContent = total > 0 ? Math.floor(Math.random() * 150) + 50 : 0;
}

function mostrarMensajeVacio(mensaje) {
    document.getElementById('tablaRepartidores').innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff9800;"></i>
        <p>${mensaje}</p></td></tr>`;
}

function filtrarRepartidores() {
    const busqueda = document.getElementById('buscarRepartidor').value.toLowerCase();
    const estadoFiltro = document.getElementById('filtroEstado').value;
    
    let resultado = todosLosUsuarios.filter(usuario => usuario.nombrePerfil.toLowerCase() === 'repartidor');
    
    if (busqueda) {
        resultado = resultado.filter(repartidor => 
            repartidor.nombreCompleto.toLowerCase().includes(busqueda) ||
            repartidor.dni.includes(busqueda) ||
            repartidor.nombreUsuario.toLowerCase().includes(busqueda)
        );
    }
    
    if (estadoFiltro) {
        resultado = resultado.filter(repartidor => repartidor.estado === estadoFiltro);
    }
    
    repartidoresFiltrados = resultado;
    mostrarRepartidores(resultado);
    actualizarEstadisticas(resultado);
}

function verDetallesRepartidor(idUsuario) {
    const repartidor = todosLosUsuarios.find(u => u.idUsuario === idUsuario);
    if (repartidor) {
        alert(`DETALLES DEL REPARTIDOR\n\nNombre: ${repartidor.nombreCompleto}\nUsuario: ${repartidor.nombreUsuario}\nDNI: ${repartidor.dni}\nTeléfono: ${repartidor.telefono}\nEmail: ${repartidor.email || 'No especificado'}\nEstado: ${repartidor.estado}`);
    }
}

function editarRepartidor(idUsuario) {
    alert(`Función de edición en desarrollo.\nID: ${idUsuario}`);
}

function cambiarEstadoRepartidor(idUsuario, estadoActual) {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    if (confirm(`¿Está seguro que desea ${nuevoEstado === 'activo' ? 'activar' : 'desactivar'} este repartidor?`)) {
        alert(`Función de cambio de estado en desarrollo.`);
    }
}

function exportarRepartidores() {
    if (repartidoresFiltrados.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    let csv = 'ID,Nombre Completo,DNI,Usuario,Teléfono,Email,Estado\n';
    repartidoresFiltrados.forEach(repartidor => {
        csv += `${repartidor.idUsuario},"${repartidor.nombreCompleto}",${repartidor.dni},${repartidor.nombreUsuario},${repartidor.telefono},"${repartidor.email || ''}",${repartidor.estado}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `repartidores_${new Date().toISOString().split('T')[0]}.csv`);
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

document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    
    setInterval(actualizarFechaHora, 1000);
    
    // Inicializar navegación de pestañas
    inicializarNavegacionTabs();
    
    cargarRepartidores();
    
    const buscarInput = document.getElementById('buscarRepartidor');
    const estadoSelect = document.getElementById('filtroEstado');
    const btnBuscar = document.getElementById('btnBuscar');
    
    if (buscarInput) buscarInput.addEventListener('input', filtrarRepartidores);
    if (estadoSelect) estadoSelect.addEventListener('change', filtrarRepartidores);
    if (btnBuscar) btnBuscar.addEventListener('click', filtrarRepartidores);
});

