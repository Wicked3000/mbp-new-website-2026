<?php
// Generic CRUD over every admin-managed entity: the site content, the page
// section tables (basic_*, post_*, vet_*, fode_*, home_*) and the private
// tables (selection_students, contact_messages, whatsapp_subscribers, users).
//
// $MAP and $publicRead below are GENERATED from ENTITY_MAP in server/app.js,
// which is the single source of truth. Do not hand-edit them: run
// `npm run sync:php` after changing ENTITY_MAP. A map that has drifted out of
// date makes this endpoint answer 400 "Unknown entity" for sections that are
// present in the database, which is how the whole Home Page admin broke.
require_once __DIR__.'/config/cors.php';
require_once __DIR__.'/helpers.php';
require_once __DIR__.'/config/database.php';
require_once __DIR__.'/config/auth.php';

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
  'partners'=>['table'=>'partners','cols'=>['name','logo','sort_order']],
  'quick_links'=>['table'=>'quick_links','cols'=>['icon','label','description','href','sort_order']],
  'downloads'=>['table'=>'downloads','cols'=>['name','type','size_text','category','description','file_path','program','sort_order']],
  'site_settings'=>['table'=>'site_settings','cols'=>['skey','svalue'],'pk'=>'skey'],
  'selections_grade9'=>['table'=>'selections_grade9','cols'=>['school','district','type','capacity','placed','stream','cutoff']],
  'selections_grade11'=>['table'=>'selections_grade11','cols'=>['school','district','type','streams_json','placed_json','cutoff_json','capacity','placed','cutoff']],
  'selection_students'=>['table'=>'selection_students','cols'=>['grade_level','school','position_no','primary_school','surname','first_name','gender','student_name','slf_no','transferred_from']],
  'contact_messages'=>['table'=>'contact_messages','cols'=>['full_name','phone','email','category','district','subject','message','status']],
  'whatsapp_subscribers'=>['table'=>'whatsapp_subscribers','cols'=>['phone','source']],
  'users'=>['table'=>'users','cols'=>['username','email','role'],'selectCols'=>['id','username','email','role'],'readOnly'=>true],
  'basic_hero'=>['table'=>'basic_hero','cols'=>['eyebrow','title','subtitle','description','banner','alt','sort_order']],
  'basic_overview'=>['table'=>'basic_overview','cols'=>['eyebrow','heading','intro','body','features_title','sort_order']],
  'basic_overview_cards'=>['table'=>'basic_overview_cards','cols'=>['icon','title','desc','sort_order']],
  'basic_overview_features'=>['table'=>'basic_overview_features','cols'=>['feature','sort_order']],
  'basic_overview_stats'=>['table'=>'basic_overview_stats','cols'=>['value_text','label','color','sort_order']],
  'basic_curriculum'=>['table'=>'basic_curriculum','cols'=>['area','grades','desc','icon','sort_order']],
  'basic_initiatives'=>['table'=>'basic_initiatives','cols'=>['title','desc','icon','status','color','sort_order']],
  'basic_support'=>['table'=>'basic_support','cols'=>['icon','title','desc','sort_order']],
  'basic_support_contact'=>['table'=>'basic_support_contact','cols'=>['heading','body','phone_label','phone_value','email_label','email_value','office_label','office_value','button_label','button_href','sort_order']],
  'basic_faq'=>['table'=>'basic_faq','cols'=>['q','a','sort_order']],
  'basic_section_headings'=>['table'=>'basic_section_headings','cols'=>['skey','eyebrow','heading','blurb','sort_order']],
  'post_hero'=>['table'=>'post_hero','cols'=>['eyebrow','title','subtitle','description','banner','alt','sort_order']],
  'post_overview'=>['table'=>'post_overview','cols'=>['eyebrow','heading','intro','body','features_title','sort_order']],
  'post_overview_cards'=>['table'=>'post_overview_cards','cols'=>['icon','title','desc','sort_order']],
  'post_overview_features'=>['table'=>'post_overview_features','cols'=>['feature','sort_order']],
  'post_overview_stats'=>['table'=>'post_overview_stats','cols'=>['value_text','label','color','sort_order']],
  'post_streams'=>['table'=>'post_streams','cols'=>['name','grades','subjects','icon','color','sort_order']],
  'post_assessment'=>['table'=>'post_assessment','cols'=>['icon','heading','bullet','sort_order']],
  'post_pathways'=>['table'=>'post_pathways','cols'=>['title','desc','icon','color','stats','sort_order']],
  'post_initiatives'=>['table'=>'post_initiatives','cols'=>['title','desc','icon','status','color','sort_order']],
  'post_support'=>['table'=>'post_support','cols'=>['icon','title','desc','sort_order']],
  'post_support_contact'=>['table'=>'post_support_contact','cols'=>['heading','body','phone_label','phone_value','email_label','email_value','office_label','office_value','button_label','button_href','sort_order']],
  'post_faq'=>['table'=>'post_faq','cols'=>['q','a','sort_order']],
  'post_section_headings'=>['table'=>'post_section_headings','cols'=>['skey','eyebrow','heading','blurb','sort_order']],
  'vet_hero'=>['table'=>'vet_hero','cols'=>['eyebrow','title','subtitle','description','banner','alt','sort_order']],
  'vet_overview'=>['table'=>'vet_overview','cols'=>['eyebrow','heading','intro','body','features_title','sort_order']],
  'vet_overview_cards'=>['table'=>'vet_overview_cards','cols'=>['icon','title','desc','sort_order']],
  'vet_overview_features'=>['table'=>'vet_overview_features','cols'=>['feature','sort_order']],
  'vet_overview_stats'=>['table'=>'vet_overview_stats','cols'=>['value_text','label','color','sort_order']],
  'vet_programs'=>['table'=>'vet_programs','cols'=>['code','name','duration','level','trades','icon','color','sort_order']],
  'vet_centres'=>['table'=>'vet_centres','cols'=>['name','district','status','programs','capacity','facilities','icon','sort_order']],
  'vet_centre_names'=>['table'=>'vet_centre_names','cols'=>['name','sort_order']],
  'vet_partners'=>['table'=>'vet_partners','cols'=>['name','sector','programs','icon','sort_order']],
  'vet_apprenticeship'=>['table'=>'vet_apprenticeship','cols'=>['icon','heading','body','bullet','sort_order']],
  'vet_initiatives'=>['table'=>'vet_initiatives','cols'=>['title','desc','icon','status','color','sort_order']],
  'vet_enrolment_steps'=>['table'=>'vet_enrolment_steps','cols'=>['step','title','desc','sort_order']],
  'vet_intake_dates'=>['table'=>'vet_intake_dates','cols'=>['label','date_text','sort_order']],
  'vet_support'=>['table'=>'vet_support','cols'=>['icon','title','desc','sort_order']],
  'vet_support_contact'=>['table'=>'vet_support_contact','cols'=>['heading','body','phone_label','phone_value','email_label','email_value','office_label','office_value','button_label','button_href','sort_order']],
  'vet_faq'=>['table'=>'vet_faq','cols'=>['q','a','sort_order']],
  'vet_section_headings'=>['table'=>'vet_section_headings','cols'=>['skey','eyebrow','heading','blurb','sort_order']],
  'fode_hero'=>['table'=>'fode_hero','cols'=>['eyebrow','title','subtitle','description','banner','alt','sort_order']],
  'fode_overview'=>['table'=>'fode_overview','cols'=>['eyebrow','heading','intro','body','features_title','sort_order']],
  'fode_overview_cards'=>['table'=>'fode_overview_cards','cols'=>['icon','title','desc','sort_order']],
  'fode_overview_features'=>['table'=>'fode_overview_features','cols'=>['feature','sort_order']],
  'fode_overview_stats'=>['table'=>'fode_overview_stats','cols'=>['value_text','label','color','sort_order']],
  'fode_programs'=>['table'=>'fode_programs','cols'=>['name','level','duration','subjects','target','icon','color','sort_order']],
  'fode_centres'=>['table'=>'fode_centres','cols'=>['name','district','centre_type','students','facilities','coordinator','icon','sort_order']],
  'fode_delivery_methods'=>['table'=>'fode_delivery_methods','cols'=>['name','desc','icon','availability','sort_order']],
  'fode_app_callout'=>['table'=>'fode_app_callout','cols'=>['icon','heading','body','bullet','sort_order']],
  'fode_enrolment_steps'=>['table'=>'fode_enrolment_steps','cols'=>['step','title','desc','sort_order']],
  'fode_key_dates'=>['table'=>'fode_key_dates','cols'=>['label','date_text','sort_order']],
  'fode_support'=>['table'=>'fode_support','cols'=>['icon','title','desc','sort_order']],
  'fode_support_contact'=>['table'=>'fode_support_contact','cols'=>['heading','body','phone_label','phone_value','email_label','email_value','whatsapp_label','whatsapp_value','office_label','office_value','button_label','button_href','sort_order']],
  'fode_initiatives'=>['table'=>'fode_initiatives','cols'=>['title','desc','icon','status','color','sort_order']],
  'fode_faq'=>['table'=>'fode_faq','cols'=>['q','a','sort_order']],
  'fode_section_headings'=>['table'=>'fode_section_headings','cols'=>['skey','eyebrow','heading','blurb','sort_order']],
  'home_mission'=>['table'=>'home_mission','cols'=>['eyebrow','heading','heading_accent','para1','para2','image','image_alt','badge_value','badge_label','badge_sub','button_label','button_href','sort_order']],
  'home_mission_points'=>['table'=>'home_mission_points','cols'=>['feature','sort_order']],
  'home_selection_banner'=>['table'=>'home_selection_banner','cols'=>['icon','title','badge','body','primary_label','primary_href','secondary_label','secondary_href','sort_order']],
  'home_cta'=>['table'=>'home_cta','cols'=>['badge','heading','body','sub_body','image','image_alt','tagline','form_title','form_body','phone_label','phone_placeholder','channel_label','channel_prompt','button_label','button_loading_label','response_note','sort_order']],
  'home_cta_channels'=>['table'=>'home_cta_channels','cols'=>['name','sort_order']],
];

