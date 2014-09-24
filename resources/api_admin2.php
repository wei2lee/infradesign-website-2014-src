<?php
include_once "config.php";
include_once "util.php";

$db=SSP::sql_connect($config['db']);
$auser = new AUser($db);
$ret = $auser->login(array('authName'=>'infra', 'authPassword'=>'infra'));
?>
