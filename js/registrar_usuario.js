// ===== REGISTRAR USUARIO - JAVASCRIPT =====

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
        alert('Error al cargar los perfiles disponibles');
    }
}

// Cargar datos del usuario para edición
async function cargarUsuario(idUsuario) {
    try {
        const response = await fetch(`/Proyecto_De_App_Fast_Food/api/usuarios/buscar?id=${idUsuario}`);
        const data = await response.json();
        
        if (data.exito && data.usuario) {
            const usuario = data.usuario;
            
            // Rellenar formulario
            document.getElementById('dni').value = usuario.dni;
            document.getElementById('nombre').value = usuario.nombreCompleto;
            document.getElementById('telefono').value = usuario.telefono;
            document.getElementById('email').value = usuario.email || '';
            document.getElementById('usuario').value = usuario.nombreUsuario;
            document.getElementById('perfil').value = usuario.idPerfil;
            document.getElementById('estado').value = usuario.estado;
            
            // Hacer contraseña opcional en edición
            const passwordInput = document.getElementById('password');
            const confirmarPasswordInput = document.getElementById('confirmarPassword');
            passwordInput.required = false;
            confirmarPasswordInput.required = false;
            passwordInput.placeholder = 'Dejar en blanco para mantener la actual';
            confirmarPasswordInput.placeholder = 'Dejar en blanco para mantener la actual';
            
            // Cambiar título
            const titulo = document.querySelector('.page-header h1');
            if (titulo) {
                titulo.innerHTML = '<i class="fas fa-user-edit"></i> Editar Usuario';
            }
            
            // Cambiar texto del botón
            const btnSubmit = document.querySelector('button[type="submit"]');
            if (btnSubmit) {
                btnSubmit.innerHTML = '<i class="fas fa-save"></i> Actualizar Usuario';
            }
        } else {
            alert('No se pudo cargar el usuario');
            window.location.href = 'registrar_usuario.html';
        }
    } catch (error) {
        console.error('Error al cargar usuario:', error);
        alert('Error al cargar los datos del usuario');
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

// Registrar o actualizar usuario
async function registrarUsuario(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Validar que las contraseñas coincidan (solo si se ingresaron)
    const password = formData.get('password');
    const confirmarPassword = formData.get('confirmarPassword');
    
    if (password || confirmarPassword) {
        if (password !== confirmarPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }
    }
    
    const data = {
        dni: formData.get('dni'),
        nombreCompleto: formData.get('nombre'),
        telefono: formData.get('telefono'),
        email: formData.get('email'),
        nombreUsuario: formData.get('usuario'),
        idPerfil: parseInt(formData.get('perfil')),
        estado: formData.get('estado')
    };
    
    // Solo agregar contraseña si se ingresó
    if (password) {
        data.contrasena = password;
    }
    
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
    
    if (!data.nombreCompleto || data.nombreCompleto.trim().length < 3) {
        alert('Debe ingresar el nombre completo');
        return;
    }
    
    // En modo registro, la contraseña es obligatoria
    if (!modoEdicion && !data.contrasena) {
        alert('La contraseña es obligatoria');
        return;
    }
    
    try {
        let url = '/Proyecto_De_App_Fast_Food/api/usuarios/registrar';
        let method = 'POST';
        
        if (modoEdicion) {
            url = '/Proyecto_De_App_Fast_Food/api/usuarios/actualizar';
            method = 'PUT';
            data.idUsuario = idUsuarioEditar;
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
                alert('✅ Usuario actualizado exitosamente');
                // Redirigir a la página de visualización correspondiente
                const perfil = document.getElementById('perfil').selectedOptions[0].textContent;
                if (perfil.toLowerCase().includes('administrador')) {
                    window.location.href = '../html/ver_administradores.html';
                } else if (perfil.toLowerCase().includes('cajero')) {
                    window.location.href = '../html/ver_cajeros.html';
                } else if (perfil.toLowerCase().includes('mesero')) {
                    window.location.href = '../html/ver_meseros.html';
                } else if (perfil.toLowerCase().includes('repartidor')) {
                    window.location.href = '../html/ver_repartidores.html';
                } else {
                    window.location.href = '../html/registrar_usuario.html';
                }
            } else {
                alert(`✅ Usuario registrado exitosamente\nID: ${result.idUsuario}\nNombre de usuario: ${result.nombreUsuario}`);
                event.target.reset();
                cargarPerfiles(); // Recargar select
            }
        } else {
            alert('❌ Error: ' + result.mensaje);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al procesar la solicitud. Por favor, intente nuevamente.');
    }
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Cargar perfiles disponibles
    cargarPerfiles();
    
    // Verificar si es modo edición
    const urlParams = new URLSearchParams(window.location.search);
    const editarId = urlParams.get('editar');
    
    if (editarId) {
        modoEdicion = true;
        idUsuarioEditar = parseInt(editarId);
        
        // Esperar a que se carguen los perfiles antes de cargar el usuario
        setTimeout(() => {
            cargarUsuario(idUsuarioEditar);
        }, 500);
    }
    
    // Validación solo números para teléfono y DNI
    document.getElementById('telefono').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    document.getElementById('dni').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    // Manejar envío del formulario
    document.getElementById('formRegistrarUsuario').addEventListener('submit', registrarUsuario);
    
    // Botón limpiar
    const btnLimpiar = document.querySelector('.btn-secondary');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', function() {
            if (modoEdicion) {
                // Si está en modo edición, volver a modo registro
                modoEdicion = false;
                idUsuarioEditar = null;
                
                // Limpiar URL
                window.history.replaceState({}, document.title, window.location.pathname);
                
                // Resetear formulario
                document.getElementById('formRegistrarUsuario').reset();
                
                // Restaurar título y botón
                const titulo = document.querySelector('.page-header h1');
                if (titulo) {
                    titulo.innerHTML = '<i class="fas fa-user-plus"></i> Registrar Nuevo Usuario';
                }
                
                const btnSubmit = document.querySelector('button[type="submit"]');
                if (btnSubmit) {
                    btnSubmit.innerHTML = '<i class="fas fa-save"></i> Registrar Usuario';
                }
                
                // Restaurar contraseña como requerida
                const passwordInput = document.getElementById('password');
                const confirmarPasswordInput = document.getElementById('confirmarPassword');
                passwordInput.required = true;
                confirmarPasswordInput.required = true;
                passwordInput.placeholder = '';
                confirmarPasswordInput.placeholder = '';
                
                cargarPerfiles();
            }
        });
    }
});

// Función para salir del módulo
function salirModulo() {
    if (confirm('¿Está seguro que desea salir? Los cambios no guardados se perderán.')) {
        window.location.href = 'menu_principal.html';
    }
}
