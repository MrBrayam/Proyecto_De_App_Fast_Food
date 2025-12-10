let modoEdicion = false;
let platoEnEdicion = null;

document.addEventListener('DOMContentLoaded', function() {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);

    const btnGuardar = document.getElementById('btnGuardar');
    const btnAnadir = document.getElementById('btnAnadir');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const inputImagen = document.getElementById('inputImagen');

    if (btnGuardar) btnGuardar.addEventListener('click', registrarPlato);
    if (btnAnadir) btnAnadir.addEventListener('click', registrarPlato);
    if (btnLimpiar) btnLimpiar.addEventListener('click', limpiarYResetear);
    
    // Evento para vista previa de imagen
    if (inputImagen) {
        inputImagen.addEventListener('change', mostrarPreviewImagen);
    }

    inicializarEdicion();
});

function actualizarFechaHora() {
    const ahora = new Date();
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = ahora.toLocaleDateString('es-ES', opciones);
    const horaFormateada = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const fechaElement = document.getElementById('currentDate');
    if (fechaElement) {
        fechaElement.textContent = fechaFormateada + ' ' + horaFormateada;
    }
}

// Mostrar preview de imagen seleccionada
function mostrarPreviewImagen(e) {
    const file = e.target.files[0];
    const previewContainer = document.getElementById('imagenPreview');
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            previewContainer.innerHTML = `
                <img src="${event.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px;">
                <p style="margin-top: 10px; font-size: 12px; color: #888;">
                    <i class="fas fa-check-circle" style="color: #27ae60;"></i> Archivo: ${file.name}
                </p>
            `;
        };
        reader.readAsDataURL(file);
    } else {
        previewContainer.innerHTML = '';
    }
}

function obtenerParametro(nombre) {
    const params = new URLSearchParams(window.location.search);
    return params.get(nombre);
}

function inicializarEdicion() {
    const guardado = sessionStorage.getItem('platoEditando');

    if (guardado) {
        try {
            const plato = JSON.parse(guardado);
            aplicarDatosPlato(plato);
            return;
        } catch (error) {
            console.error('No se pudo cargar el plato desde sesión:', error);
        }
    }

    const codEditar = obtenerParametro('editar');
    if (codEditar) {
        cargarPlatoParaEditar(codEditar);
    }
}

async function cargarPlatoParaEditar(codPlato) {
    try {
        const resp = await fetch(`${API_BASE}/platos/buscar?codPlato=${encodeURIComponent(codPlato)}`);
        const data = await resp.json();

        if (data.exito && data.plato) {
            aplicarDatosPlato(data.plato);
        } else {
            alert(data.mensaje || 'No se pudo cargar el plato a editar');
        }
    } catch (error) {
        console.error('Error al cargar plato para editar:', error);
        alert('Ocurrió un error al cargar el plato para editar');
    }
}

function aplicarDatosPlato(plato) {
    if (!plato) return;

    platoEnEdicion = plato;
    modoEdicion = true;

    document.getElementById('searchCodigo').value = plato.CodPlato || plato.codPlato || '';
    document.getElementById('searchNombre').value = plato.Nombre || plato.nombre || '';
    document.getElementById('searchTamano').value = plato.Tamano || plato.tamano || '';
    document.getElementById('searchPrecio').value = plato.Precio ?? plato.precio ?? '';
    document.getElementById('searchCantidad').value = plato.Cantidad ?? plato.cantidad ?? '';
    document.getElementById('searchStockMinimo').value = plato.StockMinimo ?? plato.stockMinimo ?? 10;
    document.getElementById('searchDescripcion').value = plato.Descripcion || plato.descripcion || '';
    document.getElementById('searchIngredientes').value = plato.Ingredientes || plato.ingredientes || '';

    const codigoInput = document.getElementById('searchCodigo');
    if (codigoInput) codigoInput.readOnly = true;

    const previewContainer = document.getElementById('imagenPreview');
    if (previewContainer) {
        const ruta = plato.RutaImg || plato.rutaImg;
        if (ruta) {
            previewContainer.innerHTML = `
                <img src="${ruta}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px;">
                <p style="margin-top: 10px; font-size: 12px; color: #888;">
                    <i class="fas fa-info-circle" style="color: #3498db;"></i> Imagen actual
                </p>
            `;
        } else {
            previewContainer.innerHTML = '';
        }
    }

    actualizarUiEdicion();
}

function actualizarUiEdicion() {
    const titulo = document.querySelector('.page-title');
    if (titulo) {
        titulo.innerHTML = '<i class="fas fa-pizza-slice"></i> Editar Plato';
    }

    const btnGuardar = document.getElementById('btnGuardar');
    if (btnGuardar) {
        btnGuardar.innerHTML = '<i class="fas fa-save"></i> Actualizar';
    }

    const btnAnadir = document.getElementById('btnAnadir');
    if (btnAnadir) {
        btnAnadir.innerHTML = '<i class="fas fa-save"></i> Actualizar';
    }
}

