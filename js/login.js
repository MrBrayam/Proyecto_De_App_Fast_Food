// ============================================
// LOGIN.JS - KING'S PIZZA
// Manejo de la lógica del login
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const togglePassword = document.getElementById('togglePassword');
    const rememberMe = document.getElementById('rememberMe');
    const forgotPassword = document.getElementById('forgotPassword');
    const loginAlert = document.getElementById('loginAlert');
    const alertMessage = document.getElementById('alertMessage');
    
    // Errores
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    // Usuarios de prueba (en producción esto vendría de una base de datos)
    const users = [
        {
            username: 'admin',
            password: 'admin123',
            role: 'administrador',
            name: 'Administrador'
        },
        {
            username: 'cajero',
            password: 'cajero123',
            role: 'cajero',
            name: 'Cajero'
        },
        {
            username: 'delivery',
            password: 'delivery123',
            role: 'delivery',
            name: 'Repartidor'
        }
    ];

    // Verificar si hay sesión guardada
    checkRememberedSession();

    // Toggle para mostrar/ocultar contraseña
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.textContent = type === 'password' ? '👁️' : '�️‍🗨️';
        togglePassword.setAttribute('aria-label', type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña');
    });

    // Manejar el link de "Olvidó su contraseña"
    forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        showAlert('Contacte al administrador del sistema para recuperar su contraseña.', 'warning');
    });

    // Validación en tiempo real
    usernameInput.addEventListener('input', function() {
        clearError(usernameInput, usernameError);
        hideAlert();
    });

    passwordInput.addEventListener('input', function() {
        clearError(passwordInput, passwordError);
        hideAlert();
    });

    // Manejar el envío del formulario
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Limpiar errores previos
        clearAllErrors();
        hideAlert();

        // Obtener valores
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Validar campos
        let isValid = true;

        if (!username) {
            showError(usernameInput, usernameError, 'Por favor ingrese su usuario');
            isValid = false;
        } else if (username.length < 3) {
            showError(usernameInput, usernameError, 'El usuario debe tener al menos 3 caracteres');
            isValid = false;
        }

        if (!password) {
            showError(passwordInput, passwordError, 'Por favor ingrese su contraseña');
            isValid = false;
        } else if (password.length < 6) {
            showError(passwordInput, passwordError, 'La contraseña debe tener al menos 6 caracteres');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Simular proceso de login
        performLogin(username, password);
    });

    // Función para realizar el login
    function performLogin(username, password) {
        // Mostrar estado de carga
        setLoadingState(true);

        // Simular delay de conexión al servidor (500ms)
        setTimeout(() => {
            // Buscar usuario
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                // Login exitoso
                handleSuccessfulLogin(user);
            } else {
                // Login fallido
                handleFailedLogin();
            }

            setLoadingState(false);
        }, 500);
    }

    // Manejar login exitoso
    function handleSuccessfulLogin(user) {
        // Guardar sesión en localStorage
        const sessionData = {
            username: user.username,
            name: user.name,
            role: user.role,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('userSession', JSON.stringify(sessionData));

        // Si el usuario marcó "Recordarme", guardar preferencia
        if (rememberMe.checked) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('rememberedUser', user.username);
        } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('rememberedUser');
        }

        // Mostrar mensaje de éxito
        showAlert(`¡Bienvenido, ${user.name}!`, 'success');

        // Redirigir según el rol
        setTimeout(() => {
            redirectToDashboard(user.role);
        }, 1000);
    }

    // Manejar login fallido
    function handleFailedLogin() {
        showAlert('Usuario o contraseña incorrectos. Por favor intente nuevamente.', 'error');
        passwordInput.value = '';
        passwordInput.focus();
        
        // Añadir efecto de shake
        loginForm.classList.add('shake');
        setTimeout(() => {
            loginForm.classList.remove('shake');
        }, 500);
    }

    // Redirigir según el rol del usuario
    function redirectToDashboard(role) {
        // En producción, redirigir a diferentes dashboards según el rol
        switch(role) {
            case 'administrador':
                window.location.href = 'index.html';
                break;
            case 'cajero':
                window.location.href = 'ventas.html';
                break;
            case 'delivery':
                window.location.href = 'delivery.html';
                break;
            default:
                window.location.href = 'index.html';
        }
    }

    // Verificar sesión recordada
    function checkRememberedSession() {
        const rememberMeFlag = localStorage.getItem('rememberMe');
        const rememberedUser = localStorage.getItem('rememberedUser');

        if (rememberMeFlag === 'true' && rememberedUser) {
            usernameInput.value = rememberedUser;
            rememberMe.checked = true;
            passwordInput.focus();
        }
    }

    // Mostrar error en campo
    function showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    // Limpiar error de campo
    function clearError(input, errorElement) {
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    // Limpiar todos los errores
    function clearAllErrors() {
        clearError(usernameInput, usernameError);
        clearError(passwordInput, passwordError);
    }

    // Mostrar alerta
    function showAlert(message, type = 'error') {
        alertMessage.textContent = message;
        loginAlert.className = `login-alert ${type}`;
        
        // Cambiar icono según tipo
        const icon = loginAlert.querySelector('span:first-child');
        switch(type) {
            case 'success':
                icon.textContent = '✓';
                break;
            case 'warning':
                icon.textContent = '⚠️';
                break;
            case 'error':
            default:
                icon.textContent = '❌';
                break;
        }
        
        loginAlert.style.display = 'flex';
    }

    // Ocultar alerta
    function hideAlert() {
        loginAlert.style.display = 'none';
    }

    // Establecer estado de carga
    function setLoadingState(isLoading) {
        if (isLoading) {
            loginBtn.disabled = true;
            loginBtn.classList.add('loading');
            loginBtn.textContent = 'Iniciando sesión...';
        } else {
            loginBtn.disabled = false;
            loginBtn.classList.remove('loading');
            loginBtn.textContent = 'Iniciar Sesión';
        }
    }

    // Agregar estilo para efecto shake
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .shake {
            animation: shake 0.5s;
        }
    `;
    document.head.appendChild(style);

    // Prevenir ataques XSS básicos
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // Log para desarrollo (remover en producción)
    console.log('%c� King\'s Pizza - Sistema de Login Activo', 'color: #e74c3c; font-size: 16px; font-weight: bold;');
    console.log('%cUsuarios de prueba:', 'color: #3498db; font-weight: bold;');
    console.log('Admin: admin / admin123');
    console.log('Cajero: cajero / cajero123');
    console.log('Delivery: delivery / delivery123');
});