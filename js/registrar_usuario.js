// ===== REGISTRAR USUARIO - JAVASCRIPT =====

// Actualizar fecha y hora
function actualizarFechaHora() {
    const ahora = new Date();
    
    const fechaElement = document.getElementById('fechaActual');
    if (fechaElement) {
        const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const fechaFormateada = ahora.toLocaleDateString('es-ES', opciones);
        fechaElement.textContent = fechaFormateada;
    }
    
    const horaElement = document.getElementById('horaActual');
    if (horaElement) {
        const horaFormateada = ahora.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false 
        });
        horaElement.textContent = horaFormateada;
    }
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Generar nombre de usuario automáticamente
    document.getElementById('nombres').addEventListener('blur', generarNombreUsuario);
    document.getElementById('apellidos').addEventListener('blur', generarNombreUsuario);
    
    // Validación solo números para teléfono
    document.getElementById('telefono').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});

// Función para generar nombre de usuario automáticamente
function generarNombreUsuario() {
    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    
    if (nombres && apellidos) {
        const nombreArray = nombres.split(' ');
        const apellidoArray = apellidos.split(' ');
        
        const usuario = (nombreArray[0] + apellidoArray[0]).toLowerCase()
            .replace(/[áàäâ]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/ñ/g, 'n')
            .replace(/\s+/g, '');
        
        document.getElementById('nombreUsuario').value = usuario;
    }
}

// Función para mostrar/ocultar contraseña
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.parentElement.querySelector('.btn-toggle-password');
    const icon = button.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        field.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Envío del formulario
document.getElementById('formRegistrarUsuario').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validación básica
    const requiredFields = this.querySelectorAll('[required]');
    let valid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            valid = false;
        } else {
            field.style.borderColor = 'rgba(255, 87, 51, 0.3)';
        }
    });
    
    if (!valid) {
        alert('Por favor, complete todos los campos obligatorios');
        return;
    }
    
    // Validar email
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, ingrese un email válido');
        return;
    }
    
    // Validar teléfono
    const telefono = document.getElementById('telefono').value;
    if (telefono.length < 9) {
        alert('El teléfono debe tener al menos 9 dígitos');
        return;
    }
    
    // Simular guardado
    const formData = new FormData(this);
    const usuario = Object.fromEntries(formData);
    
    console.log('Registrando usuario:', usuario);
    
    // Guardar en localStorage (simulación)
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuario.id = Date.now();
    usuario.fechaCreacion = new Date().toISOString();
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    alert('Usuario registrado exitosamente');
    limpiarFormulario();
});

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById('formRegistrarUsuario').reset();
    
    // Remover estilos de error
    document.querySelectorAll('.form-control').forEach(field => {
        field.style.borderColor = 'rgba(255, 87, 51, 0.3)';
    });
}

// Función para salir del módulo
function salirModulo() {
    if (confirm('¿Está seguro que desea salir? Los cambios no guardados se perderán.')) {
        window.location.href = 'menu_principal.html';
    }
}
