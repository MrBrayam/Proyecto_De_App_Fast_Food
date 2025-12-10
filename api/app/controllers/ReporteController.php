<?php
require_once __DIR__ . '/../core/Controller.php';

class ReporteController extends Controller
{
    public function ventasPorPeriodo(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $periodo = $_GET['periodo'] ?? 'mes'; // 'hoy', 'semana', 'mes'
        $fechaInicio = $_GET['fechaInicio'] ?? '';
        $fechaFin = $_GET['fechaFin'] ?? '';

        try {
            require_once __DIR__ . '/../core/Database.php';
            $db = Database::connection();

            $query = 'SELECT 
                        DATE(v.FechaVenta) as Fecha,
                        dv.Linea as Concepto,
                        SUM(dv.Cantidad) as Cantidad,
                        SUM(dv.Subtotal) as Monto,
                        v.Estado
                    FROM Ventas v
                    INNER JOIN DetalleVenta dv ON v.CodVenta = dv.CodVenta
                    WHERE 1=1';

            $params = [];

            // Aplicar filtro de periodo
            if ($periodo === 'hoy') {
                $query .= ' AND DATE(v.FechaVenta) = CURDATE()';
            } elseif ($periodo === 'semana') {
                $query .= ' AND WEEK(v.FechaVenta) = WEEK(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'mes') {
                $query .= ' AND MONTH(v.FechaVenta) = MONTH(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $query .= ' AND DATE(v.FechaVenta) BETWEEN ? AND ?';
                $params = [$fechaInicio, $fechaFin];
            }

            $query .= ' GROUP BY DATE(v.FechaVenta), dv.Linea, v.Estado
                        ORDER BY DATE(v.FechaVenta) DESC, dv.Linea';

            $stmt = $db->prepare($query);
            $stmt->execute($params);
            $ventasPorProducto = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Obtener resumen general
            $queryResumen = 'SELECT 
                                COUNT(DISTINCT v.CodVenta) as TotalVentas,
                                SUM(v.Total) as TotalMonto,
                                AVG(v.Total) as PromedioVenta,
                                COUNT(DISTINCT v.IdCliente) as ClientesUnicos,
                                SUM(CASE WHEN v.TipoPago = "efectivo" THEN v.Total ELSE 0 END) as VentasEfectivo,
                                SUM(CASE WHEN v.TipoPago = "tarjeta" THEN v.Total ELSE 0 END) as VentasTarjeta,
                                SUM(CASE WHEN v.TipoPago = "yape" THEN v.Total ELSE 0 END) as VentasYape,
                                SUM(CASE WHEN v.TipoPago = "plin" THEN v.Total ELSE 0 END) as VentasPlin
                            FROM Ventas v
                            WHERE v.Estado = "pagado"';

            if ($periodo === 'hoy') {
                $queryResumen .= ' AND DATE(v.FechaVenta) = CURDATE()';
            } elseif ($periodo === 'semana') {
                $queryResumen .= ' AND WEEK(v.FechaVenta) = WEEK(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'mes') {
                $queryResumen .= ' AND MONTH(v.FechaVenta) = MONTH(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $queryResumen .= ' AND DATE(v.FechaVenta) BETWEEN ? AND ?';
            }

            $stmtResumen = $db->prepare($queryResumen);
            if ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $stmtResumen->execute([$fechaInicio, $fechaFin]);
            } else {
                $stmtResumen->execute();
            }
            $resumen = $stmtResumen->fetch(PDO::FETCH_ASSOC);

            // Obtener productos más vendidos
            $queryProductos = 'SELECT 
                                dv.Linea as Concepto,
                                SUM(dv.Cantidad) as Cantidad,
                                SUM(dv.Subtotal) as Monto
                            FROM DetalleVenta dv
                            INNER JOIN Ventas v ON dv.CodVenta = v.CodVenta
                            WHERE v.Estado = "pagado"';

            if ($periodo === 'hoy') {
                $queryProductos .= ' AND DATE(v.FechaVenta) = CURDATE()';
            } elseif ($periodo === 'semana') {
                $queryProductos .= ' AND WEEK(v.FechaVenta) = WEEK(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'mes') {
                $queryProductos .= ' AND MONTH(v.FechaVenta) = MONTH(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $queryProductos .= ' AND DATE(v.FechaVenta) BETWEEN ? AND ?';
            }

            $queryProductos .= ' GROUP BY dv.Linea
                                ORDER BY Cantidad DESC LIMIT 10';

            $stmtProductos = $db->prepare($queryProductos);
            if ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $stmtProductos->execute([$fechaInicio, $fechaFin]);
            } else {
                $stmtProductos->execute();
            }
            $productosMasVendidos = $stmtProductos->fetchAll(PDO::FETCH_ASSOC);

