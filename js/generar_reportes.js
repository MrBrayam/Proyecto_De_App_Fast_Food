/* ============================================
   GENERAR REPORTES - ARCHIVO PRINCIPAL
   Solo maneja fecha/hora como estructura estándar
   ============================================ */

// Función para actualizar fecha y hora
function actualizarFechaHora() {
    const ahora = new Date();
    
    // Configurar formato de fecha
    const opcionesFecha = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    // Configurar formato de hora
    const opcionesHora = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    // Actualizar elementos del DOM
    const fechaElement = document.getElementById('fechaActual');
    const horaElement = document.getElementById('horaActual');
    
    if (fechaElement) {
        fechaElement.textContent = ahora.toLocaleDateString('es-ES', opcionesFecha);
    }
    
    if (horaElement) {
        horaElement.textContent = ahora.toLocaleTimeString('es-ES', opcionesHora);
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

// Datos de ejemplo para los reportes
const datosReportes = {
    ventas: {
        hoy: [
            { fecha: '29/10/2025', concepto: 'Pizza Hawaiana', cantidad: 15, monto: 525.00, estado: 'Completado' },
            { fecha: '29/10/2025', concepto: 'Pizza Pepperoni', cantidad: 12, monto: 480.00, estado: 'Completado' },
            { fecha: '29/10/2025', concepto: 'Hamburguesa Clásica', cantidad: 8, monto: 200.00, estado: 'Completado' },
            { fecha: '29/10/2025', concepto: 'Bebidas Variadas', cantidad: 25, monto: 125.00, estado: 'Completado' },
            { fecha: '29/10/2025', concepto: 'Postres', cantidad: 6, monto: 72.00, estado: 'Completado' }
        ],
        semana: [
            { fecha: '23-29/10/2025', concepto: 'Pizza Hawaiana', cantidad: 89, monto: 3115.00, estado: 'Completado' },
            { fecha: '23-29/10/2025', concepto: 'Pizza Pepperoni', cantidad: 76, monto: 3040.00, estado: 'Completado' },
            { fecha: '23-29/10/2025', concepto: 'Hamburguesa Clásica', cantidad: 52, monto: 1300.00, estado: 'Completado' },
            { fecha: '23-29/10/2025', concepto: 'Bebidas Variadas', cantidad: 180, monto: 900.00, estado: 'Completado' },
            { fecha: '23-29/10/2025', concepto: 'Postres', cantidad: 34, monto: 408.00, estado: 'Completado' }
        ],
        mes: [
            { fecha: 'Octubre 2025', concepto: 'Pizza Hawaiana', cantidad: 350, monto: 12250.00, estado: 'Completado' },
            { fecha: 'Octubre 2025', concepto: 'Pizza Pepperoni', cantidad: 298, monto: 11920.00, estado: 'Completado' },
            { fecha: 'Octubre 2025', concepto: 'Hamburguesa Clásica', cantidad: 210, monto: 5250.00, estado: 'Completado' },
            { fecha: 'Octubre 2025', concepto: 'Bebidas Variadas', cantidad: 720, monto: 3600.00, estado: 'Completado' },
            { fecha: 'Octubre 2025', concepto: 'Postres', cantidad: 145, monto: 1740.00, estado: 'Completado' }
        ]
    },
    compras: {
        hoy: [
            { fecha: '29/10/2025', concepto: 'Ingredientes Pizza', cantidad: 1, monto: 250.00, estado: 'Recibido' },
            { fecha: '29/10/2025', concepto: 'Bebidas', cantidad: 1, monto: 180.00, estado: 'Recibido' },
            { fecha: '29/10/2025', concepto: 'Envases', cantidad: 1, monto: 75.00, estado: 'Pendiente' }
        ],
        semana: [
            { fecha: '23-29/10/2025', concepto: 'Ingredientes Pizza', cantidad: 5, monto: 1250.00, estado: 'Recibido' },
            { fecha: '23-29/10/2025', concepto: 'Carnes', cantidad: 3, monto: 890.00, estado: 'Recibido' },
            { fecha: '23-29/10/2025', concepto: 'Verduras', cantidad: 4, monto: 320.00, estado: 'Recibido' },
            { fecha: '23-29/10/2025', concepto: 'Bebidas', cantidad: 2, monto: 360.00, estado: 'Recibido' },
            { fecha: '23-29/10/2025', concepto: 'Envases', cantidad: 3, monto: 225.00, estado: 'Recibido' }
        ],
        mes: [
            { fecha: 'Octubre 2025', concepto: 'Ingredientes Pizza', cantidad: 20, monto: 5000.00, estado: 'Recibido' },
            { fecha: 'Octubre 2025', concepto: 'Carnes', cantidad: 15, monto: 4200.00, estado: 'Recibido' },
            { fecha: 'Octubre 2025', concepto: 'Verduras', cantidad: 18, monto: 1440.00, estado: 'Recibido' },
            { fecha: 'Octubre 2025', concepto: 'Bebidas', cantidad: 12, monto: 2160.00, estado: 'Recibido' },
            { fecha: 'Octubre 2025', concepto: 'Envases', cantidad: 10, monto: 750.00, estado: 'Recibido' }
        ]
    },
    inventario: {
        hoy: [
            { fecha: '29/10/2025', concepto: 'Harina', cantidad: 50, monto: 0, estado: 'Stock Bajo' },
            { fecha: '29/10/2025', concepto: 'Queso Mozzarella', cantidad: 25, monto: 0, estado: 'Normal' },
            { fecha: '29/10/2025', concepto: 'Tomate', cantidad: 80, monto: 0, estado: 'Normal' },
            { fecha: '29/10/2025', concepto: 'Pepperoni', cantidad: 15, monto: 0, estado: 'Stock Bajo' },
            { fecha: '29/10/2025', concepto: 'Coca Cola', cantidad: 120, monto: 0, estado: 'Normal' }
        ]
    },
    clientes: {
        mes: [
            { fecha: 'Octubre 2025', concepto: 'Juan Pérez', cantidad: 12, monto: 450.00, estado: 'Activo' },
            { fecha: 'Octubre 2025', concepto: 'María García', cantidad: 8, monto: 320.00, estado: 'Activo' },
            { fecha: 'Octubre 2025', concepto: 'Carlos López', cantidad: 15, monto: 575.00, estado: 'VIP' },
            { fecha: 'Octubre 2025', concepto: 'Ana Martín', cantidad: 6, monto: 180.00, estado: 'Activo' },
            { fecha: 'Octubre 2025', concepto: 'Luis Torres', cantidad: 20, monto: 780.00, estado: 'VIP' }
        ]
    },
    empleados: {
        mes: [
            { fecha: 'Octubre 2025', concepto: 'Roberto (Mesero)', cantidad: 145, monto: 2890.00, estado: 'Activo' },
            { fecha: 'Octubre 2025', concepto: 'Patricia (Cajera)', cantidad: 0, monto: 3200.00, estado: 'Activo' },
            { fecha: 'Octubre 2025', concepto: 'Carlos (Repartidor)', cantidad: 89, monto: 2650.00, estado: 'Activo' },
            { fecha: 'Octubre 2025', concepto: 'María (Mesera)', cantidad: 132, monto: 2780.00, estado: 'Activo' },
            { fecha: 'Octubre 2025', concepto: 'Fernando (Cajero)', cantidad: 0, monto: 3200.00, estado: 'Activo' }
        ]
    },
    financiero: {
        mes: [
            { fecha: 'Octubre 2025', concepto: 'Ingresos por Ventas', cantidad: 1, monto: 34760.00, estado: 'Positivo' },
            { fecha: 'Octubre 2025', concepto: 'Gastos Operativos', cantidad: 1, monto: -13550.00, estado: 'Normal' },
            { fecha: 'Octubre 2025', concepto: 'Salarios', cantidad: 1, monto: -12000.00, estado: 'Normal' },
            { fecha: 'Octubre 2025', concepto: 'Utilidad Neta', cantidad: 1, monto: 9210.00, estado: 'Positivo' },
            { fecha: 'Octubre 2025', concepto: 'Impuestos', cantidad: 1, monto: -1658.00, estado: 'Normal' }
        ]
    }
};

// Variables globales
let tipoReporteActual = 'ventas';
let periodoActual = 'mes';
let vistaActual = 'grafico';
let chartPrincipal = null;
let chartSecundario = null;
let chartTendencias = null;

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
            fechaPersonalizada.style.display = 'block';
        } else {
            fechaPersonalizada.style.display = 'none';
        }
        
        actualizarContenidoReporte();
    });

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
    actualizarContenidoReporte();
}

