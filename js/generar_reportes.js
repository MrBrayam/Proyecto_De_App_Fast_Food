/* ============================================
   GENERAR REPORTES - ARCHIVO PRINCIPAL
   Solo maneja fecha/hora como estructura estándar
   ============================================ */

// API_BASE definido en menu_principal.js
// const API_BASE = '/Proyecto_De_App_Fast_Food/api';

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


// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar fecha y hora inmediatamente
    actualizarFechaHora();
    
    // Actualizar cada segundo
    setInterval(actualizarFechaHora, 1000);
    
    // Llamar función de inicialización de funcionalidades
    if (typeof init === 'function') {
        init();
    }
});

/* ============================================
   FUNCIONALIDADES GENERAR REPORTES
   Lógica de negocio separada del archivo principal
   ============================================ */

// Variables globales
let tipoReporteActual = 'ventas';
let periodoActual = 'mes';
let vistaActual = 'grafico';
let chartPrincipal = null;
let chartSecundario = null;
let chartTendencias = null;
let chartProductos = null;
let chartProductosMenos = null;

// Función para actualizar títulos de gráficos según tipo de reporte
function actualizarTitulosGraficos(tipoReporte) {
    const titulos = {
        ventas: {
            principal: 'Distribución por Métodos de Pago',
            segundo: 'Top 3 Productos Más Vendidos',
            tercero: 'Productos Menos Vendidos'
        },
        compras: {
            principal: 'Estado de Compras',
            segundo: 'Top 3 Productos Más Comprados',
            tercero: 'Top 3 Proveedores'
        },
        inventario: {
            principal: 'Estado del Inventario',
            segundo: 'Top 3 Productos Más Vendidos',
            tercero: 'Top 3 Categorías por Valor'
        },
        clientes: {
            principal: 'Distribución por Métodos de Pago',
            segundo: 'Top 3 Clientes que Más Gastan',
            tercero: 'Clientes en Posición 4-6'
        },
        financiero: {
            principal: 'Flujo de Caja (Últimos 15 Días)',
            segundo: 'Top 3 Proveedores con Más Gastos',
            tercero: 'Top 3 Categorías con Más Gastos'
        }
    };
    
    const tituloConfig = titulos[tipoReporte] || titulos.ventas;
    
    const elementoPrincipal = document.getElementById('tituloGraficoPrincipal');
    const elementoSegundo = document.getElementById('tituloGraficoSegundo');
    const elementoTercero = document.getElementById('tituloGraficoTercero');
    
    if (elementoPrincipal) elementoPrincipal.textContent = tituloConfig.principal;
    if (elementoSegundo) elementoSegundo.textContent = tituloConfig.segundo;
    if (elementoTercero) elementoTercero.textContent = tituloConfig.tercero;
}

// Función de inicialización
function init() {
    configurarEventListeners();
    cargarTipoReporteDefault();
    actualizarVista();
}

// Configurar event listeners
function configurarEventListeners() {
    // Selección de tipo de reporte
    document.querySelectorAll('.tipo-reporte-card').forEach(card => {
        card.addEventListener('click', function() {
            // Remover clase active de todas las cards
            document.querySelectorAll('.tipo-reporte-card').forEach(c => c.classList.remove('active'));
            // Agregar clase active a la card seleccionada
            this.classList.add('active');
            
            // Actualizar tipo de reporte actual
            tipoReporteActual = this.dataset.tipo;
            
            // Actualizar contenido
            actualizarContenidoReporte();
        });
    });

    // Cambio de período
    document.getElementById('periodo').addEventListener('change', function() {
        periodoActual = this.value;
        
        // Mostrar/ocultar campos de fecha personalizada
        const fechaPersonalizada = document.querySelector('.fecha-personalizada');
        if (this.value === 'personalizado') {
            if (fechaPersonalizada) {
                fechaPersonalizada.style.display = 'block';
            }
            // No cargar datos aún, esperar a que el usuario ingrese las fechas
        } else {
            if (fechaPersonalizada) {
                fechaPersonalizada.style.display = 'none';
            }
            actualizarContenidoReporte();
        }
    });
    
    // Event listeners para fechas personalizadas
    const fechaFinInput = document.getElementById('fechaFin');
    if (fechaFinInput) {
        fechaFinInput.addEventListener('change', function() {
            if (periodoActual === 'personalizado') {
                actualizarContenidoReporte();
            }
        });
    }

    // Botón generar reporte
    document.getElementById('btnGenerar').addEventListener('click', generarReporte);

    // Botón limpiar filtros
    document.getElementById('btnLimpiar').addEventListener('click', limpiarFiltros);

    // Botones de vista
    document.querySelectorAll('.btn-vista').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            document.querySelectorAll('.btn-vista').forEach(b => b.classList.remove('active'));
            // Agregar clase active al botón seleccionado
            this.classList.add('active');
            
            // Actualizar vista actual
            vistaActual = this.dataset.vista;
            
            // Actualizar contenido de vista
            actualizarVista();
        });
    });

    // Búsqueda en tabla
    document.getElementById('buscarTabla').addEventListener('input', function() {
        filtrarTabla(this.value);
    });

    // Botones de exportar e imprimir
    document.getElementById('exportarTabla').addEventListener('click', exportarTabla);
    document.getElementById('imprimirTabla').addEventListener('click', imprimirTabla);

    // Botón limpiar historial
    document.getElementById('btnLimpiarHistorial').addEventListener('click', limpiarHistorial);

    // Botones del historial
    document.querySelectorAll('.btn-historial-accion').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const accion = this.title.toLowerCase();
            const item = this.closest('.historial-item');
            
            switch(accion) {
                case 'ver':
                    verReporteHistorial(item);
                    break;
                case 'descargar':
                    descargarReporteHistorial(item);
                    break;
                case 'eliminar':
                    eliminarReporteHistorial(item);
                    break;
            }
        });
    });
}

// Cargar tipo de reporte por defecto
function cargarTipoReporteDefault() {
    // No cargar automáticamente para evitar precarga de gráficos
    // El usuario debe seleccionar manualmente o hacer clic en generar
}

// Actualizar contenido del reporte según el tipo y período seleccionado
function actualizarContenidoReporte() {
    if (tipoReporteActual === 'ventas') {
        cargarReporteVentasDesdeAPI();
    } else if (tipoReporteActual === 'compras') {
        cargarReporteComprasDesdeAPI();
    } else if (tipoReporteActual === 'inventario') {
        cargarReporteInventarioDesdeAPI();
    } else if (tipoReporteActual === 'clientes') {
        cargarReporteClientesDesdeAPI();
    } else if (tipoReporteActual === 'financiero') {
        cargarReporteFinancieroDesdeAPI();
    } else {
        const datos = obtenerDatosReporte();
        actualizarTituloVisualizacion();
        actualizarEstadisticas(datos);
        actualizarTabla(datos);
        actualizarResumen(datos);
        actualizarGraficos();
    }
}

// Cargar reporte de ventas desde API
async function cargarReporteVentasDesdeAPI() {
    try {
        let url = `${API_BASE}/reportes/ventas-por-periodo?periodo=${periodoActual}`;
        
        // Si es período personalizado, agregar fechas
        if (periodoActual === 'personalizado') {
            const fechaInicio = document.getElementById('fechaInicio')?.value;
            const fechaFin = document.getElementById('fechaFin')?.value;
            
            if (!fechaInicio || !fechaFin) {
                alert('Por favor, selecciona un rango de fechas');
                return;
            }
            
            url += `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
        }
        
        const resp = await fetch(url);
        const data = await resp.json();
        
        if (data.exito) {
            actualizarTituloVisualizacion();
            actualizarEstadisticasVentas(data.resumen);
            actualizarTablaVentas(data.ventasPorProducto);
            actualizarResumenVentas(data.resumen);
            actualizarGraficosVentas(data);
        } else {
            console.error('Error al cargar reporte:', data.mensaje);
            alert('Error al cargar el reporte de ventas');
        }
    } catch (error) {
        console.error('Error al obtener reporte:', error);
        alert('Error al conectar con el servidor');
    }
}

// Cargar reporte de compras desde API
async function cargarReporteComprasDesdeAPI() {
    try {
        let url = `${API_BASE}/reportes/compras-por-periodo?periodo=${periodoActual}`;
        
        // Si es período personalizado, agregar fechas
        if (periodoActual === 'personalizado') {
            const fechaInicio = document.getElementById('fechaInicio')?.value;
            const fechaFin = document.getElementById('fechaFin')?.value;
            
            if (!fechaInicio || !fechaFin) {
                alert('Por favor, selecciona un rango de fechas');
                return;
            }
            
            url += `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
        }
        
        const resp = await fetch(url);
        const data = await resp.json();
        
        if (data.exito) {
            actualizarTituloVisualizacion();
            actualizarEstadisticasCompras(data.resumen);
            actualizarTablaCompras(data.comprasPorProducto);
            actualizarResumenCompras(data.resumen);
            actualizarGraficosCompras(data);
        } else {
            console.error('Error al cargar reporte:', data.mensaje);
            alert('Error al cargar el reporte de compras');
        }
    } catch (error) {
        console.error('Error al obtener reporte:', error);
        alert('Error al conectar con el servidor');
    }
}

