<?php
$pdo = new PDO('mysql:host=localhost;dbname=kings_pizza_db', 'root', '71490956');
$stmt = $pdo->query('SHOW TABLES');
while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
    echo $row[0] . "\n";
}
