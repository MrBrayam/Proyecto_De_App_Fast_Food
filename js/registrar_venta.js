/* ============================================
   JAVASCRIPT PARA REGISTRAR VENTA
   ============================================ */

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    inicializarEventos();
    cargarProductosEjemplo();
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
    
    const horaFormateada = ahora.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    document.getElementById('fechaActual').textContent = fechaFormateada;
    document.getElementById('horaActual').textContent = horaFormateada;
}

// Inicializar eventos
function inicializarEventos() {
    // Event listeners para inputs
    document.getElementById('inputCantidad').addEventListener('change', function() {
        if (this.value < 1) {
            this.value = 1;
        }
    });
}

// Cargar productos de ejemplo
function cargarProductosEjemplo() {
    // Aquí se pueden cargar productos de ejemplo o desde una base de datos
}

// Función para buscar cliente
function buscarCliente() {
    const textoBusqueda = document.getElementById('clienteBuscar').value;
    if (textoBusqueda.trim() === '') {
        alert('Por favor ingrese un nombre para buscar');
        return;
    }
    alert('Buscando cliente: ' + textoBusqueda);
}

// Función para nuevo cliente
function nuevoCliente() {
    alert('Abriendo formulario de nuevo cliente');
}

// Función para añadir producto
function añadirProducto() {
    const codigo = document.getElementById('inputCodigo').value;
    const linea = document.getElementById('inputLinea').value;
    const descripcion = document.getElementById('inputDescripcion').value;
    const cantidad = parseInt(document.getElementById('inputCantidad').value) || 1;
    const precio = document.getElementById('inputPrecio').value;

    if (!codigo && !linea) {
        alert('Por favor ingrese un código o línea de producto');
        return;
    }

    if (!precio) {
        alert('Por favor ingrese un precio válido');
        return;
    }

    // Agregar a la tabla
    const tabla = document.getElementById('tablaProductos');
    const nuevaFila = tabla.insertRow();
    
    const precioNumerico = parseFloat(precio.replace('S/', '')) || 0;
    const total = precioNumerico * cantidad;

    nuevaFila.innerHTML = `
        <td>${descripcion || linea || codigo}</td>
        <td>${cantidad}</td>
        <td>S/${precioNumerico.toFixed(2)}</td>
        <td>S/${total.toFixed(2)}</td>
        <td>
            <button class="btn-scroll-up" onclick="moverArriba(this)"><i class="fas fa-chevron-up"></i></button>
            <button class="btn-scroll-down" onclick="moverAbajo(this)"><i class="fas fa-chevron-down"></i></button>
            <button class="btn-eliminar-item" onclick="eliminarItem(this)"><i class="fas fa-trash"></i></button>
        </td>
    `;

    // Limpiar formulario
    limpiarFormularioProducto();
}

// Limpiar formulario de producto
function limpiarFormularioProducto() {
    document.getElementById('inputCodigo').value = '';
    document.getElementById('inputLinea').value = '';
    document.getElementById('inputDescripcion').value = '';
    document.getElementById('inputCantidad').value = '1';
    document.getElementById('inputPrecio').value = '';
}

// Mover producto arriba
function moverArriba(boton) {
    const fila = boton.closest('tr');
    const filaAnterior = fila.previousElementSibling;
    if (filaAnterior) {
        fila.parentNode.insertBefore(fila, filaAnterior);
    }
}

// Mover producto abajo
function moverAbajo(boton) {
    const fila = boton.closest('tr');
    const filaSiguiente = fila.nextElementSibling;
    if (filaSiguiente) {
        fila.parentNode.insertBefore(filaSiguiente, fila);
    }
}

// Eliminar item de la tabla
function eliminarItem(boton) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
        const fila = boton.closest('tr');
        fila.remove();
    }
}

// Eliminar toda la venta
function eliminarVenta() {
    if (confirm('¿Está seguro de eliminar toda la venta?')) {
        document.getElementById('tablaProductos').innerHTML = '';
        limpiarFormularioProducto();
        document.getElementById('clienteBuscar').value = '';
        document.getElementById('tipoPago').value = '';
    }
}

// Registrar venta
function registrarVenta() {
    const cliente = document.getElementById('clienteBuscar').value;
    const tipoPago = document.getElementById('tipoPago').value;
    const productos = document.getElementById('tablaProductos').rows.length;

    if (!cliente.trim()) {
        alert('Por favor seleccione un cliente');
        return;
    }

    if (!tipoPago) {
        alert('Por favor seleccione un tipo de pago');
        return;
    }

    if (productos === 0) {
        alert('Por favor agregue al menos un producto');
        return;
    }

    alert('Venta registrada exitosamente');
    // Aquí se enviarían los datos al servidor
}

// Salir de la venta
function salirVenta() {
    if (confirm('¿Está seguro de salir? Se perderán los datos no guardados.')) {
        window.history.back();
    }
}
