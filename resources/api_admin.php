<?php
include_once "config.php";
include_once "util.php";
$action = $_GET['action'] || 'login';
session_start();
$con=mysqli_connect($config['db']['host'],$config['db']['user'],$config['db']['pass'],$config['db']['db']);
if (mysqli_connect_errno()) {
    echo getResponseJSONString('1', '0', "Failed to connect to MySQL: " . mysqli_connect_error());
    die();
}
$form = new Form();
if($action == 'read') {
    $q = $form->getReadQuery();
    $res = mysqli_query($con, $q);
    $data = array();
    while($r = mysql_fetch_assoc($res)){
        $data[] = $r;        
    }
    echo getResponseJSONString('0','','',$data);
}else if($action == 'update'){
    $users = $_POST['users'];
    foreach($user as $i => $user) {
        $q = $form->getEditQuery($user);   
        $res = mysqli_query($con, $q);
    }
}else if($action == 'delete'){
    $users = $_POST['users'];
    foreach($user as $i => $user) {
        $q = $form->getDeleteQuery($user);   
        $res = mysqli_query($con, $q);
    }
}else if($action == 'new'){
    $users = $_POST['users'];
    foreach($user as $i => $user) {
        $q = $form->getNewQuery($user);   
        $res = mysqli_query($con, $q);
    }
}
?>