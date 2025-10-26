// Registrar Perfil
document.addEventListener('DOMContentLoaded', function() {
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
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validarFormulario()) {
                const formData = new FormData(form);
                
                const perfil = {
                    nombre: formData.get('nombrePerfil'),
                    descripcion: formData.get('descripcion'),
                    estado: formData.get('estadoPerfil'),
                    nivelAcceso: formData.get('nivelAcceso'),
                    permisos: {
                        ventas: {
                            registrar: formData.get('perm_ventas_registrar') === 'on',
                            visualizar: formData.get('perm_ventas_visualizar') === 'on',
                            modificar: formData.get('perm_ventas_modificar') === 'on',
                            eliminar: formData.get('perm_ventas_eliminar') === 'on'
                        },
                        compras: {
                            registrar: formData.get('perm_compras_registrar') === 'on',
                            visualizar: formData.get('perm_compras_visualizar') === 'on',
                            inventario: formData.get('perm_inventario_gestionar') === 'on'
                        },
                        usuarios: {
                            registrar: formData.get('perm_usuarios_registrar') === 'on',
                            visualizar: formData.get('perm_usuarios_visualizar') === 'on',
                            modificar: formData.get('perm_usuarios_modificar') === 'on',
                            eliminar: formData.get('perm_usuarios_eliminar') === 'on'
                        },
                        reportes: {
                            ventas: formData.get('perm_reportes_ventas') === 'on',
                            compras: formData.get('perm_reportes_compras') === 'on',
                            financieros: formData.get('perm_reportes_financieros') === 'on'
                        },
                        clientes: formData.get('perm_clientes_gestionar') === 'on',
                        proveedores: formData.get('perm_proveedores_gestionar') === 'on',
                        perfiles: formData.get('perm_perfiles_gestionar') === 'on',
                        accesoCompleto: formData.get('perm_acceso_completo') === 'on'
                    },
                    fechaCreacion: new Date().toISOString()
                };
                
                // Guardar en localStorage
                let perfiles = JSON.parse(localStorage.getItem('perfiles_sistema') || '[]');
                perfiles.push(perfil);
                localStorage.setItem('perfiles_sistema', JSON.stringify(perfiles));
                
                alert('Perfil registrado exitosamente');
                form.reset();
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
