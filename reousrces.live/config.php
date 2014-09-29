<?php
//error_reporting(0);
error_reporting(E_ALL);

$config = array(
    "db" => array(
        "user" => "infr3963_infra", 
        "pass" => "84l_U!;Ltm}c",
        //"user" => "root",
        //"pass" => "",
        "host" => "localhost",
        "db" => "infr3963_infradesign"),
    
    "smtp" => array(
        "user" => "infr3963",
        "pass" => "Nvk#j7sa2a",
        "host" => "mail.infradesign.com.my",
        "port" => 587
    ),
    
    "publicPath" => realpath(dirname(__FILE__)),
    "uploadPath" => realpath(dirname(__FILE__)) . '/upload',
);
?>