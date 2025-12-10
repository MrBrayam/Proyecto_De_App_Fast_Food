/* ============================================
   JAVASCRIPT PARA REGISTRAR PROMOCIONES
   ============================================ */

let idUsuario = null;
let promocionEditando = null;

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    obtenerUsuarioActual();
    inicializarEventos();
    setFechaMinima();
    
    // Verificar si viene en modo edición
    const urlParams = new URLSearchParams(window.location.search);
    const idEditar = urlParams.get('editar');
    
    if (idEditar) {
        cargarPromocionParaEditar(idEditar);
    }
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

    // Botón limpiar
    const btnLimpiar = document.querySelector('.btn-limpiar, .btn-cancelar, button[type="reset"]');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', function(e) {
            e.preventDefault();
            limpiarFormulario();
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

        alert(data.mensaje || 'Promoción ' + (promocionEditando ? 'actualizada' : 'registrada') + ' correctamente');
        
        if (promocionEditando) {
            // Si estaba editando, redirigir a visualizar
            window.location.href = '/Proyecto_De_App_Fast_Food/html/visualizar_promociones.html';
        } else {
            // Si era nuevo registro, limpiar formulario
            limpiarFormulario();
        }
    } catch (err) {
        console.error(err);
        alert(err.message || 'Error al registrar promoción');
    }
}

// Limpiar formulario
function limpiarFormulario() {
    // Resetear modo edición
    promocionEditando = null;
    
    // Limpiar URL
    window.history.replaceState({}, document.title, window.location.pathname);
    
    // Resetear formulario
    document.getElementById('formPromocion')?.reset();
    
    // Restaurar texto del botón
    const btnGuardar = document.querySelector('.btn-guardar');
    if (btnGuardar) {
        btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar';
    }
    
    // Restaurar título
    const titulo = document.querySelector('.page-title');
    if (titulo) {
        titulo.innerHTML = '<i class="fas fa-tags"></i> Registrar Nueva Promoción';
    }
    
    // Limpiar sessionStorage
    sessionStorage.removeItem('promocionEditando');
    
    setFechaMinima();
}

// Cargar promoción para editar
async function cargarPromocionParaEditar(idPromocion) {
    try {
        // Intentar obtener de sessionStorage primero
        let promocion = null;
        const promocionStorage = sessionStorage.getItem('promocionEditando');
        
        if (promocionStorage) {
            try {
                promocion = JSON.parse(promocionStorage);
            } catch (e) {
                promocion = null;
            }
        }
        
        // Si no está en storage, buscar en API
        if (!promocion) {
            const resp = await fetch(`/Proyecto_De_App_Fast_Food/api/promociones/buscar?id=${idPromocion}`);
            const data = await resp.json();
            
            if (!resp.ok || !data.exito) {
                throw new Error('No se pudo cargar la promoción');
            }
            
            promocion = data.promocion;
        }
        
        // Establecer modo edición
        promocionEditando = idPromocion;
        
        // Cambiar título
        const titulo = document.querySelector('.page-title');
        if (titulo) {
            titulo.innerHTML = '<i class="fas fa-edit"></i> Editar Promoción';
        }
        
        // Cambiar texto del botón
        const btnGuardar = document.querySelector('.btn-guardar');
        if (btnGuardar) {
            btnGuardar.innerHTML = '<i class="fas fa-save"></i> Actualizar';
        }
        
        // Cargar datos en el formulario
        document.getElementById('nombre').value = promocion.NombrePromocion || '';
        document.getElementById('tipo').value = promocion.TipoPromocion || '';
        document.getElementById('descuento').value = promocion.Descuento || '';
        document.getElementById('estado').value = promocion.Estado || 'activo';
        document.getElementById('fechaInicio').value = promocion.FechaInicio ? promocion.FechaInicio.split('T')[0] : '';
        document.getElementById('fechaFin').value = promocion.FechaFin ? promocion.FechaFin.split('T')[0] : '';
        document.getElementById('diasAplicables').value = promocion.DiasAplicables || '';
        document.getElementById('horario').value = promocion.Horario || '';
        document.getElementById('montoMinimo').value = promocion.MontoMinimo || '';
        document.getElementById('usosMaximos').value = promocion.UsosMaximos || '';
        document.getElementById('acumulable').value = promocion.Acumulable ? 'si' : 'no';
        document.getElementById('descripcion').value = promocion.Descripcion || '';
        
    } catch (error) {
        console.error('Error al cargar promoción:', error);
        alert('Error al cargar la promoción: ' + error.message);
        window.location.href = '/Proyecto_De_App_Fast_Food/html/registrar_promociones.html';
    }
}

// Cancelar edición
function cancelar() {
    if (promocionEditando) {
        // Si está editando, redirigir a visualizar
        window.location.href = '/Proyecto_De_App_Fast_Food/html/visualizar_promociones.html';
    } else {
        // Si no está editando, volver al menú principal
        window.location.href = '/Proyecto_De_App_Fast_Food/html/menu_principal.html';
    }
}