// Cargar reporte de clientes desde API
async function cargarReporteClientesDesdeAPI() {
    try {
        let url = `${API_BASE}/reportes/clientes-por-periodo?periodo=${periodoActual}`;
        
        if (periodoActual === 'personalizado') {
            const fechaInicio = document.getElementById('fechaInicio')?.value;
            const fechaFin = document.getElementById('fechaFin')?.value;
            
            if (!fechaInicio || !fechaFin) {
                alert('Por favor, selecciona un rango de fechas');
                return;
            }
            
            url += `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
        }
        
        const resp = await fetch(url);
        const data = await resp.json();
        
        if (data.exito) {
            actualizarTituloVisualizacion();
            actualizarEstadisticasClientes(data.resumen);
            actualizarTablaClientes(data.clientesTopGasto);
            actualizarResumenClientes(data.resumen);
            actualizarGraficosClientes(data);
        } else {
            console.error('Error al cargar reporte:', data.mensaje);
            alert('Error al cargar el reporte de clientes');
        }
    } catch (error) {
        console.error('Error al obtener reporte:', error);
        alert('Error al conectar con el servidor');
    }
}

// Cargar reporte de inventario desde API
async function cargarReporteInventarioDesdeAPI() {
    try {
        const resp = await fetch(`${API_BASE}/reportes/inventario-por-categoria`);
        const data = await resp.json();
        
        if (data.exito) {
            actualizarTituloVisualizacion();
            actualizarEstadisticasInventario(data.resumen);
            actualizarTablaInventario(data.productosBajoStock);
            actualizarResumenInventario(data.resumen);
            actualizarGraficosInventario(data);
        } else {
            console.error('Error al cargar reporte:', data.mensaje);
            alert('Error al cargar el reporte de inventario');
        }
    } catch (error) {
        console.error('Error al obtener reporte:', error);
        alert('Error al conectar con el servidor');
    }
}

// Actualizar título de visualización según el tipo de reporte
function actualizarTituloVisualizacion() {
    const titulos = {
        'ventas': 'Visualización de Reportes de Ventas',
        'compras': 'Visualización de Reportes de Compras',
        'inventario': 'Visualización de Reportes de Inventario',
        'clientes': 'Visualización de Reportes de Clientes',
        'empleados': 'Visualización de Reportes de Empleados',
        'financiero': 'Visualización de Reportes Financieros'
    };
    
    const iconos = {
        'ventas': 'fa-dollar-sign',
        'compras': 'fa-shopping-cart',
        'inventario': 'fa-boxes',
        'clientes': 'fa-users',
        'empleados': 'fa-user-tie',
        'financiero': 'fa-chart-pie'
    };
    
    const tituloElement = document.querySelector('.visualizacion-header h2');
    if (tituloElement) {
        tituloElement.innerHTML = `<i class="fas ${iconos[tipoReporteActual]}"></i> ${titulos[tipoReporteActual]}`;
    }
}

// Actualizar vista activa
function actualizarVista() {
    // Ocultar todas las vistas
    document.querySelectorAll('.vista-content').forEach(vista => {
        vista.classList.remove('active');
    });
    
    // Mostrar vista activa
    document.querySelector(`.vista-${vistaActual}`).classList.add('active');
}

// Generar reporte
function generarReporte() {
    const btn = document.getElementById('btnGenerar');
    const originalText = btn.innerHTML;
    
    // Mostrar estado de carga
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    btn.disabled = true;
    
    setTimeout(() => {
        actualizarContenidoReporte();
        
        // Agregar al historial
        agregarAlHistorial();
        
        // Restaurar botón
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        // Mostrar notificación de éxito
        mostrarNotificacion('Reporte generado exitosamente', 'success');
    }, 1500);
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('periodo').value = 'mes';
    document.querySelector('.fecha-personalizada').style.display = 'none';
    document.getElementById('fechaInicio').value = '';
    document.getElementById('fechaFin').value = '';
    document.querySelector('input[name="formato"][value="pdf"]').checked = true;
    
    periodoActual = 'mes';
    actualizarContenidoReporte();
    
    mostrarNotificacion('Filtros limpiados', 'info');
}

// Filtrar tabla
function filtrarTabla(termino) {
    const filas = document.querySelectorAll('#tablaReporte tbody tr');
    termino = termino.toLowerCase();
    
    filas.forEach(fila => {
        const texto = fila.textContent.toLowerCase();
        if (texto.includes(termino)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

// Exportar tabla
function exportarTabla() {
    const formato = document.querySelector('input[name="formato"]:checked').value;
    
    mostrarNotificacion(`Exportando tabla en formato ${formato.toUpperCase()}...`, 'info');
    
    setTimeout(() => {
        mostrarNotificacion(`Tabla exportada exitosamente en ${formato.toUpperCase()}`, 'success');
    }, 1000);
}

// Imprimir tabla
function imprimirTabla() {
    mostrarNotificacion('Preparando impresión...', 'info');
    
    setTimeout(() => {
        window.print();
    }, 500);
}

// Agregar al historial
function agregarAlHistorial() {
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-PE') + ' - ' + ahora.toLocaleTimeString('es-PE', {hour: '2-digit', minute: '2-digit'});
    
    const iconos = {
        'ventas': 'fa-dollar-sign',
        'compras': 'fa-shopping-cart',
        'inventario': 'fa-boxes',
        'clientes': 'fa-users',
        'empleados': 'fa-user-tie',
        'financiero': 'fa-chart-pie'
    };
    
    const nombres = {
        'ventas': 'Reporte de Ventas',
        'compras': 'Reporte de Compras',
        'inventario': 'Reporte de Inventario',
        'clientes': 'Reporte de Clientes',
        'empleados': 'Reporte de Empleados',
        'financiero': 'Reporte Financiero'
    };
    
    const nuevoItem = `
        <div class="historial-item">
            <div class="historial-info">
                <div class="historial-tipo">
                    <i class="fas ${iconos[tipoReporteActual]}"></i>
                    <span>${nombres[tipoReporteActual]}</span>
                </div>
                <div class="historial-detalles">
                    <span class="historial-fecha">${fecha}</span>
                    <span class="historial-periodo">${obtenerNombrePeriodo()}</span>
                </div>
            </div>
            <div class="historial-acciones">
                <button class="btn-historial-accion" title="Ver">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-historial-accion" title="Descargar">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn-historial-accion eliminar" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    const historialLista = document.querySelector('.historial-lista');
    historialLista.insertAdjacentHTML('afterbegin', nuevoItem);
    
    // Configurar eventos para el nuevo item
    const nuevoItemElement = historialLista.firstElementChild;
    nuevoItemElement.querySelectorAll('.btn-historial-accion').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const accion = this.title.toLowerCase();
            
            switch(accion) {
                case 'ver':
                    verReporteHistorial(nuevoItemElement);
                    break;
                case 'descargar':
                    descargarReporteHistorial(nuevoItemElement);
                    break;
                case 'eliminar':
                    eliminarReporteHistorial(nuevoItemElement);
                    break;
            }
        });
    });
}

// Limpiar historial
function limpiarHistorial() {
    if (confirm('¿Estás seguro de que quieres eliminar todo el historial de reportes?')) {
        document.querySelector('.historial-lista').innerHTML = `
            <div style="text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.5);">
                <i class="fas fa-history" style="font-size: 3rem; margin-bottom: 1rem; color: rgba(255, 87, 51, 0.3);"></i>
                <p>No hay reportes en el historial</p>
            </div>
        `;
        mostrarNotificacion('Historial limpiado exitosamente', 'success');
    }
}

// Ver reporte del historial
function verReporteHistorial(item) {
    mostrarNotificacion('Cargando reporte...', 'info');
}

// Descargar reporte del historial
function descargarReporteHistorial(item) {
    mostrarNotificacion('Descargando reporte...', 'info');
}

// Eliminar reporte del historial
function eliminarReporteHistorial(item) {
    if (confirm('¿Estás seguro de que quieres eliminar este reporte del historial?')) {
        item.remove();
        mostrarNotificacion('Reporte eliminado del historial', 'success');
    }
}

