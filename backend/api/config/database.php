<?php
// XAMPP MySQL connection — update credentials if needed
class Database {
    private $host = "localhost";
    private $db = "mbp_education";
    private $user = "root";
    private $pass = "";
    private $charset = "utf8mb4";
    private $pdo = null;

    public function connect() {
        if ($this->pdo) return $this->pdo;
        $dsn = "mysql:host={$this->host};dbname={$this->db};charset={$this->charset}";
        $opts = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        try {
            $this->pdo = new PDO($dsn, $this->user, $this->pass, $opts);
            return $this->pdo;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error"=>"DB connection failed","details"=>$e->getMessage()]);
            exit;
        }
    }
}
