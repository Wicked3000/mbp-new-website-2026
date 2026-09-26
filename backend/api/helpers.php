<?php
// Shared plumbing for every endpoint: input parsing, responses, prepared
// statements, rate limiting and error handling.

// An uncaught PDOException would print the failing SQL - table names, column
// names and sometimes row values - straight to the caller. Log it instead and
// answer with a generic error.
set_exception_handler(function(Throwable $e){
  error_log('[mbp-api] ' . get_class($e) . ': ' . $e->getMessage());
  if (!headers_sent()) { http_response_code(500); header('Content-Type: application/json; charset=utf-8'); }
  echo json_encode(['error' => 'Server error']);
  exit;
});
set_error_handler(function($severity, $message, $file, $line){
  if ((error_reporting() & $severity) === 0) return false;
  throw new ErrorException($message, 0, $severity, $file, $line);
});

const RATE_LIMIT_WINDOW = 900; // 15 minutes

function env_or(string $key, string $default = ''): string {
  $value = getenv($key);
  return ($value === false || $value === '') ? $default : $value;
}

function is_production(): bool {
  return strtolower(env_or('NODE_ENV')) === 'production';
}

function json_input(){
  $raw = file_get_contents('php://input');
  $j = json_decode($raw,true);
  return is_array($j)?$j:[];
}

function respond($data,int $code=200){
  http_response_code($code);
  if (!headers_sent()) header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
  exit;
}

function q($pdo,$sql,$params=[]){ $stmt=$pdo->prepare($sql); $stmt->execute($params); return $stmt; }

function client_ip(): string {
  // X-Forwarded-For is caller-controlled, so only trust it when the deployment
  // is explicitly fronted by a proxy we control.
  if (strtolower(env_or('TRUSTED_PROXY')) === '1' && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $first = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
    if ($first !== '') return $first;
  }
  return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

/**
 * Fixed-window limiter kept in the system temp directory, so it survives across
 * requests without needing APCu or a shared store. Fails open: an unwritable
 * temp directory must not lock every admin out.
 */
function rate_limit(int $limit, string $action, string $message = 'Too many requests, please try again later'): void {
  $dir = rtrim(sys_get_temp_dir(), '/') . '/mbp-ratelimit';
  if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) return;
  $file = $dir . '/' . $action . '-' . substr(hash('sha256', client_ip()), 0, 32) . '.json';
  $handle = @fopen($file, 'c+');
  if ($handle === false) return;

  $count = 0;
  $resetAt = time() + RATE_LIMIT_WINDOW;
  if (flock($handle, LOCK_EX)) {
    $entry = json_decode(stream_get_contents($handle) ?: '', true);
    if (is_array($entry) && (int)($entry['resetAt'] ?? 0) > time()) {
      $count = (int)($entry['count'] ?? 0) + 1;
      $resetAt = (int)$entry['resetAt'];
    } else {
      $count = 1;
    }
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode(['count' => $count, 'resetAt' => $resetAt]));
    fflush($handle);
    flock($handle, LOCK_UN);
  }
  fclose($handle);

  if ($count > $limit) {
    header('Retry-After: ' . max(1, $resetAt - time()));
    respond(['error' => $message], 429);
  }
}
