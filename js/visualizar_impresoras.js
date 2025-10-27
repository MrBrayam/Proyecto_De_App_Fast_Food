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

// Base de datos simulada de impresoras
let impresoras = [
    {
        id: 1,
        nombre: 'Impresora Principal',
        marca: 'Epson',
        modelo: 'TM-T88V',
        tipo: 'Térmica',
        conexion: 'Ethernet',
        ip: '192.168.1.100',
        puerto: '9100',
        ubicacion: 'Caja Principal',
        ancho: '80mm',
        estado: 'Activa',
        configuracion: {
            corteAutomatico: true,
            aperturaCajon: true,
            imprimirLogo: true,
            imprimirQR: false
        },
        observaciones: 'Impresora principal para tickets de venta en caja 1'
    },
    {
        id: 2,
        nombre: 'Impresora Cocina',
        marca: 'Star Micronics',
        modelo: 'TSP143III',
        tipo: 'Térmica',
        conexion: 'USB',
        ip: '-',
        puerto: 'USB001',
        ubicacion: 'Cocina',
        ancho: '80mm',
        estado: 'Activa',
        configuracion: {
            corteAutomatico: true,
            aperturaCajon: false,
            imprimirLogo: false,
            imprimirQR: false
        },
        observaciones: 'Impresora para comandas de cocina'
    },
    {
        id: 3,
        nombre: 'Impresora Backup',
        marca: 'HP',
        modelo: 'LaserJet Pro',
        tipo: 'Láser',
        conexion: 'WiFi',
        ip: '192.168.1.105',
        puerto: '9100',
        ubicacion: 'Almacén',
        ancho: 'A4',
        estado: 'Inactiva',
        configuracion: {
            corteAutomatico: false,
            aperturaCajon: false,
            imprimirLogo: true,
            imprimirQR: true
        },
        observaciones: 'Impresora de respaldo para reportes e inventarios'
    }
];

// Variable para almacenar la impresora seleccionada
let impresoraSeleccionada = null;

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    cargarImpresoras();
});

