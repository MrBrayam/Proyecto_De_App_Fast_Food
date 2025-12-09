/* ============================================
   LOGIN CLIENTE - FUNCIONALIDADES
   ============================================ */

const API_BASE = '/Proyecto_De_App_Fast_Food/api';

// Elementos del DOM
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const switchTabs = document.querySelectorAll('.switch-tab');
const loginForm = document.getElementById('loginForm');
const registroForm = document.getElementById('registroForm');
const mensajeEstado = document.getElementById('mensajeEstado');

// ============= INICIALIZACIÓN =============
document.addEventListener('DOMContentLoaded', function() {
    console.log('[login_cliente] Inicializando...');
    
    // Event listeners para tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', cambiarTab);
    });
    
    switchTabs.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            cambiarTab.call(this);
        });
    });
    
    // Event listeners para formularios
    loginForm.addEventListener('submit', handleLogin);
    registroForm.addEventListener('submit', handleRegistro);
    
    // Verificar si ya hay sesión activa
    verificarSesionCliente();
});

// ============= CAMBIAR TAB =============
function cambiarTab(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Obtener tab desde data-tab del botón o elemento
    const tab = this.dataset.tab;
    
    // Remover active de todos
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Agregar active al seleccionado
    document.querySelector(`.tab-btn[data-tab="${tab}"]`)?.classList.add('active');
    document.getElementById(tab)?.classList.add('active');
    
    console.log('[login_cliente] Tab cambiado a:', tab);
}

// ============= TOGGLE PASSWORD =============
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.target.closest('.toggle-password').querySelector('i');
    
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

// ============= MOSTRAR MENSAJE =============
function mostrarMensaje(mensaje, tipo = 'info') {
    mensajeEstado.textContent = mensaje;
    mensajeEstado.className = `mensaje-estado mostrar ${tipo}`;
    
    console.log(`[login_cliente] ${tipo.toUpperCase()}: ${mensaje}`);
    
    if (tipo !== 'error') {
        setTimeout(() => {
            mensajeEstado.classList.remove('mostrar');
        }, 4000);
    }
}

// ============= VERIFICAR SESIÓN =============
function verificarSesionCliente() {
    try {
        const clienteActual = localStorage.getItem('clienteActual');
        if (clienteActual) {
            const cliente = JSON.parse(clienteActual);
            console.log('[login_cliente] Sesión activa:', cliente.nombreCompleto);
            
            // Redirigir a tienda
            setTimeout(() => {
                window.location.href = './tienda.html';
            }, 500);
        }
    } catch (error) {
        console.error('[login_cliente] Error verificando sesión:', error);
    }
}

