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
}
?>
