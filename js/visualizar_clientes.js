// ===== VISUALIZAR CLIENTES - JAVASCRIPT =====

// Variables globales
let ordenAscendente = true;
let datosOriginales = [];

// Datos de clientes (simulando base de datos)
const clientesData = [
    { id: 1, dni: '72345678', nombres: 'María', apellidos: 'González López', email: 'maria.gonzalez@email.com', telefono: '987654321', monto: 450.00 },
    { id: 2, dni: '85647392', nombres: 'Carlos', apellidos: 'Ramírez Torres', email: 'carlos.ramirez@email.com', telefono: '912345678', monto: 1250.50 },
    { id: 3, dni: '91234567', nombres: 'Ana', apellidos: 'Torres Mendoza', email: 'ana.torres@email.com', telefono: '923456789', monto: 85.00 },
    { id: 4, dni: '78912345', nombres: 'Luis', apellidos: 'Mendoza Silva', email: 'luis.mendoza@email.com', telefono: '934567890', monto: 720.75 },
    { id: 5, dni: '65498732', nombres: 'Patricia', apellidos: 'Flores Castro', email: 'patricia.flores@email.com', telefono: '945678901', monto: 320.25 },
    { id: 6, dni: '58473619', nombres: 'Roberto', apellidos: 'Vásquez Pérez', email: 'roberto.vasquez@email.com', telefono: '956789012', monto: 95.00 },
    { id: 7, dni: '47382951', nombres: 'Carmen', apellidos: 'Jiménez Ruiz', email: 'carmen.jimenez@email.com', telefono: '967890123', monto: 1480.00 },
    { id: 8, dni: '36271849', nombres: 'José', apellidos: 'Herrera Díaz', email: 'jose.herrera@email.com', telefono: '978901234', monto: 630.90 }
];

// Actualizar fecha y hora
function actualizarFechaHora() {
    const ahora = new Date();
    
    const fechaElement = document.getElementById('fechaActual');
    if (fechaElement) {
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        fechaElement.textContent = ahora.toLocaleDateString('es-ES', opciones);
    }
    
    const horaElement = document.getElementById('horaActual');
    if (horaElement) {
        horaElement.textContent = ahora.toLocaleTimeString('es-ES');
    }
}

// Función para renderizar la tabla
function renderizarTabla(datos = clientesData) {
    const tbody = document.getElementById('tbodyClientes');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    datos.forEach((cliente, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${cliente.dni}</td>
            <td>${cliente.nombres}</td>
            <td>${cliente.apellidos}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefono}</td>
            <td>S/. ${cliente.monto.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        `;
        tbody.appendChild(fila);
    });
}

// Función para filtrar por texto
function filtrarClientes() {
    const textoBusqueda = document.getElementById('buscarCliente').value.toLowerCase().trim();
    const filtroMonto = document.getElementById('filtroMontoGastado').value;
    
    let datosFiltrados = [...clientesData];
    
    // Filtrar por texto (busca en todos los campos)
    if (textoBusqueda) {
        datosFiltrados = datosFiltrados.filter(cliente => {
            return (
                cliente.dni.toLowerCase().includes(textoBusqueda) ||
                cliente.nombres.toLowerCase().includes(textoBusqueda) ||
                cliente.apellidos.toLowerCase().includes(textoBusqueda) ||
                cliente.email.toLowerCase().includes(textoBusqueda) ||
                cliente.telefono.includes(textoBusqueda) ||
                cliente.monto.toString().includes(textoBusqueda)
            );
        });
    }
    
    // Filtrar por rango de monto
    if (filtroMonto) {
        datosFiltrados = datosFiltrados.filter(cliente => {
            switch (filtroMonto) {
                case 'bajo':
                    return cliente.monto >= 0 && cliente.monto <= 100;
                case 'medio':
                    return cliente.monto > 100 && cliente.monto <= 500;
                case 'alto':
                    return cliente.monto > 500;
                default:
                    return true;
            }
        });
    }
    
    renderizarTabla(datosFiltrados);
}

// Función para ordenar por monto
function ordenarPorMonto() {
    const tbody = document.getElementById('tbodyClientes');
    const filas = Array.from(tbody.querySelectorAll('tr'));
    const icono = document.getElementById('sortIcon');
    
    // Extraer datos y ordenar
    const datosConIndice = filas.map(fila => {
        const celdas = fila.querySelectorAll('td');
        const montoTexto = celdas[6].textContent.replace('S/.', '').replace(/,/g, '').trim();
        const monto = parseFloat(montoTexto);
        return {
            fila: fila,
            monto: monto
        };
    });
    
    // Ordenar
    datosConIndice.sort((a, b) => {
        if (ordenAscendente) {
            return a.monto - b.monto;
        } else {
            return b.monto - a.monto;
        }
    });
    
    // Actualizar la tabla
    tbody.innerHTML = '';
    datosConIndice.forEach((item, index) => {
        // Actualizar el número de fila
        const celdas = item.fila.querySelectorAll('td');
        celdas[0].textContent = index + 1;
        tbody.appendChild(item.fila);
    });
    
    // Actualizar icono
    if (ordenAscendente) {
        icono.className = 'fas fa-sort-up';
    } else {
        icono.className = 'fas fa-sort-down';
    }
    
    // Cambiar el orden para la próxima vez
    ordenAscendente = !ordenAscendente;
}

// Función para cargar clientes
function cargarClientes() {
    datosOriginales = [...clientesData];
    renderizarTabla();
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
