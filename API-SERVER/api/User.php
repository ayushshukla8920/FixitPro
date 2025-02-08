<?php 
    require __DIR__ . '/../middlewares/JWT.php';
    $jwt = new JWT();
    header("Content-Type: application/json");
    $secret_key = "ayush8920";
    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        echo json_encode(["error" => "This Method is Not Allowed"]);
        exit;
    }
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $json = file_get_contents("php://input");
        $data = json_decode($json, true);
        if(!isset($data['token'])){
            echo json_encode(["error" => "Unauthorised Access"]);
            exit;
        }
        $payload = $jwt->decodeJWT($data['token']);
        echo json_encode(['user'=>$payload]);
    }
?>