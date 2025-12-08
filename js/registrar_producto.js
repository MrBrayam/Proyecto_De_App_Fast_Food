// ===== REGISTRAR PRODUCTO - JAVASCRIPT =====

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Bind al evento submit del formulario
    const formProducto = document.getElementById('formProducto');
    if (formProducto) {
        formProducto.addEventListener('submit', submitForm);
    }
});

// Actualizar fecha y hora
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

// Registrar producto
async function submitForm(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const codProducto = document.getElementById('codProducto').value.trim();
    const nombreProducto = document.getElementById('nombreProducto').value.trim();
    const categoria = document.getElementById('categoria').value.trim();
    const tamano = document.getElementById('tamano').value || 'na';
    const precio = parseFloat(document.getElementById('precio').value) || 0;
    const costo = parseFloat(document.getElementById('costo').value) || 0;
    const stock = parseInt(document.getElementById('stock').value) || 0;
    const stockMinimo = parseInt(document.getElementById('stockMinimo').value) || 0;
    const tiempoPreparacion = parseInt(document.getElementById('tiempoPreparacion').value) || 0;
    const estado = document.getElementById('estado').value || 'disponible';
    const codigoBarras = document.getElementById('codigoBarras').value.trim() || null;
    const descripcion = document.getElementById('descripcion').value.trim() || null;
    const codProveedor = null; // Opcional
    
    // Validar campos requeridos
    if (!codProducto || !nombreProducto || !categoria || precio <= 0) {
        alert('Por favor completa los campos requeridos: Código, Nombre, Categoría y Precio');
        return;
    }
    
    // Construir objeto de datos
    const data = {
        codProducto,
        nombreProducto,
        categoria,
        tamano,
        precio,
        costo,
        stock,
        stockMinimo,
        tiempoPreparacion,
        codigoBarras,
        descripcion,
        codProveedor
    };
    
    // Mostrar loading
    const btnRegistrar = document.querySelector('.btn-registrar');
    const textOriginal = btnRegistrar.innerHTML;
    btnRegistrar.disabled = true;
    btnRegistrar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
    
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/productos/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.exito) {
            alert('✓ Producto registrado exitosamente');
            // Limpiar formulario
            document.getElementById('formProducto').reset();
        } else {
            alert('✗ Error: ' + (result.mensaje || 'No se pudo registrar el producto'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('✗ Error al registrar producto: ' + error.message);
    } finally {
        btnRegistrar.disabled = false;
        btnRegistrar.innerHTML = textOriginal;
    }
}

// Función para salir del módulo
function salirModulo() {
    if (confirm('¿Está seguro de salir? Los datos no guardados se perderán.')) {
        window.history.back();
    }
}
