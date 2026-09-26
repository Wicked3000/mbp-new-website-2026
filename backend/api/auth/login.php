<?php
require_once __DIR__.'/../config/cors.php';
require_once __DIR__.'/../helpers.php';
require_once __DIR__.'/../config/database.php';
require_once __DIR__.'/../config/auth.php';

if($_SERVER['REQUEST_METHOD']!=='POST') respond(['error'=>'Method not allowed'],405);

// Credential stuffing guard: 10 attempts per IP per 15 minutes.
rate_limit(10, 'login', 'Too many login attempts, please try again later');

$in=json_input();
$username=trim($in['username']??'');
$password=$in['password']??'';
if(!$username||!$password) respond(['error'=>'Username and password required'],400);
if(strlen($password)>512) respond(['error'=>'Invalid credentials'],401); // bcrypt only reads 72 bytes

$pdo=(new Database())->connect();
$user=q($pdo,"SELECT * FROM users WHERE username=? OR email=? LIMIT 1",[$username,$username])->fetch();

$hash=$user['password_hash']??'$2y$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin';
$ok=password_verify((string)$password, $hash);
if(!$user || !$ok){
  // The seed ships with no password, so the operator gets an actionable message
  // instead of a generic rejection. Production hides the hint.
  if($user && empty($user['password_hash'])){
    http_response_code(401);
    respond(['error'=> is_production()
      ? 'Invalid credentials'
      : 'This account has no password yet. Run: npm run admin:password -- '.$user['username'].' \'a long unique passphrase\'']);
  }
  respond(['error'=>'Invalid credentials'],401);
}

respond(['token'=>token_for($user),'user'=>user_public($user)]);
