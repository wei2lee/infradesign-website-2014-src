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

session_start();
$con=mysqli_connect($config['db']['host'],$config['db']['user'],$config['db']['pass'],$config['db']['db']);
mysqli_set_charset($con, 'utf8');
checkMySQLError($con);

$db = sql_connect($config['db']);

$action = isset($_GET['action']) ? $_GET['action'] : '';
$target = isset($_GET['target']) ? $_GET['target'] : '';

if($action == 'login') {
    $auser = new AUser($db);
    $loginuser = $auser->login($_POST['user']);
    if($loginuser == null) {
        echo getResponseJSONString(1, 0, 'No user is matched with password', '');
    }else{
        $isRelogin = isset($_SESSION['id']);
        session_unset ();
        foreach($loginuser as $key => $value) {
            $_SESSION[$key] = $value;   
        }
        echo getResponseJSONString(0, 0, $isRelogin?'Relogin':'', '');
    }
}else if($action == 'logout'){
    session_unset ();
    session_destroy();
    echo getResponseJSONString(0, 0, '', '');
}else{
    if(!isset($_SESSION['id'])){
        //no session !
    }
    if($target == 'user') {
        $user = new User($db);
        $form = new Form();
        $form->con = $con;
        $form->config = $config;
        
        if($action == 'read') {
            $data = $user->select();
            echo getResponseJSONString(0, 0,'',$data);
        }else if($action == 'update'){
            $user->update($_POST['users']);
            echo getResponseJSONString(0, 0, '', '');
        }else if($action == 'delete'){
            $user->delete($_POST['users']);
            echo getResponseJSONString(0, 0, '', '');
        }else if($action == 'new'){
            $user->insert($_POST['users']);
            echo getResponseJSONString(0, 0, '', '');
        }else if($action == 'export'){
            $form->export($con);
            //No Response, this action will download
        }else if($action == 'import'){
            $form->import($_FILES, $con);
            echo getResponseJSONString(0, 0, 'imported', '');
        }else{
            echo getResponseJSONString(1, 0, 'Unable to perform action', '');
        }
    }else{
        echo getResponseJSONString(1, 0, 'Unable to perform action', '');   
    }
}
?>