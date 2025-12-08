// ===== VISUALIZAR REPORTES DE COMPRAS - JAVASCRIPT =====

let chartCategorias, chartProveedores, chartEstadoOrdenes;

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


// Inicializar al cargar
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    inicializarGraficos();
});

// Función para inicializar gráficos
function inicializarGraficos() {
    // Gráfico de Compras por Categoría
    const ctxCategorias = document.getElementById('chartCategorias');
    if (ctxCategorias) {
        chartCategorias = new Chart(ctxCategorias, {
            type: 'pie',
            data: {
                labels: ['Insumos', 'Suministros', 'Productos', 'Otros'],
                datasets: [{
                    data: [3510, 1170, 2340, 780],
                    backgroundColor: [
                        '#ff5733',
                        '#ffc857',
                        '#3498db',
                        '#9b59b6'
                    ],
                    borderColor: 'rgba(26, 29, 46, 0.8)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 29, 46, 0.95)',
                        titleColor: '#ffc857',
                        bodyColor: '#ffffff',
                        borderColor: '#ff5733',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += 'S/. ' + context.parsed.toLocaleString('es-PE', {minimumFractionDigits: 2});
                                
                                // Calcular porcentaje
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                label += ' (' + percentage + '%)';
                                
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfico de Top Proveedores
    const ctxProveedores = document.getElementById('chartProveedores');
    if (ctxProveedores) {
        chartProveedores = new Chart(ctxProveedores, {
            type: 'pie',
            data: {
                labels: ['Distribuidora ABC', 'Alimentos XYZ', 'Suministros DEF', 'Otros'],
                datasets: [{
                    data: [2730, 1950, 1560, 1560],
                    backgroundColor: [
                        '#27ae60',
                        '#3498db',
                        '#ff5733',
                        '#9b59b6'
                    ],
                    borderColor: 'rgba(26, 29, 46, 0.8)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 29, 46, 0.95)',
                        titleColor: '#ffc857',
                        bodyColor: '#ffffff',
                        borderColor: '#ff5733',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += 'S/. ' + context.parsed.toLocaleString('es-PE', {minimumFractionDigits: 2});
                                
                                // Calcular porcentaje
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                label += ' (' + percentage + '%)';
                                
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfico de Estado de Órdenes
    const ctxEstadoOrdenes = document.getElementById('chartEstadoOrdenes');
    if (ctxEstadoOrdenes) {
        chartEstadoOrdenes = new Chart(ctxEstadoOrdenes, {
            type: 'pie',
            data: {
                labels: ['Completadas', 'Pendientes', 'Canceladas'],
                datasets: [{
                    data: [32, 9, 4],
                    backgroundColor: [
                        '#27ae60',
                        '#ffc857',
                        '#e74c3c'
                    ],
                    borderColor: 'rgba(26, 29, 46, 0.8)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 29, 46, 0.95)',
                        titleColor: '#ffc857',
                        bodyColor: '#ffffff',
                        borderColor: '#ff5733',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed + ' órdenes';
                                
                                // Calcular porcentaje
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                label += ' (' + percentage + '%)';
                                
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Función para salir del módulo
function salirModulo() {
    if (confirm('¿Está seguro que desea salir?')) {
        window.location.href = '../index.html';
    }
}
