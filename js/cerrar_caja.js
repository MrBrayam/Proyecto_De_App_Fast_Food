// ===== CERRAR CAJA - LÓGICA =====

let idUsuario = null;
let cajasAbiertas = [];

document.addEventListener('DOMContentLoaded', () => {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    obtenerUsuarioActual();
    cargarCajasAbiertas();
    inicializarEventos();
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
}

function inicializarEventos() {
    const btnCerrar = document.querySelector('.btn-cerrar');
    const btnSalir = document.getElementById('btnSalir');
    const selectCaja = document.getElementById('codigoCaja');

    if (selectCaja) {
        selectCaja.addEventListener('change', cargarDatosCaja);
    }

    if (btnCerrar) {
        btnCerrar.addEventListener('click', cerrarCaja);
    }

    if (btnSalir) {
        btnSalir.addEventListener('click', () => window.location.href = '/Proyecto_De_App_Fast_Food/html/menu_principal.html');
    }
}

async function cargarCajasAbiertas() {
    const selectCaja = document.getElementById('codigoCaja');
    if (!selectCaja) return;

    try {
        const resp = await fetch(`${API_BASE}/caja/listar`);
        const data = await resp.json();

        console.log('Respuesta de cajas:', data);

        if (!resp.ok || !data.exito) {
            throw new Error('No se pudieron cargar las cajas');
        }

        // Filtrar solo cajas abiertas
        cajasAbiertas = data.items.filter(caja => {
            const estado = (caja.Estado || '').toLowerCase();
            return estado === 'abierta' || estado === 'activa';
        });

        console.log('Cajas abiertas/activas encontradas:', cajasAbiertas);

        if (cajasAbiertas.length === 0) {
            selectCaja.innerHTML = '<option value="">No hay cajas abiertas</option>';
            console.warn('No hay cajas abiertas para cerrar');
            return;
        }

        selectCaja.innerHTML = '<option value="">Seleccionar caja abierta</option>';
        cajasAbiertas.forEach(caja => {
            const option = document.createElement('option');
            option.value = caja.CodCaja;
            option.textContent = `${caja.CodCaja} - ${caja.Turno || 'Sin turno'} (${caja.FechaApertura || caja.Fecha || 'Sin fecha'})`;
            selectCaja.appendChild(option);
        });

        console.log('Cajas cargadas en select:', cajasAbiertas.length);

        // Si solo hay una caja abierta, seleccionarla automáticamente
        if (cajasAbiertas.length === 1) {
            selectCaja.value = cajasAbiertas[0].CodCaja;
            cargarDatosCaja();
        }
    } catch (error) {
        console.error('Error al cargar cajas abiertas:', error);
        selectCaja.innerHTML = '<option value="">Error al cargar cajas</option>';
    }
}

function cargarDatosCaja() {
    const selectCaja = document.getElementById('codigoCaja');
    const codCaja = selectCaja?.value;

    if (!codCaja) {
        limpiarFormulario();
        return;
    }

    const caja = cajasAbiertas.find(c => c.CodCaja === codCaja);
    if (!caja) return;

    setValor('usuario', caja.NombreUsuario || `Usuario ID: ${caja.IdUsuario}`);
    setValor('fechaApertura', caja.FechaApertura?.slice(0, 10) || caja.Fecha?.slice(0, 10) || '');
    setValor('horaApertura', caja.HoraApertura || '');
    setValor('montoInicial', caja.MontoInicial ? `S/ ${Number(caja.MontoInicial).toFixed(2)}` : '');
    setValor('turno', caja.Turno || '');

    // Mostrar total de ventas si existe
    if (caja.TotalVentas && caja.TotalVentas > 0) {
        const totalVentasEl = document.getElementById('totalVentas');
        if (totalVentasEl) {
            totalVentasEl.textContent = `S/ ${Number(caja.TotalVentas).toFixed(2)}`;
        }
    }
}

function limpiarFormulario() {
    setValor('usuario', '');
    setValor('fechaApertura', '');
    setValor('horaApertura', '');
    setValor('montoInicial', '');
    setValor('turno', '');
    setValor('montoFinal', '');
    setValor('observaciones', '');
}

function setValor(id, valor) {
    const el = document.getElementById(id);
    if (el && valor !== undefined && valor !== null) {
        el.value = valor;
    }
}

async function cerrarCaja() {
    const montoFinal = parseFloat(document.getElementById('montoFinal')?.value || '0');
    const observaciones = document.getElementById('observaciones')?.value.trim() || '';
    const codCaja = document.getElementById('codigoCaja')?.value.trim();

    if (!codCaja) {
        alert('No hay caja seleccionada');
        return;
    }

    if (isNaN(montoFinal) || montoFinal < 0) {
        alert('Ingrese un monto final válido');
        return;
    }

    if (!idUsuario) {
        alert('No hay usuario autenticado');
        window.location.href = '/Proyecto_De_App_Fast_Food/index.html';
        return;
    }

    const payload = {
        codCaja,
        montoFinal,
        observaciones,
        idUsuario
    };

    try {
        const resp = await fetch(`${API_BASE}/caja/cerrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await resp.json();

        if (!resp.ok || !data.exito) {
            throw new Error(data.mensaje || 'No se pudo cerrar la caja');
        }

        alert(data.mensaje || 'Caja cerrada');
        window.location.href = '/Proyecto_De_App_Fast_Food/html/visualizar_caja.html';
    } catch (err) {
        console.error(err);
        alert(err.message || 'Error al cerrar caja');
    }
}

