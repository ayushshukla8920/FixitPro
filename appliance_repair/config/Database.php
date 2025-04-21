<?php
$servername = "mysql-97180f4-ayushshukla8920-232a.k.aivencloud.com";
$username = "avnadmin";
$password = "AVNS_NkZmKUxjS0cAXzbrEyx";
$database = "appliance_repair_db";
$port = 19295;
$conn = new mysqli($servername, $username, $password, $database, $port);
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
?>
