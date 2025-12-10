// ===== REGISTRAR PRODUCTO - JAVASCRIPT =====

let productoEditando = null;

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Verificar si estamos en modo edición
    const productoData = sessionStorage.getItem('editarProductoData');
    if (productoData) {
        cargarProductoParaEditar();
    }
    
    // Bind al evento submit del formulario
    const formProducto = document.getElementById('formProducto');
    if (formProducto) {
        formProducto.addEventListener('submit', submitForm);
    }
    
    // Event listener para botón limpiar
    const btnLimpiar = document.querySelector('.btn-limpiar');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', function(e) {
            e.preventDefault();
            limpiarFormulario();
        });
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
function cargarProductoParaEditar() {
    const productoData = sessionStorage.getItem('editarProductoData');
    if (!productoData) {
        console.log('No hay datos en sessionStorage');
        return;
    }
    
    try {
        const p = JSON.parse(productoData);
        console.log('Producto a cargar:', p);
        
        // Guardar código del producto editando
        productoEditando = p.CodProducto || p.codProducto;
        console.log('Código producto editando:', productoEditando);
        
        // Cambiar título y botón
        const titulo = document.querySelector('.section-title h2, h1');
        if (titulo) {
            titulo.textContent = 'Editar Producto';
        }
        
        const btnRegistrar = document.querySelector('.btn-registrar, button[type="submit"]');
        if (btnRegistrar) {
            btnRegistrar.innerHTML = '<i class="fas fa-save"></i> Actualizar Producto';
        }
        
        // Llenar el formulario con los datos del producto
        const campos = {
            codProducto: p.CodProducto || p.codProducto || '',
            nombreProducto: p.NombreProducto || p.Nombre || p.nombreProducto || '',
            categoria: p.Categoria || p.categoria || '',
            tamano: p.Tamano || p.tamano || 'na',
            precio: p.Precio || p.precio || '',
            costo: p.Costo || p.costo || '',
            stock: p.Stock || p.stock || '',
            stockMinimo: p.StockMinimo || p.stockMinimo || '',
            tiempoPreparacion: p.TiempoPreparacion || p.tiempoPreparacion || '',
            estado: p.Estado || p.estado || 'disponible',
            codigoBarras: p.CodigoBarras || p.codigoBarras || '',
            descripcion: p.Descripcion || p.descripcion || ''
        };
        
        console.log('Campos a llenar:', campos);
        
        // Asignar valores
        for (const [id, valor] of Object.entries(campos)) {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.value = valor;
                console.log(`Campo ${id} = ${valor}`);
            } else {
                console.warn(`Campo ${id} no encontrado en el DOM`);
            }
        }
        
        // Bloquear código de producto
        const codProductoInput = document.getElementById('codProducto');
        if (codProductoInput) {
            codProductoInput.readOnly = true;
        }
        
    } catch (error) {
        console.error('Error al cargar producto para editar:', error);
        alert('Error al cargar el producto');
        window.location.href = 'visualizar_productos.html';
    }
}

// Limpiar formulario
function limpiarFormulario() {
    if (confirm('¿Está seguro que desea limpiar el formulario?')) {
        const form = document.getElementById('formProducto');
        if (form) {
            form.reset();
        }
        
        // Limpiar modo edición
        productoEditando = null;
        sessionStorage.removeItem('editarProductoData');
        
        // Habilitar código de producto
        document.getElementById('codProducto').readOnly = false;
        
        // Restaurar título y botón
        const titulo = document.querySelector('.section-title h2, h1');
        if (titulo) {
            titulo.textContent = 'Registrar Nuevo Producto';
        }
        
        const btnRegistrar = document.querySelector('.btn-registrar, button[type="submit"]');
        if (btnRegistrar) {
            btnRegistrar.innerHTML = '<i class="fas fa-save"></i> Registrar Producto';
        }
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
    const btnRegistrar = document.querySelector('.btn-registrar, button[type="submit"]');
    const textOriginal = btnRegistrar.innerHTML;
    btnRegistrar.disabled = true;
    const textoLoading = productoEditando ? 'Actualizando...' : 'Registrando...';
    btnRegistrar.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${textoLoading}`;
    
    try {
        const endpoint = productoEditando ? 'actualizar' : 'registrar';
        const method = productoEditando ? 'PUT' : 'POST';
        
        const response = await fetch(`/Proyecto_De_App_Fast_Food/api/productos/${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.exito) {
            const mensaje = productoEditando ? 'Producto actualizado exitosamente' : 'Producto registrado exitosamente';
            alert('✓ ' + mensaje);
            
            // Limpiar sessionStorage
            sessionStorage.removeItem('editarProductoData');
            
            // Redirigir siempre a visualizar
            window.location.href = 'visualizar_productos.html';
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
