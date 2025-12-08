// ===== REGISTRAR INSUMO - JAVASCRIPT =====

let proveedoresData = [];

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    cargarProveedores();
    
    // Event listener para el formulario
    document.getElementById('formRegistrarInsumo').addEventListener('submit', registrarInsumo);
});

// Actualizar fecha y hora
function actualizarFechaHora() {
    const fecha = new Date();
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormato = fecha.toLocaleDateString('es-PE', opciones);
    document.getElementById('currentDate').textContent = fechaFormato;
}

// Cargar proveedores desde API
async function cargarProveedores() {
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/proveedores/listar');
        const data = await response.json();
        
        if (data.exito && data.proveedores) {
            proveedoresData = data.proveedores;
            const select = document.getElementById('codProveedor');
            select.innerHTML = '<option value="">Seleccionar proveedor...</option>';

            data.proveedores.forEach(proveedor => {
                const option = document.createElement('option');
                const id = proveedor.CodProveedor ?? proveedor.codProveedor;
                const nombre = proveedor.RazonSocial ?? proveedor.razonSocial ?? proveedor.NombreComercial ?? proveedor.nombreComercial ?? 'Proveedor';
                option.value = id;
                option.textContent = nombre;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al cargar proveedores:', error);
    }
}

// Registrar insumo
async function registrarInsumo(e) {
    e.preventDefault();
    
    const nombreInsumo = document.getElementById('nombreInsumo').value.trim();
    const ubicacion = document.getElementById('ubicacion').value.trim();
    const precioUnitario = parseFloat(document.getElementById('precioUnitario').value);
    const vencimiento = document.getElementById('vencimiento').value || null;
    const estado = document.getElementById('estado').value;
    const codProveedor = document.getElementById('codProveedor').value || null;
    const observacion = document.getElementById('observacion').value.trim() || null;

    // Validaciones
    if (!nombreInsumo) {
        mostrarAlerta('El nombre del insumo es obligatorio', 'error');
        return;
    }

    if (!ubicacion) {
        mostrarAlerta('La ubicación es obligatoria', 'error');
        return;
    }

    if (precioUnitario <= 0) {
        mostrarAlerta('El precio debe ser mayor a 0', 'error');
        return;
    }

    if (!estado) {
        mostrarAlerta('Debe seleccionar un estado', 'error');
        return;
    }

    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/insumos/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombreInsumo,
                ubicacion,
                precioUnitario,
                vencimiento,
                estado,
                codProveedor: codProveedor ? parseInt(codProveedor) : null,
                observacion
            })
        });

        const data = await response.json();

        if (data.exito) {
            mostrarAlerta('Insumo registrado exitosamente', 'exito');
            document.getElementById('formRegistrarInsumo').reset();
            setTimeout(() => {
                window.location.href = 'visualizar_inventario.html';
            }, 1500);
        } else {
            mostrarAlerta(data.mensaje || 'Error al registrar el insumo', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al conectar con el servidor', 'error');
    }
}

// Mostrar alerta
function mostrarAlerta(mensaje, tipo) {
    const alerta = document.createElement('div');
    alerta.className = `alerta alerta-${tipo}`;
    alerta.innerHTML = `
        <i class="fas fa-${tipo === 'exito' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${mensaje}
    `;
    
    document.body.appendChild(alerta);
    
    setTimeout(() => {
        alerta.classList.add('mostrar');
    }, 10);
    
    setTimeout(() => {
        alerta.classList.remove('mostrar');
        setTimeout(() => alerta.remove(), 300);
    }, 3000);
}

// Volver atrás
function volverAtras() {
    if (confirm('¿Desea salir sin guardar los cambios?')) {
        window.history.back();
    }
}

