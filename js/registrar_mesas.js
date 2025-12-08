/* ============================================
   REGISTRAR MESAS - FRONTEND ONLY
   Solo funcionalidades de interfaz
   ============================================ */

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
        btnLimpiar.addEventListener('click', function() {
            form.reset();
            generarNumeroMesaAutomatico();
        });
    }

    precargarMesaSiEdita();
    generarNumeroMesaAutomatico();
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

function precargarMesaSiEdita() {
    const mesaData = sessionStorage.getItem('editarMesaData');
    if (!mesaData) return;
    try {
        const mesa = JSON.parse(mesaData);
        // Mostrar número sin permitir edición
        const numeroMesaInput = document.getElementById('numeroMesa');
        numeroMesaInput.value = mesa.numeroMesa || '';
        
        document.getElementById('capacidad').value = mesa.capacidad || '';
        document.getElementById('ubicacion').value = mesa.ubicacion || '';
        document.getElementById('tipo').value = mesa.tipo || 'cuadrada';
        document.getElementById('estado').value = mesa.estado || 'disponible';
        document.getElementById('prioridad').value = mesa.prioridad || 'normal';
        document.getElementById('ventana').checked = !!mesa.ventana;
        document.getElementById('sillaBebe').checked = !!mesa.sillaBebe;
        document.getElementById('accesible').checked = !!mesa.accesible;
        document.getElementById('silenciosa').checked = !!mesa.silenciosa;
        document.getElementById('observaciones').value = mesa.observaciones || '';
    } catch (err) {
        console.error('No se pudo precargar mesa:', err);
    }
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
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/mesas/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.exito) {
            alert('Mesa guardada correctamente');
            sessionStorage.removeItem('editarMesaData');
            window.location.href = '../html/visualizar_mesas.html';
        } else {
            alert(data.mensaje || 'No se pudo registrar la mesa');
        }
    } catch (err) {
        console.error('Error registrando mesa:', err);
        alert('Error al registrar la mesa');
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
