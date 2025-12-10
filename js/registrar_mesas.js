/* ============================================
   REGISTRAR MESAS - FRONTEND ONLY
   Solo funcionalidades de interfaz
   ============================================ */

let mesaEditando = null;

document.addEventListener('DOMContentLoaded', function() {
    // Actualizar fecha y hora
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);

    const form = document.getElementById('formMesa');
    if (form) {
        form.addEventListener('submit', manejarSubmitMesa);
    }

    const btnLimpiar = document.querySelector('.btn-limpiar');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', function(e) {
            e.preventDefault();
            limpiarFormulario();
        });
    }

    // Detectar si estamos editando
    const mesaData = sessionStorage.getItem('editarMesaData');
    if (mesaData) {
        cargarMesaParaEditar();
    } else {
        generarNumeroMesaAutomatico();
    }
});

// Función para actualizar fecha y hora
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

function cargarMesaParaEditar() {
    const mesaData = sessionStorage.getItem('editarMesaData');
    if (!mesaData) return;
    
    try {
        const mesa = JSON.parse(mesaData);
        
        // Guardar ID de mesa editando
        mesaEditando = mesa.id;
        
        // Cambiar título y botón
        const titulo = document.querySelector('h1');
        if (titulo) {
            titulo.textContent = 'Editar Mesa';
        }
        
        const btnGuardar = document.querySelector('.btn-guardar, button[type="submit"]');
        if (btnGuardar) {
            btnGuardar.textContent = 'Actualizar';
        }
        
        // Cargar datos en el formulario
        const numeroMesaInput = document.getElementById('numeroMesa');
        if (numeroMesaInput) numeroMesaInput.value = mesa.numeroMesa || '';
        
        const capacidadInput = document.getElementById('capacidad');
        if (capacidadInput) capacidadInput.value = mesa.capacidad || '';
        
        const ubicacionInput = document.getElementById('ubicacion');
        if (ubicacionInput) ubicacionInput.value = mesa.ubicacion || '';
        
        const tipoInput = document.getElementById('tipo');
        if (tipoInput) tipoInput.value = mesa.tipo || 'cuadrada';
        
        const estadoInput = document.getElementById('estado');
        if (estadoInput) estadoInput.value = mesa.estado || 'disponible';
        
        const prioridadInput = document.getElementById('prioridad');
        if (prioridadInput) prioridadInput.value = mesa.prioridad || 'normal';
        
        const ventanaInput = document.getElementById('ventana');
        if (ventanaInput) ventanaInput.checked = !!mesa.ventana;
        
        const sillaBebeInput = document.getElementById('sillaBebe');
        if (sillaBebeInput) sillaBebeInput.checked = !!mesa.sillaBebe;
        
        const accesibleInput = document.getElementById('accesible');
        if (accesibleInput) accesibleInput.checked = !!mesa.accesible;
        
        const silenciosaInput = document.getElementById('silenciosa');
        if (silenciosaInput) silenciosaInput.checked = !!mesa.silenciosa;
        
        const observacionesInput = document.getElementById('observaciones');
        if (observacionesInput) observacionesInput.value = mesa.observaciones || '';
        
    } catch (err) {
        console.error('Error al cargar mesa para editar:', err);
    }
}

function limpiarFormulario() {
    // Resetear formulario
    const form = document.getElementById('formMesa');
    if (form) {
        form.reset();
    }
    
    // Limpiar modo edición
    mesaEditando = null;
    sessionStorage.removeItem('editarMesaData');
    
    // Restaurar título y botón
    const titulo = document.querySelector('h1');
    if (titulo) {
        titulo.textContent = 'Registrar Nueva Mesa';
    }
    
    const btnGuardar = document.querySelector('.btn-guardar, button[type="submit"]');
    if (btnGuardar) {
        btnGuardar.textContent = 'Guardar';
    }
    
    // Generar nuevo número de mesa
    generarNumeroMesaAutomatico();
}

async function manejarSubmitMesa(e) {
    e.preventDefault();

    const numeroMesa = document.getElementById('numeroMesa').value.trim();
    const capacidad = parseInt(document.getElementById('capacidad').value, 10);
    const ubicacion = document.getElementById('ubicacion').value.trim();
    const tipo = document.getElementById('tipo').value;
    const estado = document.getElementById('estado').value;
    const prioridad = document.getElementById('prioridad').value;
    const ventana = document.getElementById('ventana').checked;
    const sillaBebe = document.getElementById('sillaBebe').checked;
    const accesible = document.getElementById('accesible').checked;
    const silenciosa = document.getElementById('silenciosa').checked;
    const observaciones = document.getElementById('observaciones').value.trim();

    if (!numeroMesa || !capacidad || capacidad <= 0 || !ubicacion || !estado) {
        alert('Completa número, capacidad, ubicación y estado.');
        return;
    }

    const payload = {
        numeroMesa: parseInt(numeroMesa, 10),
        capacidad,
        ubicacion,
        tipo,
        estado,
        prioridad,
        ventana,
        sillaBebe,
        accesible,
        silenciosa,
        observaciones
    };

    try {
        // La misma ruta maneja tanto registro como actualización
        // El stored procedure detecta si la mesa existe y actualiza o inserta
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/mesas/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.exito) {
            alert(mesaEditando ? 'Mesa actualizada correctamente' : 'Mesa guardada correctamente');
            sessionStorage.removeItem('editarMesaData');
            
            // Redirigir siempre a visualizar
            window.location.href = '../html/visualizar_mesas.html';
        } else {
            alert(data.mensaje || 'No se pudo guardar la mesa');
        }
    } catch (err) {
        console.error('Error guardando mesa:', err);
        alert('Error al guardar la mesa');
    }
}

// Generar número de mesa automáticamente (siguiente disponible)
async function generarNumeroMesaAutomatico() {
    // Verificar si hay datos de edición
    const mesaData = sessionStorage.getItem('editarMesaData');
    if (mesaData) {
        return; // No generar si está editando
    }
    
    try {
        const resp = await fetch('/Proyecto_De_App_Fast_Food/api/mesas/listar', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await resp.json();
        
        if (data.exito && Array.isArray(data.items)) {
            // Obtener el número más alto
            const numeros = data.items.map(m => parseInt(m.NumMesa || m.numeroMesa || 0));
            const proximoNumero = Math.max(...numeros, 0) + 1;
            document.getElementById('numeroMesa').value = proximoNumero;
        } else {
            // Si no hay mesas, empezar en 1
            document.getElementById('numeroMesa').value = 1;
        }
    } catch (err) {
        console.error('Error generando número de mesa:', err);
        document.getElementById('numeroMesa').value = 1;
    }
}
