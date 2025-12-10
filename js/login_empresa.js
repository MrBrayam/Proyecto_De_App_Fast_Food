// API Base URL
const API_BASE = 'http://localhost/Proyecto_De_App_Fast_Food/api';

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('contrasena');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Mostrar mensaje de error
function mostrarError(mensaje) {
    // Crear elemento de error si no existe
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        const form = document.getElementById('formLoginEmpresa');
        form.insertBefore(errorDiv, form.firstChild);
    }
    
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${mensaje}`;
    errorDiv.classList.add('show');
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 5000);
}

// Manejar el login de empresa
document.getElementById('formLoginEmpresa').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nombreEmpresa = document.getElementById('nombreEmpresa').value.trim();
    const contrasena = document.getElementById('contrasena').value;
    
    if (!nombreEmpresa || !contrasena) {
        mostrarError('Por favor complete todos los campos');
        return;
    }
    
    const btnLogin = this.querySelector('.btn-login');
    const btnOriginalText = btnLogin.innerHTML;
    
    try {
        // Mostrar estado de carga
        btnLogin.disabled = true;
        btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
        
        const response = await fetch(`${API_BASE}/auth/login-empresa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombreEmpresa: nombreEmpresa,
                contrasena: contrasena
            })
        });
        
        const data = await response.json();
        
        if (data.exito) {
            // Guardar datos de la empresa en sessionStorage
            sessionStorage.setItem('empresaData', JSON.stringify({
                idEmpresa: data.idEmpresa,
                nombreEmpresa: data.nombreEmpresa
            }));
            
            // Mostrar mensaje de éxito
            btnLogin.innerHTML = '<i class="fas fa-check-circle"></i> ¡Acceso concedido!';
            btnLogin.style.background = 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)';
            
            // Redirigir al login de usuarios
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            mostrarError(data.mensaje || 'Nombre de empresa o contraseña incorrectos');
            btnLogin.disabled = false;
            btnLogin.innerHTML = btnOriginalText;
        }
    } catch (error) {
        console.error('Error en login de empresa:', error);
        mostrarError('Error de conexión. Verifique que el servidor esté activo.');
        btnLogin.disabled = false;
        btnLogin.innerHTML = btnOriginalText;
    }
});

// Limpiar error al escribir
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        const errorDiv = document.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.classList.remove('show');
        }
    });
});

// Prevenir espacios al inicio en el nombre de empresa
document.getElementById('nombreEmpresa').addEventListener('input', function(e) {
    this.value = this.value.trimStart();
});
