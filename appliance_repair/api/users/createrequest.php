<?php
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

require_once(__DIR__ . '/../../middlewares/JWT.php');
require_once(__DIR__ . '/../../config/Database.php');

$data = json_decode(file_get_contents("php://input"), true);

// Extract required fields
$token = $data['token'] ?? '';
$appliance_type = trim($data['appliance_type'] ?? '');
$brand = trim($data['brand'] ?? '');
$model = trim($data['model'] ?? '');
$issue_description = trim($data['issue_description'] ?? '');
$urgency = $data['urgency'] ?? 'medium';

// Validate
if (!$token || !$appliance_type || !$brand || !$model || !$issue_description) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

// Decode JWT
$jwt = new JWT();
$decoded = $jwt->decodeJWT($token);
if (isset($decoded['error'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid token"]);
    exit;
}

$email = $decoded['email'] ?? '';
if (!$email) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid token payload"]);
    exit;
}

// Get user_id from email
$stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();
if (!$res || $res->num_rows !== 1) {
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit;
}
$user = $res->fetch_assoc();
$user_id = $user['user_id'];
$stmt->close();

// Insert into service_requests table
$stmt = $conn->prepare("INSERT INTO service_requests 
  (user_id, appliance_type, brand, model, issue_description, priority, status, created_at) 
  VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())");

$stmt->bind_param("isssss", $user_id, $appliance_type, $brand, $model, $issue_description, $urgency);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Repair request submitted successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to submit request"]);
}

$stmt->close();
$conn->close();
