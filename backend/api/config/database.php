<?php
// XAMPP MySQL connection. Credentials default to the local XAMPP install and can
// be overridden with the same environment variables the Node API uses.
class Database {
    private $host;
    private $db;
    private $user;
    private $pass;
    private $charset = "utf8mb4";
    private $pdo = null;

    public function __construct() {
        $this->host = env_or('DB_HOST', 'localhost');
        $this->db   = env_or('DB_NAME', 'mbp_education');
        $this->user = env_or('DB_USER', 'root');
        $this->pass = env_or('DB_PASSWORD', '');
    }

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
            // Credentials and host stay in the log, never in the response.
            error_log('[mbp-api] DB connection failed for ' . $this->user . '@' . $this->host . '/' . $this->db . ': ' . $e->getMessage());
            if (!headers_sent()) { http_response_code(500); header('Content-Type: application/json; charset=utf-8'); }
            echo json_encode(['error' => 'Database unavailable']);
            exit;
        }
    }
}
