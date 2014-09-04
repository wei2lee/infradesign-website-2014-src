<?php    
    session_destroy();
    unset($_SESSION['authName']);
    header('Location: index.php');
?>