/* ============================================
   TIENDA - FUNCIONALIDADES
   ============================================ */

// Variables globales
let carrito = [];
let productosDisponibles = [];
let filtroActivo = 'todos';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    cargarUsuarioInfo();
    setupLogout();
    cargarProductos().then(() => {
        inicializarEventos();
    });
});

// Inicializar eventos
function inicializarEventos() {
    // Navegación de categorías
    const navLinks = document.querySelectorAll('.nav-cat-link');
    navLinks.forEach(link => {
        link.removeEventListener('click', handleNavClick);
        link.addEventListener('click', handleNavClick);
    });

    // Botones agregar (event delegation)
    const grid = document.querySelector('.productos-grid');
    if (grid) {
        grid.removeEventListener('click', handleAgregarClick);
        grid.addEventListener('click', handleAgregarClick);
    }
    
    reinitializarEventosGenerales();
}

// Handler para navegación
function handleNavClick(e) {
    e.preventDefault();
    
    const navLinks = document.querySelectorAll('.nav-cat-link');
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    
    filtroActivo = this.dataset.categoria;
    filtrarProductos();
}

// Handler para agregar productos (event delegation)
function handleAgregarClick(e) {
    if (e.target.closest('.btn-agregar')) {
        const card = e.target.closest('.producto-card');
        if (card) {
            const nombre = card.querySelector('h3')?.textContent || 'Producto';
            const precioText = card.querySelector('.precio-actual')?.textContent || 'S/. 0';
            const precio = parseFloat(precioText.replace('S/. ', ''));
            
            // Buscar el producto en productosDisponibles para obtener su ID
            const productoEnBD = productosDisponibles.find(p => p.nombre === nombre);
            const idPlato = productoEnBD?.id || 0;
            
            agregarAlCarrito({
                id: idPlato,
                nombre: nombre,
                precio: precio,
                cantidad: 1
            });
            
            mostrarNotificacion(`${nombre} agregado al carrito`);
        }
    }
}

// Reinicializar eventos generales
function reinitializarEventosGenerales() {
    // Botones favorito (event delegation)
    const grid = document.querySelector('.productos-grid');
    if (grid) {
        grid.removeEventListener('click', handleFavoritoClick);
        grid.addEventListener('click', handleFavoritoClick);
    }

    // Botón carrito
    const btnCarrito = document.querySelector('.btn-carrito');
    if (btnCarrito) {
        btnCarrito.removeEventListener('click', toggleCarrito);
        btnCarrito.addEventListener('click', toggleCarrito);
    }

    // Botón cerrar carrito
    const btnCerrarCarrito = document.querySelector('.btn-cerrar-carrito');
    if (btnCerrarCarrito) {
        btnCerrarCarrito.removeEventListener('click', toggleCarrito);
        btnCerrarCarrito.addEventListener('click', toggleCarrito);
    }

    // Overlay carrito
    const overlay = document.querySelector('.carrito-overlay');
    if (overlay) {
        overlay.removeEventListener('click', toggleCarrito);
        overlay.addEventListener('click', toggleCarrito);
    }

    // Filtro de precio
    const rangeSlider = document.querySelector('.range-slider');
    if (rangeSlider) {
        rangeSlider.removeEventListener('change', filtrarProductos);
        rangeSlider.addEventListener('change', filtrarProductos);
    }

    // Buscar productos
    const searchBox = document.querySelector('.search-box input');
    if (searchBox) {
        searchBox.removeEventListener('input', buscarProductos);
        searchBox.addEventListener('input', buscarProductos);
    }

    // Ordenar productos
    const selectOrdenar = document.querySelector('.select-ordenar');
    if (selectOrdenar) {
        selectOrdenar.removeEventListener('change', ordenarProductos);
        selectOrdenar.addEventListener('change', ordenarProductos);
    }

    // Botón finalizar pedido
    const btnFinalizar = document.querySelector('.btn-finalizar');
    if (btnFinalizar) {
        btnFinalizar.removeEventListener('click', finalizarPedido);
        btnFinalizar.addEventListener('click', finalizarPedido);
    }
}

