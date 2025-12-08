let platosOriginal = [];
let platosFiltrados = [];

document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);

    const btnBuscar = document.getElementById('btnBuscar');
    const inputBuscar = document.getElementById('inputBuscar');
    const selectFiltro = document.getElementById('selectFiltro');
    const btnRegistrar = document.getElementById('btnRegistrar');

    if (btnBuscar) btnBuscar.addEventListener('click', filtrarPlatos);
    if (inputBuscar) inputBuscar.addEventListener('input', filtrarPlatos);
    if (selectFiltro) selectFiltro.addEventListener('change', filtrarPlatos);
    if (btnRegistrar) btnRegistrar.addEventListener('click', () => {
        window.location.href = 'registrar_platos.html';
    });

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
        card.innerHTML = `
            <div class="plato-imagen">
                <img src="https://via.placeholder.com/200/ff8c00/ffffff?text=🍕" alt="${plato.Nombre || 'Plato'}">
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
                    <span class="plato-cantidad"><i class="fas fa-boxes"></i> Stock: ${plato.Cantidad ?? 0}</span>
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
    document.getElementById('detalleCodigo').textContent = plato.CodPlato || '-';
    document.getElementById('detalleNombre').textContent = plato.Nombre || '-';
    document.getElementById('detalleTamano').textContent = plato.Tamano || '-';
    document.getElementById('detallePrecio').textContent = `S/ ${(plato.Precio ?? 0).toFixed(2)}`;
    document.getElementById('detalleCantidad').textContent = plato.Cantidad ?? '-';
    document.getElementById('detalleDescripcion').textContent = plato.Descripcion || '-';
    document.getElementById('detalleIngredientes').textContent = plato.Ingredientes || '-';

    const modal = document.getElementById('modalDetalle');
    if (modal) {
        modal.classList.add('active');
    }
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
