<?php
    switch($_GET['url']){
        case '':
            echo "<h1>This is Applicance Management App API</h1>";
            break;
        case 'api/auth/login':
            require 'api/Login.php';
            break;
        case 'api/auth/Register':
            require 'api/Register.php';
            break;
        case 'api/users/me':
            require 'api/User.php';
            break;
        default:
            header("HTTP/1.0 404 Not Found");
            echo json_encode(["message" => "Endpoint not found"]);
            break;
    }
?>
