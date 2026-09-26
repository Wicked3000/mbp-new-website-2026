<?php
// Simple JWT-like auth (no external deps). For demo. Use stronger library in prod.
function jwt_secret(){
  $secret = getenv('JWT_SECRET');
  // A published default signing key lets anyone mint admin tokens, so refuse to
  // fall back to one outside development.
  if(!$secret){
    if(strtolower((string)getenv('NODE_ENV')) === 'production'){
      http_response_code(500); echo json_encode(['error'=>'JWT_SECRET is not configured']); exit;
    }
    $secret = 'mbp_education_dev_secret_change_me_32chars';
  }
  if(strlen($secret) < 32){
    http_response_code(500); echo json_encode(['error'=>'JWT_SECRET must be at least 32 characters']); exit;
  }
  return $secret;
}
function base64url_encode($d){ return rtrim(strtr(base64_encode($d),'+/','-_'),'='); }
function base64url_decode($d){ return base64_decode(strtr($d,'-_','+/')); }
function jwt_sign($payload, $expSec=86400){
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
function auth_require(){
  $hdr = get_auth_header();
  if(!preg_match('/Bearer\s+(.+)/',$hdr,$m)){
    http_response_code(401); echo json_encode(['error'=>'Missing token','hint'=>'Ensure .htaccess forwards Authorization and you are logged in']); exit;
  }
  $token = trim($m[1]);
  $p = jwt_verify($token);
  if(!$p){ http_response_code(401); echo json_encode(['error'=>'Invalid or expired token']); exit; }
  return $p;
}
function auth_optional(){
  $hdr = get_auth_header();
  if(preg_match('/Bearer\s+(.+)/',$hdr,$m)){
    return jwt_verify(trim($m[1]));
  }
  return null;
}
