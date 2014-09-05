<?php
include_once "config.php";
include_once "util.php";

$con=mysqli_connect($config['db']['host'],$config['db']['user'],$config['db']['pass'],$config['db']['db']);
if (mysqli_connect_errno()) {
    echo getResponseJSONString(1, 0, "Failed to connect to MySQL: " . mysqli_connect_error(), '');
    die();
}

$form = new Form();
$form->config = $config;
$form->set($_POST);

$query = $form->getInsertQuery();
mysqli_query($con,$query);
if (mysqli_errno($con)) {
    echo getResponseJSONString(1, 0, "Failed to insert to MySQL: " . mysqli_error($con), '');
    die();
}

$id = mysqli_insert_id($con);
$query = 
" UPDATE User SET createdAt = now(), updatedAt = now() " . 
" WHERE id = " . $id;
mysqli_query($con,$query);
if (mysqli_errno($con)) {
    echo getResponseJSONString(1, 0, "Failed to update createdAt, updatedAt to MySQL:($query) " . mysqli_error($con), '');
    die();
}
echo getResponseJSONString(0, 0, '', '');
?>
