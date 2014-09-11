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
mysqli_set_charset($con, 'utf8');
checkMySQLError();



$action = isset($_GET['action']) ? $_GET['action'] : '';
$target = isset($_GET['target']) ? $_GET['target'] : '';

if($action == 'login') {
    $auser = new AUser();
    $user = $_POST['user'];
    $q = $auser->getLoginQuery($user);
    $res = mysqli_query($con, $q);
    checkMySQLError();
    if(mysqli_num_rows($res) == 0) {
        echo getResponseJSONString(1, 0, 'No user is matched with password', '');
    }else{
        $isRelogin = isset($_SESSION['id']);
        
        session_unset ();
        $r = mysqli_fetch_assoc ($res);
        foreach($r as $key => $value) {
            $_SESSION[$key] = $value;   
        }
        $q = $auser->getOnLoginQuery($_SESSION['id']);
        $res = mysqli_query($con, $q);
        checkMySQLError();
        
        echo getResponseJSONString(0, 0, $isRelogin?'Relogin':'', '');
    }
}else if($action == 'logout'){
    $auser = new AUser();
    
    session_unset ();
    session_destroy();
    
    echo getResponseJSONString(0, 0, '', '');
}else{
    if($target == 'user') {
        $form = new Form();
        $form->con = $con;
        
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
        }else if($action == 'export'){
            $form->export();
        }else if($action == 'import'){
            $form->import();
        }else{
            echo getResponseJSONString(1, 0, 'Unable to perform action', '');
        }
    }else{
        echo getResponseJSONString(1, 0, 'Unable to perform action', '');   
    }
}
?>