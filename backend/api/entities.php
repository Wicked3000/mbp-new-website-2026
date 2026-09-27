<?php
// Generic CRUD: ?entity=news|notices|events|programs|stats|districts|schools|leadership|partners|quick_links|hero_slides|downloads|site_settings|selections_grade9|selections_grade11|contact_messages|users
require __DIR__.'/config/cors.php';
require __DIR__.'/config/database.php';
require __DIR__.'/config/auth.php';
require __DIR__.'/helpers.php';

$pdo=(new Database())->connect();

$MAP=[
  'hero_slides'=>['table'=>'hero_slides','cols'=>['src','alt','sort_order','is_active']],
  'news'=>['table'=>'news','cols'=>['tag','tag_color','news_date','title','excerpt','img','is_published','is_previous']],
  'notices'=>['table'=>'notices','cols'=>['notice_date','title','is_published']],
  'events'=>['table'=>'events','cols'=>['month','day','title','event_time','cat','color']],
  'programs'=>['table'=>'programs','cols'=>['code','label','level','description','color','accent','href','img','sort_order']],
  'stats'=>['table'=>'stats','cols'=>['value_text','label','sub','sort_order']],
  'districts'=>['table'=>'districts','cols'=>['name','capital','schools','type','students','img','sort_order']],
  'schools'=>['table'=>'schools','cols'=>['district_id','name','district','type','level','capacity','enrolled','img','head_teacher','contact','location','male','female','teachers','staff','lat','lng','email','address','alt_phone','contact_person','code','established','day_boarding','category','classrooms','land_hectares','has_library','has_computer_lab','has_science_lab','has_sports_field','has_boarding','principal','teachers_male','teachers_female','untrained_teachers','admin_officers','support_staff','streams','exam_centre','extracurricular','day_students','boarders','transport','uniform','fees','notes']],
  'leadership'=>['table'=>'leadership','cols'=>['name','title','bio','icon','photo','sort_order']],
  'partners'=>['table'=>'partners','cols'=>['name','sort_order']],
  'quick_links'=>['table'=>'quick_links','cols'=>['icon','label','description','href','sort_order']],
  'downloads'=>['table'=>'downloads','cols'=>['name','type','size_text','category','description','file_path']],
  'site_settings'=>['table'=>'site_settings','cols'=>['skey','svalue'],'pk'=>'skey'],
  'selections_grade9'=>['table'=>'selections_grade9','cols'=>['school','district','type','capacity','placed','stream','cutoff']],
  'selections_grade11'=>['table'=>'selections_grade11','cols'=>['school','district','type','streams_json','placed_json','cutoff_json']],
  'contact_messages'=>['table'=>'contact_messages','cols'=>['full_name','phone','email','category','district','subject','message','status']],
  'users'=>['table'=>'users','cols'=>['username','email','role'],'selectCols'=>['id','username','email','role'],'readOnly'=>true],
];

$entity=$_GET['entity']??'';
if(!isset($MAP[$entity])) respond(['error'=>'Unknown entity','allowed'=>array_keys($MAP)],400);
$cfg=$MAP[$entity];
$table=$cfg['table'];
$cols=$cfg['cols'];
$pk=$cfg['pk']??'id';
$method=$_SERVER['REQUEST_METHOD'];

// Public read for most entities except users/contact_messages which require auth for listing
$publicRead = ['hero_slides','news','notices','events','programs','stats','districts','schools','leadership','partners','quick_links','downloads','site_settings','selections_grade9','selections_grade11'];
$needsAuthForRead = !in_array($entity,$publicRead,true);

if($needsAuthForRead && $method==='GET'){
  auth_require();
}
if(in_array($method,['POST','PUT','DELETE'])){
  auth_require();
  if(($cfg['readOnly']??false)) respond(['error'=>'Read only'],403);
}

if($method==='GET'){
  // site_settings returns key=>value map; others list
  if($entity==='site_settings'){
    $rows=q($pdo,"SELECT skey,svalue FROM site_settings")->fetchAll();
    $map=[]; foreach($rows as $r) $map[$r['skey']]=$r['svalue'];
    respond(['data'=>$map]);
  }
  $id=$_GET['id']??null;
  // Never SELECT * on entities with a selectCols allowlist: users also stores
  // password_hash and bcrypt hashes are enough to mount an offline attack.
  $selectList = isset($cfg['selectCols'])
    ? implode(',', array_map(fn($c)=>"`$c`", $cfg['selectCols']))
    : '*';
  if($id){
    $row=q($pdo,"SELECT $selectList FROM $table WHERE $pk=? LIMIT 1",[$id])->fetch();
    if(!$row) respond(['error'=>'Not found'],404);
    respond(['data'=>$row]);
  }
  // pagination optional
  $q=q($pdo,"SELECT $selectList FROM $table ORDER BY ".($pk==='skey'?'skey':"$pk ASC"));
  respond(['data'=>$q->fetchAll()]);
}

if($method==='POST'){
  $in=json_input();
  // site_settings upsert
  if($entity==='site_settings'){
    $k=trim($in['skey']??''); $v=$in['svalue']??'';
    if(!$k) respond(['error'=>'skey required'],400);
    q($pdo,"INSERT INTO site_settings (skey,svalue) VALUES (?,?) ON DUPLICATE KEY UPDATE svalue=VALUES(svalue)",[$k,$v]);
    respond(['ok'=>true]);
  }
  // users creation disabled via generic; use dedicated endpoint
  $vals=[]; $ph=[]; $params=[];
  foreach($cols as $c){
    if(array_key_exists($c,$in)){
      $vals[]="`$c`"; $ph[]="?"; $params[]=$in[$c];
    }
  }
  if(!$vals) respond(['error'=>'No fields'],400);
  $sql="INSERT INTO $table (".implode(',',$vals).") VALUES (".implode(',',$ph).")";
  q($pdo,$sql,$params);
  $id=$pdo->lastInsertId();
  respond(['id'=>$id],201);
}

if($method==='PUT'){
  $id=$_GET['id']??null;
  if(!$id) respond(['error'=>'id required'],400);
  $in=json_input();
  if($entity==='site_settings'){
    $v=$in['svalue']??null;
    if($v===null) respond(['error'=>'svalue required'],400);
    q($pdo,"UPDATE site_settings SET svalue=? WHERE skey=?",[$v,$id]);
    respond(['ok'=>true]);
  }
  $sets=[]; $params=[];
  foreach($cols as $c){
    if(array_key_exists($c,$in)){
      $sets[]="`$c`=?"; $params[]=$in[$c];
    }
  }
  if(!$sets) respond(['error'=>'No fields to update'],400);
  $params[]=$id;
  $sql="UPDATE $table SET ".implode(',',$sets)." WHERE $pk=?";
  $st=q($pdo,$sql,$params);
  respond(['ok'=>true,'affected'=>$st->rowCount()]);
}

if($method==='DELETE'){
  $id=$_GET['id']??null;
  if(!$id) respond(['error'=>'id required'],400);
  q($pdo,"DELETE FROM $table WHERE $pk=?",[$id]);
  respond(['ok'=>true]);
}

respond(['error'=>'Method not allowed'],405);
