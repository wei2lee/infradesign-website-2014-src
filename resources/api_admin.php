<?php
include_once "config.php";
include_once "util.php";

function checkMySQLError() {
    if (mysqli_connect_errno()) {
        echo getResponseJSONString(1, 0, "Failed to connect to MySQL: " . mysqli_connect_error(), '');
        die();
    }
}

session_start();
$con=mysqli_connect($config['db']['host'],$config['db']['user'],$config['db']['pass'],$config['db']['db']);
checkMySQLError();
$form = new Form();

$action = isset($_GET['action']) ? $_GET['action'] : '';
$target = isset($_GET['target']) ? $_GET['target'] : '';

if($action == 'login') {
    $user = $_POST['user'];
    $q = $form->getLoginQuery($user);
    $res = mysqli_query($con, $q);
    checkMySQLError();
    $r = mysqli_fetch_row($res);
    if($r[0] == 0){
        echo getResponseJSONString(1, 0, 'No user is matched with password', '');
    }else{
        $_SESSION['authName'] = $user['authName'];
        $_SESSION['authPassword'] = $user['authPassword'];
        echo getResponseJSONString(0, 0, '', '');
    }
}else if($action == 'logout'){
    session_destroy();
    unset($_SESSION['authName']);
}else{
    if($target == 'user') {
        if($action == 'read') {
            $q = $form->getReadQuery();
            $res = mysqli_query($con, $q);
            checkMySQLError();
            $data = array();
            while($r = mysqli_fetch_assoc($res)){
                $data[] = $r;        
            }
            echo getResponseJSONString(0, 0,'',$data);
        }else if($action == 'update'){
            $users = $_POST['users'];
            foreach($users as $i => $user) {
                $q = $form->getEditQuery($user);   
                $res = mysqli_query($con, $q);
                checkMySQLError();

                $q = $form->getOnUpdateQuery($user);
                $res = mysqli_query($con, $q);
                checkMySQLError();
            }
            echo getResponseJSONString(0, 0, '', '');
        }else if($action == 'delete'){
            $users = $_POST['users'];
            foreach($users as $i => $user) {
                $q = $form->getDeleteQuery($user);   
                $res = mysqli_query($con, $q);
                checkMySQLError();
            }
            echo getResponseJSONString(0, 0, '', '');
        }else if($action == 'new'){
            $users = $_POST['users'];
            foreach($users as $i => $user) {
                $q = $form->getNewQuery($user);   
                $res = mysqli_query($con, $q);
                checkMySQLError();
                
                $q = $form->getOnInsertQuery($user, $con);
                $res = mysqli_query($con, $q);
                checkMySQLError();
            }
            echo getResponseJSONString(0, 0, '', '');
        }else{
            echo getResponseJSONString(1, 0, 'Unable to perform action', '');
        }
    }else{
        echo getResponseJSONString(1, 0, 'Unable to perform action', '');   
    }
}
?>