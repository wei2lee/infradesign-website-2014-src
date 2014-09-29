<?php
include_once "config.php";
include_once "util.php";

session_start();

$db = sql_connect($config['db']);

$action = isset($_GET['action']) ? $_GET['action'] : '';
$target = isset($_GET['target']) ? $_GET['target'] : '';

if($action == 'login') {
    $auser = new AUser($db);
    $loginuser = $auser->login($_POST['user']);
    if($loginuser == null) {
        echo getResponseJSONString(1, 0, 'No user is matched with password.', '');
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
        echo getResponseJSONString(1, 0, 'user is not logon.', '');
        die();
    }
    if($target != '' || $action != ''){

        $crud = null;
        if($target == 'user') $crud = new User($db);
        else if($target == 'agent') $crud = new AUser($db);
        else if($target == 'agent-hierachy') $crud = new AgentHierachy($db);
        else if($target == 'agent-followup') $crud = new AgentFollowup($db);
        else{
            echo getResponseJSONString(1, 0, 'Unable to perform action.', '');
            die();
        }
        if($action == 'read' || $action == 'select' || $action == 'get') {
            $users = array_key_exists('users', $_POST) ? $_POST['users'] : null;
            $data = $crud->select(null, $users);
            echo getResponseJSONString(0, 0,'',$data);
        }else if($action == 'select_no_parent'){
            $data = $crud->select_no_parent();
            echo getResponseJSONString(0, 0,'',$data);
        }else if($action == 'update' || $action == 'edit' || $action == 'set'){
            if(!isset($_POST['users'])) {
                echo getResponseJSONString(1, 0, 'Unable to perform action.', '');
                die();
            }
            $crud->update($_POST['users']);
            echo getResponseJSONString(0, 0, '', '');
        }else if($action == 'delete' || $action == 'remove'){
            if(!isset($_POST['users'])) {
                echo getResponseJSONString(1, 0, 'Unable to perform action.', '');
                die();
            }
            $crud->delete($_POST['users']);
            echo getResponseJSONString(0, 0, '', '');
        }else if($action == 'new' || $action == 'insert' || $action == 'add' || $action == 'put'){
            if(!isset($_POST['users'])) {
                echo getResponseJSONString(1, 0, 'Unable to perform action.', '');
                die();
            }
            $crud->insert($_POST['users']);
            echo getResponseJSONString(0, 0, '', '');
        }else if($action == 'export'){
            $crud->export($con);
            //No Response, this action will download
        }else if($action == 'import'){
            $crud->import($_FILES, $con);
            echo getResponseJSONString(0, 0, 'imported', '');
        }else{
            echo getResponseJSONString(1, 0, 'Unable to perform action.', '');
            die();
        }
    }else{
        echo getResponseJSONString(1, 0, 'Unable to perform action.', '');
        die();
    }
}



?>