// Cargar impresoras en la tabla
function cargarImpresoras(filtradas = null) {
    const tbody = document.querySelector('#tablaImpresoras tbody');
    const listaImpresoras = filtradas || impresoras;
    
    tbody.innerHTML = '';
    
    if (listaImpresoras.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 30px; color: rgba(255, 255, 255, 0.5);">
                    <i class="fas fa-inbox" style="font-size: 48px; display: block; margin-bottom: 10px;"></i>
                    No se encontraron impresoras
                </td>
            </tr>
        `;
        return;
    }
    
    listaImpresoras.forEach(impresora => {
        const tr = document.createElement('tr');
        tr.onclick = () => seleccionarFila(tr, impresora);
        
        const badgeClass = impresora.estado === 'Activa' ? 'badge-activa' : 'badge-inactiva';
        
        tr.innerHTML = `
            <td>${impresora.nombre}</td>
            <td>${impresora.marca}</td>
            <td>${impresora.tipo}</td>
            <td>${impresora.ubicacion}</td>
            <td><span class="badge ${badgeClass}">${impresora.estado}</span></td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Seleccionar fila de la tabla
function seleccionarFila(fila, impresora) {
    // Remover selección previa
    const filas = document.querySelectorAll('#tablaImpresoras tbody tr');
    filas.forEach(f => f.classList.remove('selected'));
    
    // Seleccionar nueva fila
    fila.classList.add('selected');
    impresoraSeleccionada = impresora;
    
    // Habilitar botón de detalle
    document.getElementById('btnDetalle').disabled = false;
}

// Buscar impresora
function buscarImpresora() {
    const tipoBusqueda = document.getElementById('tipoBusqueda').value;
    const termino = document.getElementById('busqueda').value.toLowerCase().trim();
    
    if (!termino) {
        cargarImpresoras();
        return;
    }
    
    const resultados = impresoras.filter(impresora => {
        switch(tipoBusqueda) {
            case 'nombre':
                return impresora.nombre.toLowerCase().includes(termino);
            case 'marca':
                return impresora.marca.toLowerCase().includes(termino);
            case 'tipo':
                return impresora.tipo.toLowerCase().includes(termino);
            case 'ubicacion':
                return impresora.ubicacion.toLowerCase().includes(termino);
            case 'estado':
                return impresora.estado.toLowerCase().includes(termino);
            default:
                return false;
        }
    });
    
    cargarImpresoras(resultados);
    
    // Limpiar selección
    impresoraSeleccionada = null;
    document.getElementById('btnDetalle').disabled = true;
}

// Ver detalle de la impresora
function verDetalle() {
    if (!impresoraSeleccionada) return;
    
    // Llenar información del modal
    document.getElementById('detalle-nombre').textContent = impresoraSeleccionada.nombre;
    document.getElementById('detalle-marca').textContent = impresoraSeleccionada.marca;
    document.getElementById('detalle-modelo').textContent = impresoraSeleccionada.modelo;
    document.getElementById('detalle-tipo').textContent = impresoraSeleccionada.tipo;
    document.getElementById('detalle-conexion').textContent = impresoraSeleccionada.conexion;
    document.getElementById('detalle-ip').textContent = impresoraSeleccionada.ip;
    document.getElementById('detalle-puerto').textContent = impresoraSeleccionada.puerto;
    document.getElementById('detalle-estado').textContent = impresoraSeleccionada.estado;
    document.getElementById('detalle-ubicacion').textContent = impresoraSeleccionada.ubicacion;
    document.getElementById('detalle-ancho').textContent = impresoraSeleccionada.ancho;
    document.getElementById('detalle-observaciones').textContent = impresoraSeleccionada.observaciones || 'Sin observaciones';
    
    // Actualizar iconos de configuración
    const config = impresoraSeleccionada.configuracion;
    actualizarIconoConfig('icon-corte', config.corteAutomatico);
    actualizarIconoConfig('icon-apertura', config.aperturaCajon);
    actualizarIconoConfig('icon-logo', config.imprimirLogo);
    actualizarIconoConfig('icon-qr', config.imprimirQR);
    
    // Mostrar modal
    document.getElementById('modalDetalle').classList.add('active');
}

// Actualizar icono de configuración
function actualizarIconoConfig(iconId, activo) {
    const icono = document.getElementById(iconId);
    if (activo) {
        icono.className = 'fas fa-check-circle';
    } else {
        icono.className = 'fas fa-times-circle';
    }
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

// Probar impresora
function probarImpresora() {
    if (!impresoraSeleccionada) return;
    
    alert(`Enviando prueba de impresión a:\n${impresoraSeleccionada.nombre}\n${impresoraSeleccionada.ubicacion}\n\nEsto es una simulación.`);
}

// Exportar impresoras
function exportarImpresoras() {
    // Simulación de exportación
    const datos = impresoras.map(imp => ({
        Nombre: imp.nombre,
        Marca: imp.marca,
        Modelo: imp.modelo,
        Tipo: imp.tipo,
        Conexión: imp.conexion,
        IP: imp.ip,
        Puerto: imp.puerto,
        Ubicación: imp.ubicacion,
        Estado: imp.estado
    }));
    
    console.log('Exportando impresoras:', datos);
    alert('Exportación de impresoras iniciada.\n\nFormato: Excel\nRegistros: ' + impresoras.length);
}

// Salir del módulo
function salirModulo() {
    if (confirm('¿Desea salir del módulo de visualización de impresoras?')) {
        window.location.href = 'menu_principal.html';
    }
}

// Event listeners para búsqueda en tiempo real
document.getElementById('busqueda').addEventListener('input', function() {
    if (this.value === '') {
        cargarImpresoras();
        impresoraSeleccionada = null;
        document.getElementById('btnDetalle').disabled = true;
    }
});

// Event listener para Enter en el campo de búsqueda
document.getElementById('busqueda').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        buscarImpresora();
    }
});
