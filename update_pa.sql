DROP PROCEDURE IF EXISTS pa_listar_proveedores;
DELIMITER //
CREATE PROCEDURE pa_listar_proveedores()
BEGIN
    SELECT 
        CodProveedor,
        TipoDoc,
        NumDoc,
        RazonSocial,
        NombreComercial,
        Categoria,
        Estado,
        TipoDoc_Contacto,
        Telefono,
        TelefonoSecundario,
        Email,
        Sitio_Web,
        PersonaContacto,
        Direccion,
        Ciudad,
        Distrito,
        TiempoEntrega,
        MontoMinimo,
        Descuento,
        Nota,
        FechaCreacion,
        FechaActualizacion
    FROM Proveedores
    ORDER BY CodProveedor DESC;
END //
DELIMITER ;
