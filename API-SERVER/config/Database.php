<?php
    class Database {
        // private $host = "sql301.infinityfree.com";
        // private $db_name = "if0_38272809_appliance_repair";
        // private $username = "if0_38272809";
        // private $password = "xxxx";
        // public $conn;
        private $host = "127.0.0.1";
        private $db_name = "appliance_repair";
        private $username = "root";
        private $password = "Ayush@8920";
        public function getConnection() {
            $this->conn = null;
            try {
                $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            } catch (PDOException $exception) {
                echo "Database connection error: " . $exception->getMessage();
            }
            return $this->conn;
        }
    }
?>
