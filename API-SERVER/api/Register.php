<?php
    require __DIR__ . '/../middlewares/JWT.php';
    require __DIR__ . '/../controllers/RegisterController.php';
    $register = new RegisterController();
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
        $required_fields = ["full_name", "email", "phone", "password", "role", "address"];
        foreach ($required_fields as $field) {
            if (!isset($data[$field])) {
                echo json_encode(["error" => "$field is Required !!"]);
                exit;
            }
        }
        if(!($data['role']=='customer')){
            echo json_encode(["error"=>"This role is not allowed.."]);
            exit;
        }
        $password = password_hash($data['password'], PASSWORD_BCRYPT);
        $response = $register->Register(
            $data['full_name'],
            $data['email'],
            $data['phone'],
            $password,
            $data['role'],
            $data['address']
        );
        if(!isset($response['error'])){
            $payload = [
                "email" => $data['email'],
            ];
            $token = $jwt->createJWT($payload);
            echo json_encode([
                "message" => "Registration Successful",
                "token" => $token
            ]);
        }
        else{
            echo json_encode([ 'error'=>$response['error']]);
        }
    }
?>
