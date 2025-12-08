/* ============================================
   JAVASCRIPT PARA VISUALIZAR PROMOCIONES
   ============================================ */

const API_BASE = '/Proyecto_De_App_Fast_Food/api';
let promociones = [];

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    inicializarEventos();
    // Forzar recarga de datos frescos
    setTimeout(() => cargarPromociones(), 100);
    // Recargar cada 5 segundos por si hay cambios de otra ventana
    setInterval(cargarPromociones, 5000);
});

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
    
    const opcionesHora = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
    };
    const horaFormateada = ahora.toLocaleTimeString('es-ES', opcionesHora);
    
    const fechaElement = document.getElementById('currentDate');
    
    if (fechaElement) {
        fechaElement.textContent = `${fechaFormateada} ${horaFormateada}`;
    }
}

// Inicializar eventos
function inicializarEventos() {
    const btnBuscar = document.getElementById('btnBuscar');
    const inputBusqueda = document.getElementById('busqueda');
    const btnVolver = document.getElementById('btnVolver');

    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => filtrarPromociones(inputBusqueda?.value.trim()));
    }

    if (inputBusqueda) {
        inputBusqueda.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                filtrarPromociones(inputBusqueda.value.trim());
            }
        });
    }

    if (btnVolver) {
        btnVolver.addEventListener('click', () => {
            window.location.href = '/Proyecto_De_App_Fast_Food/html/menu_principal.html';
        });
    }
}

// Cargar promociones
async function cargarPromociones() {
    try {
        const resp = await fetch(`${API_BASE}/promociones/listar`);
        const data = await resp.json();

        console.log('Respuesta API listar:', data);

        if (!resp.ok || !data.exito) {
            throw new Error('No se pudieron cargar las promociones');
        }

        promociones = data.items || [];
        console.log('Promociones cargadas:', promociones);
        renderTabla(promociones);
    } catch (error) {
        console.error('Error al cargar promociones:', error);
        alert('Error al cargar promociones: ' + error.message);
    }
}

// Filtrar promociones por búsqueda
function filtrarPromociones(termino) {
    if (!termino) {
        renderTabla(promociones);
        return;
    }

    const filtradas = promociones.filter(p => 
        p.NombrePromocion.toLowerCase().includes(termino.toLowerCase()) ||
        p.TipoPromocion.toLowerCase().includes(termino.toLowerCase()) ||
        p.Descuento.toLowerCase().includes(termino.toLowerCase())
    );

    renderTabla(filtradas);
}

// Limpiar búsqueda
function limpiarBusqueda() {
    const inputBusqueda = document.getElementById('busqueda');
    if (inputBusqueda) {
        inputBusqueda.value = '';
        renderTabla(promociones);
    }
}

// Renderizar tabla de promociones
function renderTabla(data) {
    const tbody = document.getElementById('tablaPromocionesBody');
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center">Sin resultados</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(promo => `
        <tr>
            <td>${promo.IdPromocion}</td>
            <td>${promo.NombrePromocion}</td>
            <td>${formatearTipo(promo.TipoPromocion)}</td>
            <td>${promo.Descuento}</td>
            <td><span class="badge badge-${promo.Estado}">${promo.Estado}</span></td>
            <td>${formatearFecha(promo.FechaInicio)}</td>
            <td>${formatearFecha(promo.FechaFin)}</td>
            <td>${promo.MontoMinimo ? 'S/ ' + Number(promo.MontoMinimo).toFixed(2) : '-'}</td>
            <td>${promo.UsosMaximos || 'Ilimitado'}</td>
            <td>
                <button class="btn-icon btn-editar" title="Editar" onclick="editarPromocion(${promo.IdPromocion})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-eliminar" title="Eliminar" onclick="confirmarEliminar(${promo.IdPromocion})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Formatear tipo de promoción
function formatearTipo(tipo) {
    const tipos = {
        '2x1': '2 x 1',
        'porcentaje': 'Porcentaje',
        'monto': 'Monto Fijo',
        'horario': 'Horario Especial',
        'combo': 'Combo',
        'especial': 'Evento Especial'
    };
    return tipos[tipo] || tipo;
}

// Formatear fecha
function formatearFecha(fecha) {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES');
}

// Editar promoción
async function editarPromocion(idPromocion) {
    try {
        const resp = await fetch(`${API_BASE}/promociones/buscar?id=${idPromocion}`);
        const data = await resp.json();

        if (!resp.ok || !data.exito) {
            throw new Error('No se pudo cargar la promoción');
        }

        // Guardar en sessionStorage para recuperar en registrar_promociones.html
        sessionStorage.setItem('promocionEditando', JSON.stringify(data.promocion));
        window.location.href = '/Proyecto_De_App_Fast_Food/html/registrar_promociones.html?editar=' + idPromocion;
    } catch (error) {
        console.error('Error al editar:', error);
        alert('Error al cargar la promoción: ' + error.message);
    }
}

// Confirmar eliminación
function confirmarEliminar(idPromocion) {
    if (confirm('¿Está seguro de que desea eliminar esta promoción?')) {
        eliminarPromocion(idPromocion);
    }
}

// Eliminar promoción
async function eliminarPromocion(idPromocion) {
    try {
        const resp = await fetch(`${API_BASE}/promociones/eliminar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idPromocion })
        });

        const data = await resp.json();

        if (!resp.ok || !data.exito) {
            throw new Error(data.mensaje || 'No se pudo eliminar la promoción');
        }

        alert('Promoción eliminada correctamente');
        cargarPromociones(); // Recargar tabla
    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error: ' + error.message);
    }
}

