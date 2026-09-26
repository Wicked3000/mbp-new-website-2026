<?php
// CORS: allow only configured origins. A wildcard cannot be combined with
// credentials, and reflecting an arbitrary Origin would let any site read
// authenticated admin responses, so unknown origins get no CORS grant at all.
$allowed = array_values(array_filter(array_map('trim', explode(
  ',',
  getenv('CORS_ORIGINS') ?: 'http://localhost:8443,http://localhost:5173,http://localhost:3000,http://127.0.0.1:8443,http://127.0.0.1:5173'
))));

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowOrigin = in_array($origin, $allowed, true) ? $origin : '';
if($allowOrigin !== ''){
  header("Access-Control-Allow-Origin: $allowOrigin");
  header("Access-Control-Allow-Credentials: true");
  header('Vary: Origin');
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("Referrer-Policy: strict-origin-when-cross-origin");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
header("Content-Type: application/json; charset=utf-8");
