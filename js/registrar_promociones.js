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
let promociones = JSON.parse(localStorage.getItem('promociones')) || [];
let promocionEditando = null;

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    cargarPromociones();
    
    // Event listener para el formulario
    document.getElementById('formPromocion').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarPromocion();
    });
});

// Cargar promociones en la tabla
function cargarPromociones() {
    const tbody = document.querySelector('#tablaPromociones tbody');
    tbody.innerHTML = '';
    
    if (promociones.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px; color: rgba(255, 255, 255, 0.5);">
                    <i class="fas fa-inbox" style="font-size: 48px; display: block; margin-bottom: 10px;"></i>
                    No hay promociones registradas
                </td>
            </tr>
        `;
        return;
    }
    
    promociones.forEach((promocion, index) => {
        const tr = document.createElement('tr');
        
        let badgeClass = '';
        switch(promocion.estado.toLowerCase()) {
            case 'activa':
                badgeClass = 'badge-activa';
                break;
            case 'inactiva':
                badgeClass = 'badge-inactiva';
                break;
            case 'programada':
                badgeClass = 'badge-programada';
                break;
        }
        
        const vigencia = `${promocion.fechaInicio} - ${promocion.fechaFin}`;
        
        tr.innerHTML = `
            <td>${promocion.nombre}</td>
            <td>${promocion.tipo}</td>
            <td>${promocion.descuento}</td>
            <td>${vigencia}</td>
            <td><span class="badge ${badgeClass}">${promocion.estado}</span></td>
            <td>
                <button class="btn-table-action btn-edit" onclick="editarPromocion(${index})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-table-action btn-delete" onclick="eliminarPromocion(${index})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Guardar promoción
function guardarPromocion() {
    // Obtener valores del formulario
    const promocion = {
        nombre: document.getElementById('nombre').value.trim(),
        tipo: document.getElementById('tipo').value,
        descuento: document.getElementById('descuento').value.trim(),
        estado: document.getElementById('estado').value,
        fechaInicio: document.getElementById('fechaInicio').value,
        fechaFin: document.getElementById('fechaFin').value,
        diasAplicables: document.getElementById('diasAplicables').value.trim() || 'Todos los días',
        horario: document.getElementById('horario').value.trim() || 'Todo el día',
        montoMinimo: document.getElementById('montoMinimo').value || '0',
        usosMaximos: document.getElementById('usosMaximos').value || 'Ilimitado',
        usosPorCliente: document.getElementById('usosPorCliente').value || '1',
        acumulable: document.getElementById('acumulable').value,
        productos: document.getElementById('productos').value.trim() || 'Todos los productos',
        descripcion: document.getElementById('descripcion').value.trim()
    };
    
    // Validar campos requeridos
    if (!promocion.nombre || !promocion.tipo || !promocion.descuento || !promocion.fechaInicio || !promocion.fechaFin) {
        alert('Por favor complete todos los campos obligatorios (*)');
        return;
    }
    
    // Validar fechas
    if (new Date(promocion.fechaInicio) > new Date(promocion.fechaFin)) {
        alert('La fecha de inicio no puede ser mayor que la fecha de fin');
        return;
    }
    
    if (promocionEditando !== null) {
        // Actualizar promoción existente
        promociones[promocionEditando] = promocion;
        promocionEditando = null;
        mostrarMensaje('Promoción actualizada correctamente', 'success');
    } else {
        // Agregar nueva promoción
        promociones.push(promocion);
        mostrarMensaje('Promoción registrada correctamente', 'success');
    }
    
    // Guardar en localStorage
    localStorage.setItem('promociones', JSON.stringify(promociones));
    
    // Actualizar tabla y limpiar formulario
    cargarPromociones();
    limpiarFormulario();
}

// Editar promoción
function editarPromocion(index) {
    const promocion = promociones[index];
    promocionEditando = index;
    
    // Llenar el formulario con los datos de la promoción
    document.getElementById('nombre').value = promocion.nombre;
    document.getElementById('tipo').value = promocion.tipo;
    document.getElementById('descuento').value = promocion.descuento;
    document.getElementById('estado').value = promocion.estado;
    document.getElementById('fechaInicio').value = promocion.fechaInicio;
    document.getElementById('fechaFin').value = promocion.fechaFin;
    document.getElementById('diasAplicables').value = promocion.diasAplicables;
    document.getElementById('horario').value = promocion.horario;
    document.getElementById('montoMinimo').value = promocion.montoMinimo === 'Ilimitado' ? '' : promocion.montoMinimo;
    document.getElementById('usosMaximos').value = promocion.usosMaximos === 'Ilimitado' ? '' : promocion.usosMaximos;
    document.getElementById('usosPorCliente').value = promocion.usosPorCliente;
    document.getElementById('acumulable').value = promocion.acumulable;
    document.getElementById('productos').value = promocion.productos === 'Todos los productos' ? '' : promocion.productos;
    document.getElementById('descripcion').value = promocion.descripcion;
    
    // Scroll al inicio del formulario
    document.querySelector('.promocion-form-card').scrollTop = 0;
    
    // Cambiar el texto del botón
    document.querySelector('.btn-guardar').innerHTML = '<i class="fas fa-save"></i> Actualizar';
}

// Eliminar promoción
function eliminarPromocion(index) {
    const promocion = promociones[index];
    
    if (confirm(`¿Está seguro de eliminar la promoción "${promocion.nombre}"?`)) {
        promociones.splice(index, 1);
        localStorage.setItem('promociones', JSON.stringify(promociones));
        cargarPromociones();
        mostrarMensaje('Promoción eliminada correctamente', 'success');
    }
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('formPromocion').reset();
    promocionEditando = null;
    document.querySelector('.btn-guardar').innerHTML = '<i class="fas fa-save"></i> Guardar';
}

// Cancelar
function cancelar() {
    if (confirm('¿Está seguro de cancelar? Se perderán los datos no guardados.')) {
        limpiarFormulario();
    }
}

// Filtrar promociones
function filtrarPromociones() {
    const filtro = document.getElementById('buscarPromocion').value.toLowerCase();
    const filas = document.querySelectorAll('#tablaPromociones tbody tr');
    
    filas.forEach(fila => {
        const texto = fila.textContent.toLowerCase();
        if (texto.includes(filtro)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

// Mostrar mensaje
function mostrarMensaje(mensaje, tipo) {
    // Crear elemento de mensaje
    const mensajeDiv = document.createElement('div');
    mensajeDiv.style.position = 'fixed';
    mensajeDiv.style.top = '20px';
    mensajeDiv.style.right = '20px';
    mensajeDiv.style.padding = '15px 25px';
    mensajeDiv.style.borderRadius = '10px';
    mensajeDiv.style.color = 'white';
    mensajeDiv.style.fontWeight = 'bold';
    mensajeDiv.style.zIndex = '10000';
    mensajeDiv.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    mensajeDiv.style.animation = 'slideIn 0.3s ease';
    
    if (tipo === 'success') {
        mensajeDiv.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    } else {
        mensajeDiv.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
    }
    
    mensajeDiv.textContent = mensaje;
    document.body.appendChild(mensajeDiv);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        mensajeDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(mensajeDiv);
        }, 300);
    }, 3000);
}

// Agregar estilos de animación
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
