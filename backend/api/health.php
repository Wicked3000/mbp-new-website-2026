<?php
require __DIR__.'/config/cors.php';
echo json_encode(['status'=>'ok','db'=>'mbp_education','time'=>date('c')]);
