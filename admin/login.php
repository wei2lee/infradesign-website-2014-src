<?php
include_once "../resources/config.php";
include_once "../resources/util.php";

$con=mysqli_connect($config['db']['host'],$config['db']['user'],$config['db']['pass'],$config['db']['db']);
    if (mysqli_connect_errno()) {
    echo getResponseJSONString('1', '0', "Failed to connect to MySQL: " . mysqli_connect_error());
    die();
}
$form = new Form();
$user = $_POST['user'];
$q = $form->getLoginQuery($user);
$res = $mysqli_query($con, $q);
$r = mysqli_fetch_row($con,$res);
if($r[0] == 0){
    header('Location: index.php');
}else{
    $_SESSION['authName'] = $authName;
    header('Location: content.php');
}
?>