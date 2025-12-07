// ============================================
// SISTEMA DE CAMBIO DE TEMA
// Modo claro/oscuro para todo el sistema
// ============================================

class ThemeManager {
    constructor() {
        this.body = document.body;
        this.modoClaro = null;
        this.modoClaroPage = null;
        this.modoOscuroPage = null;
        this.themeIcon = null;
        this.themeBtn = null;
        
        // Inicializar cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.setupThemeElements();
        this.loadSavedTheme();
        this.setupEventListeners();
    }

    setupThemeElements() {
        // Buscar el enlace del modo claro general
        this.modoClaro = document.getElementById('modo-claro-css');
        
        // Si no existe, crearlo
        if (!this.modoClaro) {
            this.modoClaro = document.createElement('link');
            this.modoClaro.id = 'modo-claro-css';
            this.modoClaro.rel = 'stylesheet';
            this.modoClaro.href = this.getCorrectPath() + 'css/modo-claro/modo-claro.css';
            this.modoClaro.disabled = true;
            document.head.appendChild(this.modoClaro);
        }

        // Buscar los enlaces específicos de página
        this.modoClaroPage = document.getElementById('modo-claro-page-css');
        this.modoOscuroPage = document.getElementById('modo-oscuro-page-css');

        // Buscar elementos del tema
        this.themeIcon = document.querySelector('.theme-icon');
        this.themeBtn = document.getElementById('toggleTheme');
        
        // Si no existe el botón, crearlo
        if (!this.themeBtn) {
            this.createThemeButton();
        }
    }

    getCorrectPath() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/html/')) {
            return '../';
        }
        return '';
    }

    createThemeButton() {
        // Buscar un lugar apropiado para el botón
        let container = document.querySelector('.top-bar-right, .header-right, .clientes-header-right, .login-header');
        
        if (!container) {
            // Si no hay contenedor específico, buscar el header principal
            container = document.querySelector('header, .main-header, .clientes-header, .top-bar');
        }
        
        if (container) {
            const themeToggle = document.createElement('div');
            themeToggle.className = 'theme-toggle';
            
            themeToggle.innerHTML = `
                <button id="toggleTheme" class="btn-theme" title="Cambiar tema">
                    <span class="theme-icon">🌙</span>
                </button>
            `;
            
            // Insertar al inicio del contenedor si es top-bar-right, sino al final
            if (container.classList.contains('top-bar-right')) {
                container.insertBefore(themeToggle, container.firstChild);
            } else {
                container.appendChild(themeToggle);
            }
            
            // Actualizar referencias
            this.themeBtn = document.getElementById('toggleTheme');
            this.themeIcon = document.querySelector('.theme-icon');
        }
    }

    toggleTheme() {
        if (this.body.classList.contains('modo-claro')) {
            this.setDarkTheme();
        } else {
            this.setLightTheme();
        }
    }

    setLightTheme() {
        this.body.classList.add('modo-claro');
        this.body.classList.remove('modo-oscuro');
        
        // Activar estilos de modo claro
        if (this.modoClaro) this.modoClaro.disabled = false;
        if (this.modoClaroPage) this.modoClaroPage.disabled = false;
        
        // Desactivar estilos de modo oscuro
        if (this.modoOscuroPage) this.modoOscuroPage.disabled = true;
        
        if (this.themeIcon) this.themeIcon.textContent = '☀️';
        if (this.themeBtn) this.themeBtn.title = 'Cambiar a modo oscuro';
        localStorage.setItem('theme', 'light');
        
        // Disparar evento personalizado
        this.dispatchThemeChangeEvent('light');
    }

    setDarkTheme() {
        this.body.classList.remove('modo-claro');
        this.body.classList.add('modo-oscuro');
        
        // Desactivar estilos de modo claro
        if (this.modoClaro) this.modoClaro.disabled = true;
        if (this.modoClaroPage) this.modoClaroPage.disabled = true;
        
        // Activar estilos de modo oscuro
        if (this.modoOscuroPage) this.modoOscuroPage.disabled = false;
        
        if (this.themeIcon) this.themeIcon.textContent = '🌙';
        if (this.themeBtn) this.themeBtn.title = 'Cambiar a modo claro';
        localStorage.setItem('theme', 'dark');
        
        // Disparar evento personalizado
        this.dispatchThemeChangeEvent('dark');
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'light') {
            this.setLightTheme();
        } else {
            this.setDarkTheme();
        }
    }

    setupEventListeners() {
        if (this.themeBtn) {
            this.themeBtn.addEventListener('click', () => this.toggleTheme());
        }
        
        // Escuchar cambios de tema desde otras pestañas
        window.addEventListener('storage', (e) => {
            if (e.key === 'theme') {
                if (e.newValue === 'light') {
                    this.setLightTheme();
                } else {
                    this.setDarkTheme();
                }
            }
        });
    }

    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themechange', {
            detail: { theme }
        });
        window.dispatchEvent(event);
    }

    // Método público para obtener el tema actual
    getCurrentTheme() {
        return this.body.classList.contains('modo-claro') ? 'light' : 'dark';
    }
}

// Crear instancia global del administrador de temas
const themeManager = new ThemeManager();

// Función global para compatibilidad
window.toggleTheme = function() {
    themeManager.toggleTheme();
};

// Exportar para usar en módulos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}