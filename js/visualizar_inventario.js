// ===== VISUALIZAR INVENTARIO - JAVASCRIPT =====

// Variables globales
let productosData = [];
let platosData = [];
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
    if (tabParam === 'productos' || tabParam === 'platos') {
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
    document.getElementById('platosSection').style.display = 'none';
    if (tab === 'productos') document.getElementById('productosSection').style.display = 'block';
    if (tab === 'platos') document.getElementById('platosSection').style.display = 'block';
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

// Cargar platos desde API
async function cargarPlatos() {
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/platos/listar', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.exito && data.platos) {
            // Calcular estado dinámico basado en stock
            platosData = data.platos.map(plato => {
                const stock = parseInt(plato.Stock) || 0;
                const stockMin = parseInt(plato.StockMinimo) || 0;
                let estadoCalculado = plato.Estado;
                
                if (stock === 0) {
                    estadoCalculado = 'agotado';
                } else if (stock <= stockMin) {
                    estadoCalculado = 'bajo_stock';
                } else {
                    estadoCalculado = 'disponible';
                }
                
                return { ...plato, EstadoCalculado: estadoCalculado };
            });
            renderizarPlatos(platosData);
            actualizarEstadisticas();
        } else {
            mostrarMensaje('Error al cargar platos', 'error');
        }
    } catch (error) {
        console.error('Error al cargar platos:', error);
        mostrarMensaje('Error al conectar con el servidor', 'error');
    }
}

// Renderizar platos en tabla
function renderizarPlatos(items) {
    const tbody = document.getElementById('platosBody');
    
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">No hay platos disponibles</td></tr>';
        return;
    }
    
    tbody.innerHTML = items.map(plato => `
        <tr>
            <td>${plato.IdPlato}</td>
            <td>${plato.NombrePlato}</td>
            <td>${plato.Categoria}</td>
            <td>${plato.Descripcion ? plato.Descripcion.substring(0, 50) + '...' : 'N/A'}</td>
            <td>S/ ${parseFloat(plato.Precio).toFixed(2)}</td>
            <td class="stock-cell">${plato.Stock}</td>
            <td>${plato.StockMinimo}</td>
            <td>
                <span class="badge ${getEstadoBadgeClass(plato.EstadoCalculado || plato.Estado)}">
                    ${formatearEstado(plato.EstadoCalculado || plato.Estado)}
                </span>
            </td>
            <td>
                <button class="btn-icon" onclick="verDetallesPlato('${plato.IdPlato}')" title="Ver detalles">
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
    if (tab === 'platos' && platosData.length === 0) cargarPlatos();
    
    // Actualizar estadísticas para la pestaña actual
    actualizarEstadisticas();
    
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
    } else if (tablaActual === 'platos') {
        datosActuales = platosData.filter(item => {
            const matchText = item.NombrePlato.toLowerCase().includes(searchText) ||
                             (item.Categoria && item.Categoria.toLowerCase().includes(searchText));
            const matchState = !stateFilter || item.Estado === stateFilter;
            return matchText && matchState;
        });
        renderizarPlatos(datosActuales);
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
    } else if (tablaActual === 'platos') {
        total = platosData.length;
        // Usar EstadoCalculado para contar stock bajo y agotados
        stockBajo = platosData.filter(p => {
            const estado = (p.EstadoCalculado || p.Estado || '').toLowerCase();
            return estado === 'bajo_stock';
        }).length;
        agotados = platosData.filter(p => {
            const estado = (p.EstadoCalculado || p.Estado || '').toLowerCase();
            return estado === 'agotado' || estado === 'no_disponible';
        }).length;
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

// Ver detalles de plato
function verDetallesPlato(id) {
    const plato = platosData.find(p => p.IdPlato == id);
    if (!plato) return;
    
    const modal = document.getElementById('detallesModal');
    document.getElementById('modalTitle').textContent = 'Detalles del Plato';
    document.getElementById('modalBody').innerHTML = `
        <div class="detalle-grid">
            <div class="detalle-item">
                <label>ID:</label>
                <span>${plato.IdPlato}</span>
            </div>
            <div class="detalle-item">
                <label>Nombre:</label>
                <span>${plato.NombrePlato}</span>
            </div>
            <div class="detalle-item">
                <label>Categoría:</label>
                <span>${plato.Categoria}</span>
            </div>
            <div class="detalle-item">
                <label>Precio:</label>
                <span>S/ ${parseFloat(plato.Precio).toFixed(2)}</span>
            </div>
            <div class="detalle-item">
                <label>Stock Actual:</label>
                <span class="stock-highlight">${plato.Stock}</span>
            </div>
            <div class="detalle-item">
                <label>Stock Mínimo:</label>
                <span>${plato.StockMinimo}</span>
            </div>
            <div class="detalle-item">
                <label>Estado:</label>
                <span class="badge ${getEstadoBadgeClass(plato.EstadoCalculado || plato.Estado)}">${formatearEstado(plato.EstadoCalculado || plato.Estado)}</span>
            </div>
            <div class="detalle-item full-width">
                <label>Descripción:</label>
                <span>${plato.Descripcion || 'N/A'}</span>
            </div>
            ${plato.RutaImagen ? `
            <div class="detalle-item full-width">
                <label>Imagen:</label>
                <img src="${plato.RutaImagen}" alt="${plato.NombrePlato}" style="max-width: 300px; border-radius: 8px;">
            </div>
            ` : ''}
        </div>
    `;
    modal.style.display = 'block';
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('detallesModal').style.display = 'none';
}

// Formatear estado para mostrar
function formatearEstado(estado) {
    if (!estado) return 'Desconocido';
    const estado_lower = estado.toLowerCase();
    
    if (estado_lower === 'bajo_stock') return 'Stock Bajo';
    if (estado_lower === 'no_disponible') return 'No Disponible';
    if (estado_lower === 'agotado') return 'Agotado';
    if (estado_lower === 'disponible') return 'Disponible';
    
    // Capitalizar primera letra si no coincide con ninguno
    return estado.charAt(0).toUpperCase() + estado.slice(1);
}

// Obtener clase CSS para badge de estado
function getEstadoBadgeClass(estado) {
    if (!estado) return 'badge-neutral';
    const estado_lower = estado.toLowerCase();
    
    if (estado_lower.includes('disponible') || estado_lower === 'disponible') {
        return 'badge-success';
    } else if (estado_lower.includes('agotado') || estado_lower === 'agotado') {
        return 'badge-danger';
    } else if (estado_lower.includes('bajo') || estado_lower === 'stock bajo' || estado_lower === 'bajo_stock') {
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
