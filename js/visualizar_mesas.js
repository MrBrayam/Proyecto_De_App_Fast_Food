/* ============================================
   VISUALIZAR MESAS - FUNCIONALIDADES COMPLETAS
   Vista de tarjetas con filtros y modal de detalles
   ============================================ */

// Base de datos de mesas (se obtiene del LocalStorage)
let mesasDB = [];
let mesaSeleccionada = null;
let filtroActual = 'todos';
let busquedaActual = '';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    inicializar();
});

function inicializar() {
    // Actualizar fecha y hora
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Cargar mesas del LocalStorage
    cargarMesasDesdeStorage();
    
    // Event Listeners
    document.getElementById('searchMesa').addEventListener('input', buscarMesas);
    document.getElementById('sortMesas').addEventListener('change', ordenarMesas);
    
    // Filtros de estado
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filtroActual = this.dataset.estado;
            aplicarFiltros();
        });
    });
    
    // Renderizar mesas
    renderizarMesas();
    actualizarContadores();
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
    
    const fecha = ahora.toLocaleDateString('es-ES', opciones);
    const hora = ahora.toLocaleTimeString('es-ES');
    
    document.getElementById('fecha-actual').textContent = fecha;
    document.getElementById('hora-actual').textContent = hora;
}

// Cargar mesas desde LocalStorage o base de datos
function cargarMesasDesdeStorage() {
    // Las mesas se cargan desde la base de datos
    // mesasDB = await fetch('/api/mesas').then(r => r.json());
    
    const mesasGuardadas = localStorage.getItem('mesas');
    if (mesasGuardadas) {
        mesasDB = JSON.parse(mesasGuardadas);
    } else {
        mesasDB = [];
    }
}

// Renderizar todas las mesas como tarjetas
function renderizarMesas(mesas = null) {
    const mesasGrid = document.getElementById('mesasGrid');
    const noResultados = document.getElementById('noResultados');
    const listaMesas = mesas || mesasDB;
    
    mesasGrid.innerHTML = '';
    
    if (listaMesas.length === 0) {
        noResultados.style.display = 'flex';
        mesasGrid.style.display = 'none';
        return;
    }
    
    noResultados.style.display = 'none';
    mesasGrid.style.display = 'grid';
    
    listaMesas.forEach(mesa => {
        const card = crearTarjetaMesa(mesa);
        mesasGrid.appendChild(card);
    });
}

// Crear tarjeta de mesa
function crearTarjetaMesa(mesa) {
    const card = document.createElement('div');
    card.className = `mesa-card ${mesa.estado}`;
    card.onclick = () => mostrarDetalles(mesa.id);
    
    // Determinar texto del estado
    let estadoTexto = mesa.estado.charAt(0).toUpperCase() + mesa.estado.slice(1);
    
    // Iconos de características
    const caracteristicas = `
        <div class="caracteristica-icon ${mesa.fumadores ? 'active' : ''}" title="${mesa.fumadores ? 'Permite fumadores' : 'No fumadores'}">
            <i class="fas fa-smoking"></i>
        </div>
        <div class="caracteristica-icon ${mesa.reservable ? 'active' : ''}" title="${mesa.reservable ? 'Reservable' : 'No reservable'}">
            <i class="fas fa-calendar-check"></i>
        </div>
        <div class="caracteristica-icon ${mesa.exterior ? 'active' : ''}" title="${mesa.exterior ? 'Exterior' : 'Interior'}">
            <i class="fas fa-tree"></i>
        </div>
        <div class="caracteristica-icon ${mesa.accesible ? 'active' : ''}" title="${mesa.accesible ? 'Accesible' : 'No accesible'}">
            <i class="fas fa-wheelchair"></i>
        </div>
    `;
    
    // Prioridad
    const prioridadClass = mesa.prioridad === 'vip' ? 'vip' : '';
    const prioridadIcon = mesa.prioridad === 'vip' ? 'fa-crown' : 'fa-flag';
    const prioridadTexto = mesa.prioridad === 'vip' ? 'VIP' : 'Normal';
    
    card.innerHTML = `
        <div class="mesa-card-header">
            <div class="mesa-numero">Mesa #${mesa.numeroMesa}</div>
            <div class="mesa-estado-badge ${mesa.estado}">${estadoTexto}</div>
        </div>
        
        <div class="mesa-card-body">
            <div class="mesa-info-item">
                <i class="fas fa-users"></i>
                <span>Capacidad: <strong>${mesa.capacidad} personas</strong></span>
            </div>
            <div class="mesa-info-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${mesa.ubicacion}</span>
            </div>
            <div class="mesa-info-item">
                <i class="fas fa-shapes"></i>
                <span>Tipo: <strong>${mesa.tipo.charAt(0).toUpperCase() + mesa.tipo.slice(1)}</strong></span>
            </div>
            
            <div class="mesa-caracteristicas">
                ${caracteristicas}
            </div>
        </div>
        
        <div class="mesa-card-footer">
            <div class="mesa-prioridad ${prioridadClass}">
                <i class="fas ${prioridadIcon}"></i>
                <span>${prioridadTexto}</span>
            </div>
            <button class="mesa-ver-detalles" onclick="event.stopPropagation(); mostrarDetalles(${mesa.id})">
                Ver más <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
    
    return card;
}

// Mostrar modal de detalles
function mostrarDetalles(id) {
    const mesa = mesasDB.find(m => m.id === id);
    if (!mesa) return;
    
    mesaSeleccionada = mesa;
    
    // Llenar datos en el modal
    document.getElementById('detalle-numero').textContent = `#${mesa.numeroMesa}`;
    document.getElementById('detalle-capacidad').textContent = `${mesa.capacidad} personas`;
    document.getElementById('detalle-ubicacion').textContent = mesa.ubicacion;
    document.getElementById('detalle-tipo').textContent = mesa.tipo.charAt(0).toUpperCase() + mesa.tipo.slice(1);
    
    // Estado
    const estadoBadge = document.createElement('span');
    estadoBadge.className = `mesa-estado-badge ${mesa.estado}`;
    estadoBadge.textContent = mesa.estado.charAt(0).toUpperCase() + mesa.estado.slice(1);
    document.getElementById('detalle-estado').innerHTML = '';
    document.getElementById('detalle-estado').appendChild(estadoBadge);
    
    // Prioridad
    const prioridadText = mesa.prioridad === 'vip' ? 'VIP ⭐' : 'Normal';
    document.getElementById('detalle-prioridad').textContent = prioridadText;
    
    // Características
    const caracteristicasHTML = `
        <div class="caracteristica-badge ${mesa.fumadores ? 'activa' : 'inactiva'}">
            <i class="fas fa-smoking"></i>
            ${mesa.fumadores ? 'Permite fumadores' : 'No fumadores'}
        </div>
        <div class="caracteristica-badge ${mesa.reservable ? 'activa' : 'inactiva'}">
            <i class="fas fa-calendar-check"></i>
            ${mesa.reservable ? 'Reservable' : 'No reservable'}
        </div>
        <div class="caracteristica-badge ${mesa.exterior ? 'activa' : 'inactiva'}">
            <i class="fas fa-tree"></i>
            ${mesa.exterior ? 'Exterior' : 'Interior'}
        </div>
        <div class="caracteristica-badge ${mesa.accesible ? 'activa' : 'inactiva'}">
            <i class="fas fa-wheelchair"></i>
            ${mesa.accesible ? 'Accesible' : 'No accesible'}
        </div>
    `;
    document.getElementById('detalle-caracteristicas').innerHTML = caracteristicasHTML;
    
    // Observaciones
    document.getElementById('detalle-observaciones').textContent = mesa.observaciones || 'Sin observaciones';
    
    // Mostrar modal
    document.getElementById('modalDetalles').classList.add('active');
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modalDetalles').classList.remove('active');
    mesaSeleccionada = null;
}

