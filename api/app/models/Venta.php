<?php
class Venta
{
    public function registrar(array $data): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('CALL pa_registrar_venta(:idCliente, :tipoPago, :subTotal, :descuento, :total, :idUsuario, :codCaja, :observaciones, :detalles)');

        $stmt->bindValue(':idCliente', $data['idCliente'], $data['idCliente'] === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
        $stmt->bindValue(':tipoPago', $data['tipoPago'], PDO::PARAM_STR);
        $stmt->bindValue(':subTotal', $data['subTotal'], PDO::PARAM_STR);
        $stmt->bindValue(':descuento', $data['descuento'], PDO::PARAM_STR);
        $stmt->bindValue(':total', $data['total'], PDO::PARAM_STR);
        $stmt->bindValue(':idUsuario', $data['idUsuario'], PDO::PARAM_INT);
        $stmt->bindValue(':codCaja', $data['codCaja'], $data['codCaja'] === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindValue(':observaciones', $data['observaciones'], $data['observaciones'] === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindValue(':detalles', json_encode($data['detalles'], JSON_UNESCAPED_UNICODE), PDO::PARAM_STR);

        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
        while ($stmt->nextRowset()) { /* limpiar más resultsets */ }
        return $result;
    }
}
