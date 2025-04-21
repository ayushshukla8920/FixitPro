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
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST");

require_once(__DIR__ . '/../../middlewares/JWT.php');
require_once(__DIR__ . '/../../config/Database.php');

// Parse input
$data = json_decode(file_get_contents("php://input"), true);
$token = $data['token'] ?? '';

if (!$token) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Token not provided"]);
    exit;
}

// Decode JWT
$jwt = new JWT();
$decoded = $jwt->decodeJWT($token);
if (isset($decoded['error']) || ($decoded['role'] ?? '') !== 'technician') {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Unauthorized access"]);
    exit;
}

$email = $decoded['email'] ?? '';
if (!$email) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Email missing in token"]);
    exit;
}

// Get user_id using email
$stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
if (!$result || $result->num_rows !== 1) {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Technician not found"]);
    exit;
}
$technician = $result->fetch_assoc();
$technician_id = $technician['user_id'];
$stmt->close();

// Fetch assignments
$sql = "SELECT sr.request_id, sr.issue_description, sr.priority, sr.status,
               sr.scheduled_date AS assigned_at, sr.completed_date AS completed_at,
               CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
               u.phone AS customer_phone,
               sr.appliance_type AS appliance_name,
               sr.brand AS appliance_type,
               sr.request_id AS assignment_id
        FROM service_requests sr
        JOIN users u ON sr.user_id = u.user_id
        WHERE sr.technician_id = ?
        ORDER BY 
            CASE 
                WHEN sr.status = 'pending' THEN 1
                WHEN sr.status = 'assigned' AND sr.priority = 'high' THEN 2
                WHEN sr.status = 'assigned' AND sr.priority = 'medium' THEN 3
                WHEN sr.status = 'assigned' AND sr.priority = 'low' THEN 4
                ELSE 5
            END,
            sr.scheduled_date DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $technician_id);
$stmt->execute();
$result = $stmt->get_result();

$assignments = [];
while ($row = $result->fetch_assoc()) {
    $assignments[] = $row;
}

echo json_encode(["status" => "success", "assignments" => $assignments]);

$stmt->close();
$conn->close();
