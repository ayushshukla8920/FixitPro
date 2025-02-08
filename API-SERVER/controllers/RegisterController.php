<?php
    require_once __DIR__ . '/../config/Database.php';
    class RegisterController {
        private $conn;
        public function __construct() {
            $database = new Database();
            $this->conn = $database->getConnection();
        }
        public function Register($full_name, $email, $phone, $password, $role, $address) {
            $sql = "INSERT INTO users (full_name, email, phone, password, role, address) 
                    VALUES (:full_name, :email, :phone, :password, :role, :address)";
            try {
                $stmt = $this->conn->prepare($sql);
                $stmt->bindParam(":full_name", $full_name);
                $stmt->bindParam(":email", $email);
                $stmt->bindParam(":phone", $phone);
                $stmt->bindParam(":password", $password);
                $stmt->bindParam(":role", $role);
                $stmt->bindParam(":address", $address);
                $stmt->execute();
                return ["message" => "User registered successfully"];
            } catch (PDOException $e) {
                return ["error" => "Error inserting data: " . $e->getMessage()];
            }
        }
    }
?>
