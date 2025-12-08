// ===== VISUALIZAR REPORTES DE VENTAS - JAVASCRIPT =====

let chartCategorias, chartMetodosPago, chartTipoServicio;

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

    // Gráfico de Métodos de Pago
    const ctxMetodosPago = document.getElementById('chartMetodosPago');
    if (ctxMetodosPago) {
        chartMetodosPago = new Chart(ctxMetodosPago, {
            type: 'pie',
            data: {
                labels: ['Efectivo', 'Tarjeta', 'Transferencia'],
                datasets: [{
                    data: [5625, 4375, 2500],
                    backgroundColor: [
                        '#27ae60',
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

    // Gráfico de Tipo de Servicio
    const ctxTipoServicio = document.getElementById('chartTipoServicio');
    if (ctxTipoServicio) {
        chartTipoServicio = new Chart(ctxTipoServicio, {
            type: 'pie',
            data: {
                labels: ['Delivery', 'Para llevar', 'En local'],
                datasets: [{
                    data: [6875, 3750, 1875],
                    backgroundColor: [
                        '#ff5733',
                        '#ffc857',
                        '#3498db'
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