// Actualizar contenido del reporte según el tipo y período seleccionado
function actualizarContenidoReporte() {
    const datos = obtenerDatosReporte();
    actualizarEstadisticas(datos);
    actualizarTabla(datos);
    actualizarResumen(datos);
    actualizarGraficos();
}

// Obtener datos del reporte actual
function obtenerDatosReporte() {
    const tipoData = datosReportes[tipoReporteActual];
    if (!tipoData) return [];
    
    // Mapear período a los datos disponibles
    let periodo = periodoActual;
    if (periodo === 'trimestre' || periodo === 'anio') {
        periodo = 'mes'; // Usar datos del mes como fallback
    }
    
    return tipoData[periodo] || tipoData.mes || [];
}

// Actualizar estadísticas
function actualizarEstadisticas(datos) {
    if (!datos || datos.length === 0) {
        document.getElementById('totalPeriodo').textContent = 'S/. 0.00';
        document.getElementById('promedioDiario').textContent = 'S/. 0.00';
        document.getElementById('variacion').textContent = '0%';
        document.getElementById('diasAnalizados').textContent = '0';
        return;
    }
    
    const total = datos.reduce((sum, item) => sum + Math.abs(item.monto), 0);
    const promedio = total / datos.length;
    const diasMap = {
        'hoy': 1,
        'semana': 7,
        'mes': 30,
        'trimestre': 90,
        'anio': 365
    };
    const dias = diasMap[periodoActual] || 1;
    
    document.getElementById('totalPeriodo').textContent = formatearMoneda(total);
    document.getElementById('promedioDiario').textContent = formatearMoneda(total / dias);
    document.getElementById('variacion').textContent = '+12.5%';
    document.getElementById('diasAnalizados').textContent = dias.toString();
}

