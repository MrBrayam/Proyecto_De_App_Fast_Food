// ===== SEGURIDAD - REGISTRAR USUARIO =====

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
    }
}

// Validar DNI
function validarDNI() {
    const dni = document.getElementById('dni').value;
    const error = document.getElementById('dniError');
    
    if (dni.length !== 8 || !/^\d{8}$/.test(dni)) {
        error.textContent = 'El DNI debe tener 8 dígitos';
        return false;
    }
    error.textContent = '';
    return true;
}

// Validar email
function validarEmail() {
    const email = document.getElementById('email').value;
    const error = document.getElementById('emailError');
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        error.textContent = 'Email inválido';
        return false;
    }
    error.textContent = '';
    return true;
}

// Validar contraseñas
function validarPassword() {
    const password = document.getElementById('password').value;
    const confirmar = document.getElementById('confirmarPassword').value;
    const errorPass = document.getElementById('passwordError');
    const errorConfirm = document.getElementById('confirmarPasswordError');
    
    if (password.length < 6) {
        errorPass.textContent = 'La contraseña debe tener al menos 6 caracteres';
        return false;
    }
    errorPass.textContent = '';
    
    if (password !== confirmar) {
        errorConfirm.textContent = 'Las contraseñas no coinciden';
        return false;
    }
    errorConfirm.textContent = '';
    return true;
}

// Registrar usuario
async function registrarUsuario(event) {
    event.preventDefault();
    
    // Validar campos
    if (!validarDNI() || !validarEmail() || !validarPassword()) {
        return;
    }
    
    const formData = new FormData(event.target);
    
    const data = {
        dni: formData.get('dni'),
        nombreCompleto: formData.get('nombre').trim(),
        telefono: formData.get('telefono') || '000000000',
        email: formData.get('email'),
        nombreUsuario: formData.get('usuario'),
        contrasena: formData.get('password'),
        idPerfil: parseInt(formData.get('perfil')),
        estado: formData.get('estado') || 'activo'
    };
    
    // Validaciones
    if (!data.idPerfil || isNaN(data.idPerfil)) {
        document.getElementById('perfilError').textContent = 'Debe seleccionar un perfil';
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
            alert(`✅ Usuario registrado exitosamente\n\nID: ${result.idUsuario}\nUsuario: ${result.nombreUsuario}\n\nPuede iniciar sesión con sus credenciales.`);
            event.target.reset();
            cargarPerfiles();
        } else {
            alert('❌ Error: ' + result.mensaje);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al registrar el usuario. Verifique su conexión.');
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Cargar perfiles
    cargarPerfiles();
    
    // Validaciones en tiempo real
    document.getElementById('dni').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        validarDNI();
    });
    
    document.getElementById('telefono').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    document.getElementById('email').addEventListener('blur', validarEmail);
    document.getElementById('password').addEventListener('blur', validarPassword);
    document.getElementById('confirmarPassword').addEventListener('blur', validarPassword);
    
    // Enviar formulario
    document.getElementById('formRegistrarUsuario').addEventListener('submit', registrarUsuario);
});