// Handler para favorito
function handleFavoritoClick(e) {
    if (e.target.closest('.btn-favorito')) {
        const btn = e.target.closest('.btn-favorito');
        btn.classList.toggle('active');
        btn.innerHTML = btn.classList.contains('active') 
            ? '<i class="fas fa-heart"></i>' 
            : '<i class="far fa-heart"></i>';
    }
}

// Cargar productos (desde la API)
async function cargarProductos() {
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/platos/listar');
        const data = await response.json();
        
        if (data.exito && data.platos) {
            productosDisponibles = data.platos.map(plato => ({
                id: plato.IdPlato,
                nombre: plato.Nombre,
                descripcion: plato.Descripcion || '',
                ingredientes: plato.Ingredientes || '',
                tamano: plato.Tamano || 'personal',
                precio: parseFloat(plato.Precio),
                cantidad: plato.Cantidad || 0,
                estado: plato.Estado,
                categoria: obtenerCategoria(plato.Nombre)
            }));
            
            console.log('Productos cargados desde BD:', productosDisponibles.length);
            renderizarProductosDesdeAPI();
        }
    } catch (error) {
        console.error('Error cargando productos:', error);
        // Usar datos por defecto si falla
        usarProductosPorDefecto();
    }
}

// Obtener categoría del nombre del plato
function obtenerCategoria(nombre) {
    nombre = nombre.toLowerCase();
    if (nombre.includes('pizza')) return 'pizzas';
    if (nombre.includes('hamburguesa')) return 'hamburguesas';
    if (nombre.includes('coca') || nombre.includes('limonada') || nombre.includes('jugo') || nombre.includes('bebida')) return 'bebidas';
    if (nombre.includes('helado') || nombre.includes('postre') || nombre.includes('cheesecake') || nombre.includes('brownies')) return 'postres';
    if (nombre.includes('alitas') || nombre.includes('tequeños') || nombre.includes('anticuchos') || nombre.includes('entrada')) return 'entradas';
    return 'otros';
}

// Renderizar productos desde la API
function renderizarProductosDesdeAPI() {
    const grid = document.querySelector('.productos-grid');
    
    // Limpiar grid
    const cardsExistentes = grid.querySelectorAll('.producto-card');
    cardsExistentes.forEach(card => card.remove());
    
    // Agregar nuevas tarjetas
    productosDisponibles.forEach(producto => {
        const card = crearTarjetaProducto(producto);
        grid.appendChild(card);
    });
    
    // Reinicializar eventos para los nuevos elementos
    reinitializarEventosGenerales();
    
    // Actualizar contador
    const counter = document.querySelector('.productos-count');
    if (counter) {
        counter.textContent = `${productosDisponibles.length} productos disponibles`;
    }
}