// ============= HANDLE LOGIN =============
async function handleLogin(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('loginUsuario').value.trim();
    const contrasena = document.getElementById('loginContrasena').value;
    
    if (!usuario || !contrasena) {
        mostrarMensaje('Por favor completa todos los campos', 'error');
        return;
    }
    
    try {
        console.log('[login_cliente] Intentando login con usuario:', usuario);
        
        const response = await fetch(`${API_BASE}/clientes/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: usuario,
                contrasena: contrasena
            })
        });
        
        const data = await response.json();
        
        if (data.exito && data.cliente) {
            console.log('[login_cliente] Login exitoso:', data.cliente);
            
            // Guardar sesión
            localStorage.setItem('clienteActual', JSON.stringify(data.cliente));
            sessionStorage.setItem('clienteActual', JSON.stringify(data.cliente));
            
            mostrarMensaje('¡Bienvenido ' + data.cliente.nombres + '!', 'exito');
            
            // Redirigir a tienda
            setTimeout(() => {
                window.location.href = './tienda.html';
            }, 1500);
        } else {
            mostrarMensaje(data.error || 'Usuario o contraseña incorrectos', 'error');
        }
    } catch (error) {
        console.error('[login_cliente] Error en login:', error);
        mostrarMensaje('Error en el servidor. Intenta de nuevo.', 'error');
    }
}

// ============= HANDLE REGISTRO =============
async function handleRegistro(e) {
    e.preventDefault();
    
    const nombres = document.getElementById('regNombre').value.trim();
    const apellidos = document.getElementById('regApellido').value.trim();
    const numDocumento = document.getElementById('regDNI').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const telefono = document.getElementById('regTelefono').value.trim();
    const direccion = document.getElementById('regDireccion').value.trim();
    const terminos = document.getElementById('regTerminos').checked;
    
    // Validaciones
    if (!nombres || !apellidos || !numDocumento || !email || !telefono || !direccion) {
        mostrarMensaje('Por favor completa todos los campos', 'error');
        return;
    }
    
    if (!terminos) {
        mostrarMensaje('Debes aceptar los términos y condiciones', 'error');
        return;
    }
    
    if (numDocumento.length !== 8 || !/^\d{8}$/.test(numDocumento)) {
        mostrarMensaje('El DNI debe tener 8 dígitos', 'error');
        return;
    }
    
    // Validar formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarMensaje('Email inválido', 'error');
        return;
    }
    
    try {
        console.log('[login_cliente] Registrando nuevo cliente:', nombres);
        
        const response = await fetch(`${API_BASE}/clientes/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombres: nombres,
                apellidos: apellidos,
                numDocumento: numDocumento,
                email: email,
                telefono: telefono,
                direccion: direccion
            })
        });
        
        const data = await response.json();
        
        if (data.exito) {
            console.log('[login_cliente] Registro exitoso');
            
            mostrarMensaje('¡Cuenta creada! Usa tu nombre y DNI para iniciar sesión', 'exito');
            
            // Limpiar formulario
            registroForm.reset();
            
            // Cambiar a tab de login y prellenar nombre
            setTimeout(() => {
                cambiarTab.call(document.querySelector('.tab-btn[data-tab="login"]'));
                document.getElementById('loginUsuario').value = nombres;
                document.getElementById('loginContrasena').focus();
            }, 2000);
        } else {
            mostrarMensaje(data.error || 'Error al crear la cuenta', 'error');
        }
    } catch (error) {
        console.error('[login_cliente] Error en registro:', error);
        mostrarMensaje('Error en el servidor. Intenta de nuevo.', 'error');
    }
}

// ============= VERIFICAR DISPONIBILIDAD DE NOMBRE =============
const regNombreInput = document.getElementById('regNombre');
let verificaciónTimeout;

if (regNombreInput) {
    regNombreInput.addEventListener('input', function() {
        clearTimeout(verificaciónTimeout);
        
        const nombre = this.value.trim();
        const userCheck = this.parentElement.querySelector('.user-check');
        
        if (nombre.length < 2) {
            userCheck.textContent = '';
            return;
        }
        
        userCheck.textContent = 'Verificando disponibilidad...';
        userCheck.className = 'user-check validando';
        
        verificaciónTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`${API_BASE}/clientes/verificar-usuario?usuario=${encodeURIComponent(nombre)}`);
                const data = await response.json();
                
                if (data.disponible) {
                    userCheck.textContent = '✓ Nombre disponible';
                    userCheck.className = 'user-check disponible';
                } else {
                    userCheck.textContent = '✗ Nombre ya en uso';
                    userCheck.className = 'user-check ocupado';
                }
            } catch (error) {
                console.error('Error verificando nombre:', error);
                userCheck.textContent = '';
            }
        }, 500);
    });
}

// ============= OBTENER CLIENTE ACTUAL =============
function obtenerClienteActual() {
    try {
        const clienteJSON = localStorage.getItem('clienteActual') || sessionStorage.getItem('clienteActual');
        if (clienteJSON) {
            return JSON.parse(clienteJSON);
        }
    } catch (error) {
        console.error('[login_cliente] Error obteniendo cliente:', error);
    }
    return null;
}

// ============= LOGOUT =============
function logout() {
    localStorage.removeItem('clienteActual');
    sessionStorage.removeItem('clienteActual');
    window.location.href = './login_cliente.html';
}
