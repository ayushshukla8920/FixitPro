<?php
require_once(__DIR__ . '/JWT.php');
require_once(__DIR__ . '/../config/Database.php');
function isAdmin($token) {
    $jwt = new JWT();
    $decoded = $jwt->decodeJWT($token);
    if (isset($decoded['error']) || $decoded['role'] !== 'admin') {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Admin access only"]);
        exit;
    }
    return $decoded;
}
