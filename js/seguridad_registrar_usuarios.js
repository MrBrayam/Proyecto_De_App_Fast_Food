// ===== SEGURIDAD - REGISTRAR USUARIO =====

// Variables globales para modo edición
let modoEdicion = false;
let idUsuarioEditar = null;

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

// Cargar datos del usuario para editar
async function cargarUsuario(idUsuario) {
    try {
        const response = await fetch(`/Proyecto_De_App_Fast_Food/api/usuarios/buscar?id=${idUsuario}`);
        const data = await response.json();
        
        if (data.exito && data.usuario) {
            const usuario = data.usuario;
            
            // Cambiar a modo edición
            modoEdicion = true;
            idUsuarioEditar = idUsuario;
            
            // Cambiar título
            const titulo = document.querySelector('.page-title');
            if (titulo) {
                titulo.innerHTML = '<i class="fas fa-user-edit"></i> Editar Usuario';
            }
            
            // Cambiar texto del botón
            const btnSubmit = document.querySelector('button[type="submit"]');
            if (btnSubmit) {
                btnSubmit.innerHTML = '<i class="fas fa-save"></i> Actualizar Usuario';
            }
            
            // Llenar formulario
            document.getElementById('nombre').value = usuario.nombreCompleto || '';
            document.getElementById('dni').value = usuario.dni || '';
            document.getElementById('telefono').value = usuario.telefono || '';
            document.getElementById('email').value = usuario.email || '';
            document.getElementById('usuario').value = usuario.nombreUsuario || '';
            document.getElementById('perfil').value = usuario.idPerfil || '';
            document.getElementById('estado').value = usuario.estado || 'activo';
            
            // NO cargar contraseñas (seguridad)
            document.getElementById('password').value = '';
            document.getElementById('confirmarPassword').value = '';
            
            // Hacer campos de contraseña opcionales en edición
            const passwordField = document.getElementById('password');
            const confirmarField = document.getElementById('confirmarPassword');
            if (passwordField) {
                passwordField.required = false;
                passwordField.type = 'password'; // Asegurar que esté oculta
            }
            if (confirmarField) {
                confirmarField.required = false;
                confirmarField.type = 'password'; // Asegurar que esté oculta
            }
            
            // Agregar nota sobre contraseña
            const passwordContainer = passwordField.closest('.form-group');
            if (passwordContainer && !document.getElementById('passwordNote')) {
                const note = document.createElement('small');
                note.id = 'passwordNote';
                note.style.color = '#ffc857';
                note.textContent = 'Dejar en blanco para mantener la contraseña actual';
                passwordContainer.appendChild(note);
            }
        }
    } catch (error) {
        console.error('Error al cargar usuario:', error);
        alert('Error al cargar los datos del usuario');
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
    
    // En modo edición, si no se ingresa contraseña, es válido
    if (modoEdicion && password === '' && confirmar === '') {
        errorPass.textContent = '';
        errorConfirm.textContent = '';
        return true;
    }
    
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

// Registrar o actualizar usuario
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
        idPerfil: parseInt(formData.get('perfil')),
        estado: formData.get('estado') || 'activo'
    };
    
    // Solo incluir contraseña si se ingresó
    const password = formData.get('password');
    if (password && password.trim() !== '') {
        data.contrasena = password;
    }
    
    // Validaciones
    if (!data.idPerfil || isNaN(data.idPerfil)) {
        document.getElementById('perfilError').textContent = 'Debe seleccionar un perfil';
        return;
    }
    
    try {
        let url, method;
        
        if (modoEdicion) {
            // Modo edición
            url = '/Proyecto_De_App_Fast_Food/api/usuarios/actualizar';
            method = 'PUT';
            data.idUsuario = idUsuarioEditar;
        } else {
            // Modo registro
            url = '/Proyecto_De_App_Fast_Food/api/usuarios/registrar';
            method = 'POST';
            
            // En modo registro, la contraseña es obligatoria
            if (!data.contrasena) {
                alert('La contraseña es obligatoria');
                return;
            }
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.exito) {
            if (modoEdicion) {
                alert(`✅ Usuario actualizado exitosamente`);
                // Redirigir a visualizar usuarios
                window.location.href = 'seguridad_visualizar_usuarios.html';
            } else {
                alert(`✅ Usuario registrado exitosamente\n\nID: ${result.idUsuario}\nUsuario: ${result.nombreUsuario}\n\nPuede iniciar sesión con sus credenciales.`);
                event.target.reset();
                cargarPerfiles();
            }
        } else {
            alert('❌ Error: ' + result.mensaje);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al procesar la solicitud. Verifique su conexión.');
    }
}

// Limpiar formulario y resetear modo edición
function limpiarFormulario() {
    // Resetear variables de modo edición
    modoEdicion = false;
    idUsuarioEditar = null;
    
    // Limpiar URL
    window.history.replaceState({}, document.title, window.location.pathname);
    
    // Resetear formulario
    document.getElementById('formRegistrarUsuario').reset();
    
    // Restaurar título
    const titulo = document.querySelector('.page-title');
    if (titulo) {
        titulo.innerHTML = '<i class="fas fa-user-plus"></i> Registrar Nuevo Usuario';
    }
    
    // Restaurar texto del botón
    const btnSubmit = document.querySelector('button[type="submit"]');
    if (btnSubmit) {
        btnSubmit.innerHTML = '<i class="fas fa-save"></i> Registrar Usuario';
    }
    
    // Hacer contraseñas requeridas nuevamente y asegurar que estén ocultas
    const passwordField = document.getElementById('password');
    const confirmarField = document.getElementById('confirmarPassword');
    if (passwordField) {
        passwordField.required = true;
        passwordField.type = 'password';
        passwordField.value = '';
    }
    if (confirmarField) {
        confirmarField.required = true;
        confirmarField.type = 'password';
        confirmarField.value = '';
    }
    
    // Restablecer iconos de ver/ocultar contraseña si existen
    const eyeIcons = document.querySelectorAll('.toggle-password i');
    eyeIcons.forEach(icon => {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    });
    
    // Eliminar nota de contraseña si existe
    const passwordNote = document.getElementById('passwordNote');
    if (passwordNote) passwordNote.remove();
    
    // Limpiar errores
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
    });
    
    // Recargar perfiles
    cargarPerfiles();
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Cargar perfiles
    cargarPerfiles();
    
    // Verificar si viene parámetro de edición
    const urlParams = new URLSearchParams(window.location.search);
    const idEditar = urlParams.get('editar');
    
    if (idEditar) {
        cargarUsuario(idEditar);
    }
    
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
    
    // Botón limpiar
    const btnLimpiar = document.querySelector('.btn-limpiar, .btn-secondary, button[type="reset"]');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', function(e) {
            e.preventDefault();
            limpiarFormulario();
        });
    }
});
