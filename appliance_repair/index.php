<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
    switch($_GET['url']){
        case '':
            echo "<h1>This is FarmFresh API Service</h1>";
            break;
        case 'api/login':
            require 'api/auth/login.php';
            break;
        case 'api/register':
            require 'api/auth/register.php';
            break;
        case 'api/getuser':
            require 'api/users/getuser.php';
            break;
        case 'api/user/getrequests':
            require 'api/users/getrequests.php';
            break;
        case 'api/user/request':
            require 'api/users/createrequest.php';
            break;
        case 'api/admin/getdashboard':
            require 'api/admin/getdashboard.php';
            break;
        case 'api/admin/technicianlist':
            require 'api/admin/technicianlist.php';
            break;
        case 'api/admin/addtechnician':
            require 'api/admin/addtechnician.php';
            break;
        case 'api/admin/allrequests':
            require 'api/admin/allrequests.php';
            break;
        case 'api/admin/assigntechnician':
            require 'api/admin/assigntechnician.php';
            break;
        case 'api/technician/assignments':
            require 'api/technician/assignments.php';
            break;
        case 'api/technician/accept':
            require 'api/technician/accept.php';
            break;
        case 'api/getdetails':
            require 'api/admin/getdetails.php';
            break;
        default:
            header("HTTP/1.0 404 Not Found");
            echo json_encode(["message" => "Endpoint not found"]);
            break;
    }
?>
