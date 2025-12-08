// ===== REGISTRAR PLATOS - FRONTEND ONLY =====
// Solo funcionalidades de interfaz básica

document.addEventListener('DOMContentLoaded', function() {
    // Actualizar fecha y hora
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
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


// Función para editar plato
function editarPlato(codigo) {
    alert(`Función de editar plato con código: ${codigo}\nEsta funcionalidad se implementará en la versión completa.`);
}

// Función para eliminar plato
function eliminarPlato(codigo) {
    if(confirm(`¿Está seguro de que desea eliminar el plato con código ${codigo}?`)) {
        // Aquí iría la lógica para eliminar el plato
        alert(`Plato con código ${codigo} eliminado correctamente.\nEsta funcionalidad se implementará en la versión completa.`);
    }
}

// Función para registrar nuevo plato
function registrarPlato() {
    const nombre = document.getElementById('searchNombre').value;
    const categoria = document.getElementById('searchCategoria').value;
    const descripcion = document.getElementById('searchDescripcion').value;
    const ingredientes = document.getElementById('searchIngredientes').value;
    const disponibilidad = document.getElementById('searchDisponibilidad').value;
    const precio = document.getElementById('searchPrecio').value;
    
    // Validación básica
    if (!nombre || !categoria || !descripcion || !ingredientes || !disponibilidad || !precio) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }
    
    if (parseFloat(precio) <= 0) {
        alert('El precio debe ser mayor a 0.');
        return;
    }
    
    // Simulación de registro exitoso
    alert(`Plato registrado correctamente:\n
Nombre: ${nombre}
Categoría: ${categoria}
Descripción: ${descripcion}
Ingredientes: ${ingredientes}
Disponibilidad: ${disponibilidad}
Precio: S/. ${precio}

Esta funcionalidad se implementará completamente en la versión final.`);
    
    // Limpiar formulario
    document.getElementById('searchNombre').value = '';
    document.getElementById('searchCategoria').value = '';
    document.getElementById('searchDescripcion').value = '';
    document.getElementById('searchIngredientes').value = '';
    document.getElementById('searchDisponibilidad').value = '';
    document.getElementById('searchPrecio').value = '';
}
