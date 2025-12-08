// ===== VISUALIZAR CLIENTES - JAVASCRIPT =====

// Variables globales
let ordenAscendente = true;
let clientes = [];

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

// Cargar clientes desde la API
async function cargarClientes() {
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/clientes/listar');
        const data = await response.json();
        
        if (data.exito) {
            clientes = data.clientes || [];
            mostrarClientes(clientes);
        } else {
            console.error('Error al cargar clientes:', data.mensaje);
            clientes = [];
            mostrarClientes(clientes);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        clientes = [];
        mostrarClientes(clientes);
    }
}

// Mostrar clientes en la tabla
function mostrarClientes(data) {
    const tbody = document.getElementById('tbodyClientes');
    
    if (!tbody) return;
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No hay clientes registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = data.map((cliente, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${cliente.numDocumento}</td>
            <td>${cliente.nombres}</td>
            <td>${cliente.apellidos}</td>
            <td>${cliente.email || '-'}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.direccion || '-'}</td>
            <td>S/. ${cliente.montoGastado.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
    `).join('');
}

// Función para filtrar clientes
function filtrarClientes() {
    const textoBusqueda = document.getElementById('buscarCliente').value.toLowerCase().trim();
    const filtroMonto = document.getElementById('filtroMontoGastado').value;
    
    let datosFiltrados = [...clientes];
    
    // Filtrar por texto (busca en todos los campos)
    if (textoBusqueda) {
        datosFiltrados = datosFiltrados.filter(cliente => {
            return (
                cliente.numDocumento.toLowerCase().includes(textoBusqueda) ||
                cliente.nombres.toLowerCase().includes(textoBusqueda) ||
                cliente.apellidos.toLowerCase().includes(textoBusqueda) ||
                (cliente.email && cliente.email.toLowerCase().includes(textoBusqueda)) ||
                cliente.telefono.includes(textoBusqueda) ||
                cliente.montoGastado.toString().includes(textoBusqueda)
            );
        });
    }
    
    // Filtrar por rango de monto
    if (filtroMonto) {
        datosFiltrados = datosFiltrados.filter(cliente => {
            switch (filtroMonto) {
                case 'bajo':
                    return cliente.montoGastado >= 0 && cliente.montoGastado <= 100;
                case 'medio':
                    return cliente.montoGastado > 100 && cliente.montoGastado <= 500;
                case 'alto':
                    return cliente.montoGastado > 500;
                default:
                    return true;
            }
        });
    }
    
    mostrarClientes(datosFiltrados);
}

// Función para ordenar por monto
function ordenarPorMonto() {
    const icono = document.getElementById('sortIcon');
    
    // Crear copia y ordenar
    const datosOrdenados = [...clientes].sort((a, b) => {
        if (ordenAscendente) {
            return a.montoGastado - b.montoGastado;
        } else {
            return b.montoGastado - a.montoGastado;
        }
    });
    
    // Actualizar icono
    if (ordenAscendente) {
        icono.className = 'fas fa-sort-up';
    } else {
        icono.className = 'fas fa-sort-down';
    }
    
    // Cambiar el orden para la próxima vez
    ordenAscendente = !ordenAscendente;
    
    // Mostrar datos ordenados
    mostrarClientes(datosOrdenados);
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    cargarClientes();
    
    // Event listeners para filtros
    const inputBusqueda = document.getElementById('buscarCliente');
    const selectFiltro = document.getElementById('filtroMontoGastado');
    const btnBuscar = document.querySelector('.btn-buscar');
    
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', filtrarClientes);
    }
    
    if (selectFiltro) {
        selectFiltro.addEventListener('change', filtrarClientes);
    }
    
    if (btnBuscar) {
        btnBuscar.addEventListener('click', filtrarClientes);
    }
});

// Función para salir del módulo
function salirModulo() {
    if (confirm('¿Está seguro que desea salir?')) {
        window.location.href = '../index.html';
    }
}
