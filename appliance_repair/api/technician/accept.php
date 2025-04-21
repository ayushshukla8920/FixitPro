<?php
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

// Parse input
$data = json_decode(file_get_contents("php://input"), true);
$token = $data['token'] ?? '';
$request_id = $data['request_id'] ?? null;
$action = strtolower($data['status'] ?? '');

if (!$token || !$request_id || !in_array($action, ['accepted', 'declined', 'completed'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
    exit;
}

// Decode JWT
$jwt = new JWT();
$decoded = $jwt->decodeJWT($token);

if (isset($decoded['error']) || ($decoded['role'] ?? '') !== 'technician') {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

$email = $decoded['email'] ?? '';
if (!$email) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Technician email not found"]);
    exit;
}

// Get technician ID
$stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();

if (!$res || $res->num_rows !== 1) {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Technician not found"]);
    exit;
}

$technician_id = $res->fetch_assoc()['user_id'];
$stmt->close();

// Check if request belongs to technician
$stmt = $conn->prepare("SELECT technician_id FROM service_requests WHERE request_id = ?");
$stmt->bind_param("i", $request_id);
$stmt->execute();
$res = $stmt->get_result();
if (!$res || $res->num_rows !== 1) {
    echo json_encode(["status" => "error", "message" => "Request not found"]);
    exit;
}
$row = $res->fetch_assoc();
if ((int)$row['technician_id'] !== (int)$technician_id) {
    echo json_encode(["status" => "error", "message" => "Not assigned to you"]);
    exit;
}
$stmt->close();

// Perform update
if ($action === 'accepted') {
    $stmt = $conn->prepare("UPDATE service_requests SET status = 'in_progress' WHERE request_id = ?");
    $stmt->bind_param("i", $request_id);
}
else if ($action === 'completed') {
    $stmt = $conn->prepare("UPDATE service_requests SET status = 'completed', completed_date = NOW() WHERE request_id = ?");
    $stmt->bind_param("i", $request_id);
} else {
    // declined
    $stmt = $conn->prepare("UPDATE service_requests SET status = 'pending', technician_id = NULL WHERE request_id = ?");
    $stmt->bind_param("i", $request_id);
}

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Status updated"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to update status"]);
}

$stmt->close();
$conn->close();
