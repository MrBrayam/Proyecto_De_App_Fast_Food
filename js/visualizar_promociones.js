// Actualizar fecha y hora en tiempo real
function actualizarFechaHora() {
    const ahora = new Date();
    
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const fechaFormateada = ahora.toLocaleDateString('es-ES', opciones);
    
    const opcionesHora = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
    };
    const horaFormateada = ahora.toLocaleTimeString('es-ES', opcionesHora);
    
    document.getElementById('fechaActual').textContent = fechaFormateada;
    document.getElementById('horaActual').textContent = horaFormateada;
}

// Base de datos simulada de promociones
let promociones = [
    {
        id: 1,
        nombre: '2x1 en Pizzas Familiares',
        tipo: '2x1',
        descuento: '50%',
        vigencia: '01/10/2025 - 31/10/2025',
        estado: 'Activa',
        fechaInicio: '01/10/2025',
        fechaFin: '31/10/2025',
        diasAplicables: 'Todos los días',
        horario: 'Todo el día',
        montoMinimo: 'S/30.00',
        usosMaximos: 'Ilimitado',
        usosPorCliente: '1 por día',
        acumulable: 'No',
        productos: 'Pizzas Familiares (Grande y Familiar)',
        descripcion: 'Promoción válida para pizzas familiares. El cliente paga la pizza de mayor valor y obtiene la segunda gratis. No acumulable con otras promociones.'
    },
    {
        id: 2,
        nombre: 'Descuento Estudiantes',
        tipo: 'Porcentaje',
        descuento: '15%',
        vigencia: '01/09/2025 - 31/12/2025',
        estado: 'Activa',
        fechaInicio: '01/09/2025',
        fechaFin: '31/12/2025',
        diasAplicables: 'Lunes a Viernes',
        horario: '11:00 - 17:00',
        montoMinimo: 'S/20.00',
        usosMaximos: 'Ilimitado',
        usosPorCliente: 'Ilimitado',
        acumulable: 'Sí',
        productos: 'Todos los productos',
        descripcion: 'Descuento especial para estudiantes. Válido presentando carnet universitario vigente. Aplicable de lunes a viernes en horario de almuerzo.'
    },
    {
        id: 3,
        nombre: 'Happy Hour',
        tipo: 'Horario',
        descuento: '20%',
        vigencia: 'Permanente',
        estado: 'Activa',
        fechaInicio: 'Permanente',
        fechaFin: 'Permanente',
        diasAplicables: 'Todos los días',
        horario: '14:00 - 17:00',
        montoMinimo: 'S/15.00',
        usosMaximos: 'Ilimitado',
        usosPorCliente: 'Ilimitado',
        acumulable: 'No',
        productos: 'Pizzas personales y bebidas',
        descripcion: 'Horario especial con descuento en pizzas personales y bebidas. Válido todos los días en horario de 2pm a 5pm.'
    },
    {
        id: 4,
        nombre: 'Black Friday',
        tipo: 'Especial',
        descuento: '40%',
        vigencia: '24/11/2025 - 24/11/2025',
        estado: 'Inactiva',
        fechaInicio: '24/11/2025',
        fechaFin: '24/11/2025',
        diasAplicables: 'Viernes 24 de Noviembre',
        horario: 'Todo el día',
        montoMinimo: 'S/50.00',
        usosMaximos: '500 usos',
        usosPorCliente: '1 por cliente',
        acumulable: 'No',
        productos: 'Todos los productos excepto bebidas',
        descripcion: 'Promoción especial de Black Friday con 40% de descuento en toda la carta. Válido solo el viernes 24 de noviembre hasta agotar stock (500 cupones).'
    }
];

// Variable para almacenar la promoción seleccionada
let promocionSeleccionada = null;

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    cargarPromociones();
});

