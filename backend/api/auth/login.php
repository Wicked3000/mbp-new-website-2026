<?php
require __DIR__.'/../config/cors.php';
require __DIR__.'/../config/database.php';
require __DIR__.'/../config/auth.php';
require __DIR__.'/../helpers.php';

if($_SERVER['REQUEST_METHOD']!=='POST') respond(['error'=>'Method not allowed'],405);
$in=json_input();
$username=trim($in['username']??'');
$password=$in['password']??'';
if(!$username||!$password) respond(['error'=>'Username and password required'],400);

$pdo=(new Database())->connect();
$stmt=q($pdo,"SELECT * FROM users WHERE username=? OR email=? LIMIT 1",[$username,$username]);
$user=$stmt->fetch();
if(!$user || !password_verify($password,$user['password_hash'])) respond(['error'=>'Invalid credentials'],401);

$token=jwt_sign(['uid'=>$user['id'],'username'=>$user['username'],'role'=>$user['role']]);
respond(['token'=>$token,'user'=>['id'=>$user['id'],'username'=>$user['username'],'email'=>$user['email'],'role'=>$user['role']]]);
