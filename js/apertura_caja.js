// ===== APERTURA DE CAJA - LÓGICA =====

const API_BASE = '/Proyecto_De_App_Fast_Food/api';
let idUsuario = null;

document.addEventListener('DOMContentLoaded', () => {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    obtenerUsuarioActual();
    inicializarFormulario();
});

// Validar usuario autenticado
function obtenerUsuarioActual() {
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    if (usuario) {
        idUsuario = usuario.IdUsuario;
    } else {
        alert('No hay usuario autenticado');
        window.location.href = '/Proyecto_De_App_Fast_Food/index.html';
    }
}

function actualizarFechaHora() {
    const ahora = new Date();
    const fechaElement = document.getElementById('currentDate');
    if (fechaElement) {
        const fechaFormateada = ahora.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const horaFormateada = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        fechaElement.textContent = `${fechaFormateada} ${horaFormateada}`;
    }
    const inputFecha = document.getElementById('fecha');
    if (inputFecha) {
        inputFecha.value = ahora.toISOString().slice(0, 10);
    }
}

function inicializarFormulario() {
    const form = document.getElementById('formAperturaCaja');
    const btnGuardar = form?.querySelector('.btn-guardar');
    const btnSalir = document.getElementById('btnSalir');
    const selectCaja = document.getElementById('codigoCaja');

    precargarUsuarioYCaja();
    cargarCajas();

    if (selectCaja) {
        selectCaja.addEventListener('change', autocompletarMontoInicial);
    }

    if (btnGuardar) {
        btnGuardar.addEventListener('click', registrarApertura);
    }

    if (btnSalir) {
        btnSalir.addEventListener('click', () => window.location.href = '/Proyecto_De_App_Fast_Food/html/menu_principal.html');
    }
}

function precargarUsuarioYCaja() {
    const usuario = JSON.parse(sessionStorage.getItem('usuario') || 'null');
    const inputUsuario = document.getElementById('usuario');

    if (usuario && inputUsuario) {
        inputUsuario.value = usuario.NombreCompleto || usuario.nombre || '';
    }
}

async function cargarCajas() {
    const selectCaja = document.getElementById('codigoCaja');
    if (!selectCaja) return;

    try {
        const resp = await fetch(`${API_BASE}/caja/listar`);
        const data = await resp.json();

        if (!resp.ok || !data.exito) {
            throw new Error('No se pudieron cargar las cajas');
        }

        // Obtener cajas únicas por código
        const cajasUnicas = new Map();
        data.items.forEach(caja => {
            if (!cajasUnicas.has(caja.CodCaja)) {
                cajasUnicas.set(caja.CodCaja, caja);
            } else {
                // Si ya existe, mantener la más reciente (última cerrada)
                const existente = cajasUnicas.get(caja.CodCaja);
                if (caja.Estado === 'cerrada' && existente.Estado === 'cerrada') {
                    if (new Date(caja.Fecha) > new Date(existente.Fecha)) {
                        cajasUnicas.set(caja.CodCaja, caja);
                    }
                }
            }
        });

        selectCaja.innerHTML = '<option value="">Seleccionar caja</option>';
        selectCaja.innerHTML += '<option value="NUEVA">+ Crear nueva caja</option>';
        
        cajasUnicas.forEach(caja => {
            // Solo mostrar cajas cerradas para reabrir
            if (caja.Estado === 'cerrada') {
                const option = document.createElement('option');
                option.value = caja.CodCaja;
                option.textContent = `${caja.CodCaja} (Cerrada - Último cierre: ${caja.Fecha})`;
                option.dataset.montoFinal = caja.MontoFinal || '';
                option.dataset.estado = caja.Estado;
                selectCaja.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error al cargar cajas:', error);
        selectCaja.innerHTML = '<option value="">Error al cargar cajas</option>';
    }
}

function autocompletarMontoInicial() {
    const selectCaja = document.getElementById('codigoCaja');
    const inputMonto = document.getElementById('montoInicial');
    
    if (!selectCaja || !inputMonto) return;

    const codCaja = selectCaja.value;
    
    // Si seleccionó crear nueva caja, generar código único
    if (codCaja === 'NUEVA') {
        const timestamp = Date.now().toString().slice(-8);
        selectCaja.insertAdjacentHTML('beforeend', `<option value="CAJ-${timestamp}" selected>CAJ-${timestamp} (Nueva)</option>`);
        selectCaja.value = `CAJ-${timestamp}`;
        inputMonto.value = '';
        return;
    }

    const selectedOption = selectCaja.options[selectCaja.selectedIndex];
    const montoFinal = selectedOption?.dataset?.montoFinal;
    const estado = selectedOption?.dataset?.estado;

    // Si la caja está cerrada y tiene monto final, autocompletar
    if (estado === 'cerrada' && montoFinal && montoFinal !== 'null') {
        inputMonto.value = parseFloat(montoFinal).toFixed(2);
    } else {
        inputMonto.value = '';
    }
}

async function registrarApertura() {
    const codigoCaja = document.getElementById('codigoCaja')?.value.trim();
    const fecha = document.getElementById('fecha')?.value;
    const montoInicial = parseFloat(document.getElementById('montoInicial')?.value || '0');
    const turno = document.getElementById('turno')?.value;

    if (!codigoCaja || !fecha || isNaN(montoInicial) || montoInicial < 0 || !turno) {
        alert('Complete los datos: código, fecha, monto inicial y turno.');
        return;
    }

    if (!idUsuario) {
        alert('No hay usuario autenticado.');
        window.location.href = '/Proyecto_De_App_Fast_Food/index.html';
        return;
    }

    const payload = {
        codCaja: codigoCaja,
        fechaApertura: fecha,
        montoInicial,
        turno,
        idUsuario
    };

    try {
        const resp = await fetch(`${API_BASE}/caja/abrir`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await resp.json();

        if (!resp.ok || !data.exito) {
            throw new Error(data.mensaje || 'No se pudo abrir la caja');
        }

        alert(data.mensaje || 'Caja abierta correctamente');
        window.location.href = '/Proyecto_De_App_Fast_Food/html/visualizar_caja.html';
    } catch (error) {
        console.error(error);
        alert(error.message || 'Error al abrir caja');
    }
}
