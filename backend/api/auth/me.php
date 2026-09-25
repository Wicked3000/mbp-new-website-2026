<?php
require __DIR__.'/../config/cors.php';
require __DIR__.'/../config/auth.php';
require __DIR__.'/../helpers.php';
$p=auth_require();
respond(['user'=>$p]);
