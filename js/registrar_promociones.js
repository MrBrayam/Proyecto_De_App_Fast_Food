/* ============================================
   JAVASCRIPT PARA REGISTRAR PROMOCIONES
   ============================================ */

const API_BASE = '/Proyecto_De_App_Fast_Food/api';
let idUsuario = null;
let promocionEditando = null;

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    obtenerUsuarioActual();
    inicializarEventos();
    setFechaMinima();
});

// Validar usuario autenticado
function obtenerUsuarioActual() {
    const sessionUserRaw = sessionStorage.getItem('usuario');
    let usuario = null;

    if (sessionUserRaw) {
        try {
            usuario = JSON.parse(sessionUserRaw);
        } catch (e) {
            usuario = null;
        }
    }

    if (!usuario) {
        const localUserRaw = localStorage.getItem('userSession') || localStorage.getItem('currentUser');
        if (localUserRaw) {
            try {
                const localUser = JSON.parse(localUserRaw);
                usuario = {
                    IdUsuario: localUser.IdUsuario || localUser.id || localUser.idUsuario,
                    NombreCompleto: localUser.NombreCompleto || localUser.nombre || localUser.nombreCompleto
                };
                sessionStorage.setItem('usuario', JSON.stringify(usuario));
            } catch (e) {
                usuario = null;
            }
        }
    }

    if (usuario && usuario.IdUsuario) {
        idUsuario = usuario.IdUsuario;
    } else {
        alert('No hay usuario autenticado');
        window.location.href = '/Proyecto_De_App_Fast_Food/index.html';
    }
}

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

// Inicializar eventos del formulario
function inicializarEventos() {
    const formPromocion = document.getElementById('formPromocion');
    if (formPromocion) {
        formPromocion.addEventListener('submit', (e) => {
            e.preventDefault();
            registrarPromocion();
        });
    }

    // Validar que fechaFin sea posterior a fechaInicio
    const fechaInicio = document.getElementById('fechaInicio');
    const fechaFin = document.getElementById('fechaFin');
    
    if (fechaInicio) {
        fechaInicio.addEventListener('change', function() {
            if (fechaFin) {
                fechaFin.setAttribute('min', this.value);
            }
        });
    }
}

// Establecer fecha mínima en los inputs (hoy)
function setFechaMinima() {
    const today = new Date().toISOString().split('T')[0];
    const fechaInicio = document.getElementById('fechaInicio');
    const fechaFin = document.getElementById('fechaFin');
    
    if (fechaInicio) fechaInicio.setAttribute('min', today);
    if (fechaFin) fechaFin.setAttribute('min', today);
}

// Registrar nueva promoción
async function registrarPromocion() {
    const nombre = document.getElementById('nombre')?.value.trim();
    const tipo = document.getElementById('tipo')?.value;
    const descuento = document.getElementById('descuento')?.value.trim();
    const estado = document.getElementById('estado')?.value;
    const fechaInicio = document.getElementById('fechaInicio')?.value;
    const fechaFin = document.getElementById('fechaFin')?.value;
    const diasAplicables = document.getElementById('diasAplicables')?.value.trim() || null;
    const horario = document.getElementById('horario')?.value.trim() || null;
    const montoMinimo = parseFloat(document.getElementById('montoMinimo')?.value || '0');
    const usosMaximos = parseInt(document.getElementById('usosMaximos')?.value || 'null') || null;
    const acumulable = document.getElementById('acumulable')?.value === 'si' ? 1 : 0;
    const descripcion = document.getElementById('descripcion')?.value.trim() || null;

    // Validar campos obligatorios
    if (!nombre || !tipo || !descuento || !estado || !fechaInicio || !fechaFin) {
        alert('Por favor complete todos los campos obligatorios (*)');
        return;
    }

    // Validar que fechaFin sea posterior a fechaInicio
    if (new Date(fechaFin) <= new Date(fechaInicio)) {
        alert('La fecha de fin debe ser posterior a la fecha de inicio');
        return;
    }

    const payload = {
        nombre,
        tipo,
        descuento,
        estado,
        fechaInicio,
        fechaFin,
        diasAplicables,
        horario,
        montoMinimo,
        usosMaximos,
        acumulable,
        descripcion
    };

    try {
        const endpoint = promocionEditando ? 
            `${API_BASE}/promociones/actualizar` : 
            `${API_BASE}/promociones/registrar`;
        
        if (promocionEditando) {
            payload.idPromocion = promocionEditando;
        }

        const resp = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await resp.json();

        if (!resp.ok || !data.exito) {
            throw new Error(data.mensaje || 'No se pudo registrar la promoción');
        }

        alert(data.mensaje || 'Promoción registrada correctamente');
        limpiarFormulario();
        promocionEditando = null;
    } catch (err) {
        console.error(err);
        alert(err.message || 'Error al registrar promoción');
    }
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('formPromocion')?.reset();
    const btnGuardar = document.querySelector('.btn-guardar');
    if (btnGuardar) {
        btnGuardar.textContent = '\uf0c7 Guardar';
    }
    promocionEditando = null;
    setFechaMinima();
}

// Cancelar edición
function cancelar() {
    if (promocionEditando) {
        limpiarFormulario();
    } else {
        window.location.href = '/Proyecto_De_App_Fast_Food/html/menu_principal.html';
    }
}