// Cargar promociones en la tabla
function cargarPromociones(filtradas = null) {
    const tbody = document.querySelector('#tablaPromociones tbody');
    const listaPromociones = filtradas || promociones;
    
    tbody.innerHTML = '';
    
    if (listaPromociones.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 30px; color: rgba(255, 255, 255, 0.5);">
                    <i class="fas fa-inbox" style="font-size: 48px; display: block; margin-bottom: 10px;"></i>
                    No se encontraron promociones
                </td>
            </tr>
        `;
        return;
    }
    
    listaPromociones.forEach(promocion => {
        const tr = document.createElement('tr');
        tr.onclick = () => seleccionarFila(tr, promocion);
        
        const badgeClass = promocion.estado === 'Activa' ? 'badge-activa' : 'badge-inactiva';
        
        tr.innerHTML = `
            <td>${promocion.nombre}</td>
            <td>${promocion.tipo}</td>
            <td>${promocion.descuento}</td>
            <td>${promocion.vigencia}</td>
            <td><span class="badge ${badgeClass}">${promocion.estado}</span></td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Seleccionar fila de la tabla
function seleccionarFila(fila, promocion) {
    // Remover selección previa
    const filas = document.querySelectorAll('#tablaPromociones tbody tr');
    filas.forEach(f => f.classList.remove('selected'));
    
    // Seleccionar nueva fila
    fila.classList.add('selected');
    promocionSeleccionada = promocion;
    
    // Habilitar botón de detalle
    document.getElementById('btnDetalle').disabled = false;
}

// Buscar promoción
function buscarPromocion() {
    const tipoBusqueda = document.getElementById('tipoBusqueda').value;
    const termino = document.getElementById('busqueda').value.toLowerCase().trim();
    
    if (!termino) {
        cargarPromociones();
        return;
    }
    
    const resultados = promociones.filter(promocion => {
        switch(tipoBusqueda) {
            case 'nombre':
                return promocion.nombre.toLowerCase().includes(termino);
            case 'tipo':
                return promocion.tipo.toLowerCase().includes(termino);
            case 'descuento':
                return promocion.descuento.toLowerCase().includes(termino);
            case 'estado':
                return promocion.estado.toLowerCase().includes(termino);
            default:
                return false;
        }
    });
    
    cargarPromociones(resultados);
    
    // Limpiar selección
    promocionSeleccionada = null;
    document.getElementById('btnDetalle').disabled = true;
}

// Ver detalle de la promoción
function verDetalle() {
    if (!promocionSeleccionada) return;
    
    // Llenar información del modal
    document.getElementById('detalle-nombre').textContent = promocionSeleccionada.nombre;
    document.getElementById('detalle-tipo').textContent = promocionSeleccionada.tipo;
    document.getElementById('detalle-descuento').textContent = promocionSeleccionada.descuento;
    document.getElementById('detalle-estado').textContent = promocionSeleccionada.estado;
    document.getElementById('detalle-inicio').textContent = promocionSeleccionada.fechaInicio;
    document.getElementById('detalle-fin').textContent = promocionSeleccionada.fechaFin;
    document.getElementById('detalle-dias').textContent = promocionSeleccionada.diasAplicables;
    document.getElementById('detalle-horario').textContent = promocionSeleccionada.horario;
    document.getElementById('detalle-monto').textContent = promocionSeleccionada.montoMinimo;
    document.getElementById('detalle-usos').textContent = promocionSeleccionada.usosMaximos;
    document.getElementById('detalle-usos-cliente').textContent = promocionSeleccionada.usosPorCliente;
    document.getElementById('detalle-acumulable').textContent = promocionSeleccionada.acumulable;
    document.getElementById('detalle-productos').textContent = promocionSeleccionada.productos;
    document.getElementById('detalle-descripcion').textContent = promocionSeleccionada.descripcion;
    
    // Mostrar modal
    document.getElementById('modalDetalle').classList.add('active');
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modalDetalle').classList.remove('active');
}

// Cerrar modal al hacer click fuera
document.addEventListener('click', function(event) {
    const modal = document.getElementById('modalDetalle');
    if (event.target === modal) {
        cerrarModal();
    }
});

// Editar promoción
function editarPromocion() {
    if (!promocionSeleccionada) return;
    
    alert(`Editar promoción:\n${promocionSeleccionada.nombre}\n\nEsta función redireccionaría al módulo de registro/edición de promociones.`);
}

// Exportar promociones
function exportarPromociones() {
    // Simulación de exportación
    const datos = promociones.map(promo => ({
        Nombre: promo.nombre,
        Tipo: promo.tipo,
        Descuento: promo.descuento,
        Vigencia: promo.vigencia,
        Estado: promo.estado,
        'Monto Mínimo': promo.montoMinimo,
        'Usos Máximos': promo.usosMaximos
    }));
    
    console.log('Exportando promociones:', datos);
    alert('Exportación de promociones iniciada.\n\nFormato: Excel\nRegistros: ' + promociones.length);
}

// Salir del módulo
function salirModulo() {
    if (confirm('¿Desea salir del módulo de visualización de promociones?')) {
        window.location.href = 'menu_principal.html';
    }
}

// Event listeners para búsqueda en tiempo real
document.getElementById('busqueda').addEventListener('input', function() {
    if (this.value === '') {
        cargarPromociones();
        promocionSeleccionada = null;
        document.getElementById('btnDetalle').disabled = true;
    }
});

// Event listener para Enter en el campo de búsqueda
document.getElementById('busqueda').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        buscarPromocion();
    }
});
