<?php
include_once "config.php";
include_once "util.php";


$db = sql_connect($config['db']);
$user = new User($db);
$inserted = $user->insert(array($_POST));

$auser = new AUser($db);
$res = $auser->getNotifyEmails();
$addresses = array();
foreach($res as $r) $addresses[] = array($r['email'], ucwords($r['firstName']));

$mail = new Mail();
$mail->config = $config;
$mail->template = new NotifyOnRegistrationEmailTemplate();
$mail->templateData = $inserted[0];
$mail->addresses = $addresses;
$mail->send();


echo getResponseJSONString(0, 0, '', '');
?>
