document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);

    const btnGuardar = document.getElementById('btnGuardar');
    const btnAnadir = document.getElementById('btnAnadir');

    if (btnGuardar) btnGuardar.addEventListener('click', registrarPlato);
    if (btnAnadir) btnAnadir.addEventListener('click', registrarPlato);
});

function actualizarFechaHora() {
    const ahora = new Date();
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = ahora.toLocaleDateString('es-ES', opciones);
    const horaFormateada = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const fechaElement = document.getElementById('currentDate');
    if (fechaElement) {
        fechaElement.textContent = fechaFormateada + ' ' + horaFormateada;
    }
}

async function registrarPlato() {
    const codPlato = document.getElementById('searchCodigo').value.trim();
    const nombre = document.getElementById('searchNombre').value.trim();
    const tamano = document.getElementById('searchTamano').value;
    const precio = parseFloat(document.getElementById('searchPrecio').value || '0');
    const cantidad = parseInt(document.getElementById('searchCantidad').value || '0', 10);
    const descripcion = document.getElementById('searchDescripcion').value.trim();
    const ingredientes = document.getElementById('searchIngredientes').value.trim();

    if (!codPlato || !nombre) {
        alert('Código y nombre del plato son obligatorios');
        return;
    }
    if (!tamano) {
        alert('Selecciona un tamaño');
        return;
    }
    if (isNaN(precio) || precio < 0) {
        alert('El precio debe ser mayor o igual a 0');
        return;
    }
    if (isNaN(cantidad) || cantidad < 0) {
        alert('La cantidad debe ser 0 o mayor');
        return;
    }

    const payload = {
        codPlato,
        nombre,
        descripcion,
        ingredientes,
        tamano,
        precio,
        cantidad,
        estado: 'disponible'
    };

    try {
        const resp = await fetch('/Proyecto_De_App_Fast_Food/api/platos/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await resp.json();
        if (data.exito) {
            alert('Plato registrado correctamente');
            limpiarFormulario();
        } else {
            alert(data.mensaje || 'No se pudo registrar el plato');
        }
    } catch (error) {
        console.error('Error registrando plato:', error);
        alert('Ocurrió un error al registrar el plato');
    }
}

function limpiarFormulario() {
    document.getElementById('searchCodigo').value = '';
    document.getElementById('searchNombre').value = '';
    document.getElementById('searchTamano').value = '';
    document.getElementById('searchPrecio').value = '';
    document.getElementById('searchCantidad').value = '';
    document.getElementById('searchDescripcion').value = '';
    document.getElementById('searchIngredientes').value = '';
}
