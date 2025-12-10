// Registrar Perfil
let modoEdicion = false;
let idPerfilEditar = null;

document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    
    // Verificar si viene parámetro de edición
    const urlParams = new URLSearchParams(window.location.search);
    const idEditar = urlParams.get('editar');
    
    if (idEditar) {
        cargarPerfil(idEditar);
    }
    
    const form = document.getElementById('formRegistrarPerfil');
    
    if (form) {
        // Event listener para el botón reset/limpiar
        const btnReset = form.querySelector('button[type="reset"]');
        if (btnReset) {
            btnReset.addEventListener('click', function(e) {
                // Limpiar modo edición
                modoEdicion = false;
                idPerfilEditar = null;
                
                // Limpiar URL (quitar parámetro ?editar=X)
                const url = new URL(window.location.href);
                url.search = ''; // Eliminar todos los parámetros de la URL
                window.history.replaceState({}, document.title, url.pathname);
                
                // Restaurar título y botón
                const titulo = document.querySelector('.page-title');
                if (titulo) {
                    titulo.innerHTML = '<i class="fas fa-user-shield"></i> Registrar Tipo de Perfil';
                }
                
                const btnSubmit = form.querySelector('button[type="submit"]');
                if (btnSubmit) {
                    btnSubmit.innerHTML = '<i class="fas fa-save"></i> Registrar Perfil';
                }
            });
        }
        
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
                        // Ventas
                        ventasRegistrar: formData.get('perm_ventas_registrar') === 'on',
                        ventasVisualizar: formData.get('perm_ventas_visualizar') === 'on',
                        promocionesRegistrar: formData.get('perm_promociones_registrar') === 'on',
                        promocionesVisualizar: formData.get('perm_promociones_visualizar') === 'on',
                        mesasRegistrar: formData.get('perm_mesas_registrar') === 'on',
                        mesasVisualizar: formData.get('perm_mesas_visualizar') === 'on',
                        pedidosRegistrar: formData.get('perm_pedidos_registrar') === 'on',
                        pedidosVisualizar: formData.get('perm_pedidos_visualizar') === 'on',
                        cajaApertura: formData.get('perm_caja_apertura') === 'on',
                        cajaVisualizar: formData.get('perm_caja_visualizar') === 'on',
                        cajaCerrar: formData.get('perm_caja_cerrar') === 'on',
                        // Compras
                        comprasRegistrar: formData.get('perm_compras_registrar') === 'on',
                        comprasVisualizar: formData.get('perm_compras_visualizar') === 'on',
                        inventarioVisualizar: formData.get('perm_inventario_visualizar') === 'on',
                        insumoRegistrar: formData.get('perm_insumo_registrar') === 'on',
                        proveedoresRegistrar: formData.get('perm_proveedores_registrar') === 'on',
                        proveedoresVisualizar: formData.get('perm_proveedores_visualizar') === 'on',
                        productoRegistrar: formData.get('perm_producto_registrar') === 'on',
                        productoVisualizar: formData.get('perm_producto_visualizar') === 'on',
                        // Usuarios
                        usuariosRegistrar: formData.get('perm_usuarios_registrar') === 'on',
                        usuariosVisualizar: formData.get('perm_usuarios_visualizar') === 'on',
                        // Clientes
                        clientesRegistrar: formData.get('perm_clientes_registrar') === 'on',
                        clientesVisualizar: formData.get('perm_clientes_visualizar') === 'on',
                        // Reportes
                        reportes: formData.get('perm_reportes') === 'on',
                        // Seguridad
                        seguridadUsuariosRegistrar: formData.get('perm_seguridad_usuarios_registrar') === 'on',
                        seguridadUsuariosVisualizar: formData.get('perm_seguridad_usuarios_visualizar') === 'on',
                        perfilesRegistrar: formData.get('perm_perfiles_registrar') === 'on',
                        perfilesVisualizar: formData.get('perm_perfiles_visualizar') === 'on'
                    }
                };
                
                try {
                    let url, method;
                    
                    if (modoEdicion) {
                        // Modo edición - agregar idPerfil al objeto
                        perfil.idPerfil = idPerfilEditar;
                        url = '/Proyecto_De_App_Fast_Food/api/perfiles/actualizar';
                        method = 'PUT';
                    } else {
                        // Modo registro
                        url = '/Proyecto_De_App_Fast_Food/api/perfiles/registrar';
                        method = 'POST';
                    }
                    
                    const response = await fetch(url, {
                        method: method,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(perfil)
                    });
                    
                    const data = await response.json();
                    
                    if (data.exito) {
                        if (modoEdicion) {
                            alert('✅ Perfil actualizado exitosamente');
                            window.location.href = 'visualizar_perfil.html';
                        } else {
                            alert('✅ Perfil registrado exitosamente con ID: ' + data.idPerfil);
                            form.reset();
                        }
                    } else {
                        alert('❌ Error: ' + data.mensaje);
                    }
                } catch (error) {
                    console.error('Error al procesar perfil:', error);
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

// Cargar datos del perfil para editar
async function cargarPerfil(idPerfil) {
    try {
        const response = await fetch(`/Proyecto_De_App_Fast_Food/api/perfiles/buscar?id=${idPerfil}`);
        const data = await response.json();
        
        if (data.exito && data.perfil) {
            const perfil = data.perfil;
            
            // Cambiar a modo edición
            modoEdicion = true;
            idPerfilEditar = idPerfil;
            
            // Cambiar título
            const titulo = document.querySelector('.page-title');
            if (titulo) {
                titulo.innerHTML = '<i class="fas fa-user-shield"></i> Editar Perfil';
            }
            
            // Cambiar texto del botón
            const btnSubmit = document.querySelector('button[type="submit"]');
            if (btnSubmit) {
                btnSubmit.innerHTML = '<i class="fas fa-save"></i> Actualizar Perfil';
            }
            
            // Llenar formulario
            document.getElementById('nombrePerfil').value = perfil.nombrePerfil || '';
            document.getElementById('descripcion').value = perfil.descripcion || '';
            document.getElementById('estadoPerfil').value = perfil.estado || 'activo';
            document.getElementById('nivelAcceso').value = perfil.nivelAcceso || '';
            
            // Cargar permisos
            if (perfil.permisos) {
                const permisos = typeof perfil.permisos === 'string' ? JSON.parse(perfil.permisos) : perfil.permisos;
                
                // Mapeo de nombres camelCase a nombres de checkboxes
                const mapeoPermisos = {
                    // Ventas
                    'ventasRegistrar': 'perm_ventas_registrar',
                    'ventasVisualizar': 'perm_ventas_visualizar',
                    'promocionesRegistrar': 'perm_promociones_registrar',
                    'promocionesVisualizar': 'perm_promociones_visualizar',
                    'mesasRegistrar': 'perm_mesas_registrar',
                    'mesasVisualizar': 'perm_mesas_visualizar',
                    'pedidosRegistrar': 'perm_pedidos_registrar',
                    'pedidosVisualizar': 'perm_pedidos_visualizar',
                    'cajaApertura': 'perm_caja_apertura',
                    'cajaVisualizar': 'perm_caja_visualizar',
                    'cajaCerrar': 'perm_caja_cerrar',
                    // Compras
                    'comprasRegistrar': 'perm_compras_registrar',
                    'comprasVisualizar': 'perm_compras_visualizar',
                    'inventarioVisualizar': 'perm_inventario_visualizar',
                    'insumoRegistrar': 'perm_insumo_registrar',
                    'proveedoresRegistrar': 'perm_proveedores_registrar',
                    'proveedoresVisualizar': 'perm_proveedores_visualizar',
                    'productoRegistrar': 'perm_producto_registrar',
                    'productoVisualizar': 'perm_producto_visualizar',
                    // Usuarios
                    'usuariosRegistrar': 'perm_usuarios_registrar',
                    'usuariosVisualizar': 'perm_usuarios_visualizar',
                    // Clientes
                    'clientesRegistrar': 'perm_clientes_registrar',
                    'clientesVisualizar': 'perm_clientes_visualizar',
                    // Reportes
                    'reportes': 'perm_reportes',
                    // Seguridad
                    'seguridadUsuariosRegistrar': 'perm_seguridad_usuarios_registrar',
                    'seguridadUsuariosVisualizar': 'perm_seguridad_usuarios_visualizar',
                    'perfilesRegistrar': 'perm_perfiles_registrar',
                    'perfilesVisualizar': 'perm_perfiles_visualizar'
                };
                
                for (const [key, value] of Object.entries(permisos)) {
                    const nombreCheckbox = mapeoPermisos[key];
                    if (nombreCheckbox) {
                        const checkbox = document.querySelector(`[name="${nombreCheckbox}"]`);
                        if (checkbox) {
                            checkbox.checked = value === true || value === 1 || value === '1';
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error al cargar perfil:', error);
        alert('Error al cargar los datos del perfil');
    }
}

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
