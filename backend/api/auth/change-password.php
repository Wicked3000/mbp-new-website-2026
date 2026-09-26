<?php
// Password rotation for the signed-in admin. The seeded account ships without a
// usable password, so this endpoint is how the first real one gets set once an
// operator has used `npm run admin:password` to bootstrap access.
require_once __DIR__.'/../config/cors.php';
require_once __DIR__.'/../helpers.php';
require_once __DIR__.'/../config/database.php';
require_once __DIR__.'/../config/auth.php';

if($_SERVER['REQUEST_METHOD']!=='POST') respond(['error'=>'Method not allowed'],405);
rate_limit(10, 'change-password', 'Too many attempts, please try again later');

$pdo=(new Database())->connect();
$claims=auth_require($pdo);

$in=json_input();
$current=(string)($in['current_password']??'');
$next=(string)($in['new_password']??'');
if(!$current || !$next) respond(['error'=>'Both passwords are required'],400);
if(strlen($next)<MIN_PASSWORD_LENGTH) respond(['error'=>'Use at least '.MIN_PASSWORD_LENGTH.' characters for the new password'],400);
if($current===$next) respond(['error'=>'Choose a password you have not used here before'],400);

$user=q($pdo,'SELECT * FROM users WHERE id=? LIMIT 1',[$claims['uid']])->fetch();
if(!$user) respond(['error'=>'Account not found'],404);
if(!password_verify($current, $user['password_hash'] ?? '')) respond(['error'=>'Current password is incorrect'],401);
if(password_verify($next, $user['password_hash'] ?? '')) respond(['error'=>'Choose a different password'],400);

// $2y$ is what PHP writes; bcryptjs reads it too, so the hash stays portable
// between this API and the Node one.
$hash=password_hash($next, PASSWORD_BCRYPT, ['cost'=>10]);
$version=(int)($user['auth_version'] ?? 1)+1;
try {
  q($pdo,'UPDATE users SET password_hash=?, auth_version=? WHERE id=?',[$hash,$version,$user['id']]);
} catch (PDOException $e) {
  // Installs whose users table predates auth_version still get the new password.
  error_log('[mbp-api] auth_version update failed: ' . $e->getMessage());
  q($pdo,'UPDATE users SET password_hash=? WHERE id=?',[$hash,$user['id']]);
  $version=null;
  unset($user['auth_version']);
}
$user['auth_version']=$version;
respond(['ok'=>true,'token'=>token_for($user),'user'=>user_public($user)]);