// Crear tarjeta de producto
function crearTarjetaProducto(producto) {
    const card = document.createElement('div');
    card.className = `producto-card ${producto.estado === 'disponible' ? '' : 'agotado'}`;
    card.dataset.categoria = producto.categoria;
    
    const estadoDisponible = producto.estado === 'disponible';
    const estadoBadge = estadoDisponible ? '' : '<span class="badge badge-agotado">Agotado</span>';
    
    card.innerHTML = `
        <div class="producto-badges">
            ${estadoBadge}
        </div>
        <button class="btn-favorito" ${!estadoDisponible ? 'disabled' : ''}>
            <i class="far fa-heart"></i>
        </button>
        <div class="producto-imagen">
            <i class="fas fa-pizza-slice"></i>
        </div>
        <div class="producto-info">
            <h3>${producto.nombre}</h3>
            <p class="producto-descripcion">${producto.descripcion || 'Delicioso platillo'}</p>
            <div class="producto-rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
                <span>(${Math.floor(Math.random() * 200) + 50})</span>
            </div>
            <div class="producto-meta">
                <span class="tiempo"><i class="far fa-clock"></i> ${Math.floor(Math.random() * 15) + 15} min</span>
                <span class="calorias"><i class="fas fa-fire"></i> ${Math.floor(Math.random() * 500) + 400} kcal</span>
            </div>
            <div class="producto-footer">
                <div class="precio-box">
                    <span class="precio-actual">S/. ${producto.precio.toFixed(2)}</span>
                </div>
                <button class="btn-agregar" ${!estadoDisponible ? 'disabled' : ''}>
                    <i class="fas fa-plus"></i> ${estadoDisponible ? 'Agregar' : 'No disponible'}
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Usar productos por defecto (fallback)
function usarProductosPorDefecto() {
    productosDisponibles = [
        { id: 1, nombre: 'Pizza Hawaiana Personal', categoria: 'pizzas', precio: 25.50, cantidad: 20, estado: 'disponible', descripcion: 'Piña y jamón' },
        { id: 2, nombre: 'Pizza Pepperoni Mediana', categoria: 'pizzas', precio: 34.50, cantidad: 20, estado: 'disponible', descripcion: 'Pepperoni premium' },
        { id: 3, nombre: 'Pizza Vegetariana Grande', categoria: 'pizzas', precio: 43.50, cantidad: 18, estado: 'disponible', descripcion: 'Vegetales frescos' },
        { id: 4, nombre: 'Hamburguesa Clásica', categoria: 'hamburguesas', precio: 25.00, cantidad: 15, estado: 'disponible', descripcion: 'Carne, lechuga, tomate' },
        { id: 5, nombre: 'Coca Cola 500ml', categoria: 'bebidas', precio: 5.00, cantidad: 50, estado: 'disponible', descripcion: 'Bebida gaseosa' },
        { id: 6, nombre: 'Helado de Chocolate', categoria: 'postres', precio: 12.00, cantidad: 25, estado: 'disponible', descripcion: 'Chocolate belga' },
        { id: 7, nombre: 'Alitas Picantes', categoria: 'entradas', precio: 18.00, cantidad: 20, estado: 'disponible', descripcion: 'Salsa BBQ' },
        { id: 8, nombre: 'Tequeños de Queso', categoria: 'entradas', precio: 13.50, cantidad: 15, estado: 'disponible', descripcion: 'Relleno de queso' }
    ];
    renderizarProductosDesdeAPI();
}

// Filtrar productos
function filtrarProductos() {
    const cards = document.querySelectorAll('.producto-card');
    const rangeValue = document.querySelector('.range-slider')?.value || 100;
    
    cards.forEach(card => {
        const categoria = card.dataset.categoria;
        const precio = parseFloat(card.querySelector('.precio-actual').textContent.replace('S/. ', ''));
        
        const cumpleCategoria = filtroActivo === 'todos' || categoria === filtroActivo;
        const cumplerPrecio = precio <= rangeValue;
        
        card.style.display = (cumpleCategoria && cumplerPrecio) ? 'flex' : 'none';
    });
}

// Buscar productos
function buscarProductos(e) {
    const busqueda = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.producto-card');
    
    cards.forEach(card => {
        const nombre = card.querySelector('h3').textContent.toLowerCase();
        const descripcion = card.querySelector('.producto-descripcion').textContent.toLowerCase();
        
        const cumple = nombre.includes(busqueda) || descripcion.includes(busqueda);
        card.style.display = cumple ? 'flex' : 'none';
    });
}

// Ordenar productos
function ordenarProductos(e) {
    const grid = document.querySelector('.productos-grid');
    const cards = Array.from(grid.querySelectorAll('.producto-card'));
    const opcion = e.target.value;
    
    cards.sort((a, b) => {
        const precioA = parseFloat(a.querySelector('.precio-actual').textContent.replace('S/. ', ''));
        const precioB = parseFloat(b.querySelector('.precio-actual').textContent.replace('S/. ', ''));
        const nombreA = a.querySelector('h3').textContent;
        const nombreB = b.querySelector('h3').textContent;
        const ratingA = a.querySelectorAll('.fa-star').length;
        const ratingB = b.querySelectorAll('.fa-star').length;
        
        if (opcion.includes('Menor')) return precioA - precioB;
        if (opcion.includes('Mayor')) return precioB - precioA;
        if (opcion.includes('vendidos')) return ratingB - ratingA;
        return 0;
    });
    
    cards.forEach(card => grid.appendChild(card));
}

// Agregar al carrito
function agregarAlCarrito(producto) {
    const itemExistente = carrito.find(item => item.nombre === producto.nombre);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push(producto);
    }
    
    actualizarCarrito();
    mostrarNotificacion('Producto agregado al carrito');
}

// Toggle carrito
function toggleCarrito() {
    const panel = document.querySelector('.carrito-panel');
    const overlay = document.querySelector('.carrito-overlay');
    
    panel.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Actualizar carrito
function actualizarCarrito() {
    const carritoVacio = document.querySelector('.carrito-vacio');
    const carritoItems = document.querySelector('.carrito-items');
    const btnCarrito = document.querySelector('.btn-carrito');
    const contador = btnCarrito.querySelector('.carrito-count');
    const totalBtn = btnCarrito.querySelector('.carrito-total');
    
    // Actualizar contador
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    contador.textContent = totalItems;
    
    // Calcular total
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    totalBtn.textContent = `S/. ${total.toFixed(2)}`;
    
    // Mostrar/ocultar secciones
    if (carrito.length === 0) {
        carritoVacio.style.display = 'flex';
        carritoItems.style.display = 'none';
    } else {
        carritoVacio.style.display = 'none';
        carritoItems.style.display = 'block';
        renderizarCarrito();
    }
    
    // Actualizar resumen
    actualizarResumen();
}

// Renderizar items del carrito
function renderizarCarrito() {
    const carritoItems = document.querySelector('.carrito-items');
    carritoItems.innerHTML = '';
    
    carrito.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'carrito-item';
        itemDiv.innerHTML = `
            <div class="item-imagen">
                <i class="fas fa-pizza-slice"></i>
            </div>
            <div class="item-info">
                <h4>${item.nombre}</h4>
                <span class="item-precio">S/. ${item.precio.toFixed(2)}</span>
            </div>
            <div class="item-cantidad">
                <button class="btn-cantidad" onclick="cambiarCantidad(${index}, -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span>${item.cantidad}</span>
                <button class="btn-cantidad" onclick="cambiarCantidad(${index}, 1)">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <button class="btn-eliminar-item" onclick="eliminarDelCarrito(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        carritoItems.appendChild(itemDiv);
    });
}

