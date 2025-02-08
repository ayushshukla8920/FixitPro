<?php
    require_once __DIR__ . '/../config/Database.php';
    class LoginController {
        private $conn;
        public function __construct() {
            $database = new Database();
            $this->conn = $database->getConnection();
        }
        public function Login($email, $password) {
            $sql = "SELECT email,password from users where email = :email";
            try {
                $stmt = $this->conn->prepare($sql);
                $stmt->bindParam(":email", $email);
                $stmt->execute();
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!$user) {
                    return ["error" => "User not found"];
                }
                if (!password_verify($password, $user['password'])) {
                    return ["error" => "Invalid password"];
                }
                return ["message" => "Login successful"];
            } catch (PDOException $e) {
                return ["error" => "Error inserting data: " . $e->getMessage()];
            }
        }
    }
?>
