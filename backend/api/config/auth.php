<?php
// Self-contained JWT (HS256) so the XAMPP deployment needs no Composer packages.
require_once __DIR__.'/../helpers.php';

const TOKEN_TTL_SECONDS = 86400; // 1 day
const MIN_PASSWORD_LENGTH = 12;

function jwt_secret(){
  $secret = env_or('JWT_SECRET');
  // A published default signing key lets anyone mint admin tokens, so refuse to
  // fall back to one outside development.
  if(!$secret){
    if(is_production()){
      http_response_code(500); respond(['error'=>'JWT_SECRET is not configured']);
    }
    $secret = 'mbp_education_dev_secret_change_me_32chars';
  }
  if(strlen($secret) < 32){
    http_response_code(500); respond(['error'=>'JWT_SECRET must be at least 32 characters']);
  }
  return $secret;
}
function base64url_encode($d){ return rtrim(strtr(base64_encode($d),'+/','-_'),'='); }
function base64url_decode($d){ return base64_decode(strtr($d,'-_','+/')); }
function jwt_sign($payload, $expSec=TOKEN_TTL_SECONDS){
  $header = base64url_encode(json_encode(['alg'=>'HS256','typ'=>'JWT']));
  $payload['exp'] = time()+$expSec;
  $payload['iat'] = time();
  $body = base64url_encode(json_encode($payload));
  $sig = base64url_encode(hash_hmac('sha256', "$header.$body", jwt_secret(), true));
  return "$header.$body.$sig";
}
function jwt_verify($token){
  $parts = explode('.',$token);
  if(count($parts)!==3) return null;
  [$h,$b,$s] = $parts;
  $expect = base64url_encode(hash_hmac('sha256', "$h.$b", jwt_secret(), true));
  if(!hash_equals($expect, $s)) return null;
  $payload = json_decode(base64url_decode($b), true);
  if(!$payload || ($payload['exp']??0) < time()) return null;
  return $payload;
}
function get_auth_header(){
  // Apache may strip Authorization - try multiple sources
  $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
  if(!$hdr && function_exists('apache_request_headers')){
    $headers = apache_request_headers();
    foreach($headers as $k=>$v){ if(strtolower($k)==='authorization'){ $hdr=$v; break; } }
  }
  if(!$hdr && isset($_SERVER['HTTP_X_AUTHORIZATION'])) $hdr = $_SERVER['HTTP_X_AUTHORIZATION'];
  return $hdr;
}

function user_public(array $user): array {
  return [
    'id'       => (int)$user['id'],
    'username' => $user['username'],
    'email'    => $user['email'],
    'role'     => $user['role'],
  ];
}

function token_for(array $user): string {
  $payload = user_public($user);
  $payload['uid'] = $payload['id'];
  if (isset($user['auth_version'])) $payload['ver'] = (int)$user['auth_version'];
  return jwt_sign($payload);
}

// A password change bumps users.auth_version, so tokens carrying an older value
// stop verifying. $pdo may be null on endpoints that never open a connection.
function auth_require($pdo = null){
  $hdr = get_auth_header();
  if(!preg_match('/Bearer\s+(.+)/',$hdr,$m)){
    http_response_code(401); respond(['error'=>'Missing token','hint'=>'Ensure .htaccess forwards Authorization and you are logged in']);
  }
  $token = trim($m[1]);
  $p = jwt_verify($token);
  if(!$p){ http_response_code(401); respond(['error'=>'Invalid or expired token']); }
  if($pdo !== null && isset($p['ver'])){
    try {
      $row = q($pdo,'SELECT auth_version FROM users WHERE id=? LIMIT 1',[$p['uid']])->fetch();
      // A database this app cannot ALTER keeps working, just without revocation.
      if ($row !== false && (int)$row['auth_version'] !== (int)$p['ver']) {
        http_response_code(401); respond(['error'=>'Session revoked, please sign in again']);
      }
    } catch (PDOException $e) {
      error_log('[mbp-api] auth_version check unavailable: ' . $e->getMessage());
    }
  }
  return $p;
}
function auth_optional(){
  $hdr = get_auth_header();
  if(preg_match('/Bearer\s+(.+)/',$hdr,$m)){
    return jwt_verify(trim($m[1]));
  }
  return null;
}
