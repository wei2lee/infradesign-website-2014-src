<?php 
require_once 'resources/lib/Mobile_Detect.php';
$detect = new Mobile_Detect();
$q = "";
if(isset($_GET['go'])) $q .= "?go=" . $_GET['go'];
if($detect->isMobile() || $detect->isTablet()) { header('Location: ./m/home.html'.$q); }
else { header('Location: ./home.html'.$q); }
?>