<?php
$pdo = new PDO('mysql:host=localhost;dbname=kings_pizza_db', 'root', '71490956');
$stmt = $pdo->query('DESC suministros');
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo json_encode($row) . "\n";
}
