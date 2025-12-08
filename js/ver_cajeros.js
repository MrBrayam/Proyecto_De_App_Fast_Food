/* ============================================
   JAVASCRIPT PARA VER CAJEROS
   Maneja la visualización y gestión de usuarios cajeros
   ============================================ */

let todosLosUsuarios = [];
let cajerosFiltrados = [];

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

async function cargarCajeros() {
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/usuarios/listar');
        const data = await response.json();
        
        if (data.exito && data.usuarios) {
            todosLosUsuarios = data.usuarios;
            cajerosFiltrados = todosLosUsuarios.filter(usuario => 
                usuario.nombrePerfil.toLowerCase() === 'cajero'
            );
            
            mostrarCajeros(cajerosFiltrados);
            actualizarEstadisticas(cajerosFiltrados);
        } else {
            mostrarMensajeVacio('Error al cargar los datos');
        }
    } catch (error) {
        mostrarMensajeVacio('Error al conectar con el servidor');
    }
}

function mostrarCajeros(cajeros) {
    const tbody = document.getElementById('tablaCajeros');
    
    if (!cajeros || cajeros.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 2rem;">
            <i class="fas fa-inbox" style="font-size: 3rem; color: #666;"></i>
            <p>No se encontraron cajeros</p></td></tr>`;
        return;
    }
    
    tbody.innerHTML = cajeros.map(cajero => {
        const estadoClass = cajero.estado === 'activo' ? 'badge-activo' : 'badge-inactivo';
        const estadoIcon = cajero.estado === 'activo' ? 'fa-check-circle' : 'fa-times-circle';
        const numeroCaja = Math.floor(Math.random() * 5) + 1;
        const ventasHoy = Math.floor(Math.random() * 50) + 10;
        const montoHoy = (Math.random() * 2000 + 500).toFixed(2);
        const montoMes = (Math.random() * 15000 + 5000).toFixed(2);
        const turno = Math.random() > 0.5 ? 'Mañana' : 'Tarde';
        
        return `
            <tr>
                <td>
                    <div class="usuario-info">
                        <div class="avatar"><i class="fas fa-cash-register"></i></div>
                        <div>
                            <strong>${cajero.nombreCompleto}</strong><br>
                            <small><i class="fas fa-id-card"></i> DNI: ${cajero.dni}</small><br>
                            <small><i class="fas fa-user"></i> ${cajero.nombreUsuario}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge badge-info"><i class="fas fa-store"></i> Principal</span></td>
                <td style="text-align: center;">
                    <strong style="font-size: 1.2rem; color: #2196F3;">Caja ${numeroCaja}</strong>
                </td>
                <td style="text-align: center;">
                    <strong style="font-size: 1.2rem; color: #4CAF50;">${ventasHoy}</strong><br>
                    <small>ventas</small>
                </td>
                <td style="text-align: center;">
                    <strong style="font-size: 1.2rem; color: #4CAF50;">S/. ${montoHoy}</strong>
                </td>
                <td style="text-align: center;">
                    <strong style="font-size: 1.2rem; color: #FF9800;">S/. ${montoMes}</strong>
                </td>
                <td>
                    <span class="badge ${turno === 'Mañana' ? 'badge-warning' : 'badge-info'}">
                        <i class="fas fa-clock"></i> ${turno}
                    </span>
                </td>
                <td style="text-align: center;">
                    <span class="badge ${estadoClass}"><i class="fas ${estadoIcon}"></i> ${cajero.estado}</span>
                </td>
                <td style="text-align: center;">
                    <div class="action-buttons">
                        <button class="btn-icon btn-info" onclick="verDetallesCajero(${cajero.idUsuario})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-warning" onclick="editarCajero(${cajero.idUsuario})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-danger" onclick="cambiarEstadoCajero(${cajero.idUsuario}, '${cajero.estado}')" title="${cajero.estado === 'activo' ? 'Desactivar' : 'Activar'}">
                            <i class="fas fa-${cajero.estado === 'activo' ? 'ban' : 'check'}"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function actualizarEstadisticas(cajeros) {
    const total = cajeros.length;
    const activos = cajeros.filter(c => c.estado === 'activo').length;
    document.getElementById('totalCajeros').textContent = total;
    document.getElementById('cajerosActivos').textContent = activos;
    document.getElementById('cajerosAtendiendo').textContent = Math.floor(activos * 0.7);
    document.getElementById('totalVentas').textContent = total > 0 ? Math.floor(Math.random() * 100) + 50 : 0;
}

function mostrarMensajeVacio(mensaje) {
    document.getElementById('tablaCajeros').innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 2rem;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff9800;"></i>
        <p>${mensaje}</p></td></tr>`;
}

function filtrarCajeros() {
    const busqueda = document.getElementById('buscarCajero').value.toLowerCase();
    const estadoFiltro = document.getElementById('filtroEstado').value;
    
    let resultado = todosLosUsuarios.filter(usuario => usuario.nombrePerfil.toLowerCase() === 'cajero');
    
    if (busqueda) {
        resultado = resultado.filter(cajero => 
            cajero.nombreCompleto.toLowerCase().includes(busqueda) ||
            cajero.dni.includes(busqueda) ||
            cajero.nombreUsuario.toLowerCase().includes(busqueda)
        );
    }
    
    if (estadoFiltro) {
        resultado = resultado.filter(cajero => cajero.estado === estadoFiltro);
    }
    
    cajerosFiltrados = resultado;
    mostrarCajeros(resultado);
    actualizarEstadisticas(resultado);
}

function verDetallesCajero(idUsuario) {
    const cajero = todosLosUsuarios.find(u => u.idUsuario === idUsuario);
    if (cajero) {
        alert(`DETALLES DEL CAJERO\n\nNombre: ${cajero.nombreCompleto}\nUsuario: ${cajero.nombreUsuario}\nDNI: ${cajero.dni}\nTeléfono: ${cajero.telefono}\nEmail: ${cajero.email || 'No especificado'}\nEstado: ${cajero.estado}`);
    }
}

function editarCajero(idUsuario) {
    alert(`Función de edición en desarrollo.\nID: ${idUsuario}`);
}

function cambiarEstadoCajero(idUsuario, estadoActual) {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    if (confirm(`¿Está seguro que desea ${nuevoEstado === 'activo' ? 'activar' : 'desactivar'} este cajero?`)) {
        alert(`Función de cambio de estado en desarrollo.`);
    }
}

function exportarCajeros() {
    if (cajerosFiltrados.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    let csv = 'ID,Nombre Completo,DNI,Usuario,Teléfono,Email,Estado\n';
    cajerosFiltrados.forEach(cajero => {
        csv += `${cajero.idUsuario},"${cajero.nombreCompleto}",${cajero.dni},${cajero.nombreUsuario},${cajero.telefono},"${cajero.email || ''}",${cajero.estado}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `cajeros_${new Date().toISOString().split('T')[0]}.csv`);
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
    
    cargarCajeros();
    
    const buscarInput = document.getElementById('buscarCajero');
    const estadoSelect = document.getElementById('filtroEstado');
    const btnBuscar = document.getElementById('btnBuscar');
    
    if (buscarInput) buscarInput.addEventListener('input', filtrarCajeros);
    if (estadoSelect) estadoSelect.addEventListener('change', filtrarCajeros);
    if (btnBuscar) btnBuscar.addEventListener('click', filtrarCajeros);
});

