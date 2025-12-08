// ===== VISUALIZAR RENDIMIENTO DE TRABAJADORES - JAVASCRIPT =====

let chartTopMozos, chartTurnos, chartAreas;

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
    // Gráfico de Top Mozos por Atenciones
    const ctxTopMozos = document.getElementById('chartTopMozos');
    if (ctxTopMozos) {
        chartTopMozos = new Chart(ctxTopMozos, {
            type: 'pie',
            data: {
                labels: ['Carlos Mendoza', 'Ana García', 'Luis Pérez', 'María Torres', 'Otros'],
                datasets: [{
                    data: [95, 82, 78, 71, 254],
                    backgroundColor: [
                        '#ff5733',
                        '#ffc857',
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
                                label += context.parsed + ' clientes';
                                
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

    // Gráfico de Distribución por Turno
    const ctxTurnos = document.getElementById('chartTurnos');
    if (ctxTurnos) {
        chartTurnos = new Chart(ctxTurnos, {
            type: 'pie',
            data: {
                labels: ['Mañana', 'Tarde', 'Noche'],
                datasets: [{
                    data: [185, 225, 170],
                    backgroundColor: [
                        '#ffc857',
                        '#ff5733',
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
                                label += context.parsed + ' atenciones';
                                
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

    // Gráfico de Desempeño por Área
    const ctxAreas = document.getElementById('chartAreas');
    if (ctxAreas) {
        chartAreas = new Chart(ctxAreas, {
            type: 'pie',
            data: {
                labels: ['Atención al Cliente', 'Cocina', 'Delivery', 'Caja'],
                datasets: [{
                    data: [320, 140, 85, 35],
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
                                label += context.parsed + ' trabajadores';
                                
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

// Función para exportar reporte
function exportarReporte() {
    alert('Exportando reporte de rendimiento de trabajadores...');
    // Aquí iría la lógica para exportar a Excel o PDF
}

// Función para salir del módulo
function salirModulo() {
    if (confirm('¿Está seguro que desea salir?')) {
        window.location.href = '../index.html';
    }
}
