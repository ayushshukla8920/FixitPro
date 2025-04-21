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

if (!$token) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Token required"]);
    exit;
}

$jwt = new JWT();
$decoded = $jwt->decodeJWT($token);
if (isset($decoded['error']) || ($decoded['role'] ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Access denied"]);
    exit;
}

$stats = [];
$queries = [
    'total_requests' => "SELECT COUNT(*) as count FROM service_requests",
    'pending_requests' => "SELECT COUNT(*) as count FROM service_requests WHERE status = 'pending'",
    'in_progress_requests' => "SELECT COUNT(*) as count FROM service_requests WHERE status = 'in_progress' or status = 'assigned'",
    'completed_requests' => "SELECT COUNT(*) as count FROM service_requests WHERE status = 'completed'",
    'total_customers' => "SELECT COUNT(*) as count FROM users WHERE role = 'customer'",
    'total_technicians' => "SELECT COUNT(*) as count FROM users WHERE role = 'technician'",
    'recent_requests' => "SELECT sr.request_id, sr.status, sr.created_at, u.first_name as customer_name 
                          FROM service_requests sr 
                          JOIN users u ON sr.user_id = u.user_id 
                          ORDER BY sr.created_at DESC LIMIT 5"
];

foreach ($queries as $key => $sql) {
    $result = $conn->query($sql);
    if ($key === 'recent_requests') {
        $stats[$key] = $result->fetch_all(MYSQLI_ASSOC);
    } else {
        $stats[$key] = (int) $result->fetch_assoc()['count'];
    }
}

echo json_encode(["status" => "success", "data" => $stats]);
