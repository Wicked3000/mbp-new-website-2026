<?php
require_once __DIR__.'/config/cors.php';
require_once __DIR__.'/helpers.php';
require_once __DIR__.'/config/database.php';
require_once __DIR__.'/config/auth.php';

// Require auth for uploads
auth_require((new Database())->connect());

if($_SERVER['REQUEST_METHOD'] !== 'POST'){
  respond(['error'=>'POST only'],405);
}

if(!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK){
  http_response_code(400); respond(['error'=>'No file uploaded','code'=>$_FILES['file']['error'] ?? 'missing']);
}

$file = $_FILES['file'];
$maxBytes = 25 * 1024 * 1024; // 25MB, matching the Node API
if($file['size'] > $maxBytes){
  respond(['error'=>'File too large, max 25MB'],400);
}

// SVG is excluded: it can carry <script>, and uploads are served from this
// origin, so accepting it is a stored-XSS route into the admin session.
$allowedExt = ['jpg','jpeg','png','webp','gif','avif','pdf','doc','docx','xls','xlsx','csv','txt'];
$allowedMime = [
  'image/jpeg','image/png','image/webp','image/gif','image/avif',
  'application/pdf','application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel','text/csv','text/plain',
];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = $finfo ? finfo_file($finfo, $file['tmp_name']) : $file['type'];
if($finfo) finfo_close($finfo);

if(!in_array($ext, $allowedExt, true)){
  respond(['error'=>'Invalid file type. Allowed: '.implode(', ',$allowedExt)],400);
}
if(!in_array($mime, $allowedMime, true)){
  respond(['error'=>'File contents do not match an allowed type'],400);
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
  respond(['error'=>'Failed to save file'],500);
}

// Relative URL: building an absolute one from HTTP_HOST lets a caller inject a
// host of their choosing into every stored document link.
$scriptDir = rtrim(str_replace('\\','/',dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');
$url = $scriptDir . '/uploads/' . $unique;

respond(['ok'=>true,'url'=>$url,'filename'=>$unique,'path'=>'uploads/'.$unique]);