            $this->json([
                'exito' => true,
                'periodo' => $periodo,
                'resumen' => $resumen,
                'ventasPorProducto' => $ventasPorProducto,
                'productosMasVendidos' => $productosMasVendidos,
                'total' => count($ventasPorProducto)
            ], 200);

        } catch (Exception $e) {
            error_log('Error en ReporteController::ventasPorPeriodo: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al generar reporte', 'error' => $e->getMessage()], 500);
        }
    }

    public function ventasPorMetodoPago(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $periodo = $_GET['periodo'] ?? 'mes';
        $fechaInicio = $_GET['fechaInicio'] ?? '';
        $fechaFin = $_GET['fechaFin'] ?? '';

        try {
            require_once __DIR__ . '/../core/Database.php';
            $db = Database::connection();

            $query = 'SELECT 
                        v.TipoPago,
                        COUNT(v.CodVenta) as CantidadVentas,
                        SUM(v.Total) as TotalMonto,
                        AVG(v.Total) as PromedioVenta
                    FROM Ventas v
                    WHERE v.Estado = "pagado"';

            $params = [];

            if ($periodo === 'hoy') {
                $query .= ' AND DATE(v.FechaVenta) = CURDATE()';
            } elseif ($periodo === 'semana') {
                $query .= ' AND WEEK(v.FechaVenta) = WEEK(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'mes') {
                $query .= ' AND MONTH(v.FechaVenta) = MONTH(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $query .= ' AND DATE(v.FechaVenta) BETWEEN ? AND ?';
                $params = [$fechaInicio, $fechaFin];
            }

            $query .= ' GROUP BY v.TipoPago
                        ORDER BY TotalMonto DESC';

            $stmt = $db->prepare($query);
            $stmt->execute($params);
            $ventasPorMetodo = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->json([
                'exito' => true,
                'ventasPorMetodoPago' => $ventasPorMetodo
            ], 200);

        } catch (Exception $e) {
            error_log('Error en ReporteController::ventasPorMetodoPago: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al generar reporte', 'error' => $e->getMessage()], 500);
        }
    }

    public function tendenciaVentas(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $dias = (int)($_GET['dias'] ?? 30);

        try {
            require_once __DIR__ . '/../core/Database.php';
            $db = Database::connection();

            $query = 'SELECT 
                        DATE(v.FechaVenta) as Fecha,
                        COUNT(v.CodVenta) as CantidadVentas,
                        SUM(v.Total) as TotalMonto,
                        AVG(v.Total) as PromedioVenta
                    FROM Ventas v
                    WHERE v.Estado = "pagado"
                    AND DATE(v.FechaVenta) >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
                    GROUP BY DATE(v.FechaVenta)
                    ORDER BY Fecha DESC';

            $stmt = $db->prepare($query);
            $stmt->execute([$dias]);
            $tendencia = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->json([
                'exito' => true,
                'tendenciaVentas' => array_reverse($tendencia)
            ], 200);

        } catch (Exception $e) {
            error_log('Error en ReporteController::tendenciaVentas: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al generar reporte', 'error' => $e->getMessage()], 500);
        }
    }

    // ============================================
    // REPORTES DE COMPRAS
    // ============================================

    public function comprasPorPeriodo(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $periodo = $_GET['periodo'] ?? 'mes';
        $fechaInicio = $_GET['fechaInicio'] ?? '';
        $fechaFin = $_GET['fechaFin'] ?? '';

        try {
            require_once __DIR__ . '/../core/Database.php';
            $db = Database::connection();

            $query = 'SELECT 
                        DATE(c.FechaCompra) as Fecha,
                        dc.Descripcion as Concepto,
                        SUM(dc.Cantidad) as Cantidad,
                        SUM(dc.Total) as Monto,
                        c.Estado
                    FROM Compras c
                    INNER JOIN DetalleCompra dc ON c.IdCompra = dc.IdCompra
                    WHERE 1=1';

            $params = [];

            // Aplicar filtro de periodo
            if ($periodo === 'hoy') {
                $query .= ' AND DATE(c.FechaCompra) = CURDATE()';
            } elseif ($periodo === 'semana') {
                $query .= ' AND WEEK(c.FechaCompra) = WEEK(CURDATE()) AND YEAR(c.FechaCompra) = YEAR(CURDATE())';
            } elseif ($periodo === 'mes') {
                $query .= ' AND MONTH(c.FechaCompra) = MONTH(CURDATE()) AND YEAR(c.FechaCompra) = YEAR(CURDATE())';
            } elseif ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $query .= ' AND DATE(c.FechaCompra) BETWEEN ? AND ?';
                $params = [$fechaInicio, $fechaFin];
            }

            $query .= ' GROUP BY DATE(c.FechaCompra), dc.Descripcion, c.Estado
                        ORDER BY DATE(c.FechaCompra) DESC, dc.Descripcion';

            $stmt = $db->prepare($query);
            $stmt->execute($params);
            $comprasPorProducto = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Obtener resumen general
            $queryResumen = 'SELECT 
                                COUNT(DISTINCT c.IdCompra) as TotalCompras,
                                SUM(c.Total) as TotalMonto,
                                AVG(c.Total) as PromedioCompra,
                                COUNT(DISTINCT c.CodProveedor) as ProveedoresUnicos,
                                MIN(DATE(c.FechaCompra)) as FechaInicio,
                                MAX(DATE(c.FechaCompra)) as FechaFin
                            FROM Compras c
                            WHERE 1=1';

            if ($periodo === 'hoy') {
                $queryResumen .= ' AND DATE(c.FechaCompra) = CURDATE()';
            } elseif ($periodo === 'semana') {
                $queryResumen .= ' AND WEEK(c.FechaCompra) = WEEK(CURDATE()) AND YEAR(c.FechaCompra) = YEAR(CURDATE())';
            } elseif ($periodo === 'mes') {
                $queryResumen .= ' AND MONTH(c.FechaCompra) = MONTH(CURDATE()) AND YEAR(c.FechaCompra) = YEAR(CURDATE())';
            } elseif ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $queryResumen .= ' AND DATE(c.FechaCompra) BETWEEN ? AND ?';
            }

            $stmtResumen = $db->prepare($queryResumen);
            if ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $stmtResumen->execute([$fechaInicio, $fechaFin]);
            } else {
                $stmtResumen->execute();
            }
            $resumen = $stmtResumen->fetch(PDO::FETCH_ASSOC);
            
            // Calcular días analizados
            $diasAnalizados = 1;
            if ($resumen['FechaInicio'] && $resumen['FechaFin']) {
                $inicio = new DateTime($resumen['FechaInicio']);
                $fin = new DateTime($resumen['FechaFin']);
                $diasAnalizados = max(1, $inicio->diff($fin)->days + 1);
            }
            $resumen['DiasAnalizados'] = $diasAnalizados;
            $resumen['PromedioDiario'] = $resumen['TotalMonto'] ? $resumen['TotalMonto'] / $diasAnalizados : 0;

            // Obtener productos más comprados
            $queryProductos = 'SELECT 
                                dc.Descripcion as Concepto,
                                SUM(dc.Cantidad) as Cantidad,
                                SUM(dc.Total) as Monto
                            FROM DetalleCompra dc
                            INNER JOIN Compras c ON dc.IdCompra = c.IdCompra
                            WHERE 1=1';

            if ($periodo === 'hoy') {
                $queryProductos .= ' AND DATE(c.FechaCompra) = CURDATE()';
            } elseif ($periodo === 'semana') {
                $queryProductos .= ' AND WEEK(c.FechaCompra) = WEEK(CURDATE()) AND YEAR(c.FechaCompra) = YEAR(CURDATE())';
            } elseif ($periodo === 'mes') {
                $queryProductos .= ' AND MONTH(c.FechaCompra) = MONTH(CURDATE()) AND YEAR(c.FechaCompra) = YEAR(CURDATE())';
            } elseif ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $queryProductos .= ' AND DATE(c.FechaCompra) BETWEEN ? AND ?';
            }

            $queryProductos .= ' GROUP BY dc.Descripcion
                                ORDER BY Cantidad DESC LIMIT 10';

            $stmtProductos = $db->prepare($queryProductos);
            if ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $stmtProductos->execute([$fechaInicio, $fechaFin]);
            } else {
                $stmtProductos->execute();
            }
            $productosMasComprados = $stmtProductos->fetchAll(PDO::FETCH_ASSOC);

            $this->json([
                'exito' => true,
                'periodo' => $periodo,
                'resumen' => $resumen,
                'comprasPorProducto' => $comprasPorProducto,
                'productosMasComprados' => $productosMasComprados,
                'total' => count($comprasPorProducto)
            ], 200);

        } catch (Exception $e) {
            error_log('Error en ReporteController::comprasPorPeriodo: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al generar reporte', 'error' => $e->getMessage()], 500);
        }
    }

    public function comprasPorProveedor(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $periodo = $_GET['periodo'] ?? 'mes';
        $fechaInicio = $_GET['fechaInicio'] ?? '';
        $fechaFin = $_GET['fechaFin'] ?? '';

            try {
                require_once __DIR__ . '/../core/Database.php';
                $db = Database::connection();

                $query = 'SELECT 
                            pr.RazonSocial as NombreProveedor,
                            COUNT(DISTINCT c.IdCompra) as CantidadCompras,
                            SUM(c.Total) as TotalMonto,
                            AVG(c.Total) as PromedioCompra
                        FROM Compras c
                        INNER JOIN Proveedores pr ON c.CodProveedor = pr.CodProveedor
                        WHERE 1=1';

                $params = [];

                if ($periodo === 'hoy') {
                    $query .= ' AND DATE(c.FechaCompra) = CURDATE()';
                } elseif ($periodo === 'semana') {
                    $query .= ' AND WEEK(c.FechaCompra) = WEEK(CURDATE()) AND YEAR(c.FechaCompra) = YEAR(CURDATE())';
                } elseif ($periodo === 'mes') {
                    $query .= ' AND MONTH(c.FechaCompra) = MONTH(CURDATE()) AND YEAR(c.FechaCompra) = YEAR(CURDATE())';
                } elseif ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                    $query .= ' AND DATE(c.FechaCompra) BETWEEN ? AND ?';
                    $params = [$fechaInicio, $fechaFin];
                }

                $query .= ' GROUP BY pr.CodProveedor, pr.RazonSocial
                            ORDER BY TotalMonto DESC';

                $stmt = $db->prepare($query);
                $stmt->execute($params);
                $comprasPorProveedor = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->json([
                'exito' => true,
                'comprasPorProveedor' => $comprasPorProveedor
            ], 200);

        } catch (Exception $e) {
            error_log('Error en ReporteController::comprasPorProveedor: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al generar reporte', 'error' => $e->getMessage()], 500);
        }
    }

    public function estadoCompras(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $periodo = $_GET['periodo'] ?? 'mes';
        $fechaInicio = $_GET['fechaInicio'] ?? '';
        $fechaFin = $_GET['fechaFin'] ?? '';

        try {
            require_once __DIR__ . '/../core/Database.php';
            $db = Database::connection();

            $query = 'SELECT 
                        c.Estado,
                        COUNT(DISTINCT c.IdCompra) as CantidadCompras,
                        SUM(c.Total) as TotalMonto,
                        AVG(c.Total) as PromedioCompra
                    FROM Compras c
                    WHERE 1=1';

            $params = [];

            if ($periodo === 'hoy') {
                $query .= ' AND DATE(c.FechaCompra) = CURDATE()';
            } elseif ($periodo === 'semana') {
                $query .= ' AND WEEK(c.FechaCompra) = WEEK(CURDATE()) AND YEAR(c.FechaCompra) = YEAR(CURDATE())';
            } elseif ($periodo === 'mes') {
                $query .= ' AND MONTH(c.FechaCompra) = MONTH(CURDATE()) AND YEAR(c.FechaCompra) = YEAR(CURDATE())';
            } elseif ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $query .= ' AND DATE(c.FechaCompra) BETWEEN ? AND ?';
                $params = [$fechaInicio, $fechaFin];
            }

            $query .= ' GROUP BY c.Estado
                        ORDER BY TotalMonto DESC';

            $stmt = $db->prepare($query);
            $stmt->execute($params);
            $estadoCompras = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->json([
                'exito' => true,
                'estadoCompras' => $estadoCompras
            ], 200);

        } catch (Exception $e) {
            error_log('Error en ReporteController::estadoCompras: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al generar reporte', 'error' => $e->getMessage()], 500);
        }
    }

    // ============================================
    // REPORTES DE INVENTARIO
    // ============================================

    public function inventarioPorCategoria(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        try {
            require_once __DIR__ . '/../core/Database.php';
            $db = Database::connection();

            // Resumen general
            $queryResumen = 'SELECT 
                                COUNT(*) as TotalProductos,
                                SUM(Stock) as StockTotal,
                                SUM(Stock * Precio) as ValorInventario,
                                SUM(CASE WHEN Stock <= StockMinimo THEN 1 ELSE 0 END) as ProductosBajoStock,
                                SUM(CASE WHEN Estado = "agotado" THEN 1 ELSE 0 END) as ProductosAgotados
                            FROM Productos';
            
            $stmtResumen = $db->prepare($queryResumen);
            $stmtResumen->execute();
            $resumen = $stmtResumen->fetch(PDO::FETCH_ASSOC);

            // Productos por categoría
            $queryCategoria = 'SELECT 
                                Categoria,
                                COUNT(*) as Cantidad,
                                SUM(Stock) as StockTotal,
                                SUM(Stock * Precio) as ValorTotal
                            FROM Productos
                            GROUP BY Categoria
                            ORDER BY ValorTotal DESC';
            
            $stmtCategoria = $db->prepare($queryCategoria);
            $stmtCategoria->execute();
            $productosPorCategoria = $stmtCategoria->fetchAll(PDO::FETCH_ASSOC);

            // Productos con bajo stock
            $queryBajoStock = 'SELECT 
                                NombreProducto,
                                Categoria,
                                Stock,
                                StockMinimo,
                                Precio,
                                Estado
                            FROM Productos
                            WHERE Stock <= StockMinimo
                            ORDER BY Stock ASC
                            LIMIT 10';
            
            $stmtBajoStock = $db->prepare($queryBajoStock);
            $stmtBajoStock->execute();
            $productosBajoStock = $stmtBajoStock->fetchAll(PDO::FETCH_ASSOC);

            // Productos más vendidos (top 10)
            $queryTopProductos = 'SELECT 
                                    p.NombreProducto,
                                    p.Categoria,
                                    p.Stock,
                                    SUM(dv.Cantidad) as TotalVendido,
                                    SUM(dv.Subtotal) as Ingresos
                                FROM Productos p
                                INNER JOIN DetalleVenta dv ON p.CodProducto = dv.CodProducto
                                INNER JOIN Ventas v ON dv.CodVenta = v.CodVenta
                                WHERE v.Estado = "pagado"
                                GROUP BY p.NombreProducto, p.Categoria, p.Stock
                                ORDER BY TotalVendido DESC
                                LIMIT 10';
            
            $stmtTopProductos = $db->prepare($queryTopProductos);
            $stmtTopProductos->execute();
            $productosTopVendidos = $stmtTopProductos->fetchAll(PDO::FETCH_ASSOC);

            $this->json([
                'exito' => true,
                'resumen' => $resumen,
                'productosPorCategoria' => $productosPorCategoria,
                'productosBajoStock' => $productosBajoStock,
                'productosTopVendidos' => $productosTopVendidos
            ], 200);

        } catch (Exception $e) {
            error_log('Error en ReporteController::inventarioPorCategoria: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al generar reporte', 'error' => $e->getMessage()], 500);
        }
    }

    public function inventarioPorEstado(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        try {
            require_once __DIR__ . '/../core/Database.php';
            $db = Database::connection();

            $query = 'SELECT 
                        Estado,
                        COUNT(*) as Cantidad,
                        SUM(Stock) as StockTotal,
                        SUM(Stock * Precio) as ValorTotal
                    FROM Productos
                    GROUP BY Estado
                    ORDER BY ValorTotal DESC';
            
            $stmt = $db->prepare($query);
            $stmt->execute();
            $inventarioPorEstado = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->json([
                'exito' => true,
                'inventarioPorEstado' => $inventarioPorEstado
            ], 200);

        } catch (Exception $e) {
            error_log('Error en ReporteController::inventarioPorEstado: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al generar reporte', 'error' => $e->getMessage()], 500);
        }
    }

    public function rotacionInventario(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $periodo = $_GET['periodo'] ?? 'mes';

        try {
            require_once __DIR__ . '/../core/Database.php';
            $db = Database::connection();

            $whereClause = '';
            if ($periodo === 'semana') {
                $whereClause = 'AND WEEK(v.FechaVenta) = WEEK(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'mes') {
                $whereClause = 'AND MONTH(v.FechaVenta) = MONTH(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'trimestre') {
                $whereClause = 'AND QUARTER(v.FechaVenta) = QUARTER(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            }

            $query = "SELECT 
                        p.NombreProducto,
                        p.Categoria,
                        p.Stock as StockActual,
                        COALESCE(SUM(dv.Cantidad), 0) as CantidadVendida,
                        ROUND(COALESCE(SUM(dv.Cantidad), 0) / NULLIF(p.Stock, 0), 2) as IndiceRotacion
                    FROM Productos p
                    LEFT JOIN DetalleVenta dv ON p.NombreProducto = dv.Linea
                    LEFT JOIN Ventas v ON dv.CodVenta = v.CodVenta AND v.Estado = 'pagado' $whereClause
                    GROUP BY p.IdProducto, p.NombreProducto, p.Categoria, p.Stock
                    HAVING CantidadVendida > 0
                    ORDER BY IndiceRotacion DESC
                    LIMIT 15";
            
            $stmt = $db->prepare($query);
            $stmt->execute();
            $rotacionInventario = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->json([
                'exito' => true,
                'rotacionInventario' => $rotacionInventario,
                'periodo' => $periodo
            ], 200);

        } catch (Exception $e) {
            error_log('Error en ReporteController::rotacionInventario: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al generar reporte', 'error' => $e->getMessage()], 500);
        }
    }

    // ============================================
    // REPORTES DE CLIENTES
    // ============================================

    public function clientesPorPeriodo(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $periodo = $_GET['periodo'] ?? 'mes';
        $fechaInicio = $_GET['fechaInicio'] ?? '';
        $fechaFin = $_GET['fechaFin'] ?? '';

        try {
            require_once __DIR__ . '/../core/Database.php';
            $db = Database::connection();

            // Resumen general
            $queryResumen = 'SELECT 
                                COUNT(DISTINCT v.IdCliente) as TotalClientes,
                                COUNT(DISTINCT v.CodVenta) as TotalPedidos,
                                SUM(v.Total) as TotalMonto,
                                AVG(v.Total) as PromedioTicket,
                                MIN(DATE(v.FechaVenta)) as FechaInicio,
                                MAX(DATE(v.FechaVenta)) as FechaFin
                            FROM Ventas v
                            WHERE v.Estado = "pagado" AND v.IdCliente IS NOT NULL';

            $params = [];

            if ($periodo === 'hoy') {
                $queryResumen .= ' AND DATE(v.FechaVenta) = CURDATE()';
            } elseif ($periodo === 'semana') {
                $queryResumen .= ' AND WEEK(v.FechaVenta) = WEEK(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'mes') {
                $queryResumen .= ' AND MONTH(v.FechaVenta) = MONTH(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $queryResumen .= ' AND DATE(v.FechaVenta) BETWEEN ? AND ?';
                $params = [$fechaInicio, $fechaFin];
            }

            $stmtResumen = $db->prepare($queryResumen);
            $stmtResumen->execute($params);
            $resumen = $stmtResumen->fetch(PDO::FETCH_ASSOC);

            // Calcular días analizados
            $diasAnalizados = 1;
            if ($resumen['FechaInicio'] && $resumen['FechaFin']) {
                $inicio = new DateTime($resumen['FechaInicio']);
                $fin = new DateTime($resumen['FechaFin']);
                $diasAnalizados = max(1, $inicio->diff($fin)->days + 1);
            }
            $resumen['DiasAnalizados'] = $diasAnalizados;
            $resumen['PromedioPedidosDiario'] = $resumen['TotalPedidos'] ? round($resumen['TotalPedidos'] / $diasAnalizados, 2) : 0;

            // Clientes que más gastan
            $queryTopClientes = 'SELECT 
                                    c.IdCliente,
                                    c.Nombres,
                                    c.Apellidos,
                                    COUNT(v.CodVenta) as TotalPedidos,
                                    SUM(v.Total) as TotalGastado,
                                    AVG(v.Total) as PromedioGasto
                                FROM Clientes c
                                INNER JOIN Ventas v ON c.IdCliente = v.IdCliente
                                WHERE v.Estado = "pagado"';

            $paramsTop = [];
            if ($periodo === 'hoy') {
                $queryTopClientes .= ' AND DATE(v.FechaVenta) = CURDATE()';
            } elseif ($periodo === 'semana') {
                $queryTopClientes .= ' AND WEEK(v.FechaVenta) = WEEK(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'mes') {
                $queryTopClientes .= ' AND MONTH(v.FechaVenta) = MONTH(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $queryTopClientes .= ' AND DATE(v.FechaVenta) BETWEEN ? AND ?';
                $paramsTop = [$fechaInicio, $fechaFin];
            }

            $queryTopClientes .= ' GROUP BY c.IdCliente, c.Nombres, c.Apellidos
                                   ORDER BY TotalGastado DESC
                                   LIMIT 10';

            $stmtTopClientes = $db->prepare($queryTopClientes);
            $stmtTopClientes->execute($paramsTop);
            $clientesTopGasto = $stmtTopClientes->fetchAll(PDO::FETCH_ASSOC);

            $this->json([
                'exito' => true,
                'periodo' => $periodo,
                'resumen' => $resumen,
                'clientesTopGasto' => $clientesTopGasto
            ], 200);

        } catch (Exception $e) {
            error_log('Error en ReporteController::clientesPorPeriodo: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al generar reporte', 'error' => $e->getMessage()], 500);
        }
    }

    public function clientesPorMetodoPago(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $periodo = $_GET['periodo'] ?? 'mes';
        $fechaInicio = $_GET['fechaInicio'] ?? '';
        $fechaFin = $_GET['fechaFin'] ?? '';

        try {
            require_once __DIR__ . '/../core/Database.php';
            $db = Database::connection();

            $query = 'SELECT 
                        v.TipoPago,
                        COUNT(DISTINCT v.CodVenta) as TotalPedidos,
                        SUM(v.Total) as TotalMonto
                    FROM Ventas v
                    WHERE v.Estado = "pagado" AND v.IdCliente IS NOT NULL';

            $params = [];

            if ($periodo === 'hoy') {
                $query .= ' AND DATE(v.FechaVenta) = CURDATE()';
            } elseif ($periodo === 'semana') {
                $query .= ' AND WEEK(v.FechaVenta) = WEEK(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'mes') {
                $query .= ' AND MONTH(v.FechaVenta) = MONTH(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $query .= ' AND DATE(v.FechaVenta) BETWEEN ? AND ?';
                $params = [$fechaInicio, $fechaFin];
            }

            $query .= ' GROUP BY v.TipoPago
                        ORDER BY TotalMonto DESC';

            $stmt = $db->prepare($query);
            $stmt->execute($params);
            $clientesPorMetodoPago = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->json([
                'exito' => true,
                'clientesPorMetodoPago' => $clientesPorMetodoPago
            ], 200);

        } catch (Exception $e) {
            error_log('Error en ReporteController::clientesPorMetodoPago: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al generar reporte', 'error' => $e->getMessage()], 500);
        }
    }

    public function clientesPorTipoPedido(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $periodo = $_GET['periodo'] ?? 'mes';
        $fechaInicio = $_GET['fechaInicio'] ?? '';
        $fechaFin = $_GET['fechaFin'] ?? '';

        try {
            require_once __DIR__ . '/../core/Database.php';
            $db = Database::connection();

            $query = 'SELECT 
                        v.TipoPedido,
                        COUNT(DISTINCT v.CodVenta) as TotalPedidos,
                        SUM(v.Total) as TotalMonto
                    FROM Ventas v
                    WHERE v.Estado = "pagado" AND v.IdCliente IS NOT NULL';

            $params = [];

            if ($periodo === 'hoy') {
                $query .= ' AND DATE(v.FechaVenta) = CURDATE()';
            } elseif ($periodo === 'semana') {
                $query .= ' AND WEEK(v.FechaVenta) = WEEK(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'mes') {
                $query .= ' AND MONTH(v.FechaVenta) = MONTH(CURDATE()) AND YEAR(v.FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $query .= ' AND DATE(v.FechaVenta) BETWEEN ? AND ?';
                $params = [$fechaInicio, $fechaFin];
            }

            $query .= ' GROUP BY v.TipoPedido
                        ORDER BY TotalMonto DESC';

            $stmt = $db->prepare($query);
            $stmt->execute($params);
            $clientesPorTipoPedido = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->json([
                'exito' => true,
                'clientesPorTipoPedido' => $clientesPorTipoPedido
            ], 200);

        } catch (Exception $e) {
            error_log('Error en ReporteController::clientesPorTipoPedido: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al generar reporte', 'error' => $e->getMessage()], 500);
        }
    }

    // ============================================
    // REPORTES FINANCIEROS
    // ============================================

    public function resumenFinanciero(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $periodo = $_GET['periodo'] ?? 'mes';
        $fechaInicio = $_GET['fechaInicio'] ?? '';
        $fechaFin = $_GET['fechaFin'] ?? '';

        try {
            require_once __DIR__ . '/../core/Database.php';
            $db = Database::connection();

            // Construir condición de fecha para ventas
            $whereVentas = '1=1';
            $paramsVentas = [];

            if ($periodo === 'hoy') {
                $whereVentas = 'DATE(FechaVenta) = CURDATE()';
            } elseif ($periodo === 'semana') {
                $whereVentas = 'WEEK(FechaVenta) = WEEK(CURDATE()) AND YEAR(FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'mes') {
                $whereVentas = 'MONTH(FechaVenta) = MONTH(CURDATE()) AND YEAR(FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'trimestre') {
                $whereVentas = 'QUARTER(FechaVenta) = QUARTER(CURDATE()) AND YEAR(FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'anio') {
                $whereVentas = 'YEAR(FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $whereVentas = 'DATE(FechaVenta) BETWEEN ? AND ?';
                $paramsVentas = [$fechaInicio, $fechaFin];
            }

            // Total de ingresos (ventas)
            $queryIngresos = "SELECT 
                                COUNT(DISTINCT CodVenta) as TotalVentas,
                                COALESCE(SUM(Total), 0) as TotalIngresos,
                                COALESCE(AVG(Total), 0) as PromedioVenta
                              FROM Ventas 
                              WHERE $whereVentas";
            $stmt = $db->prepare($queryIngresos);
            $stmt->execute($paramsVentas);
            $ingresos = $stmt->fetch(PDO::FETCH_ASSOC);

            // Total de egresos (compras) - construir condición separada
            $whereCompras = '1=1';
            $paramsCompras = [];

            if ($periodo === 'hoy') {
                $whereCompras = 'DATE(FechaCompra) = CURDATE()';
            } elseif ($periodo === 'semana') {
                $whereCompras = 'WEEK(FechaCompra) = WEEK(CURDATE()) AND YEAR(FechaCompra) = YEAR(CURDATE())';
            } elseif ($periodo === 'mes') {
                $whereCompras = 'MONTH(FechaCompra) = MONTH(CURDATE()) AND YEAR(FechaCompra) = YEAR(CURDATE())';
            } elseif ($periodo === 'trimestre') {
                $whereCompras = 'QUARTER(FechaCompra) = QUARTER(CURDATE()) AND YEAR(FechaCompra) = YEAR(CURDATE())';
            } elseif ($periodo === 'anio') {
                $whereCompras = 'YEAR(FechaCompra) = YEAR(CURDATE())';
            } elseif ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $whereCompras = 'DATE(FechaCompra) BETWEEN ? AND ?';
                $paramsCompras = [$fechaInicio, $fechaFin];
            }

            $queryEgresos = "SELECT 
                                COUNT(DISTINCT IdCompra) as TotalCompras,
                                COALESCE(SUM(Total), 0) as TotalEgresos,
                                COALESCE(AVG(Total), 0) as PromedioCompra
                             FROM Compras 
                             WHERE $whereCompras";
            $stmt = $db->prepare($queryEgresos);
            $stmt->execute($paramsCompras);
            $egresos = $stmt->fetch(PDO::FETCH_ASSOC);

            // Calcular utilidad
            $utilidadBruta = $ingresos['TotalIngresos'] - $egresos['TotalEgresos'];
            $margenUtilidad = $ingresos['TotalIngresos'] > 0 
                ? ($utilidadBruta / $ingresos['TotalIngresos']) * 100 
                : 0;

            // Calcular días analizados
            $queryFechas = "SELECT 
                                MIN(DATE(FechaVenta)) as FechaMin, 
                                MAX(DATE(FechaVenta)) as FechaMax 
                            FROM Ventas 
                            WHERE $whereVentas";
            $stmt = $db->prepare($queryFechas);
            $stmt->execute($paramsVentas);
            $fechas = $stmt->fetch(PDO::FETCH_ASSOC);
            
            $diasAnalizados = 1;
            if ($fechas['FechaMin'] && $fechas['FechaMax']) {
                $fechaInicial = new DateTime($fechas['FechaMin']);
                $fechaFinal = new DateTime($fechas['FechaMax']);
                $diasAnalizados = $fechaInicial->diff($fechaFinal)->days + 1;
            }

            // Top 5 categorías que generan más ingresos
            $queryCategoriasIngresos = "SELECT 
                                            COALESCE(p.Categoria, 'Sin Categoría') as Categoria,
                                            COALESCE(SUM(dv.Subtotal), 0) as TotalIngresos,
                                            COUNT(DISTINCT v.CodVenta) as NumeroVentas
                                        FROM DetalleVenta dv
                                        INNER JOIN Ventas v ON dv.CodVenta = v.CodVenta
                                        LEFT JOIN Productos p ON p.NombreProducto = dv.Linea
                                        WHERE $whereVentas
                                        GROUP BY COALESCE(p.Categoria, 'Sin Categoría')
                                        ORDER BY TotalIngresos DESC
                                        LIMIT 5";
            $stmt = $db->prepare($queryCategoriasIngresos);
            $stmt->execute($paramsVentas);
            $categoriasIngresos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->json([
                'exito' => true,
                'resumen' => [
                    'TotalIngresos' => floatval($ingresos['TotalIngresos']),
                    'TotalEgresos' => floatval($egresos['TotalEgresos']),
                    'UtilidadBruta' => floatval($utilidadBruta),
                    'MargenUtilidad' => floatval($margenUtilidad),
                    'TotalVentas' => intval($ingresos['TotalVentas']),
                    'TotalCompras' => intval($egresos['TotalCompras']),
                    'PromedioVenta' => floatval($ingresos['PromedioVenta']),
                    'PromedioCompra' => floatval($egresos['PromedioCompra']),
                    'DiasAnalizados' => $diasAnalizados
                ],
                'categoriasIngresos' => $categoriasIngresos
            ], 200);

        } catch (Exception $e) {
            error_log('Error en ReporteController::resumenFinanciero: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al generar reporte', 'error' => $e->getMessage()], 500);
        }
    }

    public function flujoCaja(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $periodo = $_GET['periodo'] ?? 'mes';
        $fechaInicio = $_GET['fechaInicio'] ?? '';
        $fechaFin = $_GET['fechaFin'] ?? '';

        try {
            require_once __DIR__ . '/../core/Database.php';
            $db = Database::connection();

            $whereClause = '1=1';
            $params = [];

            if ($periodo === 'hoy') {
                $whereClause = 'DATE(FechaVenta) = CURDATE()';
            } elseif ($periodo === 'semana') {
                $whereClause = 'WEEK(FechaVenta) = WEEK(CURDATE()) AND YEAR(FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'mes') {
                $whereClause = 'MONTH(FechaVenta) = MONTH(CURDATE()) AND YEAR(FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'trimestre') {
                $whereClause = 'QUARTER(FechaVenta) = QUARTER(CURDATE()) AND YEAR(FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'anio') {
                $whereClause = 'YEAR(FechaVenta) = YEAR(CURDATE())';
            } elseif ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $whereClause = 'DATE(FechaVenta) BETWEEN ? AND ?';
                $params = [$fechaInicio, $fechaFin];
            }

            // Flujo diario: ingresos y egresos por día
            $queryFlujo = "SELECT 
                                Fecha,
                                SUM(Ingresos) as Ingresos,
                                SUM(Egresos) as Egresos,
                                SUM(Ingresos - Egresos) as FlujoDiario
                           FROM (
                                SELECT 
                                    DATE(FechaVenta) as Fecha,
                                    COALESCE(SUM(Total), 0) as Ingresos,
                                    0 as Egresos
                                FROM Ventas
                                WHERE $whereClause
                                GROUP BY DATE(FechaVenta)
                                
                                UNION ALL
                                
                                SELECT 
                                    DATE(FechaCompra) as Fecha,
                                    0 as Ingresos,
                                    COALESCE(SUM(Total), 0) as Egresos
                                FROM Compras
                                WHERE " . str_replace('FechaVenta', 'FechaCompra', $whereClause) . "
                                GROUP BY DATE(FechaCompra)
                           ) as flujo
                           GROUP BY Fecha
                           ORDER BY Fecha DESC
                           LIMIT 30";
            
            $stmt = $db->prepare($queryFlujo);
            $stmt->execute(array_merge($params, $params));
            $flujoDiario = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Flujo acumulado
            $saldoAcumulado = 0;
            foreach ($flujoDiario as &$dia) {
                $saldoAcumulado += floatval($dia['FlujoDiario']);
                $dia['SaldoAcumulado'] = $saldoAcumulado;
                $dia['Ingresos'] = floatval($dia['Ingresos']);
                $dia['Egresos'] = floatval($dia['Egresos']);
                $dia['FlujoDiario'] = floatval($dia['FlujoDiario']);
            }

            $this->json([
                'exito' => true,
                'flujoCaja' => array_reverse($flujoDiario) // Invertir para mostrar cronológicamente
            ], 200);

        } catch (Exception $e) {
            error_log('Error en ReporteController::flujoCaja: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al generar reporte', 'error' => $e->getMessage()], 500);
        }
    }

    public function gastosOperacionales(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['exito' => false, 'mensaje' => 'Método no permitido'], 405);
            return;
        }

        $periodo = $_GET['periodo'] ?? 'mes';
        $fechaInicio = $_GET['fechaInicio'] ?? '';
        $fechaFin = $_GET['fechaFin'] ?? '';

        try {
            require_once __DIR__ . '/../core/Database.php';
            $db = Database::connection();

            $whereClause = '1=1';
            $params = [];

            if ($periodo === 'hoy') {
                $whereClause = 'DATE(FechaCompra) = CURDATE()';
            } elseif ($periodo === 'semana') {
                $whereClause = 'WEEK(FechaCompra) = WEEK(CURDATE()) AND YEAR(FechaCompra) = YEAR(CURDATE())';
            } elseif ($periodo === 'mes') {
                $whereClause = 'MONTH(FechaCompra) = MONTH(CURDATE()) AND YEAR(FechaCompra) = YEAR(CURDATE())';
            } elseif ($periodo === 'trimestre') {
                $whereClause = 'QUARTER(FechaCompra) = QUARTER(CURDATE()) AND YEAR(FechaCompra) = YEAR(CURDATE())';
            } elseif ($periodo === 'anio') {
                $whereClause = 'YEAR(FechaCompra) = YEAR(CURDATE())';
            } elseif ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
                $whereClause = 'DATE(FechaCompra) BETWEEN ? AND ?';
                $params = [$fechaInicio, $fechaFin];
            }

            // Gastos por proveedor
            $queryProveedores = "SELECT 
                                    pr.RazonSocial as NombreProveedor,
                                    COUNT(DISTINCT c.IdCompra) as NumeroCompras,
                                    COALESCE(SUM(c.Total), 0) as TotalGastado,
                                    COALESCE(AVG(c.Total), 0) as PromedioCompra
                                 FROM Compras c
                                 INNER JOIN Proveedores pr ON c.CodProveedor = pr.CodProveedor
                                 WHERE $whereClause
                                 GROUP BY pr.CodProveedor, pr.RazonSocial
                                 ORDER BY TotalGastado DESC";
            $stmt = $db->prepare($queryProveedores);
            $stmt->execute($params);
            $gastosPorProveedor = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Gastos por descripción de productos comprados (los 10 principales)
            $queryCategorias = "SELECT 
                                    dc.Descripcion as Categoria,
                                    COUNT(*) as NumeroCompras,
                                    COALESCE(SUM(dc.Total), 0) as TotalGastado
                                FROM Compras c
                                INNER JOIN DetalleCompra dc ON c.IdCompra = dc.IdCompra
                                WHERE $whereClause AND dc.Descripcion IS NOT NULL AND dc.Descripcion != ''
                                GROUP BY dc.Descripcion
                                ORDER BY TotalGastado DESC
                                LIMIT 10";
            $stmt = $db->prepare($queryCategorias);
            $stmt->execute($params);
            $gastosPorCategoria = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->json([
                'exito' => true,
                'gastosPorProveedor' => $gastosPorProveedor,
                'gastosPorCategoria' => $gastosPorCategoria
            ], 200);

        } catch (Exception $e) {
            error_log('Error en ReporteController::gastosOperacionales: ' . $e->getMessage());
            $this->json(['exito' => false, 'mensaje' => 'Error al generar reporte', 'error' => $e->getMessage()], 500);
        }
    }
}
?>