$entity=$_GET['entity']??'';
// array_key_exists, not isset, and reject anything that is not a plain name so
// "constructor"/"__proto__" can never reach the query builder.
if(!is_string($entity) || !preg_match('/^[a-z0-9_]+$/', $entity) || !array_key_exists($entity,$MAP)){
  respond(['error'=>'Unknown entity','allowed'=>array_keys($MAP)],400);
}
$cfg=$MAP[$entity];
$table=$cfg['table'];
$cols=$cfg['cols'];
$pk=$cfg['pk']??'id';
$method=$_SERVER['REQUEST_METHOD'];

// Generated from PUBLIC_READ in server/app.js. Everything absent from this list
// needs a valid token, which is what keeps selection_students (minors' names),
// contact_messages and users off the public site.
$publicRead=[
  'hero_slides',
  'news',
  'notices',
  'events',
  'programs',
  'stats',
  'districts',
  'schools',
  'leadership',
  'partners',
  'quick_links',
  'downloads',
  'site_settings',
  'selections_grade9',
  'selections_grade11',
  'basic_hero',
  'basic_overview',
  'basic_overview_cards',
  'basic_overview_features',
  'basic_overview_stats',
  'basic_curriculum',
  'basic_initiatives',
  'basic_support',
  'basic_support_contact',
  'basic_faq',
  'basic_section_headings',
  'post_hero',
  'post_overview',
  'post_overview_cards',
  'post_overview_features',
  'post_overview_stats',
  'post_streams',
  'post_assessment',
  'post_pathways',
  'post_initiatives',
  'post_support',
  'post_support_contact',
  'post_faq',
  'post_section_headings',
  'vet_hero',
  'vet_overview',
  'vet_overview_cards',
  'vet_overview_features',
  'vet_overview_stats',
  'vet_programs',
  'vet_centres',
  'vet_centre_names',
  'vet_partners',
  'vet_apprenticeship',
  'vet_initiatives',
  'vet_enrolment_steps',
  'vet_intake_dates',
  'vet_support',
  'vet_support_contact',
  'vet_faq',
  'vet_section_headings',
  'fode_hero',
  'fode_overview',
  'fode_overview_cards',
  'fode_overview_features',
  'fode_overview_stats',
  'fode_programs',
  'fode_centres',
  'fode_delivery_methods',
  'fode_app_callout',
  'fode_enrolment_steps',
  'fode_key_dates',
  'fode_support',
  'fode_support_contact',
  'fode_initiatives',
  'fode_faq',
  'fode_section_headings',
  'home_mission',
  'home_mission_points',
  'home_selection_banner',
  'home_cta',
  'home_cta_channels',
];
$needsAuthForRead = !in_array($entity,$publicRead,true);

if($needsAuthForRead && $method==='GET'){
  auth_require($pdo);
}
if(in_array($method,['POST','PUT','DELETE'])){
  auth_require($pdo);
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
