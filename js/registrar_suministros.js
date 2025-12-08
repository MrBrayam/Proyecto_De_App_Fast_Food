// Evento de envío del formulario
document.getElementById('formRegistrarSuministro').addEventListener('submit', registrarSuministro);

// Set date to today
document.getElementById('fechaCompra').valueAsDate = new Date();

// Actualizar fecha/hora
actualizarFechaHora();
setInterval(actualizarFechaHora, 1000);

// Theme toggle
const toggleThemeBtn = document.getElementById('toggleTheme');
const modoDarkCSS = document.getElementById('modo-claro-css');
const modoDarkPageCSS = document.getElementById('modo-claro-page-css');
const modoDarkMenuCSS = document.getElementById('modo-claro-menu-css');
const themeModoClaro = localStorage.getItem('themeModoClaro') === 'true';

if (themeModoClaro) {
    modoDarkCSS.disabled = false;
    modoDarkPageCSS.disabled = false;
    modoDarkMenuCSS.disabled = false;
    toggleThemeBtn.textContent = '☀️';
}

toggleThemeBtn.addEventListener('click', () => {
    const isClaro = !modoDarkCSS.disabled;
    modoDarkCSS.disabled = isClaro;
    modoDarkPageCSS.disabled = isClaro;
    modoDarkMenuCSS.disabled = isClaro;
    toggleThemeBtn.textContent = isClaro ? '🌙' : '☀️';
    localStorage.setItem('themeModoClaro', !isClaro);
});

/**
 * Registra un nuevo suministro
 */
async function registrarSuministro(e) {
    e.preventDefault();

    // Obtener valores del formulario
    const tipoSuministro = document.getElementById('tipoSuministro').value.trim();
    const nombreSuministro = document.getElementById('nombreSuministro').value.trim();
    const proveedor = document.getElementById('proveedor').value.trim();
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const unidadMedida = document.getElementById('unidadMedida').value;
    const precioUnitario = parseFloat(document.getElementById('precioUnitario').value);
    const fechaCompra = document.getElementById('fechaCompra').value;
    const numeroFactura = document.getElementById('numeroFactura').value.trim();
    const estado = document.getElementById('estado').value;
    const ubicacion = document.getElementById('ubicacion').value.trim();
    const observaciones = document.getElementById('observaciones').value.trim();

    // Validar campos requeridos
    if (!tipoSuministro) {
        mostrarAlerta('El tipo de suministro es obligatorio', 'error');
        return;
    }

    if (!nombreSuministro) {
        mostrarAlerta('El nombre del suministro es obligatorio', 'error');
        return;
    }

    if (!proveedor) {
        mostrarAlerta('El proveedor es obligatorio', 'error');
        return;
    }

    if (!cantidad || cantidad <= 0) {
        mostrarAlerta('La cantidad debe ser mayor a 0', 'error');
        return;
    }

    if (!precioUnitario || precioUnitario <= 0) {
        mostrarAlerta('El precio unitario debe ser mayor a 0', 'error');
        return;
    }

    if (!fechaCompra) {
        mostrarAlerta('La fecha de compra es obligatoria', 'error');
        return;
    }

    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/suministros/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tipoSuministro,
                nombreSuministro,
                proveedor,
                cantidad,
                unidadMedida,
                precioUnitario,
                fechaCompra,
                numeroFactura,
                estado,
                ubicacion,
                observaciones
            })
        });

        const result = await response.json();

        if (result.exito) {
            mostrarAlerta('Suministro registrado exitosamente', 'exito');
            document.getElementById('formRegistrarSuministro').reset();
            document.getElementById('fechaCompra').valueAsDate = new Date();
            
            // Redirigir después de 1.5 segundos
            setTimeout(() => {
                window.location.href = '../html/visualizar_inventario.html';
            }, 1500);
        } else {
            mostrarAlerta(result.mensaje || 'Error al registrar el suministro', 'error');
        }
    } catch (error) {
        mostrarAlerta('Error en la solicitud: ' + error.message, 'error');
    }
}

/**
 * Muestra alertas flotantes
 */
function mostrarAlerta(mensaje, tipo) {
    const alerta = document.createElement('div');
    alerta.className = `alerta alerta-${tipo}`;
    alerta.innerHTML = `
        <div class="alerta-contenido">
            <i class="fas ${tipo === 'exito' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${mensaje}</span>
        </div>
    `;
    
    document.body.appendChild(alerta);

    // Auto-remover después de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

/**
 * Vuelve a la página anterior
 */
function volverAtras() {
    if (confirm('¿Estás seguro de que deseas abandonar sin guardar?')) {
        window.history.back();
    }
}

/**
 * Actualiza la fecha y hora actual
 */
function actualizarFechaHora() {
    const ahora = new Date();
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const fechaFormato = ahora.toLocaleDateString('es-ES', opciones);
    document.getElementById('currentDate').textContent = fechaFormato;
}

// Estilos para las alertas
const styleAlerta = `
    .alerta {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease-out;
        z-index: 10000;
        max-width: 400px;
    }

    .alerta-contenido {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
    }

    .alerta-exito {
        background-color: #4CAF50;
        color: white;
        border-left: 4px solid #45a049;
    }

    .alerta-error {
        background-color: #f44336;
        color: white;
        border-left: 4px solid #da190b;
    }

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

    @media (max-width: 768px) {
        .alerta {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styleAlerta;
document.head.appendChild(styleSheet);
