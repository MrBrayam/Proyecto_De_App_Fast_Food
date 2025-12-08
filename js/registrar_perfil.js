// Registrar Perfil
document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    const form = document.getElementById('formRegistrarPerfil');
    
    // Checkbox "Acceso Completo" selecciona todos
    const accesoCompleto = document.querySelector('[name="perm_acceso_completo"]');
    if (accesoCompleto) {
        accesoCompleto.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.permissions-grid input[type="checkbox"]');
            checkboxes.forEach(cb => {
                cb.checked = this.checked;
            });
        });
    }
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (validarFormulario()) {
                const formData = new FormData(form);
                
                const perfil = {
                    nombrePerfil: formData.get('nombrePerfil'),
                    descripcion: formData.get('descripcion') || null,
                    estado: formData.get('estadoPerfil'),
                    nivelAcceso: formData.get('nivelAcceso'),
                    permisos: {
                        ventasRegistrar: formData.get('perm_ventas_registrar') === 'on',
                        ventasVisualizar: formData.get('perm_ventas_visualizar') === 'on',
                        ventasModificar: formData.get('perm_ventas_modificar') === 'on',
                        ventasEliminar: formData.get('perm_ventas_eliminar') === 'on',
                        comprasRegistrar: formData.get('perm_compras_registrar') === 'on',
                        comprasVisualizar: formData.get('perm_compras_visualizar') === 'on',
                        comprasInventario: formData.get('perm_inventario_gestionar') === 'on',
                        usuariosRegistrar: formData.get('perm_usuarios_registrar') === 'on',
                        usuariosVisualizar: formData.get('perm_usuarios_visualizar') === 'on',
                        usuariosModificar: formData.get('perm_usuarios_modificar') === 'on',
                        usuariosEliminar: formData.get('perm_usuarios_eliminar') === 'on',
                        reportesVentas: formData.get('perm_reportes_ventas') === 'on',
                        reportesCompras: formData.get('perm_reportes_compras') === 'on',
                        reportesFinancieros: formData.get('perm_reportes_financieros') === 'on',
                        clientes: formData.get('perm_clientes_gestionar') === 'on',
                        proveedores: formData.get('perm_proveedores_gestionar') === 'on',
                        perfiles: formData.get('perm_perfiles_gestionar') === 'on',
                        accesoCompleto: formData.get('perm_acceso_completo') === 'on'
                    }
                };
                
                try {
                    const response = await fetch('/Proyecto_De_App_Fast_Food/api/perfiles/registrar', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(perfil)
                    });
                    
                    const data = await response.json();
                    
                    if (data.exito) {
                        alert('✅ Perfil registrado exitosamente con ID: ' + data.idPerfil);
                        form.reset();
                        // Opcional: redirigir a visualizar perfiles
                        // window.location.href = 'visualizar_perfil.html';
                    } else {
                        alert('❌ Error: ' + data.mensaje);
                    }
                } catch (error) {
                    console.error('Error al registrar perfil:', error);
                    alert('❌ Error de conexión al servidor');
                }
            }
        });
    }
    
    function validarFormulario() {
        let isValid = true;
        
        const nombrePerfil = document.getElementById('nombrePerfil');
        if (!nombrePerfil.value.trim()) {
            mostrarError('nombrePerfilError', 'El nombre del perfil es requerido');
            isValid = false;
        } else {
            limpiarError('nombrePerfilError');
        }
        
        const nivelAcceso = document.getElementById('nivelAcceso');
        if (!nivelAcceso.value) {
            alert('Debe seleccionar un nivel de acceso');
            isValid = false;
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
    
    const fechaElement = document.getElementById('fechaActual');
    const horaElement = document.getElementById('horaActual');
    
    if (fechaElement) {
        fechaElement.textContent = fechaFormateada;
    }
    if (horaElement) {
        horaElement.textContent = horaFormateada;
    }
}