function restaurarUiRegistro() {
    const titulo = document.querySelector('.page-title');
    if (titulo) {
        titulo.innerHTML = '<i class="fas fa-pizza-slice"></i> Registrar Plato';
    }

    const btnGuardar = document.getElementById('btnGuardar');
    if (btnGuardar) {
        btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar';
    }

    const btnAnadir = document.getElementById('btnAnadir');
    if (btnAnadir) {
        btnAnadir.innerHTML = '<i class="fas fa-plus-circle"></i> Añadir Plato';
    }

    const codigoInput = document.getElementById('searchCodigo');
    if (codigoInput) codigoInput.readOnly = false;
}

async function registrarPlato() {
    const codPlato = document.getElementById('searchCodigo').value.trim();
    const nombre = document.getElementById('searchNombre').value.trim();
    const tamano = document.getElementById('searchTamano').value;
    const precio = parseFloat(document.getElementById('searchPrecio').value || '0');
    const cantidad = parseInt(document.getElementById('searchCantidad').value || '0', 10);
    const stockMinimo = parseInt(document.getElementById('searchStockMinimo').value || '10', 10);
    const descripcion = document.getElementById('searchDescripcion').value.trim();
    const ingredientes = document.getElementById('searchIngredientes').value.trim();
    const inputImagen = document.getElementById('inputImagen');
    const esEdicion = modoEdicion;

    if (!codPlato || !nombre) {
        alert('Código y nombre del plato son obligatorios');
        return;
    }
    if (!tamano) {
        alert('Selecciona un tamaño');
        return;
    }
    if (isNaN(precio) || precio < 0) {
        alert('El precio debe ser mayor o igual a 0');
        return;
    }
    if (isNaN(cantidad) || cantidad < 0) {
        alert('La cantidad debe ser 0 o mayor');
        return;
    }

    // Preservar la imagen anterior si estamos en modo edición
    let rutaImg = esEdicion && platoEnEdicion ? (platoEnEdicion.RutaImg || platoEnEdicion.rutaImg || null) : null;

    // Si hay imagen nueva, subirla primero
    if (inputImagen && inputImagen.files.length > 0) {
        try {
            rutaImg = await subirImagen(inputImagen.files[0], codPlato);
            if (!rutaImg) {
                alert('Error al subir la imagen');
                return;
            }
        } catch (error) {
            console.error('Error al subir imagen:', error);
            alert('No se pudo subir la imagen');
            return;
        }
    }

    const payload = {
        codPlato,
        nombre,
        descripcion,
        ingredientes,
        tamano,
        precio,
        cantidad,
        stockMinimo,
        rutaImg: rutaImg,
        estado: 'disponible'
    };

    try {
        const endpoint = esEdicion ? `${API_BASE}/platos/actualizar` : `${API_BASE}/platos/registrar`;
        const resp = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await resp.json();
        if (data.exito) {
            const mensaje = esEdicion ? 'Plato actualizado correctamente' : 'Plato registrado correctamente';
            alert(mensaje);
            sessionStorage.removeItem('platoEditando');
            modoEdicion = false;
            platoEnEdicion = null;
            limpiarFormulario();
            restaurarUiRegistro();
        } else {
            alert(data.mensaje || 'No se pudo registrar el plato');
        }
    } catch (error) {
        console.error('Error registrando plato:', error);
        alert('Ocurrió un error al registrar el plato');
    }
}

async function subirImagen(file, codPlato) {
    const formData = new FormData();
    formData.append('imagen', file);
    formData.append('codPlato', codPlato);

    try {
        const resp = await fetch(`${API_BASE}/platos/subir-imagen`, {
            method: 'POST',
            body: formData
        });

        const data = await resp.json();
        if (data.exito && data.rutaImg) {
            console.log('Imagen subida exitosamente:', data.rutaImg);
            return data.rutaImg;
        } else {
            console.error('Error al subir imagen:', data.mensaje);
            return null;
        }
    } catch (error) {
        console.error('Error en request de subir imagen:', error);
        return null;
    }
}

function limpiarFormulario() {
    document.getElementById('searchCodigo').value = '';
    document.getElementById('searchNombre').value = '';
    document.getElementById('searchTamano').value = '';
    document.getElementById('searchPrecio').value = '';
    document.getElementById('searchCantidad').value = '';
    document.getElementById('searchStockMinimo').value = '10';
    document.getElementById('searchDescripcion').value = '';
    document.getElementById('searchIngredientes').value = '';
    document.getElementById('inputImagen').value = '';
    document.getElementById('imagenPreview').innerHTML = '';

    const codigoInput = document.getElementById('searchCodigo');
    if (codigoInput) codigoInput.readOnly = false;
}

function limpiarYResetear() {
    limpiarFormulario();
    sessionStorage.removeItem('platoEditando');
    modoEdicion = false;
    platoEnEdicion = null;
    restaurarUiRegistro();
    
    // Limpiar parámetros de la URL
    const url = new URL(window.location);
    url.searchParams.delete('editar');
    window.history.replaceState({}, '', url);
}
