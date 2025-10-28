// Registrar Usuario - Seguridad
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    const form = document.getElementById('formRegistrarUsuario');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validarFormulario()) {
                const formData = new FormData(form);
                const usuario = {
                    nombre: formData.get('nombre'),
                    dni: formData.get('dni'),
                    email: formData.get('email'),
                    telefono: formData.get('telefono'),
                    usuario: formData.get('usuario'),
                    perfil: formData.get('perfil'),
                    password: formData.get('password'),
                    estado: formData.get('estado'),
                    permisos: {
                        ventas: formData.get('permiso_ventas') === 'on',
                        reportes: formData.get('permiso_reportes') === 'on',
                        inventario: formData.get('permiso_inventario') === 'on'
                    },
                    fechaRegistro: new Date().toISOString()
                };
                
                // Guardar en localStorage
                let usuarios = JSON.parse(localStorage.getItem('usuarios_sistema') || '[]');
                usuarios.push(usuario);
                localStorage.setItem('usuarios_sistema', JSON.stringify(usuarios));
                
                alert('Usuario registrado exitosamente');
                form.reset();
            }
        });
    }
    
    function validarFormulario() {
        let isValid = true;
        
        // Validar nombre
        const nombre = document.getElementById('nombre');
        if (!nombre.value.trim()) {
            mostrarError('nombreError', 'El nombre es requerido');
            isValid = false;
        } else {
            limpiarError('nombreError');
        }
        
        // Validar DNI
        const dni = document.getElementById('dni');
        if (!dni.value.trim()) {
            mostrarError('dniError', 'El DNI es requerido');
            isValid = false;
        } else if (dni.value.length !== 8) {
            mostrarError('dniError', 'El DNI debe tener 8 dígitos');
            isValid = false;
        } else {
            limpiarError('dniError');
        }
        
        // Validar email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            mostrarError('emailError', 'El email es requerido');
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            mostrarError('emailError', 'Email inválido');
            isValid = false;
        } else {
            limpiarError('emailError');
        }
        
        // Validar usuario
        const usuario = document.getElementById('usuario');
        if (!usuario.value.trim()) {
            mostrarError('usuarioError', 'El nombre de usuario es requerido');
            isValid = false;
        } else if (usuario.value.length < 4) {
            mostrarError('usuarioError', 'El usuario debe tener al menos 4 caracteres');
            isValid = false;
        } else {
            limpiarError('usuarioError');
        }
        
        // Validar perfil
        const perfil = document.getElementById('perfil');
        if (!perfil.value) {
            mostrarError('perfilError', 'Debe seleccionar un perfil');
            isValid = false;
        } else {
            limpiarError('perfilError');
        }
        
        // Validar contraseña
        const password = document.getElementById('password');
        if (!password.value) {
            mostrarError('passwordError', 'La contraseña es requerida');
            isValid = false;
        } else if (password.value.length < 6) {
            mostrarError('passwordError', 'La contraseña debe tener al menos 6 caracteres');
            isValid = false;
        } else {
            limpiarError('passwordError');
        }
        
        // Validar confirmación de contraseña
        const confirmarPassword = document.getElementById('confirmarPassword');
        if (!confirmarPassword.value) {
            mostrarError('confirmarPasswordError', 'Debe confirmar la contraseña');
            isValid = false;
        } else if (password.value !== confirmarPassword.value) {
            mostrarError('confirmarPasswordError', 'Las contraseñas no coinciden');
            isValid = false;
        } else {
            limpiarError('confirmarPasswordError');
        }
        
        return isValid;
    }
    
    function mostrarError(elementId, mensaje) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = mensaje;
            errorElement.style.display = 'block';
        }
    }
    
    function limpiarError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
});

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
    
    document.getElementById('fechaActual').textContent = fechaFormateada;
    document.getElementById('horaActual').textContent = horaFormateada;
}