// Actualizar tabla
function actualizarTabla(datos) {
    const tbody = document.querySelector('#tablaReporte tbody');
    
    if (!datos || datos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">
                    <i class="fas fa-info-circle"></i>
                    No hay datos para mostrar. Genera un reporte para ver la información.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = datos.map(item => `
        <tr>
            <td>${item.fecha}</td>
            <td>${item.concepto}</td>
            <td>${item.cantidad}</td>
            <td>${formatearMoneda(Math.abs(item.monto))}</td>
            <td>
                <span class="badge ${obtenerClaseBadge(item.estado)}">
                    ${item.estado}
                </span>
            </td>
        </tr>
    `).join('');
    
    // Actualizar información de paginación
    document.getElementById('registrosDesde').textContent = '1';
    document.getElementById('registrosHasta').textContent = datos.length.toString();
    document.getElementById('totalRegistros').textContent = datos.length.toString();
}

// Actualizar resumen
function actualizarResumen(datos) {
    if (!datos || datos.length === 0) {
        document.getElementById('periodoResumen').textContent = '-';
        document.getElementById('totalRegistrosResumen').textContent = '0';
        document.getElementById('valorMaximo').textContent = 'S/. 0.00';
        document.getElementById('valorMinimo').textContent = 'S/. 0.00';
        return;
    }
    
    const montos = datos.map(item => Math.abs(item.monto));
    const maximo = Math.max(...montos);
    const minimo = Math.min(...montos);
    
    document.getElementById('periodoResumen').textContent = obtenerNombrePeriodo();
    document.getElementById('totalRegistrosResumen').textContent = datos.length.toString();
    document.getElementById('valorMaximo').textContent = formatearMoneda(maximo);
    document.getElementById('valorMinimo').textContent = formatearMoneda(minimo);
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
    document.getElementById('sucursal').value = 'todas';
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
    const sucursal = document.getElementById('sucursal').value;
    const nombreSucursal = sucursal === 'todas' ? 'Todas las sucursales' : 
                          sucursal.charAt(0).toUpperCase() + sucursal.slice(1);
    
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
                    <span class="historial-sucursal">${nombreSucursal}</span>
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
    // Actualizar títulos
    document.querySelector('#graficosGrid .grafico-card:nth-child(1) .titulo-grafico').textContent = 'Ventas por Categoría';
    document.querySelector('#graficosGrid .grafico-card:nth-child(2) .titulo-grafico').textContent = 'Métodos de Pago';
    document.querySelector('#graficosGrid .grafico-card:nth-child(3) .titulo-grafico').textContent = 'Tipo de Servicio';
    
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
}

// Gráficos de Compras
function crearGraficosCompras() {
    // Actualizar títulos
    document.querySelector('#graficosGrid .grafico-card:nth-child(1) .titulo-grafico').textContent = 'Compras por Categoría';
    document.querySelector('#graficosGrid .grafico-card:nth-child(2) .titulo-grafico').textContent = 'Top Proveedores';
    document.querySelector('#graficosGrid .grafico-card:nth-child(3) .titulo-grafico').textContent = 'Estado de Órdenes';
    
    // Gráfico Principal: Compras por Categoría
    const ctxPrincipal = document.getElementById('chartPrincipal').getContext('2d');
    chartPrincipal = new Chart(ctxPrincipal, {
        type: 'doughnut',
        data: {
            labels: ['Insumos', 'Suministros', 'Productos', 'Otros'],
            datasets: [{
                data: [45, 15, 30, 10],
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
    
    document.getElementById('leyendaPrincipal').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #ff5733;"></span><span>Insumos - 45%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ffc857;"></span><span>Suministros - 15%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #3498db;"></span><span>Productos - 30%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #9b59b6;"></span><span>Otros - 10%</span></div>
    `;
    
    // Gráfico Secundario: Top Proveedores
    const ctxSecundario = document.getElementById('chartSecundario').getContext('2d');
    chartSecundario = new Chart(ctxSecundario, {
        type: 'doughnut',
        data: {
            labels: ['Distribuidora ABC', 'Alimentos XYZ', 'Suministros DEF', 'Otros'],
            datasets: [{
                data: [35, 25, 20, 20],
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
    
    document.getElementById('leyendaSecundario').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #27ae60;"></span><span>Distribuidora ABC - 35%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #3498db;"></span><span>Alimentos XYZ - 25%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ff5733;"></span><span>Suministros DEF - 20%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #9b59b6;"></span><span>Otros - 20%</span></div>
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
            labels: ['Ingredientes', 'Bebidas', 'Envases', 'Suministros'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: ['#ff5733', '#3498db', '#ffc857', '#9b59b6'],
                borderWidth: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
    
    document.getElementById('leyendaSecundario').innerHTML = `
        <div class="leyenda-item"><span class="color-box" style="background: #ff5733;"></span><span>Ingredientes - 45%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #3498db;"></span><span>Bebidas - 25%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #ffc857;"></span><span>Envases - 20%</span></div>
        <div class="leyenda-item"><span class="color-box" style="background: #9b59b6;"></span><span>Suministros - 10%</span></div>
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
    document.querySelector('#graficosGrid .grafico-card:nth-child(1) .titulo-grafico').textContent = 'Distribución de Ingresos';
    document.querySelector('#graficosGrid .grafico-card:nth-child(2) .titulo-grafico').textContent = 'Estructura de Gastos';
    document.querySelector('#graficosGrid .grafico-card:nth-child(3) .titulo-grafico').textContent = 'Rentabilidad por Sucursal';
    
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