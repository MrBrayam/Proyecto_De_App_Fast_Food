// Script para actualizar todas las páginas HTML con modo claro
// Este script debe ejecutarse una sola vez

const fs = require('fs');
const path = require('path');

// Configuración
const htmlDir = path.join(__dirname, '..', 'html');
const modoClaroLink = '<link rel="stylesheet" href="../css/modo-claro.css" id="modo-claro-css" disabled>';
const themeManagerScript = '<script src="../js/theme-manager.js"></script>';

// Función para procesar un archivo HTML
function processHtmlFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Verificar si ya tiene el modo claro CSS
        if (!content.includes('modo-claro.css')) {
            // Buscar el último link CSS y agregar después
            const lastCssLink = content.lastIndexOf('</head>');
            if (lastCssLink !== -1) {
                content = content.substring(0, lastCssLink) + 
                         '    ' + modoClaroLink + '\n' + 
                         content.substring(lastCssLink);
                modified = true;
            }
        }
        
        // Verificar si ya tiene el theme manager
        if (!content.includes('theme-manager.js')) {
            // Buscar el cierre del body y agregar antes
            const bodyClose = content.lastIndexOf('</body>');
            if (bodyClose !== -1) {
                content = content.substring(0, bodyClose) + 
                         '    ' + themeManagerScript + '\n' + 
                         content.substring(bodyClose);
                modified = true;
            }
        }
        
        // Guardar si fue modificado
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`Error procesando ${filePath}:`, error.message);
        return false;
    }
}

// Procesar todos los archivos HTML
function processAllHtmlFiles() {
    try {
        const files = fs.readdirSync(htmlDir);
        const htmlFiles = files.filter(file => file.endsWith('.html'));
        
        let modified = 0;
        let alreadyUpdated = 0;
        
        htmlFiles.forEach(file => {
            const filePath = path.join(htmlDir, file);
            console.log(`Procesando: ${file}`);
            
            if (processHtmlFile(filePath)) {
                modified++;
                console.log(`  ✅ Actualizado`);
            } else {
                alreadyUpdated++;
                console.log(`  ⚪ Ya actualizado`);
            }
        });
        
        console.log('\n=== RESUMEN ===');
        console.log(`Total archivos HTML: ${htmlFiles.length}`);
        console.log(`Archivos modificados: ${modified}`);
        console.log(`Ya actualizados: ${alreadyUpdated}`);
        
    } catch (error) {
        console.error('Error leyendo directorio:', error.message);
    }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
    console.log('Iniciando actualización masiva de archivos HTML...\n');
    processAllHtmlFiles();
}

module.exports = { processAllHtmlFiles, processHtmlFile };