// Cambiar cantidad
function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;
    
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    
    actualizarCarrito();
}

// Eliminar del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

// Actualizar resumen
function actualizarResumen() {
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const descuento = 0;
    const delivery = carrito.length > 0 ? 5.00 : 0;
    const total = subtotal - descuento + delivery;
    
    const resumenLineas = document.querySelectorAll('.resumen-linea');
    if (resumenLineas.length >= 4) {
        resumenLineas[0].querySelector('span:last-child').textContent = `S/. ${subtotal.toFixed(2)}`;
        resumenLineas[1].querySelector('span:last-child').textContent = `-S/. ${descuento.toFixed(2)}`;
        resumenLineas[2].querySelector('span:last-child').textContent = `S/. ${delivery.toFixed(2)}`;
        resumenLineas[3].querySelector('span:last-child').textContent = `S/. ${total.toFixed(2)}`;
    }
}

// Finalizar pedido
async function finalizarPedido() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    // Obtener datos del cliente
    let clienteActual = sessionStorage.getItem('clienteActual') || localStorage.getItem('clienteActual');
    
    if (!clienteActual) {
        alert('No hay cliente autenticado. Por favor, inicia sesión nuevamente.');
        window.location.href = '../html/login_cliente.html';
        return;
    }
    
    try {
        const cliente = JSON.parse(clienteActual);
        
        // Preparar detalles del pedido
        const detalles = carrito.map((item, index) => ({
            idPlato: item.id || 0,
            codProducto: `PLATO-${item.id || (index + 1)}`,
            descripcionProducto: item.nombre,
            cantidad: item.cantidad,
            precioUnitario: item.precio,
            subtotal: item.precio * item.cantidad
        }));
        
        const subTotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const delivery = 5.00;
        const total = subTotal + delivery;
        
        // Preparar datos del pedido según la PA pa_registrar_pedido
        const pedidoData = {
            numDocumentos: cliente.numDocumento || cliente.NumDocumento,
            tipoServicio: 'delivery',
            numMesa: null,
            idCliente: cliente.idCliente || cliente.IdCliente,
            nombreCliente: cliente.nombres || cliente.nombre || cliente.Nombres,
            direccionCliente: cliente.direccion || cliente.Direccion || '',
            telefonoCliente: cliente.telefono || cliente.Telefono || '',
            idUsuario: 1, // Usuario por defecto (sistema)
            subTotal: subTotal,
            descuento: 0,
            total: total,
            estado: 'pendiente',
            observaciones: 'Pedido realizado por cliente en tienda online',
            detalles: detalles
        };
        
        // Mostrar indicador de carga
        const btnFinalizar = document.querySelector('.btn-finalizar');
        const textoOriginal = btnFinalizar.textContent;
        btnFinalizar.textContent = 'Procesando...';
        btnFinalizar.disabled = true;
        
        // Enviar pedido a la API
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/pedidos/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoData)
        });
        
        const resultado = await response.json();
        
        if (resultado.exito) {
            mostrarNotificacion(`✓ Pedido #${resultado.pedido.IdPedido} creado exitosamente`);
            
            // Limpiar carrito
            carrito = [];
            actualizarCarrito();
            toggleCarrito();
            
            // Mostrar confirmación
            setTimeout(() => {
                alert(`Pedido confirmado!\nNúmero de pedido: #${resultado.pedido.IdPedido}\nTotal: S/. ${total.toFixed(2)}\n\nTu pedido será entregado en 30-45 minutos.`);
                
                // Redirigir a mis pedidos
                window.location.href = '../html/mis_pedidos.html';
            }, 1500);
        } else {
            alert(`Error al registrar pedido: ${resultado.mensaje}`);
            btnFinalizar.textContent = textoOriginal;
            btnFinalizar.disabled = false;
        }
    } catch (error) {
        console.error('Error al finalizar pedido:', error);
        alert('Error al procesar el pedido. Por favor, intenta de nuevo.');
        const btnFinalizar = document.querySelector('.btn-finalizar');
        btnFinalizar.textContent = 'Finalizar Pedido';
        btnFinalizar.disabled = false;
    }
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    const notif = document.createElement('div');
    notif.className = 'notificacion';
    notif.textContent = mensaje;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}

