// ===== VISUALIZAR INVENTARIO - JAVASCRIPT =====

// Variables globales
let productosData = [];
let insumosData = [];
let suministrosData = [];
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
    if (tabParam === 'suministros' || tabParam === 'insumos' || tabParam === 'productos') {
        document.getElementById('tabFilter').value = tabParam;
        tablaActual = tabParam;
    }

    // Cargar datos iniciales según pestaña activa
    if (tablaActual === 'suministros') {
        mostrarSeccion('suministros');
        cargarSuministros();
    } else if (tablaActual === 'insumos') {
        mostrarSeccion('insumos');
        cargarInsumos();
    } else {
        tablaActual = 'productos';
        mostrarSeccion('productos');
        cargarProductos();
    }
});

function mostrarSeccion(tab) {
    document.getElementById('productosSection').style.display = 'none';
    document.getElementById('insumosSection').style.display = 'none';
    document.getElementById('suministrosSection').style.display = 'none';
    if (tab === 'productos') document.getElementById('productosSection').style.display = 'block';
    if (tab === 'insumos') document.getElementById('insumosSection').style.display = 'block';
    if (tab === 'suministros') document.getElementById('suministrosSection').style.display = 'block';
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

// Cargar insumos desde API
async function cargarInsumos() {
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/inventario/insumos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.exito && data.items) {
            insumosData = data.items;
            renderizarInsumos(insumosData);
            actualizarEstadisticas();
        } else {
            mostrarMensaje('Error al cargar insumos', 'error');
        }
    } catch (error) {
        console.error('Error al cargar insumos:', error);
        mostrarMensaje('Error al conectar con el servidor', 'error');
    }
}

