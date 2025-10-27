/* ============================================
   JAVASCRIPT PARA REGISTRAR VENTA
   ============================================ */

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    inicializarFechaHora();
    inicializarEventos();
    cargarProductosEjemplo();
});

// Configurar fecha y hora actual
function inicializarFechaHora() {
    const ahora = new Date();
    
    // Formato fecha: YYYY-MM-DD
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    document.getElementById('fecha').value = `${año}-${mes}-${dia}`;
    
    // Formato hora: HH:MM:SS
    actualizarHora();
    
    // Actualizar hora cada segundo
    setInterval(actualizarHora, 1000);
}

function actualizarHora() {
    const ahora = new Date();
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');
    document.getElementById('hora').value = `${horas}:${minutos}:${segundos}`;
}

// Inicializar eventos
function inicializarEventos() {
    // Eventos de búsqueda de producto
    const inputCodigo = document.getElementById('inputCodigo');
    const inputLinea = document.getElementById('inputLinea');
    
    if (inputCodigo) {
        inputCodigo.addEventListener('input', buscarProductoPorCodigo);
        inputCodigo.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                añadirProducto();
            }
        });
    }
    
    if (inputLinea) {
        inputLinea.addEventListener('input', buscarProductoPorLinea);
        inputLinea.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                añadirProducto();
            }
        });
    }
}

// Base de datos simulada de productos
const productosDB = [
    { codigo: 'P001', linea: 'PIZZAS', nombre: 'Pizza Hawaiana', precio: 35.00 },
    { codigo: 'P002', linea: 'PIZZAS', nombre: 'Pizza Pepperoni', precio: 40.00 },
    { codigo: 'P003', linea: 'PIZZAS', nombre: 'Pizza Vegetariana', precio: 38.00 },
    { codigo: 'P004', linea: 'PIZZAS', nombre: 'Pizza Americana', precio: 42.00 },
    { codigo: 'B001', linea: 'BEBIDAS', nombre: 'Coca Cola 1.5L', precio: 8.00 },
    { codigo: 'B002', linea: 'BEBIDAS', nombre: 'Inca Kola 1.5L', precio: 8.00 },
    { codigo: 'B003', linea: 'BEBIDAS', nombre: 'Agua Mineral', precio: 3.00 },
    { codigo: 'A001', linea: 'ACOMPAÑAMIENTOS', nombre: 'Alitas BBQ', precio: 25.00 },
    { codigo: 'A002', linea: 'ACOMPAÑAMIENTOS', nombre: 'Tequeños x6', precio: 18.00 },
];

// Producto seleccionado temporalmente
let productoSeleccionado = null;

// Buscar producto por código
function buscarProductoPorCodigo() {
    const codigo = document.getElementById('inputCodigo').value.toUpperCase();
    
    if (codigo.length >= 2) {
        const producto = productosDB.find(p => p.codigo.startsWith(codigo));
        
        if (producto) {
            productoSeleccionado = producto;
            document.getElementById('inputLinea').value = producto.linea;
            document.getElementById('inputDescripcion').value = producto.nombre;
            document.getElementById('inputPrecio').value = `S/${producto.precio.toFixed(2)}`;
        } else {
            limpiarSeleccionProducto();
        }
    } else {
        limpiarSeleccionProducto();
    }
}

// Buscar producto por línea
function buscarProductoPorLinea() {
    const linea = document.getElementById('inputLinea').value.toUpperCase();
    
    if (linea.length >= 2) {
        const producto = productosDB.find(p => p.linea.startsWith(linea));
        
        if (producto) {
            productoSeleccionado = producto;
            document.getElementById('inputCodigo').value = producto.codigo;
            document.getElementById('inputDescripcion').value = producto.nombre;
            document.getElementById('inputPrecio').value = `S/${producto.precio.toFixed(2)}`;
        } else {
            limpiarSeleccionProducto();
        }
    } else {
        limpiarSeleccionProducto();
    }
}

// Limpiar selección de producto
function limpiarSeleccionProducto() {
    productoSeleccionado = null;
    document.getElementById('inputDescripcion').value = '';
    document.getElementById('inputPrecio').value = 'S/';
}

