<?php
include_once "config.php";
include_once "util.php";

function checkMySQLError($con) {
    if (mysqli_connect_errno()) {
        echo getResponseJSONString(1, 0, "Failed to connect to MySQL: " . mysqli_connect_error(), '');
        die();
    }
    if (mysqli_errno($con)) {
        echo getResponseJSONString(1, 0, "MySQL error: " . mysqli_error($con), '');
        die();
    }
}

$con=mysqli_connect($config['db']['host'],$config['db']['user'],$config['db']['pass'],$config['db']['db']);
checkMySQLError($con);

$form = new Form();
$form->config = $config;
$form->set($_POST);

$query = $form->getInsertQuery();
mysqli_query($con,$query);
checkMySQLError($con);

$id = mysqli_insert_id($con);
$query = 
" UPDATE User SET createdAt = now(), updatedAt = now() " . 
" WHERE id = " . $id;
mysqli_query($con,$query);
checkMySQLError($con);

                
$auser = new AUser();
$q = $auser->getNotifyOnRegistrationQuery();
$res = mysqli_query($con, $q);
checkMySQLError($con);

$addresses = array();
while($r = mysqli_fetch_assoc($res)) {
    $addresses[] = array($r['email'], ucwords($r['firstName']));
}

$mail = new Mail();
$mail->config = $config;
$mail->template = new NotifyOnRegistrationEmailTemplate();
$mail->templateData = $form;
$mail->addresses = $addresses;
$mail->send();


echo getResponseJSONString(0, 0, '', '');
?>
