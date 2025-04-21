<?php
require_once(__DIR__ . '/../../middlewares/JWT.php');
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

// Parse input
$data = json_decode(file_get_contents("php://input"), true);
$token = $data['token'] ?? '';

if (!$token) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Token not provided"]);
    exit;
}

// Validate token
$jwt = new JWT();
$decoded = $jwt->decodeJWT($token);
if (isset($decoded['error']) || ($decoded['role'] ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

// Fetch all service requests with customer info
$sql = "SELECT sr.request_id, sr.appliance_type, sr.brand, sr.status, sr.created_at,
               CONCAT(u.first_name, ' ', u.last_name) AS customer_name
        FROM service_requests sr
        JOIN users u ON sr.user_id = u.user_id
        ORDER BY sr.created_at DESC";

$result = $conn->query($sql);
$requests = [];

while ($row = $result->fetch_assoc()) {
    $requests[] = $row;
}

echo json_encode([
    "status" => "success",
    "requests" => $requests
]);

$conn->close();
