<?php
// CORS headers - must be set before any output
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Max-Age: 86400");
    http_response_code(204);
    exit;
}

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST");

require_once(__DIR__ . '/../../middlewares/JWT.php');
require_once(__DIR__ . '/../../config/Database.php');

// Input
$data = json_decode(file_get_contents("php://input"), true);
$token = $data['token'] ?? '';
$request_id = $data['request_id'] ?? null;
$technician_id = $data['technician_id'] ?? null;

// Validate token
$jwt = new JWT();
$decoded = $jwt->decodeJWT($token);

if (!$token || isset($decoded['error']) || ($decoded['role'] ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

if (!$request_id || !$technician_id) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing fields"]);
    exit;
}

// ✅ Update technician, status, and scheduled_date
$stmt = $conn->prepare("UPDATE service_requests SET technician_id = ?, status = 'assigned', scheduled_date = NOW() WHERE request_id = ?");
$stmt->bind_param("ii", $technician_id, $request_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Technician assigned and scheduled for today"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to assign"]);
}

$stmt->close();
$conn->close();
