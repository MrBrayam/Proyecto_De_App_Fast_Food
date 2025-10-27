/* ============================================
   JAVASCRIPT PARA REGISTRAR IMPRESORAS
   ============================================ */

// Variables globales
let impresoras = [];
let impresoraEditando = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    cargarImpresoras();
    configurarEventos();
});

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
    
    const horaFormateada = ahora.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    document.getElementById('fechaActual').textContent = fechaFormateada;
    document.getElementById('horaActual').textContent = horaFormateada;
}

// Configurar eventos
function configurarEventos() {
    // Búsqueda en tiempo real
    document.getElementById('buscarImpresora').addEventListener('input', function(e) {
        filtrarImpresoras(e.target.value);
    });

    // Validar IP
    document.getElementById('ipImpresora').addEventListener('input', function(e) {
        validarIP(e.target.value);
    });

    // Habilitar/deshabilitar campos según tipo de conexión
    document.getElementById('conexionImpresora').addEventListener('change', function(e) {
        ajustarCamposConexion(e.target.value);
    });
}

// Guardar impresora
function guardarImpresora() {
    const nombre = document.getElementById('nombreImpresora').value.trim();
    const marca = document.getElementById('marcaImpresora').value.trim();
    const modelo = document.getElementById('modeloImpresora').value.trim();
    const tipo = document.getElementById('tipoImpresora').value;
    const conexion = document.getElementById('conexionImpresora').value;
    const ip = document.getElementById('ipImpresora').value.trim();
    const puerto = document.getElementById('puertoImpresora').value.trim();
    const ubicacion = document.getElementById('ubicacionImpresora').value;
    const anchoRollo = document.getElementById('anchoRollo').value;
    const estado = document.getElementById('estadoImpresora').value;
    const observaciones = document.getElementById('observaciones').value.trim();

    // Validaciones
    if (!nombre) {
        mostrarAlerta('Por favor ingrese el nombre de la impresora', 'error');
        return;
    }

    if (!tipo) {
        mostrarAlerta('Por favor seleccione el tipo de impresora', 'error');
        return;
    }

    if (!conexion) {
        mostrarAlerta('Por favor seleccione el tipo de conexión', 'error');
        return;
    }

    if (!ubicacion) {
        mostrarAlerta('Por favor seleccione la ubicación', 'error');
        return;
    }

    if (!estado) {
        mostrarAlerta('Por favor seleccione el estado', 'error');
        return;
    }

    // Validar IP si la conexión es Ethernet o Wi-Fi
    if ((conexion === 'ethernet' || conexion === 'wifi') && ip && !validarFormatoIP(ip)) {
        mostrarAlerta('Formato de IP inválido', 'error');
        return;
    }

    // Opciones de configuración
    const configuracion = {
        imprimirLogo: document.getElementById('imprimirLogo').checked,
        cortarAutomatico: document.getElementById('cortarAutomatico').checked,
        abrirCajon: document.getElementById('abrirCajon').checked,
        copiasCocina: document.getElementById('copiasCocina').checked
    };

    const impresora = {
        id: impresoraEditando ? impresoraEditando.id : Date.now(),
        nombre,
        marca,
        modelo,
        tipo,
        conexion,
        ip,
        puerto,
        ubicacion,
        anchoRollo,
        estado,
        observaciones,
        configuracion,
        fechaRegistro: impresoraEditando ? impresoraEditando.fechaRegistro : new Date().toISOString()
    };

    if (impresoraEditando) {
        // Actualizar impresora existente
        const index = impresoras.findIndex(i => i.id === impresoraEditando.id);
        impresoras[index] = impresora;
        mostrarAlerta('Impresora actualizada correctamente', 'success');
        impresoraEditando = null;
    } else {
        // Agregar nueva impresora
        impresoras.push(impresora);
        mostrarAlerta('Impresora registrada correctamente', 'success');
    }

    guardarEnLocalStorage();
    actualizarTablaImpresoras();
    limpiarFormulario();
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('nombreImpresora').value = '';
    document.getElementById('marcaImpresora').value = '';
    document.getElementById('modeloImpresora').value = '';
    document.getElementById('tipoImpresora').value = '';
    document.getElementById('conexionImpresora').value = '';
    document.getElementById('ipImpresora').value = '';
    document.getElementById('puertoImpresora').value = '';
    document.getElementById('ubicacionImpresora').value = '';
    document.getElementById('anchoRollo').value = '';
    document.getElementById('estadoImpresora').value = '';
    document.getElementById('observaciones').value = '';
    
    document.getElementById('imprimirLogo').checked = false;
    document.getElementById('cortarAutomatico').checked = true;
    document.getElementById('abrirCajon').checked = false;
    document.getElementById('copiasCocina').checked = false;

    impresoraEditando = null;
}

