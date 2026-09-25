<?php
require __DIR__.'/../config/cors.php';
require __DIR__.'/../config/database.php';
require __DIR__.'/../config/auth.php';
require __DIR__.'/../helpers.php';
auth_require();
$pdo=(new Database())->connect();
$out=[];
$out['news']= (int) q($pdo,"SELECT COUNT(*) c FROM news")->fetch()['c'];
$out['notices']= (int) q($pdo,"SELECT COUNT(*) c FROM notices")->fetch()['c'];
$out['events']= (int) q($pdo,"SELECT COUNT(*) c FROM events")->fetch()['c'];
$out['messages_new']= (int) q($pdo,"SELECT COUNT(*) c FROM contact_messages WHERE status='new'")->fetch()['c'];
$out['messages_total']= (int) q($pdo,"SELECT COUNT(*) c FROM contact_messages")->fetch()['c'];
$out['schools']= (int) q($pdo,"SELECT COUNT(*) c FROM schools")->fetch()['c'];
$out['districts']= (int) q($pdo,"SELECT COUNT(*) c FROM districts")->fetch()['c'];
$out['recent_messages']= q($pdo,"SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5")->fetchAll();
respond(['data'=>$out]);
