// ===== VISUALIZAR GANANCIAS - JAVASCRIPT =====

let chartGastos, chartVentasGastos, chartCategorias;

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
    // Gráfico de Distribución de Gastos
    const ctxGastos = document.getElementById('chartGastos');
    if (ctxGastos) {
        chartGastos = new Chart(ctxGastos, {
            type: 'pie',
            data: {
                labels: ['Compras de Insumos', 'Salarios', 'Servicios', 'Otros'],
                datasets: [{
                    data: [4700, 2000, 800, 300],
                    backgroundColor: [
                        '#ff5733',
                        '#3498db',
                        '#27ae60',
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
                                label += 'S/. ' + context.parsed.toFixed(2);
                                
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

    // Gráfico de Ventas vs Gastos
    const ctxVentasGastos = document.getElementById('chartVentasGastos');
    if (ctxVentasGastos) {
        chartVentasGastos = new Chart(ctxVentasGastos, {
            type: 'pie',
            data: {
                labels: ['Ventas', 'Gastos'],
                datasets: [{
                    data: [12500, 7800],
                    backgroundColor: [
                        '#27ae60',
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

    // Gráfico de Ventas por Categoría
    const ctxCategorias = document.getElementById('chartCategorias');
    if (ctxCategorias) {
        chartCategorias = new Chart(ctxCategorias, {
            type: 'pie',
            data: {
                labels: ['Pizzas', 'Bebidas', 'Complementos', 'Postres'],
                datasets: [{
                    data: [7500, 2000, 2000, 1000],
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
}

// Función para salir del módulo
function salirModulo() {
    if (confirm('¿Está seguro que desea salir?')) {
        window.location.href = '../index.html';
    }
}
