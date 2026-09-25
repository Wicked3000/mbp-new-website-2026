<?php
function json_input(){ $raw=file_get_contents('php://input'); $j=json_decode($raw,true); return is_array($j)?$j:[]; }
function respond($data,int $code=200){ http_response_code($code); echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES); exit; }
function q($pdo,$sql,$params=[]){ $stmt=$pdo->prepare($sql); $stmt->execute($params); return $stmt; }