// Estilos para notificación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .carrito-panel.active {
        transform: translateX(0);
    }
    
    .carrito-overlay.active {
        opacity: 1;
        pointer-events: auto;
    }
`;

// ============================================
// FUNCIONES DE USUARIO
// ============================================

function cargarUsuarioInfo() {
    const usuarioNombre = document.querySelector('.usuario-nombre');
    
    // Intenta obtener de sessionStorage primero
    let clienteActual = sessionStorage.getItem('clienteActual');
    
    // Si no está en sessionStorage, intenta localStorage
    if (!clienteActual) {
        clienteActual = localStorage.getItem('clienteActual');
    }
    
    if (clienteActual) {
        try {
            const cliente = JSON.parse(clienteActual);
            const nombreMostrar = cliente.nombres || cliente.nombre || 'Usuario';
            usuarioNombre.textContent = `👤 ${nombreMostrar}`;
        } catch (e) {
            console.error('Error al parsear cliente:', e);
            usuarioNombre.textContent = '👤 Usuario';
        }
    } else {
        // Si no hay usuario, redirigir a login
        usuarioNombre.textContent = '👤 No autenticado';
        // Redirigir después de 1 segundo
        setTimeout(() => {
            window.location.href = '../html/login_cliente.html';
        }, 1500);
    }
}

function setupLogout() {
    const btnLogout = document.querySelector('.btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                logout();
            }
        });
    }
}

function logout() {
    // Limpiar almacenamiento
    sessionStorage.removeItem('clienteActual');
    localStorage.removeItem('clienteActual');
    
    // Llamar API de logout si existe
    fetch('../api/clientes/logout', {
        method: 'POST'
    }).then(() => {
        // Redirigir a login
        window.location.href = '../html/login_cliente.html';
    }).catch(() => {
        // Si falla la API, redirigir igual
        window.location.href = '../html/login_cliente.html';
    });
}

// Ir a mis pedidos
function irAMisPedidos() {
    window.location.href = '../html/mis_pedidos.html';
}

document.head.appendChild(style);