// Cargar suministros desde API
async function cargarSuministros() {
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/inventario/suministros', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.exito && data.items) {
            suministrosData = data.items;
            renderizarSuministros(suministrosData);
            actualizarEstadisticas();
        } else {
            mostrarMensaje('Error al cargar suministros', 'error');
        }
    } catch (error) {
        console.error('Error al cargar suministros:', error);
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

// Renderizar insumos en tabla
function renderizarInsumos(items) {
    const tbody = document.getElementById('insumosBody');
    
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay insumos disponibles</td></tr>';
        return;
    }
    
    tbody.innerHTML = items.map(insumo => `
        <tr>
            <td>${insumo.CodInsumo}</td>
            <td>${insumo.NombreInsumo}</td>
            <td>${insumo.Ubicacion || 'N/A'}</td>
            <td>S/ ${parseFloat(insumo.PrecioUnitario).toFixed(2)}</td>
            <td>${insumo.Vencimiento || 'N/A'}</td>
            <td>
                <span class="badge ${getEstadoBadgeClass(insumo.Estado)}">
                    ${insumo.Estado}
                </span>
            </td>
            <td>${insumo.Observacion || 'N/A'}</td>
            <td>
                <button class="btn-icon" onclick="verDetallesInsumo('${insumo.CodInsumo}')" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Renderizar suministros en tabla
function renderizarSuministros(items) {
    const tbody = document.getElementById('suministrosBody');
    
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center">No hay suministros disponibles</td></tr>';
        return;
    }
    
    tbody.innerHTML = items.map(suministro => `
        <tr>
            <td>${suministro.IdSuministro}</td>
            <td>${suministro.TipoSuministro}</td>
            <td>${suministro.NombreSuministro}</td>
            <td>${suministro.Cantidad}</td>
            <td>${suministro.UnidadMedida}</td>
            <td>S/ ${parseFloat(suministro.PrecioUnitario).toFixed(2)}</td>
            <td>S/ ${parseFloat(suministro.Total).toFixed(2)}</td>
            <td>${suministro.FechaCompra}</td>
            <td>
                <span class="badge ${getEstadoBadgeClass(suministro.Estado)}">
                    ${suministro.Estado}
                </span>
            </td>
            <td>
                <button class="btn-icon" onclick="verDetallesSuministro('${suministro.IdSuministro}')" title="Ver detalles">
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
    else if (tab === 'insumos' && insumosData.length === 0) cargarInsumos();
    else if (tab === 'suministros' && suministrosData.length === 0) cargarSuministros();
    
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
    } else if (tablaActual === 'insumos') {
        datosActuales = insumosData.filter(item => {
            const matchText = item.NombreInsumo.toLowerCase().includes(searchText) ||
                             item.CodInsumo.toString().toLowerCase().includes(searchText);
            const matchState = !stateFilter || item.Estado === stateFilter;
            return matchText && matchState;
        });
        renderizarInsumos(datosActuales);
    } else if (tablaActual === 'suministros') {
        datosActuales = suministrosData.filter(item => {
            const matchText = item.NombreSuministro.toLowerCase().includes(searchText) ||
                             item.IdSuministro.toString().toLowerCase().includes(searchText);
            const matchState = !stateFilter || item.Estado === stateFilter;
            return matchText && matchState;
        });
        renderizarSuministros(datosActuales);
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
    } else if (tablaActual === 'insumos') {
        total = insumosData.length;
        agotados = insumosData.filter(i => i.Estado === 'agotado').length;
    } else if (tablaActual === 'suministros') {
        total = suministrosData.length;
        agotados = suministrosData.filter(s => s.Estado === 'agotado').length;
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

// Ver detalles de insumo
function verDetallesInsumo(id) {
    const insumo = insumosData.find(i => i.CodInsumo == id);
    if (!insumo) return;
    
    const modal = document.getElementById('detallesModal');
    document.getElementById('modalTitle').textContent = 'Detalles del Insumo';
    document.getElementById('modalBody').innerHTML = `
        <div class="detalle-grid">
            <div class="detalle-item">
                <label>Código:</label>
                <span>${insumo.CodInsumo}</span>
            </div>
            <div class="detalle-item">
                <label>Nombre:</label>
                <span>${insumo.NombreInsumo}</span>
            </div>
            <div class="detalle-item">
                <label>Ubicación:</label>
                <span>${insumo.Ubicacion || 'N/A'}</span>
            </div>
            <div class="detalle-item">
                <label>Precio Unitario:</label>
                <span>S/ ${parseFloat(insumo.PrecioUnitario).toFixed(2)}</span>
            </div>
            <div class="detalle-item">
                <label>Vencimiento:</label>
                <span>${insumo.Vencimiento || 'N/A'}</span>
            </div>
            <div class="detalle-item">
                <label>Estado:</label>
                <span class="badge ${getEstadoBadgeClass(insumo.Estado)}">${insumo.Estado}</span>
            </div>
            <div class="detalle-item full-width">
                <label>Observaciones:</label>
                <span>${insumo.Observacion || 'Sin observaciones'}</span>
            </div>
        </div>
    `;
    modal.style.display = 'block';
}

// Ver detalles de suministro
function verDetallesSuministro(id) {
    const suministro = suministrosData.find(s => s.IdSuministro == id);
    if (!suministro) return;
    
    const modal = document.getElementById('detallesModal');
    document.getElementById('modalTitle').textContent = 'Detalles del Suministro';
    document.getElementById('modalBody').innerHTML = `
        <div class="detalle-grid">
            <div class="detalle-item">
                <label>ID:</label>
                <span>${suministro.IdSuministro}</span>
            </div>
            <div class="detalle-item">
                <label>Tipo:</label>
                <span>${suministro.TipoSuministro}</span>
            </div>
            <div class="detalle-item">
                <label>Nombre:</label>
                <span>${suministro.NombreSuministro}</span>
            </div>
            <div class="detalle-item">
                <label>Proveedor:</label>
                <span>${suministro.Proveedor}</span>
            </div>
            <div class="detalle-item">
                <label>Cantidad:</label>
                <span>${suministro.Cantidad} ${suministro.UnidadMedida}</span>
            </div>
            <div class="detalle-item">
                <label>Precio Unitario:</label>
                <span>S/ ${parseFloat(suministro.PrecioUnitario).toFixed(2)}</span>
            </div>
            <div class="detalle-item">
                <label>Total:</label>
                <span class="total-highlight">S/ ${parseFloat(suministro.Total).toFixed(2)}</span>
            </div>
            <div class="detalle-item">
                <label>Fecha de Compra:</label>
                <span>${suministro.FechaCompra}</span>
            </div>
            <div class="detalle-item">
                <label>Estado:</label>
                <span class="badge ${getEstadoBadgeClass(suministro.Estado)}">${suministro.Estado}</span>
            </div>
            <div class="detalle-item full-width">
                <label>Observaciones:</label>
                <span>${suministro.Observaciones || 'Sin observaciones'}</span>
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
