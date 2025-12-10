// ===== REGISTRAR PRODUCTO - JAVASCRIPT =====

let modoEdicion = false;
let codigoProductoOriginal = null;

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Verificar si estamos en modo edición
    const urlParams = new URLSearchParams(window.location.search);
    const codigoEditar = urlParams.get('editar');
    
    if (codigoEditar) {
        modoEdicion = true;
        codigoProductoOriginal = codigoEditar;
        cargarProducto(codigoEditar);
        
        // Cambiar texto del botón
        const btnRegistrar = document.querySelector('.btn-registrar');
        if (btnRegistrar) {
            btnRegistrar.innerHTML = '<i class="fas fa-save"></i> Actualizar Producto';
        }
        
        // Cambiar título
        const titulo = document.querySelector('.section-title h2');
        if (titulo) {
            titulo.textContent = 'Editar Producto';
        }
    }
    
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

// Cargar producto para editar
async function cargarProducto(codigoProducto) {
    try {
        const response = await fetch(`/Proyecto_De_App_Fast_Food/api/productos/buscar?codProducto=${encodeURIComponent(codigoProducto)}`);
        const data = await response.json();
        
        if (data.exito && data.producto) {
            const p = data.producto;
            
            // Llenar el formulario con los datos del producto
            document.getElementById('codProducto').value = p.CodProducto || '';
            document.getElementById('codProducto').readOnly = true; // No permitir cambiar código
            document.getElementById('nombreProducto').value = p.NombreProducto || '';
            document.getElementById('categoria').value = p.Categoria || '';
            document.getElementById('tamano').value = p.Tamano || 'na';
            document.getElementById('precio').value = p.Precio || '';
            document.getElementById('costo').value = p.Costo || '';
            document.getElementById('stock').value = p.Stock || '';
            document.getElementById('stockMinimo').value = p.StockMinimo || '';
            document.getElementById('tiempoPreparacion').value = p.TiempoPreparacion || '';
            document.getElementById('estado').value = p.Estado || 'disponible';
            document.getElementById('codigoBarras').value = p.CodigoBarras || '';
            document.getElementById('descripcion').value = p.Descripcion || '';
        } else {
            alert('No se pudo cargar el producto');
            window.location.href = 'visualizar_productos.html';
        }
    } catch (error) {
        console.error('Error al cargar producto:', error);
        alert('Error al cargar el producto');
        window.location.href = 'visualizar_productos.html';
    }
}

// Registrar o actualizar producto
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
    const textoLoading = modoEdicion ? 'Actualizando...' : 'Registrando...';
    btnRegistrar.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${textoLoading}`;
    
    try {
        const endpoint = modoEdicion ? 'actualizar' : 'registrar';
        const method = modoEdicion ? 'PUT' : 'POST';
        
        const response = await fetch(`/Proyecto_De_App_Fast_Food/api/productos/${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.exito) {
            const mensaje = modoEdicion ? 'Producto actualizado exitosamente' : 'Producto registrado exitosamente';
            alert('✓ ' + mensaje);
            
            if (modoEdicion) {
                // Volver a la lista de productos
                window.location.href = 'visualizar_productos.html';
            } else {
                // Limpiar formulario en modo registro
                document.getElementById('formProducto').reset();
            }
        } else {
            alert('✗ Error: ' + (result.mensaje || 'No se pudo guardar el producto'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('✗ Error al guardar producto: ' + error.message);
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