// Funciones de utilidad
function formatearMoneda(valor) {
    if (valor < 0) {
        return '-S/. ' + Math.abs(valor).toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
    return 'S/. ' + valor.toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function obtenerClaseBadge(estado) {
    const clases = {
        'Completado': 'badge-success',
        'Pendiente': 'badge-warning',
        'Cancelado': 'badge-danger',
        'Recibido': 'badge-success',
        'Normal': 'badge-info',
        'Stock Bajo': 'badge-warning',
        'Activo': 'badge-success',
        'VIP': 'badge-primary',
        'Positivo': 'badge-success'
    };
    return clases[estado] || 'badge-secondary';
}

function obtenerNombrePeriodo() {
    const nombres = {
        'hoy': 'Hoy',
        'semana': 'Esta Semana',
        'mes': 'Este Mes',
        'trimestre': 'Este Trimestre',
        'anio': 'Este Año',
        'personalizado': 'Período Personalizado'
    };
    return nombres[periodoActual] || 'No definido';
}

function mostrarNotificacion(mensaje, tipo) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${mensaje}</span>
    `;
    
    // Estilos CSS en línea para la notificación
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'success' ? 'linear-gradient(135deg, #28a745, #20c997)' : 
                     tipo === 'error' ? 'linear-gradient(135deg, #dc3545, #c82333)' : 
                     'linear-gradient(135deg, #17a2b8, #138496)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        animation: slideIn 0.3s ease;
        max-width: 350px;
    `;
    
    // Agregar animación CSS
    if (!document.querySelector('#notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notificacion);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
}

// Agregar estilos para badges
if (!document.querySelector('#badgeStyles')) {
    const style = document.createElement('style');
    style.id = 'badgeStyles';
    style.textContent = `
        .badge {
            padding: 0.3rem 0.6rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .badge-success { background: linear-gradient(135deg, #28a745, #20c997); color: white; }
        .badge-warning { background: linear-gradient(135deg, #ffc857, #ff8800); color: #1a1d2e; }
        .badge-danger { background: linear-gradient(135deg, #dc3545, #c82333); color: white; }
        .badge-info { background: linear-gradient(135deg, #17a2b8, #138496); color: white; }
        .badge-primary { background: linear-gradient(135deg, #ff5733, #ffc857); color: #1a1d2e; }
        .badge-secondary { background: linear-gradient(135deg, #6c757d, #495057); color: white; }
    `;
    document.head.appendChild(style);
}

// ============================================
// FUNCIONES DE GRÁFICOS
// ============================================

// Actualizar gráficos según el tipo de reporte
function actualizarGraficos() {
    // Destruir gráficos anteriores
    if (chartPrincipal) chartPrincipal.destroy();
    if (chartSecundario) chartSecundario.destroy();
    if (chartTendencias) chartTendencias.destroy();
    if (chartProductos) chartProductos.destroy();
    if (chartProductosMenos) chartProductosMenos.destroy();
    
    // Crear nuevos gráficos según el tipo de reporte
    switch (tipoReporteActual) {
        case 'ventas':
            crearGraficosVentas();
            break;
        case 'compras':
            crearGraficosCompras();
            break;
        case 'inventario':
            crearGraficosInventario();
            break;
        case 'clientes':
            crearGraficosClientes();
            break;
        case 'empleados':
            crearGraficosEmpleados();
            break;
        case 'financiero':
            crearGraficosFinanciero();
            break;
        default:
            crearGraficosVentas();
    }
}

// Gráficos de Ventas
function crearGraficosVentas() {
    // Mostrar todos los gráficos para ventas
    document.querySelector('#graficosGrid .grafico-card:nth-child(4)').style.display = 'block';
    document.querySelector('#graficosGrid .grafico-card:nth-child(5)').style.display = 'block';
    
    // Actualizar títulos
    document.querySelector('#graficosGrid .grafico-card:nth-child(1) .titulo-grafico').textContent = 'Ventas por Categoría';
    document.querySelector('#graficosGrid .grafico-card:nth-child(2) .titulo-grafico').textContent = 'Métodos de Pago';
    document.querySelector('#graficosGrid .grafico-card:nth-child(3) .titulo-grafico').textContent = 'Tipo de Servicio';
    document.querySelector('#graficosGrid .grafico-card:nth-child(4) .titulo-grafico').textContent = 'Productos Más Vendidos';
    document.querySelector('#graficosGrid .grafico-card:nth-child(5) .titulo-grafico').textContent = 'Productos Menos Vendidos';
    
    // Gráfico Principal: Ventas por Categoría
    const ctxPrincipal = document.getElementById('chartPrincipal').getContext('2d');
    chartPrincipal = new Chart(ctxPrincipal, {
        type: 'doughnut',
        data: {
            labels: ['Pizzas', 'Bebidas', 'Complementos', 'Postres'],
            datasets: [{
                data: [60, 16, 16, 8],
                backgroundColor: ['#ff5733', '#ffc857', '#3498db', '#9b59b6'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });
    
    // Actualizar leyenda principal
    document.getElementById('leyendaPrincipal').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #ff5733;"></span><span>Pizzas - 60%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ffc857;"></span><span>Bebidas - 16%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #3498db;"></span><span>Complementos - 16%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #9b59b6;"></span><span>Postres - 8%</span></div>
    `;
    
    // Gráfico Secundario: Métodos de Pago
    const ctxSecundario = document.getElementById('chartSecundario').getContext('2d');
    chartSecundario = new Chart(ctxSecundario, {
        type: 'doughnut',
        data: {
            labels: ['Efectivo', 'Tarjeta', 'Transferencia'],
            datasets: [{
                data: [45, 35, 20],
                backgroundColor: ['#27ae60', '#3498db', '#9b59b6'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });
    
    // Actualizar leyenda secundaria
    document.getElementById('leyendaSecundario').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #27ae60;"></span><span>Efectivo - 45%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #3498db;"></span><span>Tarjeta - 35%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #9b59b6;"></span><span>Transferencia - 20%</span></div>
    `;
    
    // Gráfico de Tendencias: Tipo de Servicio
    const ctxTendencias = document.getElementById('chartTendencias').getContext('2d');
    chartTendencias = new Chart(ctxTendencias, {
        type: 'doughnut',
        data: {
            labels: ['Delivery', 'Para llevar', 'En local'],
            datasets: [{
                data: [55, 30, 15],
                backgroundColor: ['#ff5733', '#ffc857', '#3498db'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });
    
    // Actualizar leyenda de tendencias
    document.getElementById('leyendaTendencias').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #ff5733;"></span><span>Delivery - 55%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ffc857;"></span><span>Para llevar - 30%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #3498db;"></span><span>En local - 15%</span></div>
    `;

    // Gráfico de Productos Específicos Más Vendidos
    const ctxProductos = document.getElementById('chartProductos').getContext('2d');
    chartProductos = new Chart(ctxProductos, {
        type: 'bar',
        data: {
            labels: ['Pizza Hawaiana', 'Pizza Pepperoni', 'Pizza Margherita', 'Coca Cola 500ml', 'Hamburguesa Clásica', 'Papas Fritas', 'Brownie'],
            datasets: [{
                label: 'Unidades Vendidas',
                data: [125, 98, 87, 156, 64, 78, 45],
                backgroundColor: [
                    '#ff5733',
                    '#ff6b47', 
                    '#ff7f5b',
                    '#ffc857',
                    '#3498db',
                    '#5dade2',
                    '#9b59b6'
                ],
                borderColor: '#ffffff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#ffffff',
                        font: { size: 11 }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#ffffff',
                        font: { size: 10 },
                        maxRotation: 45
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });

    // Actualizar leyenda de productos
    document.getElementById('leyendaProductos').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #ff5733;"></span><span>Pizza Hawaiana - 125 unidades</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ffc857;"></span><span>Coca Cola 500ml - 156 unidades</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ff6b47;"></span><span>Pizza Pepperoni - 98 unidades</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ff7f5b;"></span><span>Pizza Margherita - 87 unidades</span></div>
    `;

    // Gráfico de Productos Menos Vendidos
    const ctxProductosMenos = document.getElementById('chartProductosMenos').getContext('2d');
    chartProductosMenos = new Chart(ctxProductosMenos, {
        type: 'bar',
        data: {
            labels: ['Ensalada César', 'Agua Mineral', 'Helado Vainilla', 'Café Americano', 'Salsa Extra', 'Pan de Ajo'],
            datasets: [{
                label: 'Unidades Vendidas',
                data: [8, 12, 15, 18, 22, 25],
                backgroundColor: [
                    '#e74c3c',
                    '#ec7063', 
                    '#f1948a',
                    '#f5b7b1',
                    '#fadbd8',
                    '#fdeaea'
                ],
                borderColor: '#ffffff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 30,
                    ticks: {
                        color: '#ffffff',
                        font: { size: 11 }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#ffffff',
                        font: { size: 10 },
                        maxRotation: 45
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });

    // Actualizar leyenda de productos menos vendidos
    document.getElementById('leyendaProductosMenos').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #e74c3c;"></span><span>Ensalada César - 8 unidades</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ec7063;"></span><span>Agua Mineral - 12 unidades</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #f1948a;"></span><span>Helado Vainilla - 15 unidades</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #f5b7b1;"></span><span>Café Americano - 18 unidades</span></div>
    `;
}

// Gráficos de Compras
function crearGraficosCompras() {
    // Ocultar el cuarto y quinto gráfico para este tipo de reporte
    document.querySelector('#graficosGrid .grafico-card:nth-child(4)').style.display = 'none';
    document.querySelector('#graficosGrid .grafico-card:nth-child(5)').style.display = 'none';
    
    // Actualizar títulos
    document.querySelector('#graficosGrid .grafico-card:nth-child(1) .titulo-grafico').textContent = 'Compras por Categoría';
    document.querySelector('#graficosGrid .grafico-card:nth-child(2) .titulo-grafico').textContent = 'Top Proveedores';
    document.querySelector('#graficosGrid .grafico-card:nth-child(3) .titulo-grafico').textContent = 'Estado de Órdenes';
    
    // Gráfico Principal: Compras por Categoría
    const ctxPrincipal = document.getElementById('chartPrincipal').getContext('2d');
    chartPrincipal = new Chart(ctxPrincipal, {
        type: 'doughnut',
        data: {
            labels: ['Productos', 'Otros'],
            datasets: [{
                data: [50, 35, 15],
                backgroundColor: ['#ff5733', '#3498db', '#9b59b6'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });
    
    document.getElementById('leyendaPrincipal').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #ff5733;"></span><span>Productos - 50%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #3498db;"></span><span>Productos - 35%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #9b59b6;"></span><span>Otros - 15%</span></div>
    `;
    
    // Gráfico Secundario: Top Proveedores
    const ctxSecundario = document.getElementById('chartSecundario').getContext('2d');
    chartSecundario = new Chart(ctxSecundario, {
        type: 'doughnut',
        data: {
            labels: ['Distribuidora ABC', 'Alimentos XYZ', 'Otros'],
            datasets: [{
                data: [40, 35, 25],
                backgroundColor: ['#27ae60', '#3498db', '#9b59b6'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });
    
    document.getElementById('leyendaSecundario').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #27ae60;"></span><span>Distribuidora ABC - 40%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #3498db;"></span><span>Alimentos XYZ - 35%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #9b59b6;"></span><span>Otros - 25%</span></div>
    `;
    
    // Gráfico de Tendencias: Estado de Órdenes
    const ctxTendencias = document.getElementById('chartTendencias').getContext('2d');
    chartTendencias = new Chart(ctxTendencias, {
        type: 'doughnut',
        data: {
            labels: ['Completadas', 'Pendientes', 'Canceladas'],
            datasets: [{
                data: [70, 20, 10],
                backgroundColor: ['#27ae60', '#ffc857', '#e74c3c'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });
    
    document.getElementById('leyendaTendencias').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #27ae60;"></span><span>Completadas - 70%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ffc857;"></span><span>Pendientes - 20%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #e74c3c;"></span><span>Canceladas - 10%</span></div>
    `;
}

// Gráficos de Empleados
function crearGraficosEmpleados() {
    // Ocultar el cuarto y quinto gráfico para este tipo de reporte
    document.querySelector('#graficosGrid .grafico-card:nth-child(4)').style.display = 'none';
    document.querySelector('#graficosGrid .grafico-card:nth-child(5)').style.display = 'none';
    
    // Actualizar títulos
    document.querySelector('#graficosGrid .grafico-card:nth-child(1) .titulo-grafico').textContent = 'Top Empleados por Rendimiento';
    document.querySelector('#graficosGrid .grafico-card:nth-child(2) .titulo-grafico').textContent = 'Distribución por Turno';
    document.querySelector('#graficosGrid .grafico-card:nth-child(3) .titulo-grafico').textContent = 'Dinero Generado por Empleado';
    
    // Gráfico Principal: Top Empleados
    const ctxPrincipal = document.getElementById('chartPrincipal').getContext('2d');
    chartPrincipal = new Chart(ctxPrincipal, {
        type: 'doughnut',
        data: {
            labels: ['Carlos Mendoza', 'Ana García', 'Luis Pérez', 'María Torres', 'Otros'],
            datasets: [{
                data: [25, 20, 18, 15, 22],
                backgroundColor: ['#ff5733', '#ffc857', '#3498db', '#27ae60', '#9b59b6'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });
    
    document.getElementById('leyendaPrincipal').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #ff5733;"></span><span>Carlos Mendoza</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ffc857;"></span><span>Ana García</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #3498db;"></span><span>Luis Pérez</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #27ae60;"></span><span>María Torres</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #9b59b6;"></span><span>Otros</span></div>
    `;
    
    // Gráfico Secundario: Distribución por Turno
    const ctxSecundario = document.getElementById('chartSecundario').getContext('2d');
    chartSecundario = new Chart(ctxSecundario, {
        type: 'doughnut',
        data: {
            labels: ['Mañana', 'Tarde', 'Noche'],
            datasets: [{
                data: [35, 40, 25],
                backgroundColor: ['#ffc857', '#ff5733', '#3498db'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });
    
    document.getElementById('leyendaSecundario').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #ffc857;"></span><span>Mañana - 35%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ff5733;"></span><span>Tarde - 40%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #3498db;"></span><span>Noche - 25%</span></div>
    `;
    
    // Gráfico de Tendencias: Dinero Generado por Empleado
    const ctxTendencias = document.getElementById('chartTendencias').getContext('2d');
    chartTendencias = new Chart(ctxTendencias, {
        type: 'doughnut',
        data: {
            labels: ['Carlos Mendoza', 'Ana García', 'Luis Pérez', 'María Torres'],
            datasets: [{
                data: [2850, 2650, 2400, 2100],
                backgroundColor: ['#27ae60', '#3498db', '#ff5733', '#9b59b6'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });
    
    document.getElementById('leyendaTendencias').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #27ae60;"></span><span>Carlos - S/. 2,850</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #3498db;"></span><span>Ana - S/. 2,650</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ff5733;"></span><span>Luis - S/. 2,400</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #9b59b6;"></span><span>María - S/. 2,100</span></div>
    `;
}

// Gráficos de Inventario
function crearGraficosInventario() {
    // Ocultar el cuarto y quinto gráfico para este tipo de reporte
    document.querySelector('#graficosGrid .grafico-card:nth-child(4)').style.display = 'none';
    document.querySelector('#graficosGrid .grafico-card:nth-child(5)').style.display = 'none';
    
    document.querySelector('#graficosGrid .grafico-card:nth-child(1) .titulo-grafico').textContent = 'Estado del Stock';
    document.querySelector('#graficosGrid .grafico-card:nth-child(2) .titulo-grafico').textContent = 'Categorías de Productos';
    document.querySelector('#graficosGrid .grafico-card:nth-child(3) .titulo-grafico').textContent = 'Productos Críticos';
    
    const ctxPrincipal = document.getElementById('chartPrincipal').getContext('2d');
    chartPrincipal = new Chart(ctxPrincipal, {
        type: 'doughnut',
        data: {
            labels: ['Normal', 'Stock Bajo', 'Agotado', 'Por Vencer'],
            datasets: [{
                data: [60, 25, 10, 5],
                backgroundColor: ['#27ae60', '#ffc857', '#e74c3c', '#9b59b6'],
                borderWidth: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
    
    document.getElementById('leyendaPrincipal').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #27ae60;"></span><span>Normal - 60%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ffc857;"></span><span>Stock Bajo - 25%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #e74c3c;"></span><span>Agotado - 10%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #9b59b6;"></span><span>Por Vencer - 5%</span></div>
    `;
    
    const ctxSecundario = document.getElementById('chartSecundario').getContext('2d');
    chartSecundario = new Chart(ctxSecundario, {
        type: 'doughnut',
        data: {
            labels: ['Ingredientes', 'Bebidas', 'Envases'],
            datasets: [{
                data: [50, 30, 20],
                backgroundColor: ['#ff5733', '#3498db', '#ffc857'],
                borderWidth: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
    
    document.getElementById('leyendaSecundario').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #ff5733;"></span><span>Ingredientes - 50%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #3498db;"></span><span>Bebidas - 30%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ffc857;"></span><span>Envases - 20%</span></div>
    `;
    
    const ctxTendencias = document.getElementById('chartTendencias').getContext('2d');
    chartTendencias = new Chart(ctxTendencias, {
        type: 'doughnut',
        data: {
            labels: ['Harina', 'Pepperoni', 'Queso', 'Otros'],
            datasets: [{
                data: [30, 25, 20, 25],
                backgroundColor: ['#e74c3c', '#ff5733', '#ffc857', '#9b59b6'],
                borderWidth: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
    
    document.getElementById('leyendaTendencias').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #e74c3c;"></span><span>Harina - Crítico</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ff5733;"></span><span>Pepperoni - Bajo</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ffc857;"></span><span>Queso - Bajo</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #9b59b6;"></span><span>Otros - Normal</span></div>
    `;
}

// Gráficos de Clientes
function crearGraficosClientes() {
    // Ocultar el cuarto y quinto gráfico para este tipo de reporte
    document.querySelector('#graficosGrid .grafico-card:nth-child(4)').style.display = 'none';
    document.querySelector('#graficosGrid .grafico-card:nth-child(5)').style.display = 'none';
    
    document.querySelector('#graficosGrid .grafico-card:nth-child(1) .titulo-grafico').textContent = 'Clasificación de Clientes';
    document.querySelector('#graficosGrid .grafico-card:nth-child(2) .titulo-grafico').textContent = 'Frecuencia de Compras';
    document.querySelector('#graficosGrid .grafico-card:nth-child(3) .titulo-grafico').textContent = 'Métodos de Contacto';
    
    const ctxPrincipal = document.getElementById('chartPrincipal').getContext('2d');
    chartPrincipal = new Chart(ctxPrincipal, {
        type: 'doughnut',
        data: {
            labels: ['VIP', 'Frecuente', 'Regular', 'Nuevo'],
            datasets: [{
                data: [15, 25, 45, 15],
                backgroundColor: ['#ff5733', '#ffc857', '#3498db', '#27ae60'],
                borderWidth: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
    
    document.getElementById('leyendaPrincipal').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #ff5733;"></span><span>VIP - 15%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ffc857;"></span><span>Frecuente - 25%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #3498db;"></span><span>Regular - 45%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #27ae60;"></span><span>Nuevo - 15%</span></div>
    `;
    
    const ctxSecundario = document.getElementById('chartSecundario').getContext('2d');
    chartSecundario = new Chart(ctxSecundario, {
        type: 'doughnut',
        data: {
            labels: ['Semanal', 'Quincenal', 'Mensual', 'Ocasional'],
            datasets: [{
                data: [20, 30, 35, 15],
                backgroundColor: ['#27ae60', '#3498db', '#ffc857', '#9b59b6'],
                borderWidth: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
    
    document.getElementById('leyendaSecundario').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #27ae60;"></span><span>Semanal - 20%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #3498db;"></span><span>Quincenal - 30%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ffc857;"></span><span>Mensual - 35%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #9b59b6;"></span><span>Ocasional - 15%</span></div>
    `;
    
    const ctxTendencias = document.getElementById('chartTendencias').getContext('2d');
    chartTendencias = new Chart(ctxTendencias, {
        type: 'doughnut',
        data: {
            labels: ['Teléfono', 'WhatsApp', 'Email', 'Presencial'],
            datasets: [{
                data: [40, 35, 15, 10],
                backgroundColor: ['#3498db', '#27ae60', '#ff5733', '#ffc857'],
                borderWidth: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
    
    document.getElementById('leyendaTendencias').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #3498db;"></span><span>Teléfono - 40%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #27ae60;"></span><span>WhatsApp - 35%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ff5733;"></span><span>Email - 15%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ffc857;"></span><span>Presencial - 10%</span></div>
    `;
}

// Gráficos Financieros
function crearGraficosFinanciero() {
    // Ocultar el cuarto y quinto gráfico para este tipo de reporte
    document.querySelector('#graficosGrid .grafico-card:nth-child(4)').style.display = 'none';
    document.querySelector('#graficosGrid .grafico-card:nth-child(5)').style.display = 'none';
    document.querySelector('#graficosGrid .grafico-card:nth-child(1) .titulo-grafico').textContent = 'Distribución de Ingresos';
    document.querySelector('#graficosGrid .grafico-card:nth-child(2) .titulo-grafico').textContent = 'Estructura de Gastos';
    document.querySelector('#graficosGrid .grafico-card:nth-child(3) .titulo-grafico').textContent = 'Ganancias';
    
    const ctxPrincipal = document.getElementById('chartPrincipal').getContext('2d');
    chartPrincipal = new Chart(ctxPrincipal, {
        type: 'doughnut',
        data: {
            labels: ['Ventas Directas', 'Delivery', 'Eventos', 'Promociones'],
            datasets: [{
                data: [65, 25, 7, 3],
                backgroundColor: ['#27ae60', '#3498db', '#ffc857', '#9b59b6'],
                borderWidth: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
    
    document.getElementById('leyendaPrincipal').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #27ae60;"></span><span>Ventas Directas - 65%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #3498db;"></span><span>Delivery - 25%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ffc857;"></span><span>Eventos - 7%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #9b59b6;"></span><span>Promociones - 3%</span></div>
    `;
    
    const ctxSecundario = document.getElementById('chartSecundario').getContext('2d');
    chartSecundario = new Chart(ctxSecundario, {
        type: 'doughnut',
        data: {
            labels: ['Ingredientes', 'Salarios', 'Servicios', 'Alquiler', 'Otros'],
            datasets: [{
                data: [40, 30, 15, 10, 5],
                backgroundColor: ['#e74c3c', '#ff5733', '#ffc857', '#3498db', '#9b59b6'],
                borderWidth: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
    
    document.getElementById('leyendaSecundario').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #e74c3c;"></span><span>Ingredientes - 40%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ff5733;"></span><span>Salarios - 30%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ffc857;"></span><span>Servicios - 15%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #3498db;"></span><span>Alquiler - 10%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #9b59b6;"></span><span>Otros - 5%</span></div>
    `;
    
    const ctxTendencias = document.getElementById('chartTendencias').getContext('2d');
    chartTendencias = new Chart(ctxTendencias, {
        type: 'doughnut',
        data: {
            labels: ['Morales', 'Partido Alto', 'La Banda de Shilcayo'],
            datasets: [{
                data: [45, 35, 20],
                backgroundColor: ['#27ae60', '#3498db', '#ffc857'],
                borderWidth: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
    
    document.getElementById('leyendaTendencias').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #27ae60;"></span><span>Morales - 45%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #3498db;"></span><span>Partido Alto - 35%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ffc857;"></span><span>La Banda de Shilcayo - 20%</span></div>
    `;
}

/* ============================================
   FUNCIONES PARA REPORTE DE VENTAS DESDE API
   ============================================ */

// Actualizar estadísticas de ventas desde API
function actualizarEstadisticasVentas(resumen) {
    if (!resumen) {
        document.getElementById('totalPeriodo').textContent = 'S/. 0.00';
        document.getElementById('promedioDiario').textContent = 'S/. 0.00';
        document.getElementById('variacion').textContent = '0%';
        return;
    }

    const totalMonto = parseFloat(resumen.TotalMonto) || 0;
    const totalVentas = parseInt(resumen.TotalVentas) || 0;
    const clientesUnicos = parseInt(resumen.ClientesUnicos) || 0;
    
    document.getElementById('totalPeriodo').textContent = 'S/. ' + totalMonto.toFixed(2);
    document.getElementById('promedioDiario').textContent = 'S/. ' + (totalVentas > 0 ? (totalMonto / totalVentas).toFixed(2) : '0.00');
    document.getElementById('variacion').textContent = clientesUnicos + ' clientes';
}

// Actualizar tabla de ventas desde API
function actualizarTablaVentas(ventasPorProducto) {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!ventasPorProducto || ventasPorProducto.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay datos disponibles</td></tr>';
        return;
    }
    
    ventasPorProducto.forEach(venta => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${venta.Fecha || ''}</td>
            <td>${venta.Concepto || ''}</td>
            <td>${venta.Cantidad || 0}</td>
            <td>S/. ${parseFloat(venta.Monto || 0).toFixed(2)}</td>
            <td><span class="badge ${venta.Estado === 'pagado' ? 'badge-success' : 'badge-warning'}">${venta.Estado || 'Pendiente'}</span></td>
        `;
        tbody.appendChild(fila);
    });
}

// Actualizar resumen de ventas desde API
function actualizarResumenVentas(resumen) {
    if (!resumen) return;
    
    const efecto = parseFloat(resumen.VentasEfectivo) || 0;
    const tarjeta = parseFloat(resumen.VentasTarjeta) || 0;
    const yape = parseFloat(resumen.VentasYape) || 0;
    const plin = parseFloat(resumen.VentasPlin) || 0;
    
    const resumenElement = document.querySelector('.resumen-data');
    if (resumenElement) {
        resumenElement.innerHTML = `
            <div class="resumen-item">
                <span class="resumen-label">Efectivo:</span>
                <span class="resumen-valor">S/. ${efecto.toFixed(2)}</span>
            </div>
            <div class="resumen-item">
                <span class="resumen-label">Tarjeta:</span>
                <span class="resumen-valor">S/. ${tarjeta.toFixed(2)}</span>
            </div>
            <div class="resumen-item">
                <span class="resumen-label">Yape:</span>
                <span class="resumen-valor">S/. ${yape.toFixed(2)}</span>
            </div>
            <div class="resumen-item">
                <span class="resumen-label">Plin:</span>
                <span class="resumen-valor">S/. ${plin.toFixed(2)}</span>
            </div>
        `;
    }
}

// ============================================
// FUNCIONES PARA REPORTE DE COMPRAS
// ============================================

// Actualizar estadísticas de compras desde API
function actualizarEstadisticasCompras(resumen) {
    if (!resumen) {
        document.getElementById('totalPeriodo').textContent = 'S/. 0.00';
        document.getElementById('promedioDiario').textContent = 'S/. 0.00';
        document.getElementById('variacion').textContent = '0 proveedores';
        document.getElementById('diasAnalizados').textContent = '0';
        return;
    }

    const totalMonto = parseFloat(resumen.TotalMonto) || 0;
    const promedioDiario = parseFloat(resumen.PromedioDiario) || 0;
    const proveedoresUnicos = parseInt(resumen.ProveedoresUnicos) || 0;
    const diasAnalizados = parseInt(resumen.DiasAnalizados) || 0;
    
    document.getElementById('totalPeriodo').textContent = 'S/. ' + totalMonto.toFixed(2);
    document.getElementById('promedioDiario').textContent = 'S/. ' + promedioDiario.toFixed(2);
    document.getElementById('variacion').textContent = proveedoresUnicos + ' proveedores';
    document.getElementById('diasAnalizados').textContent = diasAnalizados;
}

// Actualizar tabla de compras desde API
function actualizarTablaCompras(comprasPorProducto) {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!comprasPorProducto || comprasPorProducto.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay datos disponibles</td></tr>';
        return;
    }
    
    comprasPorProducto.forEach(compra => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${compra.Fecha || ''}</td>
            <td>${compra.Concepto || ''}</td>
            <td>${compra.Cantidad || 0}</td>
            <td>S/. ${parseFloat(compra.Monto || 0).toFixed(2)}</td>
            <td><span class="badge ${compra.Estado === 'recibido' ? 'badge-success' : 'badge-warning'}">${compra.Estado || 'Pendiente'}</span></td>
        `;
        tbody.appendChild(fila);
    });
}

// Actualizar resumen de compras desde API
function actualizarResumenCompras(resumen) {
    if (!resumen) return;
    
    const totalMonto = parseFloat(resumen.TotalMonto) || 0;
    const totalCompras = parseInt(resumen.TotalCompras) || 0;
    const promedio = totalCompras > 0 ? (totalMonto / totalCompras) : 0;
    
    const resumenElement = document.querySelector('.resumen-data');
    if (resumenElement) {
        resumenElement.innerHTML = `
            <div class="resumen-item">
                <span class="resumen-label">Total Compras:</span>
                <span class="resumen-valor">${totalCompras}</span>
            </div>
            <div class="resumen-item">
                <span class="resumen-label">Monto Total:</span>
                <span class="resumen-valor">S/. ${totalMonto.toFixed(2)}</span>
            </div>
            <div class="resumen-item">
                <span class="resumen-label">Promedio:</span>
                <span class="resumen-valor">S/. ${promedio.toFixed(2)}</span>
            </div>
            <div class="resumen-item">
                <span class="resumen-label">Proveedores:</span>
                <span class="resumen-valor">${resumen.ProveedoresUnicos || 0}</span>
            </div>
        `;
    }
}

// Actualizar gráficos de ventas desde API
async function actualizarGraficosVentas(data) {
    try {
        // Actualizar títulos de gráficos
        actualizarTitulosGraficos('ventas');
        
        // Gráfico de métodos de pago - DISTRIBUCIÓN PRINCIPAL
        const respMetodos = await fetch(`${API_BASE}/reportes/ventas-por-metodo-pago?periodo=${periodoActual}`);
        const dataMetodos = await respMetodos.json();
        
        if (dataMetodos.exito && dataMetodos.ventasPorMetodoPago) {
            const labels = dataMetodos.ventasPorMetodoPago.map(m => capitalizarPrimera(m.TipoPago));
            const valores = dataMetodos.ventasPorMetodoPago.map(m => parseFloat(m.TotalMonto) || 0);
            const colores = ['#2ecc71', '#3498db', '#e74c3c', '#f39c12'];
            
            const canvas1 = document.getElementById('chartPrincipal');
            if (canvas1) {
                if (chartPrincipal) chartPrincipal.destroy();
                chartPrincipal = new Chart(canvas1.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: valores,
                            backgroundColor: colores.slice(0, labels.length),
                            borderWidth: 0
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
                });
                
                // Generar leyenda dinámica
                generarLeyendaDoughnut('leyendaPrincipal', labels, valores, colores);
            }
        }
        
        // Gráfico de TOP 3 productos más vendidos
        if (data.productosMasVendidos && data.productosMasVendidos.length > 0) {
            const productosTop3 = data.productosMasVendidos.slice(0, 3);
            const productos = productosTop3.map(p => p.Concepto);
            const cantidades = productosTop3.map(p => parseInt(p.Cantidad) || 0);
            
            const canvas4 = document.getElementById('chartProductos');
            if (canvas4) {
                if (chartProductos) chartProductos.destroy();
                chartProductos = new Chart(canvas4.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: productos,
                        datasets: [{
                            label: 'Cantidad',
                            data: cantidades,
                            backgroundColor: '#2ecc71',
                            borderRadius: 4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
                });
            }
        }
        
        // Gráfico de productos MENOS vendidos
        if (data.productosMasVendidos && data.productosMasVendidos.length >= 3) {
            // Tomar los últimos 3 (menos vendidos)
            const productosBottom3 = data.productosMasVendidos.slice(-3).reverse();
            const productosM = productosBottom3.map(p => p.Concepto);
            const cantidadesM = productosBottom3.map(p => parseInt(p.Cantidad) || 0);
            
            const canvas5 = document.getElementById('chartProductosMenos');
            if (canvas5) {
                if (chartProductosMenos) chartProductosMenos.destroy();
                chartProductosMenos = new Chart(canvas5.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: productosM,
                        datasets: [{
                            label: 'Cantidad',
                            data: cantidadesM,
                            backgroundColor: '#e74c3c',
                            borderRadius: 4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
                });
            }
        } else if (data.productosMasVendidos && data.productosMasVendidos.length > 0) {
            // Si hay menos de 3 productos, mostrar todos como "menos vendidos"
            const productosBottom = data.productosMasVendidos.slice().reverse();
            const productosM = productosBottom.map(p => p.Concepto);
            const cantidadesM = productosBottom.map(p => parseInt(p.Cantidad) || 0);
            
            const canvas5 = document.getElementById('chartProductosMenos');
            if (canvas5) {
                if (chartProductosMenos) chartProductosMenos.destroy();
                chartProductosMenos = new Chart(canvas5.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: productosM,
                        datasets: [{
                            label: 'Cantidad',
                            data: cantidadesM,
                            backgroundColor: '#e74c3c',
                            borderRadius: 4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
                });
            }
        }
    } catch (error) {
        console.error('Error al cargar gráficos:', error);
    }
}

// Actualizar gráficos de compras desde API
async function actualizarGraficosCompras(data) {
    try {
        // Actualizar títulos de gráficos
        actualizarTitulosGraficos('compras');
        
        // Construir URL con período y fechas si es necesario
        let urlEstado = `${API_BASE}/reportes/estado-compras?periodo=${periodoActual}`;
        let urlProveedores = `${API_BASE}/reportes/compras-por-proveedor?periodo=${periodoActual}`;
        
        if (periodoActual === 'personalizado') {
            const fechaInicio = document.getElementById('fechaInicio')?.value;
            const fechaFin = document.getElementById('fechaFin')?.value;
            if (fechaInicio && fechaFin) {
                urlEstado += `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
                urlProveedores += `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
            }
        }
        
        // Gráfico de estado de compras - DISTRIBUCIÓN PRINCIPAL
        const respEstado = await fetch(urlEstado);
        const dataEstado = await respEstado.json();
        
        if (dataEstado.exito && dataEstado.estadoCompras) {
            const labels = dataEstado.estadoCompras.map(e => capitalizarPrimera(e.Estado));
            const valores = dataEstado.estadoCompras.map(e => parseFloat(e.TotalMonto) || 0);
            const colores = ['#2ecc71', '#f39c12', '#e74c3c', '#3498db'];
            
            const canvas1 = document.getElementById('chartPrincipal');
            if (canvas1) {
                if (chartPrincipal) chartPrincipal.destroy();
                chartPrincipal = new Chart(canvas1.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: valores,
                            backgroundColor: colores.slice(0, labels.length),
                            borderWidth: 0
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
                });
                
                // Generar leyenda dinámica
                generarLeyendaDoughnut('leyendaPrincipal', labels, valores, colores);
            }
        }
        
        // Gráfico de TOP 3 productos más comprados
        if (data.productosMasComprados && data.productosMasComprados.length > 0) {
            const productosTop3 = data.productosMasComprados.slice(0, 3);
            const productos = productosTop3.map(p => p.Concepto);
            const cantidades = productosTop3.map(p => parseInt(p.Cantidad) || 0);
            
            const canvas4 = document.getElementById('chartProductos');
            if (canvas4) {
                if (chartProductos) chartProductos.destroy();
                chartProductos = new Chart(canvas4.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: productos,
                        datasets: [{
                            label: 'Cantidad',
                            data: cantidades,
                            backgroundColor: '#3498db',
                            borderRadius: 4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
                });
            }
        } else {
            console.warn('No hay productos más comprados para mostrar');
        }
        
        // Gráfico de proveedores con más compras
        const respProveedores = await fetch(urlProveedores);
        const dataProveedores = await respProveedores.json();
        
        if (dataProveedores.exito && dataProveedores.comprasPorProveedor && dataProveedores.comprasPorProveedor.length > 0) {
            const proveedoresTop3 = dataProveedores.comprasPorProveedor.slice(0, 3);
            const proveedoresM = proveedoresTop3.map(p => p.NombreProveedor);
            const montosM = proveedoresTop3.map(p => parseFloat(p.TotalMonto) || 0);
            
            const canvas5 = document.getElementById('chartProductosMenos');
            if (canvas5) {
                if (chartProductosMenos) chartProductosMenos.destroy();
                chartProductosMenos = new Chart(canvas5.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: proveedoresM,
                        datasets: [{
                            label: 'Monto Total',
                            data: montosM,
                            backgroundColor: '#f39c12',
                            borderRadius: 4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
                });
            }
        } else {
            console.warn('No hay proveedores para mostrar en el gráfico');
            if (dataProveedores.error) {
                console.error('Error del servidor:', dataProveedores.error);
            }
        }
    } catch (error) {
        console.error('Error al cargar gráficos de compras:', error);
    }
}

// Función para generar leyenda dinámica de gráficos doughnut
function generarLeyendaDoughnut(elementId, labels, valores, colores) {
    const leyendaElement = document.getElementById(elementId);
    if (!leyendaElement) return;
    
    let html = '';
    labels.forEach((label, index) => {
        const color = colores[index] || '#999';
        const valor = valores[index] || 0;
        const total = valores.reduce((a, b) => a + b, 0);
        const porcentaje = total > 0 ? ((valor / total) * 100).toFixed(1) : 0;
        
        html += `
            <div class="leyenda-item">
                <span class="leyenda-color" style="background-color: ${color}"></span>
                <span class="leyenda-label">${label}</span>
                <span class="leyenda-valor">S/. ${valor.toFixed(2)} (${porcentaje}%)</span>
            </div>
        `;
    });
    
    leyendaElement.innerHTML = html;
}

// Función auxiliar para capitalizar
function capitalizarPrimera(texto) {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}// ============================================
// REPORTES DE INVENTARIO - FUNCIONES
// ============================================

// Actualizar estadísticas de inventario
function actualizarEstadisticasInventario(resumen) {
    if (!resumen) {
        document.getElementById('totalPeriodo').textContent = 'S/. 0.00';
        document.getElementById('promedioDiario').textContent = '0';
        document.getElementById('variacion').textContent = '0';
        document.getElementById('diasAnalizados').textContent = '0';
        return;
    }

    const valorInventario = parseFloat(resumen.ValorInventario) || 0;
    const totalProductos = parseInt(resumen.TotalProductos) || 0;
    const productosBajoStock = parseInt(resumen.ProductosBajoStock) || 0;
    const stockTotal = parseInt(resumen.StockTotal) || 0;
    
    document.getElementById('totalPeriodo').textContent = 'S/. ' + valorInventario.toFixed(2);
    document.getElementById('promedioDiario').textContent = totalProductos;
    document.getElementById('variacion').textContent = productosBajoStock + ' bajo stock';
    document.getElementById('diasAnalizados').textContent = stockTotal;
}

// Actualizar tabla de inventario (productos bajo stock)
function actualizarTablaInventario(productosBajoStock) {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!productosBajoStock || productosBajoStock.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay productos con bajo stock</td></tr>';
        return;
    }
    
    productosBajoStock.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.NombreProducto || ''}</td>
            <td>${producto.Categoria || ''}</td>
            <td>${producto.Stock || 0}</td>
            <td>${producto.StockMinimo || 0}</td>
            <td><span class="badge ${producto.Estado === 'disponible' ? 'badge-success' : producto.Estado === 'agotado' ? 'badge-danger' : 'badge-warning'}">${producto.Estado || ''}</span></td>
        `;
        tbody.appendChild(fila);
    });
}

// Actualizar resumen de inventario
function actualizarResumenInventario(resumen) {
    const resumenElement = document.querySelector('.resumen-general');
    if (!resumenElement) return;
    
    const valorInventario = parseFloat(resumen.ValorInventario) || 0;
    const totalProductos = parseInt(resumen.TotalProductos) || 0;
    const productosBajoStock = parseInt(resumen.ProductosBajoStock) || 0;
    const productosAgotados = parseInt(resumen.ProductosAgotados) || 0;
    const stockTotal = parseInt(resumen.StockTotal) || 0;
    
    resumenElement.innerHTML = `
        <h3>Resumen de Inventario</h3>
        <div class="resumen-stats">
            <div class="stat-item">
                <span class="stat-label">Valor Total:</span>
                <span class="stat-value">S/. ${valorInventario.toFixed(2)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Total Productos:</span>
                <span class="stat-value">${totalProductos}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Stock Total:</span>
                <span class="stat-value">${stockTotal} unidades</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Bajo Stock:</span>
                <span class="stat-value alert">${productosBajoStock} productos</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Agotados:</span>
                <span class="stat-value alert">${productosAgotados} productos</span>
            </div>
        </div>
    `;
}

// Actualizar gráficos de inventario
async function actualizarGraficosInventario(data) {
    try {
        // Actualizar títulos de gráficos
        actualizarTitulosGraficos('inventario');
        
        // Gráfico de estado de productos - DISTRIBUCIÓN PRINCIPAL
        const respEstado = await fetch(`${API_BASE}/reportes/inventario-por-estado`);
        const dataEstado = await respEstado.json();
        
        if (dataEstado.exito && dataEstado.inventarioPorEstado) {
            const labels = dataEstado.inventarioPorEstado.map(e => capitalizarPrimera(e.Estado.replace('_', ' ')));
            const valores = dataEstado.inventarioPorEstado.map(e => parseFloat(e.ValorTotal) || 0);
            const colores = ['#2ecc71', '#f39c12', '#e74c3c'];
            
            const canvas1 = document.getElementById('chartPrincipal');
            if (canvas1) {
                if (chartPrincipal) chartPrincipal.destroy();
                chartPrincipal = new Chart(canvas1.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: valores,
                            backgroundColor: colores.slice(0, labels.length),
                            borderWidth: 0
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
                });
                
                generarLeyendaDoughnut('leyendaPrincipal', labels, valores, colores);
            }
        }
        
        // Gráfico de TOP 3 productos más vendidos
        if (data.productosTopVendidos) {
            const productosTop3 = data.productosTopVendidos.slice(0, 3);
            const productos = productosTop3.map(p => p.NombreProducto);
            const cantidades = productosTop3.map(p => parseInt(p.TotalVendido) || 0);
            
            const canvas4 = document.getElementById('chartProductos');
            if (canvas4) {
                if (chartProductos) chartProductos.destroy();
                chartProductos = new Chart(canvas4.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: productos,
                        datasets: [{
                            label: 'Cantidad Vendida',
                            data: cantidades,
                            backgroundColor: '#3498db',
                            borderRadius: 4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
                });
            }
        }
        
        // Gráfico de categorías de productos
        if (data.productosPorCategoria) {
            const categoriasTop3 = data.productosPorCategoria.slice(0, 3);
            const categorias = categoriasTop3.map(c => capitalizarPrimera(c.Categoria));
            const valores = categoriasTop3.map(c => parseFloat(c.ValorTotal) || 0);
            
            const canvas5 = document.getElementById('chartProductosMenos');
            if (canvas5) {
                if (chartProductosMenos) chartProductosMenos.destroy();
                chartProductosMenos = new Chart(canvas5.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: categorias,
                        datasets: [{
                            label: 'Valor en S/.',
                            data: valores,
                            backgroundColor: '#9b59b6',
                            borderRadius: 4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
                });
            }
        }
    } catch (error) {
        console.error('Error al cargar gráficos de inventario:', error);
    }
}

// ============================================
// REPORTES DE CLIENTES
// ============================================

// Actualizar estadísticas de clientes
function actualizarEstadisticasClientes(resumen) {
    if (!resumen) {
        document.getElementById('totalPeriodo').textContent = 'S/. 0.00';
        document.getElementById('promedioDiario').textContent = '0';
        document.getElementById('variacion').textContent = '0';
        document.getElementById('diasAnalizados').textContent = '0';
        return;
    }

    const totalMonto = parseFloat(resumen.TotalMonto) || 0;
    const totalClientes = parseInt(resumen.TotalClientes) || 0;
    const totalPedidos = parseInt(resumen.TotalPedidos) || 0;
    const promedioPedidosDiario = parseFloat(resumen.PromedioPedidosDiario) || 0;
    
    document.getElementById('totalPeriodo').textContent = 'S/. ' + totalMonto.toFixed(2);
    document.getElementById('promedioDiario').textContent = promedioPedidosDiario.toFixed(1);
    document.getElementById('variacion').textContent = totalClientes + ' clientes';
    document.getElementById('diasAnalizados').textContent = totalPedidos;
}

// Actualizar tabla de clientes (top gastadores)
function actualizarTablaClientes(clientesTopGasto) {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!clientesTopGasto || clientesTopGasto.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay datos de clientes</td></tr>';
        return;
    }
    
    clientesTopGasto.forEach(cliente => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${cliente.Nombres || ''} ${cliente.Apellidos || ''}</td>
            <td>${cliente.TotalPedidos || 0}</td>
            <td>S/. ${parseFloat(cliente.TotalGastado || 0).toFixed(2)}</td>
            <td>S/. ${parseFloat(cliente.PromedioGasto || 0).toFixed(2)}</td>
            <td><span class="badge badge-success">Activo</span></td>
        `;
        tbody.appendChild(fila);
    });
}

// Actualizar resumen de clientes
function actualizarResumenClientes(resumen) {
    const resumenElement = document.querySelector('.resumen-general');
    if (!resumenElement) return;
    
    const totalMonto = parseFloat(resumen.TotalMonto) || 0;
    const totalClientes = parseInt(resumen.TotalClientes) || 0;
    const totalPedidos = parseInt(resumen.TotalPedidos) || 0;
    const promedioTicket = parseFloat(resumen.PromedioTicket) || 0;
    
    resumenElement.innerHTML = `
        <h3>Resumen de Clientes</h3>
        <div class="resumen-stats">
            <div class="stat-item">
                <span class="stat-label">Total Ventas:</span>
                <span class="stat-value">S/. ${totalMonto.toFixed(2)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Total Clientes:</span>
                <span class="stat-value">${totalClientes}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Total Pedidos:</span>
                <span class="stat-value">${totalPedidos}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Ticket Promedio:</span>
                <span class="stat-value">S/. ${promedioTicket.toFixed(2)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Pedidos/Cliente:</span>
                <span class="stat-value">${totalClientes > 0 ? (totalPedidos / totalClientes).toFixed(1) : 0}</span>
            </div>
        </div>
    `;
}

// Actualizar gráficos de clientes
async function actualizarGraficosClientes(data) {
    try {
        // Actualizar títulos de gráficos
        actualizarTitulosGraficos('clientes');
        
        let urlMetodoPago = `${API_BASE}/reportes/clientes-por-metodo-pago?periodo=${periodoActual}`;
        
        if (periodoActual === 'personalizado') {
            const fechaInicio = document.getElementById('fechaInicio')?.value;
            const fechaFin = document.getElementById('fechaFin')?.value;
            if (fechaInicio && fechaFin) {
                urlMetodoPago += `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
            }
        }
        
        // Gráfico de métodos de pago - DISTRIBUCIÓN PRINCIPAL
        const respMetodoPago = await fetch(urlMetodoPago);
        const dataMetodoPago = await respMetodoPago.json();
        
        if (dataMetodoPago.exito && dataMetodoPago.clientesPorMetodoPago) {
            const labels = dataMetodoPago.clientesPorMetodoPago.map(m => capitalizarPrimera(m.TipoPago));
            const valores = dataMetodoPago.clientesPorMetodoPago.map(m => parseFloat(m.TotalMonto) || 0);
            const colores = ['#2ecc71', '#3498db', '#f39c12', '#e74c3c'];
            
            const canvas1 = document.getElementById('chartPrincipal');
            if (canvas1) {
                if (chartPrincipal) chartPrincipal.destroy();
                chartPrincipal = new Chart(canvas1.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: valores,
                            backgroundColor: colores.slice(0, labels.length),
                            borderWidth: 0
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
                });
                
                generarLeyendaDoughnut('leyendaPrincipal', labels, valores, colores);
            }
        }
        
        // Gráfico de TOP 3 clientes que más gastan
        if (data.clientesTopGasto && data.clientesTopGasto.length > 0) {
            const clientesTop3 = data.clientesTopGasto.slice(0, 3);
            const nombres = clientesTop3.map(c => `${c.Nombres} ${c.Apellidos}`);
            const gastos = clientesTop3.map(c => parseFloat(c.TotalGastado) || 0);
            
            const canvas4 = document.getElementById('chartProductos');
            if (canvas4) {
                if (chartProductos) chartProductos.destroy();
                chartProductos = new Chart(canvas4.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: nombres,
                        datasets: [{
                            label: 'Total Gastado',
                            data: gastos,
                            backgroundColor: '#3498db',
                            borderRadius: 4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
                });
            }
        }
        
        // Gráfico de clientes 4-6 que más gastan (siguiente nivel)
        if (data.clientesTopGasto && data.clientesTopGasto.length > 3) {
            const clientesSiguientes = data.clientesTopGasto.slice(3, 6);
            const nombresS = clientesSiguientes.map(c => `${c.Nombres} ${c.Apellidos}`);
            const gastosS = clientesSiguientes.map(c => parseFloat(c.TotalGastado) || 0);
            
            const canvas5 = document.getElementById('chartProductosMenos');
            if (canvas5) {
                if (chartProductosMenos) chartProductosMenos.destroy();
                chartProductosMenos = new Chart(canvas5.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: nombresS,
                        datasets: [{
                            label: 'Total Gastado',
                            data: gastosS,
                            backgroundColor: '#9b59b6',
                            borderRadius: 4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
                });
            }
        } else if (data.clientesTopGasto && data.clientesTopGasto.length > 0) {
            // Si hay menos de 4 clientes, mostrar todos en el tercer gráfico
            const clientesRestantes = data.clientesTopGasto.slice(1);
            const nombresR = clientesRestantes.map(c => `${c.Nombres} ${c.Apellidos}`);
            const gastosR = clientesRestantes.map(c => parseFloat(c.TotalGastado) || 0);
            
            const canvas5 = document.getElementById('chartProductosMenos');
            if (canvas5) {
                if (chartProductosMenos) chartProductosMenos.destroy();
                chartProductosMenos = new Chart(canvas5.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: nombresR,
                        datasets: [{
                            label: 'Total Gastado',
                            data: gastosR,
                            backgroundColor: '#9b59b6',
                            borderRadius: 4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
                });
            }
        }
    } catch (error) {
        console.error('Error al cargar gráficos de clientes:', error);
    }
}

// ============================================
// REPORTES FINANCIEROS
// ============================================

// Cargar reporte financiero desde API
async function cargarReporteFinancieroDesdeAPI() {
    try {
        let url = `${API_BASE}/reportes/resumen-financiero?periodo=${periodoActual}`;
        
        if (periodoActual === 'personalizado') {
            const fechaInicio = document.getElementById('fechaInicio')?.value;
            const fechaFin = document.getElementById('fechaFin')?.value;
            if (fechaInicio && fechaFin) {
                url += `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
            }
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.exito) {
            actualizarEstadisticasFinancieras(data);
            actualizarTablaFinanciera(data);
            actualizarResumenFinanciero(data);
            actualizarGraficosFinancieros(data);
        } else {
            console.error('Error al cargar reporte financiero:', data.mensaje);
            if (data.error) {
                console.error('Detalles del error:', data.error);
            }
        }
    } catch (error) {
        console.error('Error al cargar reporte:', error);
    }
}

// Actualizar estadísticas financieras
function actualizarEstadisticasFinancieras(data) {
    const resumen = data.resumen;
    
    document.getElementById('totalPeriodo').textContent = `S/. ${parseFloat(resumen.TotalIngresos || 0).toFixed(2)}`;
    document.getElementById('promedioDiario').textContent = `S/. ${(parseFloat(resumen.TotalIngresos || 0) / resumen.DiasAnalizados).toFixed(2)}`;
    document.getElementById('variacion').textContent = `${parseFloat(resumen.MargenUtilidad || 0).toFixed(1)}%`;
    document.getElementById('diasAnalizados').textContent = resumen.DiasAnalizados || 0;
}

// Actualizar tabla financiera
function actualizarTablaFinanciera(data) {
    const tbody = document.querySelector('#tablaReporte tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Cambiar encabezados
    const thead = document.querySelector('#tablaReporte thead tr');
    if (thead) {
        thead.innerHTML = `
            <th>Categoría</th>
            <th>Total Ingresos</th>
            <th>Número de Ventas</th>
            <th>Promedio por Venta</th>
        `;
    }

    if (data.categoriasIngresos && data.categoriasIngresos.length > 0) {
        data.categoriasIngresos.forEach(cat => {
            const row = document.createElement('tr');
            const promedioVenta = cat.NumeroVentas > 0 ? (cat.TotalIngresos / cat.NumeroVentas) : 0;
            
            row.innerHTML = `
                <td>${capitalizarPrimera(cat.Categoria)}</td>
                <td>S/. ${parseFloat(cat.TotalIngresos).toFixed(2)}</td>
                <td>${cat.NumeroVentas}</td>
                <td>S/. ${parseFloat(promedioVenta).toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No hay datos para mostrar</td></tr>';
    }
}

// Actualizar resumen financiero
function actualizarResumenFinanciero(data) {
    const resumenDiv = document.querySelector('.vista-resumen');
    if (!resumenDiv) return;

    const resumen = data.resumen;
    const utilidadBruta = resumen.UtilidadBruta || 0;
    const utilidadClass = utilidadBruta >= 0 ? 'positivo' : 'negativo';

    resumenDiv.innerHTML = `
        <div class="resumen-grid">
            <div class="resumen-card">
                <div class="resumen-icon" style="background: linear-gradient(135deg, #2ecc71, #27ae60);">
                    <i class="fas fa-arrow-up"></i>
                </div>
                <div class="resumen-info">
                    <h4>Total Ingresos</h4>
                    <p class="resumen-valor">S/. ${parseFloat(resumen.TotalIngresos || 0).toFixed(2)}</p>
                    <span class="resumen-detalle">${resumen.TotalVentas || 0} ventas realizadas</span>
                </div>
            </div>

            <div class="resumen-card">
                <div class="resumen-icon" style="background: linear-gradient(135deg, #e74c3c, #c0392b);">
                    <i class="fas fa-arrow-down"></i>
                </div>
                <div class="resumen-info">
                    <h4>Total Egresos</h4>
                    <p class="resumen-valor">S/. ${parseFloat(resumen.TotalEgresos || 0).toFixed(2)}</p>
                    <span class="resumen-detalle">${resumen.TotalCompras || 0} compras realizadas</span>
                </div>
            </div>

            <div class="resumen-card">
                <div class="resumen-icon ${utilidadClass}" style="background: linear-gradient(135deg, ${utilidadBruta >= 0 ? '#3498db, #2980b9' : '#e67e22, #d35400'});">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="resumen-info">
                    <h4>Utilidad Bruta</h4>
                    <p class="resumen-valor ${utilidadClass}">S/. ${parseFloat(utilidadBruta).toFixed(2)}</p>
                    <span class="resumen-detalle">Margen: ${parseFloat(resumen.MargenUtilidad || 0).toFixed(1)}%</span>
                </div>
            </div>

            <div class="resumen-card">
                <div class="resumen-icon" style="background: linear-gradient(135deg, #9b59b6, #8e44ad);">
                    <i class="fas fa-balance-scale"></i>
                </div>
                <div class="resumen-info">
                    <h4>Promedios</h4>
                    <p class="resumen-valor">S/. ${parseFloat(resumen.PromedioVenta || 0).toFixed(2)}</p>
                    <span class="resumen-detalle">Venta | S/. ${parseFloat(resumen.PromedioCompra || 0).toFixed(2)} Compra</span>
                </div>
            </div>
        </div>
    `;
}

// Actualizar gráficos financieros
async function actualizarGraficosFinancieros(data) {
    try {
        // Actualizar títulos de gráficos
        actualizarTitulosGraficos('financiero');
        
        // Destruir gráficos existentes
        if (chartPrincipal) {
            chartPrincipal.destroy();
            chartPrincipal = null;
        }
        if (chartProductos) {
            chartProductos.destroy();
            chartProductos = null;
        }
        if (chartProductosMenos) {
            chartProductosMenos.destroy();
            chartProductosMenos = null;
        }
        
        let urlFlujoCaja = `${API_BASE}/reportes/flujo-caja?periodo=${periodoActual}`;
        let urlGastos = `${API_BASE}/reportes/gastos-operacionales?periodo=${periodoActual}`;
        
        if (periodoActual === 'personalizado') {
            const fechaInicio = document.getElementById('fechaInicio')?.value;
            const fechaFin = document.getElementById('fechaFin')?.value;
            if (fechaInicio && fechaFin) {
                urlFlujoCaja += `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
                urlGastos += `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
            }
        }
        
        // Gráfico 1: Flujo de Caja (Ingresos vs Egresos) - Línea
        const respFlujoCaja = await fetch(urlFlujoCaja);
        const dataFlujoCaja = await respFlujoCaja.json();
        
        if (dataFlujoCaja.exito && dataFlujoCaja.flujoCaja) {
            const ultimos15Dias = dataFlujoCaja.flujoCaja.slice(-15);
            const fechas = ultimos15Dias.map(f => {
                const fecha = new Date(f.Fecha + 'T00:00:00');
                return fecha.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
            });
            const ingresos = ultimos15Dias.map(f => parseFloat(f.Ingresos) || 0);
            const egresos = ultimos15Dias.map(f => parseFloat(f.Egresos) || 0);
            
            const canvas1 = document.getElementById('chartPrincipal');
            if (canvas1) {
                if (chartPrincipal) chartPrincipal.destroy();
                chartPrincipal = new Chart(canvas1.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: fechas,
                        datasets: [
                            {
                                label: 'Ingresos',
                                data: ingresos,
                                borderColor: '#2ecc71',
                                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                                fill: true,
                                tension: 0.4
                            },
                            {
                                label: 'Egresos',
                                data: egresos,
                                borderColor: '#e74c3c',
                                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                                fill: true,
                                tension: 0.4
                            }
                        ]
                    },
                    options: { 
                        responsive: true, 
                        maintainAspectRatio: false, 
                        plugins: { 
                            legend: { display: true, position: 'top' }
                        },
                        scales: { 
                            y: { beginAtZero: true }
                        }
                    }
                });
            }
        }
        
        // Gráfico 2: Top 3 Proveedores con más gastos
        const respGastos = await fetch(urlGastos);
        const dataGastos = await respGastos.json();
        
        if (dataGastos.exito && dataGastos.gastosPorProveedor && dataGastos.gastosPorProveedor.length > 0) {
            const proveedoresTop3 = dataGastos.gastosPorProveedor.slice(0, 3);
            const proveedores = proveedoresTop3.map(p => p.NombreProveedor);
            const gastos = proveedoresTop3.map(p => parseFloat(p.TotalGastado) || 0);
            
            const canvas2 = document.getElementById('chartProductos');
            if (canvas2) {
                if (chartProductos) chartProductos.destroy();
                chartProductos = new Chart(canvas2.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: proveedores,
                        datasets: [{
                            label: 'Total Gastado',
                            data: gastos,
                            backgroundColor: '#e74c3c',
                            borderRadius: 4
                        }]
                    },
                    options: { 
                        responsive: true, 
                        maintainAspectRatio: false, 
                        plugins: { legend: { display: false } }, 
                        scales: { y: { beginAtZero: true } } 
                    }
                });
            }
        }
        
        // Gráfico 3: Top 3 Categorías con más gastos
        if (dataGastos.exito && dataGastos.gastosPorCategoria && dataGastos.gastosPorCategoria.length > 0) {
            const categoriasTop3 = dataGastos.gastosPorCategoria.slice(0, 3);
            const categorias = categoriasTop3.map(c => capitalizarPrimera(c.Categoria));
            const gastosCat = categoriasTop3.map(c => parseFloat(c.TotalGastado) || 0);
            
            const canvas3 = document.getElementById('chartProductosMenos');
            if (canvas3) {
                if (chartProductosMenos) chartProductosMenos.destroy();
                chartProductosMenos = new Chart(canvas3.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: categorias,
                        datasets: [{
                            label: 'Total Gastado',
                            data: gastosCat,
                            backgroundColor: '#f39c12',
                            borderRadius: 4
                        }]
                    },
                    options: { 
                        responsive: true, 
                        maintainAspectRatio: false, 
                        plugins: { legend: { display: false } }, 
                        scales: { y: { beginAtZero: true } } 
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error al cargar gráficos financieros:', error);
    }
}