// Probar impresora
function probarImpresora() {
    const nombre = document.getElementById('nombreImpresora').value.trim();
    
    if (!nombre) {
        mostrarAlerta('Por favor complete los datos de la impresora antes de probar', 'error');
        return;
    }

    mostrarAlerta('Enviando página de prueba a ' + nombre + '...', 'info');
    
    // Simular impresión de prueba
    setTimeout(() => {
        mostrarAlerta('Página de prueba enviada correctamente', 'success');
    }, 2000);
}

// Cargar impresoras desde localStorage
function cargarImpresoras() {
    const impresorasGuardadas = localStorage.getItem('impresoras');
    if (impresorasGuardadas) {
        impresoras = JSON.parse(impresorasGuardadas);
    } else {
        // Datos de ejemplo
        impresoras = [
            {
                id: 1,
                nombre: 'Impresora Caja',
                marca: 'Epson',
                modelo: 'TM-T88V',
                tipo: 'termica',
                conexion: 'usb',
                ip: '',
                puerto: 'COM1',
                ubicacion: 'caja',
                anchoRollo: '80',
                estado: 'activa',
                observaciones: 'Impresora principal de caja',
                configuracion: {
                    imprimirLogo: true,
                    cortarAutomatico: true,
                    abrirCajon: true,
                    copiasCocina: false
                },
                fechaRegistro: new Date().toISOString()
            },
            {
                id: 2,
                nombre: 'Impresora Cocina',
                marca: 'Star',
                modelo: 'TSP143',
                tipo: 'termica',
                conexion: 'ethernet',
                ip: '192.168.1.100',
                puerto: '9100',
                ubicacion: 'cocina',
                anchoRollo: '80',
                estado: 'activa',
                observaciones: 'Para comandas de cocina',
                configuracion: {
                    imprimirLogo: false,
                    cortarAutomatico: true,
                    abrirCajon: false,
                    copiasCocina: true
                },
                fechaRegistro: new Date().toISOString()
            }
        ];
    }
    actualizarTablaImpresoras();
}

// Guardar en localStorage
function guardarEnLocalStorage() {
    localStorage.setItem('impresoras', JSON.stringify(impresoras));
}

