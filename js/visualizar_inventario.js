// ===== VISUALIZAR INVENTARIO - JAVASCRIPT =====

// Variables globales
let productosData = [];
let tablaActual = 'productos';

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Event listeners
    document.getElementById('tabFilter').addEventListener('change', cambiarPestana);
    document.getElementById('stateFilter').addEventListener('change', filtrarDatos);
    document.getElementById('searchInput').addEventListener('keyup', filtrarDatos);

    // Elegir pestaña inicial según query ?tab=
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'productos') {
        document.getElementById('tabFilter').value = tabParam;
        tablaActual = tabParam;
    }

    // Cargar datos iniciales
    tablaActual = 'productos';
    mostrarSeccion('productos');
    cargarProductos();
});

function mostrarSeccion(tab) {
    document.getElementById('productosSection').style.display = 'none';
    if (tab === 'productos') document.getElementById('productosSection').style.display = 'block';
}

// Cargar productos desde API
async function cargarProductos() {
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/inventario/productos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.exito && data.items) {
            productosData = data.items;
            renderizarProductos(productosData);
            actualizarEstadisticas();
        } else {
            mostrarMensaje('Error al cargar productos', 'error');
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarMensaje('Error al conectar con el servidor', 'error');
    }
}

// Renderizar productos en tabla
function renderizarProductos(items) {
    const tbody = document.getElementById('productosBody');
    
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center">No hay productos disponibles</td></tr>';
        return;
    }
    
    tbody.innerHTML = items.map(producto => `
        <tr>
            <td>${producto.CodProducto}</td>
            <td>${producto.NombreProducto}</td>
            <td>${producto.Categoria}</td>
            <td>${producto.Tamano}</td>
            <td>S/ ${parseFloat(producto.Precio).toFixed(2)}</td>
            <td>S/ ${parseFloat(producto.Costo).toFixed(2)}</td>
            <td class="stock-cell">${producto.Stock}</td>
            <td>${producto.StockMinimo}</td>
            <td>
                <span class="badge ${getEstadoBadgeClass(producto.EstadoStock)}">
                    ${producto.EstadoStock}
                </span>
            </td>
            <td>
                <button class="btn-icon" onclick="verDetallesProducto('${producto.IdProducto}')" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Cambiar pestaña
function cambiarPestana() {
    const tab = document.getElementById('tabFilter').value;
    tablaActual = tab;
    
    // Ocultar todas las secciones y mostrar la seleccionada
    mostrarSeccion(tab);
    
    // Cargar datos si es necesario
    if (tab === 'productos' && productosData.length === 0) cargarProductos();
    
    filtrarDatos();
}

// Filtrar datos
function filtrarDatos() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const stateFilter = document.getElementById('stateFilter').value;
    
    let datosActuales;
    
    if (tablaActual === 'productos') {
        datosActuales = productosData.filter(item => {
            const matchText = item.NombreProducto.toLowerCase().includes(searchText) ||
                             item.CodProducto.toLowerCase().includes(searchText);
            const matchState = !stateFilter || item.EstadoStock === stateFilter;
            return matchText && matchState;
        });
        renderizarProductos(datosActuales);
    }
}

// Actualizar estadísticas
function actualizarEstadisticas() {
    let total = 0;
    let stockBajo = 0;
    let agotados = 0;
    
    if (tablaActual === 'productos') {
        total = productosData.length;
        stockBajo = productosData.filter(p => p.EstadoStock === 'Stock Bajo').length;
        agotados = productosData.filter(p => p.EstadoStock === 'Agotado').length;
    }
    
    document.getElementById('totalItems').textContent = total;
    document.getElementById('lowStockItems').textContent = stockBajo;
    document.getElementById('outOfStockItems').textContent = agotados;
}

// Ver detalles de producto
function verDetallesProducto(id) {
    const producto = productosData.find(p => p.IdProducto == id);
    if (!producto) return;
    
    const modal = document.getElementById('detallesModal');
    document.getElementById('modalTitle').textContent = 'Detalles del Producto';
    document.getElementById('modalBody').innerHTML = `
        <div class="detalle-grid">
            <div class="detalle-item">
                <label>Código:</label>
                <span>${producto.CodProducto}</span>
            </div>
            <div class="detalle-item">
                <label>Nombre:</label>
                <span>${producto.NombreProducto}</span>
            </div>
            <div class="detalle-item">
                <label>Categoría:</label>
                <span>${producto.Categoria}</span>
            </div>
            <div class="detalle-item">
                <label>Tamaño:</label>
                <span>${producto.Tamano}</span>
            </div>
            <div class="detalle-item">
                <label>Precio:</label>
                <span>S/ ${parseFloat(producto.Precio).toFixed(2)}</span>
            </div>
            <div class="detalle-item">
                <label>Costo:</label>
                <span>S/ ${parseFloat(producto.Costo).toFixed(2)}</span>
            </div>
            <div class="detalle-item">
                <label>Stock Actual:</label>
                <span class="stock-highlight">${producto.Stock}</span>
            </div>
            <div class="detalle-item">
                <label>Stock Mínimo:</label>
                <span>${producto.StockMinimo}</span>
            </div>
            <div class="detalle-item">
                <label>Estado:</label>
                <span class="badge ${getEstadoBadgeClass(producto.EstadoStock)}">${producto.EstadoStock}</span>
            </div>
            <div class="detalle-item">
                <label>Descripción:</label>
                <span>${producto.Descripcion || 'N/A'}</span>
            </div>
        </div>
    `;
    modal.style.display = 'block';
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('detallesModal').style.display = 'none';
}

// Obtener clase CSS para badge de estado
function getEstadoBadgeClass(estado) {
    if (!estado) return 'badge-neutral';
    const estado_lower = estado.toLowerCase();
    
    if (estado_lower.includes('disponible') || estado_lower === 'disponible') {
        return 'badge-success';
    } else if (estado_lower.includes('agotado') || estado_lower === 'agotado') {
        return 'badge-danger';
    } else if (estado_lower.includes('bajo') || estado_lower === 'stock bajo') {
        return 'badge-warning';
    } else if (estado_lower.includes('vencido') || estado_lower === 'vencido') {
        return 'badge-danger';
    }
    return 'badge-neutral';
}

// Mostrar mensaje
function mostrarMensaje(mensaje, tipo = 'info') {
    alert(`[${tipo.toUpperCase()}] ${mensaje}`);
}

// Actualizar fecha y hora
function actualizarFechaHora() {
    const opciones = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const ahora = new Date().toLocaleDateString('es-ES', opciones);
    const elemento = document.getElementById('currentDate');
    if (elemento) {
        elemento.textContent = ahora;
    }
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('detallesModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
