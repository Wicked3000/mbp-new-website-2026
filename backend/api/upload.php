<?php
require __DIR__.'/config/cors.php';
require __DIR__.'/config/auth.php';

// Require auth for uploads
auth_require();

if($_SERVER['REQUEST_METHOD'] !== 'POST'){
  http_response_code(405); echo json_encode(['error'=>'POST only']); exit;
}

if(!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK){
  http_response_code(400); echo json_encode(['error'=>'No file uploaded','code'=>$_FILES['file']['error'] ?? 'missing']); exit;
}

$file = $_FILES['file'];
$maxBytes = 8 * 1024 * 1024; // 8MB
if($file['size'] > $maxBytes){
  http_response_code(400); echo json_encode(['error'=>'File too large, max 8MB']); exit;
}

// SVG is excluded: it can carry <script>, and uploads are served from this
// origin, so accepting it is a stored-XSS route into the admin session.
$allowedExt = ['jpg','jpeg','png','webp','gif','avif'];
$allowedMime = ['image/jpeg','image/png','image/webp','image/gif','image/avif'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = $finfo ? finfo_file($finfo, $file['tmp_name']) : $file['type'];
if($finfo) finfo_close($finfo);

if(!in_array($ext, $allowedExt, true)){
  http_response_code(400); echo json_encode(['error'=>'Invalid file type. Allowed: '.implode(', ',$allowedExt)]); exit;
}
if(!in_array($mime, $allowedMime, true)){
  http_response_code(400); echo json_encode(['error'=>'File contents do not match an allowed image type']); exit;
}

$uploadDir = __DIR__ . '/uploads';
if(!is_dir($uploadDir)){
  mkdir($uploadDir, 0775, true);
}

// sanitize filename
$base = preg_replace('/[^a-zA-Z0-9._-]/','_', pathinfo($file['name'], PATHINFO_FILENAME));
$base = substr($base, 0, 60);
$unique = $base . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
$dest = $uploadDir . '/' . $unique;

if(!move_uploaded_file($file['tmp_name'], $dest)){
  http_response_code(500); echo json_encode(['error'=>'Failed to save file']); exit;
}

// Build public URL - assumes api is at http://localhost/mbp-api
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
// Derive base path from script location: /mbp-api/upload.php -> /mbp-api
$scriptDir = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
$url = $scheme . '://' . $host . $scriptDir . '/uploads/' . $unique;

echo json_encode(['ok'=>true,'url'=>$url,'filename'=>$unique,'path'=>'uploads/'.$unique]);
