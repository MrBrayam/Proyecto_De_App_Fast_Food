// ===== VISUALIZAR CAJAS - LÓGICA =====

let cajas = [];
let ventas = [];

document.addEventListener('DOMContentLoaded', () => {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    cargarCajasYVentas();
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

// Cargar cajas y ventas simultáneamente
async function cargarCajasYVentas() {
    try {
        // Cargar cajas
        const respCajas = await fetch(`${API_BASE}/caja/listar`);
        const dataCajas = await respCajas.json();

        if (!respCajas.ok || !dataCajas.exito || !dataCajas.items) {
            throw new Error(dataCajas.mensaje || 'No se pudo cargar cajas');
        }

        cajas = dataCajas.items;

        // Cargar ventas
        const respVentas = await fetch(`${API_BASE}/ventas/listar`);
        const dataVentas = await respVentas.json();

        if (respVentas.ok && dataVentas.exito) {
            ventas = dataVentas.items || [];
            console.log('Ventas cargadas:', ventas.length);
        } else {
            ventas = [];
            console.warn('No se pudo cargar ventas');
        }

        // Calcular monto final para cada caja
        calcularMontosFinal();
        renderTabla(cajas);
    } catch (err) {
        console.error('Error al cargar cajas y ventas:', err);
        renderTabla([]);
    }
}

// Calcular monto final sumando ventas a monto inicial
function calcularMontosFinal() {
    cajas.forEach(caja => {
        const montoInicial = Number(caja.MontoInicial || 0);
        
        // Sumar todas las ventas realizadas con esta caja
        const ventasCaja = ventas.filter(v => {
            const codCajaVenta = (v.CodCaja || '').toString();
            const codCajaActual = (caja.CodCaja || '').toString();
            return codCajaVenta === codCajaActual;
        });

        // Calcular total de ventas
        const totalVentas = ventasCaja.reduce((sum, venta) => {
            return sum + Number(venta.Total || venta.MontoTotal || venta.Monto || 0);
        }, 0);

        // Monto final = Monto Inicial + Total de Ventas
        caja.MontoFinalCalculado = montoInicial + totalVentas;
        
        console.log(`Caja ${caja.CodCaja}: Inicial=${montoInicial}, Ventas=${totalVentas}, Final=${caja.MontoFinalCalculado}`);
    });
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
        
        // Usar monto final calculado si está disponible, sino usar el de la BD
        let montoFinalDisplay = '-';
        if (caja.MontoFinalCalculado !== undefined) {
            montoFinalDisplay = 'S/ ' + Number(caja.MontoFinalCalculado).toFixed(2);
        } else if (caja.MontoFinal !== null && caja.MontoFinal !== undefined) {
            montoFinalDisplay = 'S/ ' + Number(caja.MontoFinal).toFixed(2);
        }
        
        tr.innerHTML = `
            <td>${caja.CodCaja || ''}</td>
            <td>${caja.NombreUsuario || caja.Usuario || ''}</td>
            <td>S/ ${Number(caja.MontoInicial || 0).toFixed(2)}</td>
            <td>${montoFinalDisplay}</td>
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