// Editar mesa (redirige a registrar mesas)
function editarMesa() {
    if (mesaSeleccionada) {
        // Guardar ID de la mesa a editar en sessionStorage
        sessionStorage.setItem('editarMesaId', mesaSeleccionada.id);
        window.location.href = 'registrar_mesas.html';
    }
}

// Buscar mesas
function buscarMesas() {
    busquedaActual = document.getElementById('searchMesa').value.toLowerCase();
    aplicarFiltros();
}

// Aplicar filtros
function aplicarFiltros() {
    let mesasFiltradas = mesasDB;
    
    // Filtro por estado
    if (filtroActual !== 'todos') {
        mesasFiltradas = mesasFiltradas.filter(m => m.estado === filtroActual);
    }
    
    // Filtro por búsqueda
    if (busquedaActual) {
        mesasFiltradas = mesasFiltradas.filter(m => {
            return m.numeroMesa.toLowerCase().includes(busquedaActual) ||
                   m.ubicacion.toLowerCase().includes(busquedaActual) ||
                   m.tipo.toLowerCase().includes(busquedaActual) ||
                   m.estado.toLowerCase().includes(busquedaActual);
        });
    }
    
    renderizarMesas(mesasFiltradas);
}

// Ordenar mesas
function ordenarMesas() {
    const criterio = document.getElementById('sortMesas').value;
    let mesasOrdenadas = [...mesasDB];
    
    switch(criterio) {
        case 'numero':
            mesasOrdenadas.sort((a, b) => a.numeroMesa.localeCompare(b.numeroMesa));
            break;
        case 'capacidad':
            mesasOrdenadas.sort((a, b) => b.capacidad - a.capacidad);
            break;
        case 'ubicacion':
            mesasOrdenadas.sort((a, b) => a.ubicacion.localeCompare(b.ubicacion));
            break;
        case 'estado':
            mesasOrdenadas.sort((a, b) => a.estado.localeCompare(b.estado));
            break;
    }
    
    mesasDB = mesasOrdenadas;
    aplicarFiltros();
}

// Actualizar contadores
function actualizarContadores() {
    const todas = mesasDB.length;
    const disponibles = mesasDB.filter(m => m.estado === 'disponible').length;
    const ocupadas = mesasDB.filter(m => m.estado === 'ocupada').length;
    const reservadas = mesasDB.filter(m => m.estado === 'reservada').length;
    const mantenimiento = mesasDB.filter(m => m.estado === 'mantenimiento').length;
    
    document.getElementById('count-todas').textContent = todas;
    document.getElementById('count-disponibles').textContent = disponibles;
    document.getElementById('count-ocupadas').textContent = ocupadas;
    document.getElementById('count-reservadas').textContent = reservadas;
    document.getElementById('count-mantenimiento').textContent = mantenimiento;
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('modalDetalles');
    if (event.target === modal) {
        cerrarModal();
    }
}

// Exportar funciones globales
window.mostrarDetalles = mostrarDetalles;
window.cerrarModal = cerrarModal;
window.editarMesa = editarMesa;
