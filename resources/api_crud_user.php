<?php
include_once "config.php";

session_start();
if(!isset($_SESSION['id'])){
    //no session !
    echo getResponseJSONString(1, 0, 'user is not logon', '');
    die();
}
/*
 * DataTables example server-side processing script.
 *
 * Please note that this script is intentionally extremely simply to show how
 * server-side processing can be implemented, and probably shouldn't be used as
 * the basis for a large complex system. It is suitable for simple use cases as
 * for learning.
 *
 * See http://datatables.net/usage/server-side for full details on the server-
 * side processing requirements of DataTables.
 *
 * @license MIT - http://datatables.net/license_mit
 */
 
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Easy set variables
 */
 
// DB table to use
$table = 'User';
 
// Table's primary key
$primaryKey = 'id';
 
// Array of database columns which should be read and sent back to DataTables.
// The `db` parameter represents the column name in the database, while the `dt`
// parameter represents the DataTables column identifier. In this case simple
// indexes
$columns = array(
    array( 'db' => 'id', 'dt' => 'id' ),
    array( 'db' => 'name', 'dt' => 'name' ),
    array( 'db' => 'email',  'dt' => 'email' ),
    array( 'db' => 'contact',   'dt' => 'contact' ),
    array( 'db' => 'company',     'dt' => 'company' ),
    array( 'db' => 'businessType',     'dt' => 'businessType' ),
    array( 'db' => 'interested',     'dt' => 'interested' ),
    array( 'db' => 'website',     'dt' => 'website' ),
    array( 'db' => 'createdAt',     'dt' => 'createdAt' ),
    array( 'db' => 'updatedAt',     'dt' => 'updatedAt' ),
    array( 'db' => 'remark',     'dt' => 'remark' )
);
 
// SQL server connection information
$sql_details = array(
    'user' => $config['db']['user'],
    'pass' => $config['db']['pass'],
    'db'   => $config['db']['db'],
    'host' => $config['db']['host']
);
 
 
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * If you just want to use the basic configuration for DataTables with PHP
 * server-side, there is no need to edit below this line.
 */
 
require( 'lib/ssp.class.php' );



echo json_encode(
    SSP::simple( $_GET, $sql_details, $table, $primaryKey, $columns )
);