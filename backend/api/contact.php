<?php
// Public POST for contact form; admin GET via entities.php
require_once __DIR__.'/config/cors.php';
require_once __DIR__.'/helpers.php';
require_once __DIR__.'/config/database.php';

if($_SERVER['REQUEST_METHOD']!=='POST') respond(['error'=>'POST only'],405);

// Spam guard: 10 submissions per IP per 15 minutes.
rate_limit(10, 'contact', 'Too many messages, please try again later');

$in=json_input();
$required=['full_name','email','subject','message'];
foreach($required as $r) if(empty(trim($in[$r]??''))) respond(['error'=>"Missing $r"],400);
foreach(['full_name'=>120,'email'=>160,'phone'=>40,'category'=>80,'district'=>120,'subject'=>200,'message'=>5000] as $field=>$max){
  if(isset($in[$field]) && mb_strlen((string)$in[$field])>$max) respond(['error'=>"$field is too long"],400);
}
$email=trim($in['email']);
if(!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(['error'=>'Enter a valid email address'],400);

$pdo=(new Database())->connect();
q($pdo,"INSERT INTO contact_messages (full_name,phone,email,category,district,subject,message) VALUES (?,?,?,?,?,?,?)",
 [trim($in['full_name']), trim($in['phone']??''), $email, trim($in['category']??'General Enquiry'), trim($in['district']??''), trim($in['subject']), trim($in['message'])]);
respond(['ok'=>true,'message'=>'Message received']);
