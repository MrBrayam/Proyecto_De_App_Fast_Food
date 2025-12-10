// ===== VISUALIZAR PRODUCTOS - JAVASCRIPT =====

let productosGlobal = [];

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    cargarProductos();
    
    // Event listeners para filtros
    document.getElementById('btnBuscar').addEventListener('click', aplicarFiltros);
    document.getElementById('btnLimpiar').addEventListener('click', limpiarFiltros);
    document.getElementById('filterEstado').addEventListener('change', aplicarFiltros);
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

// Cargar productos desde API
async function cargarProductos() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const tableBody = document.getElementById('productosTableBody');
    const noDataMessage = document.getElementById('noDataMessage');
    
    loadingSpinner.style.display = 'flex';
    tableBody.innerHTML = '';
    noDataMessage.style.display = 'none';
    
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/productos/listar');
        const data = await response.json();
        
        if (data.exito && data.productos) {
            productosGlobal = data.productos;
            mostrarProductos(productosGlobal);
            actualizarEstadisticas(productosGlobal);
            llenarFiltrosCategorias(productosGlobal);
        } else {
            mostrarMensajeVacio();
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarMensajeVacio();
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

// Mostrar productos en tabla
function mostrarProductos(productos) {
    const tableBody = document.getElementById('productosTableBody');
    const noDataMessage = document.getElementById('noDataMessage');
    
    if (!productos || productos.length === 0) {
        mostrarMensajeVacio();
        return;
    }
    
    tableBody.innerHTML = '';
    noDataMessage.style.display = 'none';
    
    productos.forEach(p => {
        const fila = document.createElement('tr');
        const codigo = p.CodProducto || p.codProducto || '';
        const nombre = p.Nombre || p.nombre || '';
        const categoria = p.Categoria || p.categoria || '';
        const precio = p.Precio || p.precio || 0;
        const stock = p.Stock || p.stock || 0;
        const estado = (p.Estado || p.estado || 'no_disponible').toLowerCase();
        
        let estilo = 'badge-inactivo';
        let estadoMostrar = estado;
        
        if (estado === 'disponible') {
            estilo = 'badge-activo';
            estadoMostrar = 'DISPONIBLE';
        } else if (estado === 'no_disponible') {
            estilo = 'badge-inactivo';
            estadoMostrar = 'NO DISPONIBLE';
        } else if (estado === 'agotado') {
            estilo = 'badge-agotado';
            estadoMostrar = 'AGOTADO';
        }
        
        fila.innerHTML = `
            <td>${codigo}</td>
            <td>${nombre}</td>
            <td>${categoria}</td>
            <td>S/ ${parseFloat(precio).toFixed(2)}</td>
            <td>${stock}</td>
            <td><span class="badge ${estilo}">${estadoMostrar}</span></td>
            <td>
                <button class="btn-icon btn-edit" onclick="editarProducto('${codigo}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="confirmarEliminar('${codigo}')" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(fila);
    });
}

// Actualizar estadísticas
function actualizarEstadisticas(productos) {
    if (!productos) return;
    
    const total = productos.length;
    const activos = productos.filter(p => 
        (p.Estado || p.estado || '').toLowerCase() === 'disponible'
    ).length;
    const inactivos = total - activos;
    const stockBajo = productos.filter(p => {
        const stock = p.Stock || p.stock || 0;
        return stock > 0 && stock <= 10;
    }).length;
    
    document.getElementById('totalProductos').textContent = total;
    document.getElementById('productosActivos').textContent = activos;
    document.getElementById('productosInactivos').textContent = inactivos;
    document.getElementById('productosStockBajo').textContent = stockBajo;
}

// Llenar filtros de categorías
function llenarFiltrosCategorias(productos) {
    if (!productos) return;
    
    const select = document.getElementById('filterCategoria');
    const categorias = [...new Set(productos.map(p => p.Categoria || p.categoria))];
    
    // Limpiar opciones excepto la primera
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    categorias.forEach(cat => {
        if (cat) {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            select.appendChild(option);
        }
    });
}

// Aplicar filtros
function aplicarFiltros() {
    if (!productosGlobal || productosGlobal.length === 0) return;
    
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const categoria = document.getElementById('filterCategoria').value;
    const estado = document.getElementById('filterEstado').value;
    
    const productosFiltrados = productosGlobal.filter(p => {
        const codigo = (p.CodProducto || p.codProducto || '').toString().toLowerCase();
        const nombre = (p.Nombre || p.nombre || '').toLowerCase();
        const cat = p.Categoria || p.categoria || '';
        const est = p.Estado || p.estado || '';
        
        const cumpleTexto = codigo.includes(searchText) || nombre.includes(searchText);
        const cumpleCategoria = !categoria || cat === categoria;
        const cumpleEstado = !estado || est === estado;
        
        return cumpleTexto && cumpleCategoria && cumpleEstado;
    });
    
    mostrarProductos(productosFiltrados);
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCategoria').value = '';
    document.getElementById('filterEstado').value = '';
    mostrarProductos(productosGlobal);
}

// Mostrar mensaje vacío
function mostrarMensajeVacio() {
    document.getElementById('productosTableBody').innerHTML = '';
    document.getElementById('noDataMessage').style.display = 'flex';
}

// Editar producto - guardar en sessionStorage y redirigir
function editarProducto(codigoProducto) {
    if (!codigoProducto) {
        alert('Código de producto no válido');
        return;
    }
    
    // Buscar el producto en los datos cargados
    const producto = productosGlobal.find(p => 
        (p.CodProducto || p.codProducto) === codigoProducto
    );
    
    if (producto) {
        // Guardar en sessionStorage para cargar en el formulario
        sessionStorage.setItem('editarProductoData', JSON.stringify(producto));
        window.location.href = 'registrar_producto.html';
    } else {
        alert('Producto no encontrado');
    }
}

// Confirmar eliminación
function confirmarEliminar(codigoProducto) {
    if (!codigoProducto) {
        alert('Código de producto no válido');
        return;
    }
    
    const producto = productosGlobal.find(p => 
        (p.CodProducto || p.codProducto) === codigoProducto
    );
    
    if (!producto) {
        alert('Producto no encontrado');
        return;
    }
    
    const nombreProducto = producto.Nombre || producto.nombre || codigoProducto;
    const confirmacion = confirm(`¿Estás seguro de eliminar el producto "${nombreProducto}"?\n\nEsta acción no se puede deshacer.`);
    
    if (confirmacion) {
        eliminarProducto(codigoProducto);
    }
}

// Eliminar producto
async function eliminarProducto(codigoProducto) {
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/productos/eliminar', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ codProducto: codigoProducto })
        });
        
        const data = await response.json();
        
        if (data.exito) {
            alert('Producto eliminado exitosamente');
            cargarProductos(); // Recargar lista
        } else {
            alert('Error al eliminar producto: ' + (data.mensaje || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al conectar con el servidor');
    }
}
