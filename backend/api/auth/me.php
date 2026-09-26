<?php
require_once __DIR__.'/../config/cors.php';
require_once __DIR__.'/../helpers.php';
require_once __DIR__.'/../config/database.php';
require_once __DIR__.'/../config/auth.php';
$p=auth_require((new Database())->connect());
respond(['user'=>$p]);
