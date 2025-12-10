let platosOriginal = [];
let platosFiltrados = [];
let platoSeleccionado = null;

document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);

    const btnBuscar = document.getElementById('btnBuscar');
    const inputBuscar = document.getElementById('inputBuscar');
    const selectFiltro = document.getElementById('selectFiltro');
    const btnRegistrar = document.getElementById('btnRegistrar');
    const btnEditarDetalle = document.getElementById('btnEditarDetalle');

    if (btnBuscar) btnBuscar.addEventListener('click', filtrarPlatos);
    if (inputBuscar) inputBuscar.addEventListener('input', filtrarPlatos);
    if (selectFiltro) selectFiltro.addEventListener('change', filtrarPlatos);
    if (btnRegistrar) btnRegistrar.addEventListener('click', () => {
        window.location.href = 'registrar_platos.html';
    });
    if (btnEditarDetalle) btnEditarDetalle.addEventListener('click', editarPlatoSeleccionado);

    cargarPlatos();
});

function actualizarFechaHora() {
    const ahora = new Date();
    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const opcionesHora = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const fechaFormateada = ahora.toLocaleDateString('es-ES', opcionesFecha);
    const horaFormateada = ahora.toLocaleTimeString('es-ES', opcionesHora);
    const fechaElement = document.getElementById('currentDate');
    if (fechaElement) {
        fechaElement.textContent = `${fechaFormateada} ${horaFormateada}`;
    }
}

async function cargarPlatos() {
    try {
        const resp = await fetch('/Proyecto_De_App_Fast_Food/api/platos/listar');
        const data = await resp.json();

        if (data.exito) {
            platosOriginal = data.platos || [];
            platosFiltrados = [...platosOriginal];
            renderizarPlatos(platosFiltrados);
        } else {
            mostrarVacio();
        }
    } catch (error) {
        console.error('Error cargando platos:', error);
        mostrarVacio();
    }
}

function filtrarPlatos() {
    const termino = (document.getElementById('inputBuscar')?.value || '').toLowerCase();
    const filtro = document.getElementById('selectFiltro')?.value || 'nombre';

    platosFiltrados = platosOriginal.filter(plato => {
        const mapa = {
            nombre: plato.Nombre || '',
            codigo: plato.CodPlato || '',
            tamano: plato.Tamano || '',
            precio: String(plato.Precio ?? ''),
            cantidad: String(plato.Cantidad ?? '')
        };
        const valor = (mapa[filtro] || '').toString().toLowerCase();
        return valor.includes(termino);
    });

    renderizarPlatos(platosFiltrados);
}

function renderizarPlatos(lista) {
    const grid = document.getElementById('platosGrid');
    const empty = document.getElementById('emptyState');
    if (!grid) return;

    grid.innerHTML = '';

    if (!lista || lista.length === 0) {
        if (empty) empty.hidden = false;
        return;
    }
    if (empty) empty.hidden = true;

    lista.forEach(plato => {
        const card = document.createElement('div');
        card.className = 'plato-card';
        
        // Verificar si el stock está bajo
        const cantidad = parseInt(plato.Cantidad || 0);
        const stockMinimo = parseInt(plato.StockMinimo || 10);
        const stockBajo = cantidad <= stockMinimo;
        
        // Agregar clase si stock bajo
        if (stockBajo) {
            card.classList.add('stock-bajo');
        }
        
        // Usar imagen local si existe, sino usar ícono de pizza
        const imagenSrc = plato.RutaImg ? plato.RutaImg : 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 font-size=%2250%22 dominant-baseline=%22middle%22%3E%F0%9F%8D%95%3C/text%3E%3C/svg%3E';
        
        // Crear badge de alerta si stock bajo
        const stockBadge = stockBajo ? `<div class="stock-alert-badge"><i class="fas fa-exclamation-triangle"></i> Stock Bajo</div>` : '';
        
        card.innerHTML = `
            ${stockBadge}
            <div class="plato-imagen">
                <img src="${imagenSrc}" alt="${plato.Nombre || 'Plato'}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 font-size=%2250%22 dominant-baseline=%22middle%22%3E%F0%9F%8D%95%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="plato-info">
                <div class="plato-header">
                    <h3 class="plato-nombre">${plato.Nombre || '-'}</h3>
                    <span class="plato-codigo">${plato.CodPlato || '-'}</span>
                </div>
                <p class="plato-descripcion">${plato.Descripcion || 'Sin descripción'}</p>
                <div class="plato-ingredientes">
                    <strong>Ingredientes:</strong> ${plato.Ingredientes || 'No especificados'}
                </div>
                <div class="plato-detalles">
                    <span class="plato-tamano"><i class="fas fa-pizza-slice"></i> ${plato.Tamano || '-'}</span>
                    <span class="plato-precio"><i class="fas fa-tag"></i> S/. ${(plato.Precio ?? 0).toFixed(2)}</span>
                    <span class="plato-cantidad ${stockBajo ? 'stock-bajo-text' : ''}">
                        <i class="fas fa-boxes"></i> Stock: ${cantidad}/${stockMinimo}
                    </span>
                </div>
                <div class="plato-acciones">
                    <button class="btn-ver-detalles" data-cod="${plato.CodPlato}" title="Ver detalles">
                        <i class="fas fa-eye"></i> Ver Detalles
                    </button>
                </div>
            </div>
        `;

        const btn = card.querySelector('.btn-ver-detalles');
        if (btn) {
            btn.addEventListener('click', () => verDetalles(plato));
        }

        grid.appendChild(card);
    });
}

function verDetalles(plato) {
    platoSeleccionado = plato;
    document.getElementById('detalleCodigo').textContent = plato.CodPlato || '-';
    document.getElementById('detalleNombre').textContent = plato.Nombre || '-';
    document.getElementById('detalleTamano').textContent = plato.Tamano || '-';
    document.getElementById('detallePrecio').textContent = `S/ ${(plato.Precio ?? 0).toFixed(2)}`;
    
    const cantidad = parseInt(plato.Cantidad || 0);
    const stockMinimo = parseInt(plato.StockMinimo || 10);
    const detallesCantidad = document.getElementById('detalleCantidad');
    detallesCantidad.textContent = `${cantidad} / ${stockMinimo}`;
    
    // Aplicar color si stock bajo
    if (cantidad <= stockMinimo) {
        detallesCantidad.style.color = '#ff6b6b';
        detallesCantidad.style.fontWeight = 'bold';
    } else {
        detallesCantidad.style.color = '';
        detallesCantidad.style.fontWeight = '';
    }
    
    document.getElementById('detalleDescripcion').textContent = plato.Descripcion || '-';
    document.getElementById('detalleIngredientes').textContent = plato.Ingredientes || '-';

    const modal = document.getElementById('modalDetalle');
    if (modal) {
        modal.classList.add('active');
    }
}

function editarPlatoSeleccionado() {
    if (!platoSeleccionado) return;

    try {
        sessionStorage.setItem('platoEditando', JSON.stringify(platoSeleccionado));
    } catch (error) {
        console.error('No se pudo guardar el plato en sesión:', error);
    }

    window.location.href = 'registrar_platos.html?editar=' + encodeURIComponent(platoSeleccionado.CodPlato || '');
}

function cerrarModal() {
    const modal = document.getElementById('modalDetalle');
    if (modal) {
        modal.classList.remove('active');
    }
}

function mostrarVacio() {
    const grid = document.getElementById('platosGrid');
    const empty = document.getElementById('emptyState');
    if (grid) grid.innerHTML = '';
    if (empty) empty.hidden = false;
}
