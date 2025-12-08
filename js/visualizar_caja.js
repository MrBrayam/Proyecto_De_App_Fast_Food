// ===== VISUALIZAR CAJAS - LÓGICA =====

const API_BASE = '/Proyecto_De_App_Fast_Food/api';
let cajas = [];

document.addEventListener('DOMContentLoaded', () => {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    cargarCajas();
    inicializarEventos();
});

function actualizarFechaHora() {
    const ahora = new Date();
    const fechaElement = document.getElementById('currentDate');
    if (fechaElement) {
        const fechaFormateada = ahora.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const horaFormateada = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        fechaElement.textContent = `${fechaFormateada} ${horaFormateada}`;
    }
}

function inicializarEventos() {
    const btnBuscar = document.querySelector('.btn-buscar');
    const fechaBusqueda = document.getElementById('fechaBusqueda');
    const btnVolver = document.getElementById('btnVolver');

    if (btnBuscar && fechaBusqueda) {
        btnBuscar.addEventListener('click', () => filtrarPorFecha(fechaBusqueda.value));
    }

    if (fechaBusqueda) {
        fechaBusqueda.addEventListener('change', () => filtrarPorFecha(fechaBusqueda.value));
    }

    if (btnVolver) {
        btnVolver.addEventListener('click', () => window.location.href = '/Proyecto_De_App_Fast_Food/html/menu_principal.html');
    }
}

async function cargarCajas() {
    try {
        const resp = await fetch(`${API_BASE}/caja/listar`);
        const data = await resp.json();

        if (!resp.ok || !data.exito || !data.items) {
            throw new Error(data.mensaje || 'No se pudo cargar cajas');
        }

        cajas = data.items;
        renderTabla(cajas);
    } catch (err) {
        console.error(err);
        renderTabla([]);
    }
}

function filtrarPorFecha(fecha) {
    if (!fecha) {
        renderTabla(cajas);
        return;
    }

    const filtradas = cajas.filter(c => (c.Fecha || c.FechaApertura || '').startsWith(fecha));
    renderTabla(filtradas);
}

function renderTabla(data) {
    const tbody = document.getElementById('tablaCajasBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!data || data.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="8" style="text-align:center; padding:14px;">Sin resultados</td>';
        tbody.appendChild(tr);
        return;
    }

    data.forEach(caja => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${caja.CodCaja || ''}</td>
            <td>${caja.NombreUsuario || caja.Usuario || ''}</td>
            <td>S/ ${Number(caja.MontoInicial || 0).toFixed(2)}</td>
            <td>${caja.MontoFinal !== null && caja.MontoFinal !== undefined ? 'S/ ' + Number(caja.MontoFinal).toFixed(2) : '-'}</td>
            <td>${formatearFecha(caja.Fecha || caja.FechaApertura)}</td>
            <td>${caja.HoraApertura || ''}</td>
            <td>${badgeEstado(caja.Estado)}</td>
            <td>${caja.Turno || ''}</td>
        `;
        tbody.appendChild(tr);
    });
}

function formatearFecha(fecha) {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES');
}

function badgeEstado(estado) {
    const est = (estado || '').toLowerCase();
    if (est === 'abierta') return '<span class="estado-badge estado-abierta">Abierta</span>';
    if (est === 'cerrada') return '<span class="estado-badge estado-cerrada">Cerrada</span>';
    return `<span class="estado-badge">${estado || ''}</span>`;
}