// Actualizar tabla de impresoras
function actualizarTablaImpresoras(impresorasFiltradas = null) {
    const tbody = document.getElementById('tablaImpresorasBody');
    const datos = impresorasFiltradas || impresoras;

    if (datos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 30px; color: rgba(255, 255, 255, 0.5);">
                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 10px; display: block;"></i>
                    No hay impresoras registradas
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = datos.map(impresora => `
        <tr>
            <td>${impresora.nombre}</td>
            <td>${impresora.marca} ${impresora.modelo}</td>
            <td>${obtenerTextoTipo(impresora.tipo)}</td>
            <td>${obtenerTextoUbicacion(impresora.ubicacion)}</td>
            <td>${obtenerTextoConexion(impresora.conexion)}</td>
            <td><span class="badge badge-${impresora.estado}">${obtenerTextoEstado(impresora.estado)}</span></td>
            <td class="acciones-cell">
                <button class="btn-icon btn-edit" onclick="editarImpresora(${impresora.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-test" onclick="probarImpresoraGuardada(${impresora.id})" title="Probar">
                    <i class="fas fa-print"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="eliminarImpresora(${impresora.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Editar impresora
function editarImpresora(id) {
    const impresora = impresoras.find(i => i.id === id);
    if (!impresora) return;

    impresoraEditando = impresora;

    document.getElementById('nombreImpresora').value = impresora.nombre;
    document.getElementById('marcaImpresora').value = impresora.marca;
    document.getElementById('modeloImpresora').value = impresora.modelo;
    document.getElementById('tipoImpresora').value = impresora.tipo;
    document.getElementById('conexionImpresora').value = impresora.conexion;
    document.getElementById('ipImpresora').value = impresora.ip;
    document.getElementById('puertoImpresora').value = impresora.puerto;
    document.getElementById('ubicacionImpresora').value = impresora.ubicacion;
    document.getElementById('anchoRollo').value = impresora.anchoRollo;
    document.getElementById('estadoImpresora').value = impresora.estado;
    document.getElementById('observaciones').value = impresora.observaciones;

    if (impresora.configuracion) {
        document.getElementById('imprimirLogo').checked = impresora.configuracion.imprimirLogo;
        document.getElementById('cortarAutomatico').checked = impresora.configuracion.cortarAutomatico;
        document.getElementById('abrirCajon').checked = impresora.configuracion.abrirCajon;
        document.getElementById('copiasCocina').checked = impresora.configuracion.copiasCocina;
    }

    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
    mostrarAlerta('Editando impresora: ' + impresora.nombre, 'info');
}

// Probar impresora guardada
function probarImpresoraGuardada(id) {
    const impresora = impresoras.find(i => i.id === id);
    if (!impresora) return;

    mostrarAlerta('Enviando página de prueba a ' + impresora.nombre + '...', 'info');
    
    setTimeout(() => {
        mostrarAlerta('Página de prueba enviada correctamente', 'success');
    }, 2000);
}

// Eliminar impresora
function eliminarImpresora(id) {
    const impresora = impresoras.find(i => i.id === id);
    if (!impresora) return;

    if (confirm(`¿Está seguro de eliminar la impresora "${impresora.nombre}"?`)) {
        impresoras = impresoras.filter(i => i.id !== id);
        guardarEnLocalStorage();
        actualizarTablaImpresoras();
        mostrarAlerta('Impresora eliminada correctamente', 'success');
    }
}

// Filtrar impresoras
function filtrarImpresoras(texto) {
    if (!texto.trim()) {
        actualizarTablaImpresoras();
        return;
    }

    const textoLower = texto.toLowerCase();
    const filtradas = impresoras.filter(impresora => 
        impresora.nombre.toLowerCase().includes(textoLower) ||
        impresora.marca.toLowerCase().includes(textoLower) ||
        impresora.modelo.toLowerCase().includes(textoLower) ||
        impresora.ubicacion.toLowerCase().includes(textoLower)
    );

    actualizarTablaImpresoras(filtradas);
}

// Validar formato de IP
function validarFormatoIP(ip) {
    const patron = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!patron.test(ip)) return false;

    const partes = ip.split('.');
    return partes.every(parte => {
        const num = parseInt(parte);
        return num >= 0 && num <= 255;
    });
}

// Validar IP con feedback visual
function validarIP(ip) {
    const input = document.getElementById('ipImpresora');
    if (ip && !validarFormatoIP(ip)) {
        input.style.borderColor = '#dc3545';
    } else {
        input.style.borderColor = 'rgba(255, 87, 51, 0.3)';
    }
}

// Ajustar campos según tipo de conexión
function ajustarCamposConexion(tipo) {
    const ipInput = document.getElementById('ipImpresora');
    const puertoInput = document.getElementById('puertoImpresora');

    if (tipo === 'ethernet' || tipo === 'wifi') {
        ipInput.disabled = false;
        ipInput.placeholder = 'Ej: 192.168.1.100';
        puertoInput.placeholder = 'Ej: 9100';
    } else if (tipo === 'usb') {
        ipInput.disabled = true;
        ipInput.value = '';
        puertoInput.placeholder = 'Ej: USB001';
    } else if (tipo === 'serial') {
        ipInput.disabled = true;
        ipInput.value = '';
        puertoInput.placeholder = 'Ej: COM1';
    } else {
        ipInput.disabled = false;
    }
}

// Funciones auxiliares para textos
function obtenerTextoTipo(tipo) {
    const tipos = {
        'termica': 'Térmica',
        'inyeccion': 'Inyección',
        'laser': 'Láser',
        'matricial': 'Matricial'
    };
    return tipos[tipo] || tipo;
}

function obtenerTextoConexion(conexion) {
    const conexiones = {
        'usb': 'USB',
        'ethernet': 'Ethernet',
        'wifi': 'Wi-Fi',
        'bluetooth': 'Bluetooth',
        'serial': 'Serial'
    };
    return conexiones[conexion] || conexion;
}

function obtenerTextoUbicacion(ubicacion) {
    const ubicaciones = {
        'caja': 'Caja',
        'cocina': 'Cocina',
        'bar': 'Bar',
        'administracion': 'Administración'
    };
    return ubicaciones[ubicacion] || ubicacion;
}

function obtenerTextoEstado(estado) {
    const estados = {
        'activa': 'Activa',
        'inactiva': 'Inactiva',
        'mantenimiento': 'Mantenimiento'
    };
    return estados[estado] || estado;
}

// Mostrar alertas
function mostrarAlerta(mensaje, tipo) {
    // Crear elemento de alerta
    const alerta = document.createElement('div');
    alerta.className = `alerta alerta-${tipo}`;
    alerta.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;

    const colores = {
        'success': 'linear-gradient(135deg, #28a745, #20c997)',
        'error': 'linear-gradient(135deg, #dc3545, #c82333)',
        'info': 'linear-gradient(135deg, #17a2b8, #138496)',
        'warning': 'linear-gradient(135deg, #ffc107, #ff8c42)'
    };

    alerta.style.background = colores[tipo] || colores['info'];
    alerta.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${mensaje}
    `;

    document.body.appendChild(alerta);

    setTimeout(() => {
        alerta.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alerta.remove(), 300);
    }, 3000);
}

// Volver al menú
function volverMenu() {
    if (confirm('¿Desea volver al menú principal?')) {
        window.location.href = 'menu_principal.html';
    }
}

// Animaciones CSS
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
`;
document.head.appendChild(style);
