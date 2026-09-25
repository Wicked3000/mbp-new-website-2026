<?php
// Public POST for contact form; admin GET via entities.php
require __DIR__.'/config/cors.php';
require __DIR__.'/config/database.php';
require __DIR__.'/helpers.php';
if($_SERVER['REQUEST_METHOD']!=='POST') { http_response_code(405); echo json_encode(['error'=>'POST only']); exit; }
$in=json_input();
$required=['full_name','email','subject','message'];
foreach($required as $r) if(empty(trim($in[$r]??''))) { http_response_code(400); echo json_encode(['error'=>"Missing $r"]); exit; }
$pdo=(new Database())->connect();
q($pdo,"INSERT INTO contact_messages (full_name,phone,email,category,district,subject,message) VALUES (?,?,?,?,?,?,?)",
 [trim($in['full_name']), trim($in['phone']??''), trim($in['email']), trim($in['category']??'General Enquiry'), trim($in['district']??''), trim($in['subject']), trim($in['message'])]);
echo json_encode(['ok'=>true,'message'=>'Message received']);