// Añadir producto a la tabla
function añadirProducto() {
    if (!productoSeleccionado) {
        alert('Por favor, seleccione un producto válido');
        return;
    }
    
    const tbody = document.getElementById('tablaProductos');
    const cantidad = 1;
    const precio = productoSeleccionado.precio;
    const total = cantidad * precio;
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${productoSeleccionado.nombre}</td>
        <td><input type="number" class="cantidad-input" value="${cantidad}" min="1" onchange="actualizarTotal(this)"></td>
        <td>S/${precio.toFixed(2)}</td>
        <td class="total-producto">S/${total.toFixed(2)}</td>
        <td>
            <button class="btn-eliminar-fila" onclick="eliminarFila(this)" title="Eliminar producto">
                <i class="fas fa-times"></i>
            </button>
        </td>
    `;
    
    tbody.appendChild(tr);
    
    // Limpiar campos
    document.getElementById('inputCodigo').value = '';
    document.getElementById('inputLinea').value = '';
    limpiarSeleccionProducto();
    document.getElementById('inputCodigo').focus();
    
    calcularTotales();
}

// Actualizar total de una fila
function actualizarTotal(input) {
    const tr = input.closest('tr');
    const cantidad = parseInt(input.value) || 1;
    const precioTexto = tr.cells[2].textContent;
    const precio = parseFloat(precioTexto.replace('S/', ''));
    const total = cantidad * precio;
    
    tr.querySelector('.total-producto').textContent = `S/${total.toFixed(2)}`;
    
    calcularTotales();
}

// Eliminar fila de la tabla
function eliminarFila(btn) {
    const tr = btn.closest('tr');
    const tbody = document.getElementById('tablaProductos');
    
    if (tbody.children.length > 1) {
        tr.remove();
        calcularTotales();
    } else {
        alert('Debe haber al menos un producto en la venta');
    }
}

// Mover producto arriba
function moverArriba(btn) {
    const tr = btn.closest('tr');
    const prevTr = tr.previousElementSibling;
    
    if (prevTr) {
        tr.parentNode.insertBefore(tr, prevTr);
    }
}

// Mover producto abajo
function moverAbajo(btn) {
    const tr = btn.closest('tr');
    const nextTr = tr.nextElementSibling;
    
    if (nextTr) {
        tr.parentNode.insertBefore(nextTr, tr);
    }
}

// Calcular totales de la venta
function calcularTotales() {
    const tbody = document.getElementById('tablaProductos');
    const filas = tbody.getElementsByTagName('tr');
    let totalGeneral = 0;
    
    for (let fila of filas) {
        const totalTexto = fila.querySelector('.total-producto');
        if (totalTexto) {
            const total = parseFloat(totalTexto.textContent.replace('S/', ''));
            totalGeneral += total;
        }
    }
    
    // Aquí podrías mostrar el total en algún lugar de la interfaz
    console.log('Total de la venta: S/' + totalGeneral.toFixed(2));
}

// Buscar cliente
function buscarCliente() {
    const busqueda = document.getElementById('clienteBuscar').value;
    
    if (!busqueda.trim()) {
        alert('Ingrese un nombre o DNI para buscar');
        return;
    }
    
    // Simulación de búsqueda
    console.log('Buscando cliente:', busqueda);
    
    // Aquí iría la lógica de búsqueda en la base de datos
    // Por ahora, solo mostramos un mensaje
    alert('Funcionalidad de búsqueda de clientes en desarrollo');
}

// Nuevo cliente
function nuevoCliente() {
    // Redirigir a la página de registro de clientes
    window.location.href = 'registrar_clientes.html';
}

// Registrar venta
function registrarVenta() {
    const cliente = document.getElementById('clienteBuscar').value;
    const tipoPago = document.getElementById('tipoPago').value;
    const tbody = document.getElementById('tablaProductos');
    
    // Validaciones
    if (!cliente.trim()) {
        alert('Por favor, seleccione o busque un cliente');
        document.getElementById('clienteBuscar').focus();
        return;
    }
    
    if (!tipoPago) {
        alert('Por favor, seleccione un tipo de pago');
        document.getElementById('tipoPago').focus();
        return;
    }
    
    if (tbody.children.length === 0) {
        alert('Por favor, agregue al menos un producto a la venta');
        return;
    }
    
    // Recopilar datos de la venta
    const venta = {
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value,
        cliente: cliente,
        tipoPago: tipoPago,
        productos: []
    };
    
    // Recopilar productos
    const filas = tbody.getElementsByTagName('tr');
    let totalVenta = 0;
    
    for (let fila of filas) {
        const producto = fila.cells[0].textContent;
        const cantidadInput = fila.querySelector('.cantidad-input');
        const cantidad = cantidadInput ? parseInt(cantidadInput.value) : parseInt(fila.cells[1].textContent);
        const precioTexto = fila.cells[2].textContent;
        const precio = parseFloat(precioTexto.replace('S/', ''));
        const totalTexto = fila.querySelector('.total-producto') || fila.cells[3];
        const total = parseFloat(totalTexto.textContent.replace('S/', ''));
        
        venta.productos.push({
            producto: producto,
            cantidad: cantidad,
            precio: precio,
            total: total
        });
        
        totalVenta += total;
    }
    
    venta.total = totalVenta;
    
    // Guardar en localStorage (simulación)
    const ventas = JSON.parse(localStorage.getItem('ventas') || '[]');
    venta.id = Date.now();
    ventas.push(venta);
    localStorage.setItem('ventas', JSON.stringify(ventas));
    
    console.log('Venta registrada:', venta);
    
    // Mostrar confirmación
    if (confirm(`Venta registrada exitosamente!\n\nTotal: S/${totalVenta.toFixed(2)}\n\n¿Desea imprimir el ticket?`)) {
        imprimirTicket(venta);
    }
    
    // Limpiar formulario
    limpiarFormulario();
}

// Imprimir ticket
function imprimirTicket(venta) {
    console.log('Imprimiendo ticket:', venta);
    alert('Funcionalidad de impresión en desarrollo');
}

// Eliminar venta
function eliminarVenta() {
    if (confirm('¿Está seguro de que desea eliminar esta venta?')) {
        limpiarFormulario();
    }
}

// Salir de la venta
function salirVenta() {
    if (confirm('¿Está seguro de que desea salir? Los datos no guardados se perderán.')) {
        window.location.href = 'menu_principal.html';
    }
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('clienteBuscar').value = '';
    document.getElementById('tipoPago').value = '';
    document.getElementById('inputCodigo').value = '';
    document.getElementById('inputLinea').value = '';
    limpiarSeleccionProducto();
    
    // Limpiar tabla pero dejar una fila de ejemplo
    const tbody = document.getElementById('tablaProductos');
    tbody.innerHTML = '';
    
    cargarProductosEjemplo();
}

// Cargar productos de ejemplo (para demostración)
function cargarProductosEjemplo() {
    const tbody = document.getElementById('tablaProductos');
    
    // Solo cargar ejemplos si la tabla está vacía
    if (tbody.children.length === 0) {
        const ejemplos = [
            { nombre: 'PRODUCTO 1', cantidad: 1, precio: 10, total: 10 },
            { nombre: 'PRODUCTO 2', cantidad: 2, precio: 10, total: 20 },
            { nombre: 'PRODUCTO 3', cantidad: 3, precio: 10, total: 30 }
        ];
        
        ejemplos.forEach((item, index) => {
            const tr = document.createElement('tr');
            const botonFlecha = index < ejemplos.length - 1 
                ? '<button class="btn-scroll-up" onclick="moverArriba(this)"><i class="fas fa-chevron-up"></i></button>'
                : '<button class="btn-scroll-down" onclick="moverAbajo(this)"><i class="fas fa-chevron-down"></i></button>';
            
            tr.innerHTML = `
                <td>${item.nombre}</td>
                <td>${item.cantidad}</td>
                <td>S/${item.precio}</td>
                <td>S/${item.total}</td>
                <td>${botonFlecha}</td>
            `;
            
            tbody.appendChild(tr);
        });
    }
}

// Toggle sidebar (para dispositivos móviles)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

// Agregar estilos para los inputs en la tabla
const style = document.createElement('style');
style.textContent = `
    .cantidad-input {
        width: 60px;
        text-align: center;
        border: 1px solid #999;
        border-radius: 3px;
        padding: 5px;
        font-size: 14px;
        font-weight: bold;
    }
    
    .cantidad-input:focus {
        outline: none;
        border-color: #4FC3F7;
        box-shadow: 0 0 5px rgba(79, 195, 247, 0.5);
    }
    
    .btn-eliminar-fila {
        background: #FF6B6B;
        border: none;
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
    
    .btn-eliminar-fila:hover {
        background: #FF4444;
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);
