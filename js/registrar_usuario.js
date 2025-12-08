// ===== REGISTRAR USUARIO - JAVASCRIPT =====

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

// Cargar perfiles disponibles
async function cargarPerfiles() {
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/perfiles/listar');
        const data = await response.json();
        
        if (data.exito && data.perfiles) {
            const selectPerfil = document.getElementById('perfil');
            selectPerfil.innerHTML = '<option value="">Seleccione un perfil</option>';
            
            data.perfiles.forEach(perfil => {
                if (perfil.estado === 'activo') {
                    const option = document.createElement('option');
                    option.value = perfil.idPerfil;
                    option.textContent = perfil.nombrePerfil;
                    selectPerfil.appendChild(option);
                }
            });
        }
    } catch (error) {
        console.error('Error al cargar perfiles:', error);
        alert('Error al cargar los perfiles disponibles');
    }
}

// Generar nombre de usuario automáticamente
function generarNombreUsuario() {
    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    
    if (nombres && apellidos) {
        const primerNombre = nombres.split(' ')[0].toLowerCase();
        const primerApellido = apellidos.split(' ')[0].toLowerCase();
        const nombreUsuario = primerNombre.charAt(0) + primerApellido;
        
        document.getElementById('nombreUsuario').value = nombreUsuario;
    }
}

// Mostrar/ocultar contraseña
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Registrar usuario
async function registrarUsuario(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        dni: formData.get('dni'),
        nombres: formData.get('nombres'),
        apellidos: formData.get('apellidos'),
        telefono: formData.get('telefono'),
        email: formData.get('email') || null,
        nombreUsuario: formData.get('nombreUsuario'),
        contrasena: formData.get('contrasena'),
        idPerfil: parseInt(formData.get('perfil')),
        estado: 'activo'
    };
    
    // Validaciones básicas en frontend
    if (!data.dni || data.dni.length !== 8) {
        alert('El DNI debe tener 8 dígitos');
        return;
    }
    
    if (!data.telefono || data.telefono.length !== 9) {
        alert('El teléfono debe tener 9 dígitos');
        return;
    }
    
    if (!data.idPerfil || isNaN(data.idPerfil)) {
        alert('Debe seleccionar un perfil');
        return;
    }
    
    if (!data.contrasena || data.contrasena.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    try {
        const response = await fetch('/Proyecto_De_App_Fast_Food/api/usuarios/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.exito) {
            alert(`Usuario registrado exitosamente\nID: ${result.idUsuario}\nNombre de usuario: ${result.nombreUsuario}`);
            event.target.reset();
            cargarPerfiles(); // Recargar select
        } else {
            alert('Error: ' + result.mensaje);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar el usuario. Por favor, intente nuevamente.');
    }
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Cargar perfiles disponibles
    cargarPerfiles();
    
    // Generar nombre de usuario automáticamente
    document.getElementById('nombres').addEventListener('blur', generarNombreUsuario);
    document.getElementById('apellidos').addEventListener('blur', generarNombreUsuario);
    
    // Validación solo números para teléfono y DNI
    document.getElementById('telefono').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    document.getElementById('dni').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    // Manejar envío del formulario
    document.getElementById('formRegistrarUsuario').addEventListener('submit', registrarUsuario);
});

// Función para salir del módulo
function salirModulo() {
    if (confirm('¿Está seguro que desea salir? Los cambios no guardados se perderán.')) {
        window.location.href = 'menu_principal.html';
    }
}
