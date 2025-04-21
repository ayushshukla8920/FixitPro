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

$data = json_decode(file_get_contents("php://input"), true);
$token = $data['token'] ?? '';

$jwt = new JWT();
$decoded = $jwt->decodeJWT($token);
if (!$token || isset($decoded['error']) || ($decoded['role'] ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

$first_name = trim($data['first_name'] ?? '');
$last_name = trim($data['last_name'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');
$password = $data['password'] ?? '';

if (!$first_name || !$last_name || !$email || !$phone || !$password) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit;
}

$hashed = password_hash($password, PASSWORD_DEFAULT);

// Check duplicate
$check = $conn->prepare("SELECT * FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$res = $check->get_result();
if ($res->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Technician already exists with this email"]);
    exit;
}
$check->close();

// Insert technician
$stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, 'technician')");
$stmt->bind_param("sssss", $first_name, $last_name, $email, $phone, $hashed);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Technician added successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to add technician"]);
}

$stmt->close();
$conn->close();
