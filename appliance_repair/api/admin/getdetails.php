<?php
require_once(__DIR__ . '/../../config/Database.php');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    http_response_code(204);
    exit;
}

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"), true);
$request_id = $data['request_id'] ?? null;

if (!$request_id) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Request ID not provided"]);
    exit;
}

$sql = "SELECT sr.*, 
               CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
               u.phone AS customer_phone,
               u.address AS customer_address
        FROM service_requests sr
        JOIN users u ON sr.user_id = u.user_id
        WHERE sr.request_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $request_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode([
        "status" => "success",
        "data" => $row
    ]);
} else {
    http_response_code(404);
    echo json_encode([
        "status" => "error",
        "message" => "Request not found"
    ]);
}

$conn->close();
