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
require __DIR__ . '/../../middlewares/JWT.php';
require __DIR__ . '/../../config/Database.php';
$data = json_decode(file_get_contents("php://input"), true);
$full_name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'customer';
$phone = $data['phone'] ?? 'customer';
$address = $data['address'] ?? 'customer';
$name = (explode(" ",$full_name));
$first_name = $name[0];
$last_name = $name[1] || '';
if (!$full_name || !$email || !$password || !$role || !$phone  || !$address) {
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit;
}
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
try {
    $stmt = $conn->prepare("INSERT INTO users ( email, password, role, first_name,last_name, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $email, $hashed_password, $role, $first_name, $last_name, $phone, $address);
    if ($stmt->execute()) {
        $user_id = $stmt->insert_id;
        $jwtInstance = new JWT();
        $payload = [
            "email" => $email,
            "role" => $role,
        ];
        $token = $jwtInstance->createJWT($payload);
        echo json_encode([
            "status" => "success",
            "message" => "User registered successfully",
            "token" => $token
        ]);
    } else {
        if ($stmt->errno === 1062) {
            echo json_encode(["status" => "error", "message" => "Email already exists. Try logging in."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Registration failed."]);
        }
    }
    $stmt->close();
} catch (mysqli_sql_exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
$conn->close();
?>
