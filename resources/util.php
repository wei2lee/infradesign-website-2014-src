<?php
include_once "lib/class.phpmailer.php";
include_once "lib/PHPExcel.php";


function getResponseJSONString($error_exist, $error_no, $error_msg, $data) {
    $ret = array();
    $ret['error_exist'] = $error_exist;
    $ret['error_no'] = $error_no;
    $ret['error_msg'] = $error_msg;
    $ret['data'] = $data;
    return json_encode($ret);
}

function boolProperties2String($o){
    $arr = array();
    foreach($o as $key => $value) if($value) $arr[] = $key;
    return implode(', ', $arr);
}

function getEscapeObjectProperties($o){
    foreach($o as $key => $value) {
        if(is_string($value)){
            $o[$key] = mysql_real_escape_string($value);   
        }
    }
}

function var_dump_p($o){
    echo '<pre>';
    var_dump($o);
    echo '</pre>';
}

function array_remove_not_exist_keys($array, $keys){
    $removekeys = array();
    foreach($array as $key => $val){
        
        $b = in_array($key, $keys);
        
        
        if(!$b){
            $removekeys[] = $key;
        }
    }
    foreach($removekeys as $removekey){
        unset($array[$removekey]);
    }
    return $array;
}

function sql_connect($sql_details){
    try {
        $db = @new PDO(
            "mysql:host={$sql_details['host']};dbname={$sql_details['db']}",
            $sql_details['user'],
            $sql_details['pass'],
            array( PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION )
        );
    }
    catch (PDOException $e) {
        echo getResponseJSONString(1,0,
            "An error occurred while connecting to the database. ".
            "The error reported by the server was: ".$e->getMessage(),
            ""
        );
        die();
    }
    return $db;
}

function val_map_binding($val){
    return ':' . $val;
}
function val_map_update_binding($val){
    return $val . ' = :' . $val;
}

class CRUD {
    public $db;
    public $selectfields;
    public $insertfields;
    public $updatefields;
    public $pk = "id";
    public $table;
    public $validators = array();
    public $onupdatedatetime = true;
    
    public function __construct($db) {
        $this->db=$db;
        
        if($this->updatefields == null) $this->updatefields = $this->insertfields;
    }
                   
    public static function stmt_bind($stmt, $value){
        foreach($value as $c => $v){
            $stmt->bindValue(':'.$c, $v);
        }
    }
    
    public function validate(&$values) {
        if(!is_array($values)) $values = array($values);
        $ret = true;
        foreach($values as &$value){
            foreach($this->validators as $k => $validator){
                if(isset($value[$k])){
                    //ret : validate pass or fail
                    //inout param : format the in value and out
                    if(!$validator($value[$k])){
                        $ret = false;   
                    }
                }
            }
        }
        return $ret;
    }
    
    public function insert($values){
        if(!is_array($values)) $values = array($values);
        
        //TODO validate value
        $this->validate($values);

        //TODO permission to insert
        
        $array0 = array_remove_not_exist_keys($values[0], $this->insertfields);
        
        
        
        $col = implode(', ', array_keys($array0));
        $bind = implode(',', array_map("val_map_binding", array_keys($array0)));
        $pkbind = ":{$this->pk}";
        $q = "INSERT INTO {$this->table} ($col) VALUES ($bind)";
        $stmt = $this->db->prepare($q);
        
        if($this->onupdatedatetime){
            $q2 = "UPDATE  {$this->table} SET createdAt = now(), updatedAt = now() WHERE {$this->pk} = $pkbind";
            $stmt2 = $this->db->prepare($q2);
        }

        //*/
        foreach($values as $value){
            
            self::stmt_bind($stmt, $value);
            if($stmt->execute() && $this->onupdatedatetime){
                $stmt2->bindValue($pkbind, intval($this->db->lastInsertId()), PDO::PARAM_INT);
                
                
                $stmt2->execute();
            }
        }
        
        return $values;
    }
    
    public function update($values){
        if(!is_array($values)) $values = array($values);
        
        //TODO validate value here
        $this->validate($values);
        
        //TODO permission to update
        
        $array0 = array_remove_not_exist_keys($values[0], $this->updatefields);
        $bind = implode(', ', array_map("val_map_update_binding", array_keys($array0)));
        $pkbind = ":{$this->pk}";
        $q = "UPDATE {$this->table} SET $bind WHERE {$this->pk} = $pkbind";
        $stmt = $this->db->prepare($q);
        
        $q2 = "UPDATE {$this->table} SET updatedAt = now() WHERE $pk = $pkbind";
        $stmt2 = $this->db->prepare($q2);
        
        foreach($values as $value){
            self::stmt_bind($stmt, $value);
            $stmt->bindValue($pkbind, $value[$this->pk]);
            if($stmt->execute() && $this->$onupdatedatetime){
                $stmt2->bindValue($pkbind, $value[$this->pk], PDO::PARAM_INT);
                $stmt2->execute();
            }
        }
    }
                   
    public function insertOrUpdate($values){
        if(!is_array($values)) $values = array($values);
        
        //TODO validate value here
        $this->validate($values);
        
        //TODO permission to update
        
        $array0 = array_remove_not_exist_keys($values[0], $this->updatefields);
        $col = implode(', ', array_keys($array0));
        $updbind = implode(', ', array_map("val_map_update_binding", array_keys($array0)));
        $insbind = implode(',', array_map("val_map_binding", array_keys($array0)));
        $pkbind = ":{$this->pk}";
        $q = "UPDATE {$this->table} SET $updbind WHERE {$this->pk} = $pkbind";
        $upd_stmt = $this->db->prepare($q);
        
        $q2 = "UPDATE {$this->table} SET updatedAt = now() WHERE $pk = $pkbind";
        $upded_stmt = $this->db->prepare($q2);
        
        $q3 = "INSERT INTO {$this->table} ($col) VALUES($insbind)";
        $ins_stmt = $this->db->prepare($q2);
        
        foreach($values as $value){
            self::stmt_bind($upd_stmt, $value);
            $upd_stmt->bindValue($pkbind, $value[$this->pk], PDO::PARAM_INT);
            $upded_stmt->execute();
            if($upd_stmt->rowCount()){
                if($this->$onupdatedatetime){
                    $upded_stmt->bindValue($pkbind, $value[$this->pk], PDO::PARAM_INT);
                    $upded_stmt->execute();
                }
            }else{
                self::stmt_bind($ins_stmt, $value);
                if($ins_stmt->execute() && $this->$onupdatedatetime){
                    $upded_stmt->bindValue($pkbind, intval($this->db->lastInsertId()), PDO::PARAM_INT);
                    $upded_stmt->execute();
                }
            }
        }
    }
    
    public function delete($values){
        //TODO permission to delete
        
        if(!is_array($values)) $values = array($values);
        $pkbind = ":{$this->pk}";
        $q = "DELETE FROM {$this->table} WHERE {$this->pk} = $pkbind";  
        $stmt = $this->db->prepare($q);
        foreach($values as $value){
            $stmt->bindValue($pkbind, $value[$this->pk], PDO::PARAM_INT);
            $stmt->execute();
        }
    }
    
    public function select($columns=null, $filter="", $order="", $limit=""){
        //TODO filter,order,limit
        
        //TODO permission to select
        
        
        if($columns == null) $columns = $this->selectfields;
        
        $col = implode(', ', $columns);
        $q = "SELECT $col FROM {$this->table} $filter";
        $stmt = $this->db->prepare($q);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
                   
    public function export() {
        $res = $this->select();

        $objPHPExcel = new PHPExcel();
        $F=$objPHPExcel->getActiveSheet();
        $Line=1;
        $col=0;
        foreach($this->readFields as $key => $value) {
            $F->setCellValueByColumnAndRow($col, $Line, $value);
            $col++;
        }
        ++$Line;
        while($r=mysqli_fetch_assoc($res)){//extract each record
            $col = 0;
            foreach($r as $key => $value) {
                if($value === null) $value = '';
                $F->setCellValueByColumnAndRow($col, $Line, $value);
                $col++;
            }
            ++$Line;
        }
        // Redirect output to a client’s web browser (Excel5)
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="report.xls"');
        header('Cache-Control: max-age=0');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        $objWriter->save('php://output');
    }
    
    public function import($files, $con) {
        if($files == null || count($files) == 0) {
            echo getResponseJSONString(1, 0, 'No file is uploaded', '');
            die();
        }
        try {
            $objPHPExcel = PHPExcel_IOFactory::load($files[0]['tmp_name']);
            $worksheet = $objPHPExcel->getActiveSheet();
            $highestRow         = $worksheet->getHighestRow(); // e.g. 10
            $highestColumn      = $worksheet->getHighestColumn(); // e.g 'F'
            $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);

            $rows = array();
            for ($row = 2; $row <= $highestRow; ++ $row) {
                $row = array();
                $rows[] = $row;
                for ($col = 0; $col < $highestColumnIndex; ++ $col) {
                    $cell = $worksheet->getCellByColumnAndRow($col, $row);
                    $key = mysql_real_escape_string($worksheet->getCellByColumnAndRow($col, 1));
                    $val = mysql_real_escape_string($cell->getValue());
                    $row[$key] = $val;
                }
            }
            $this->insertOrUpdate($rows);
        } catch(Exception $e) {
            echo getResponseJSONString(1, 0, 'Error loading file '.$e->getMessage());
            die();
        }
    }
}


class AUser extends CRUD{
    public $loginfields;
    public $table = "AUser";
    
    public function __construct($db) {
        $this->db=$db;
        $this->loginfields = array("id", "firstName", "lastName", "username", "email", "mobile", "role", "updatedAt");
        $this->selectfields = array("id", "firstName", "lastName", "username", "email", "mobile", "role", "updatedAt", "remark");
        $this->insertfields = array("firstName", "lastName", "username", "email", "mobile", "role", "remark");
        $this->updatefields = $this->insertfields;
    }
    public function login($user) {
        $col = implode(', ', $this->fields);
        $q = 
        " SELECT $col " . 
        " FROM {$this->table} " . 
        " WHERE (username = :authName OR email = :authName) AND password = :authPassword" .
        " LIMIT 1 " ;
        $stmt = $this->db->prepare($q);
        $stmt->bindValue(':authName', $user['authName']);
        $stmt->bindValue(':authPassword', $user['authPassword']);
        $stmt->execute();
        $res = $stmt->fetchAll();

        if(count($res) > 0){
            $q = "UPDATE {$this->table} SET lastLoginAt = now() WHERE id = :id";
            $stmt = $this->db->prepare($q);
            $stmt->bindValue(':id', $res[0]['id']);
            $stmt->execute();
            return $res[0];
        }else{
            return null;   
        }
    }
    
    public function getNotifyEmails(){
        return $this->db->query("SELECT firstName, lastName, email, mobile FROM {$this->table} WHERE notifyOnRegistration = 1", PDO::FETCH_ASSOC);
    }
}

class User extends CRUD {
    public $table = "User";
    
    public function __construct($db) {
        $this->db=$db;
        $this->selectfields = array("id", 'name', 'email', 'contact', 'company', 'businessType', 'startDate', 'website', 'message', 'budget', 'interested', 'remark');
        $this->insertfields = array('name', 'email', 'contact', 'company', 'businessType', 'startDate', 'website', 'message', 'budget', 'interested', 'remark');
        $this->updatefields = $this->insertfields;
        
        $this->validators['interested'] = function(&$value){
            if(is_array($value)){
                $altvals = array(
                    '/prosalesdemoversion/i'=>'prosales', 
                    '/augmented-reality/i'=>'ar',
                    '/virtual-tour/i'=>'vt',
                    '/mobileapplication/i'=>'mobileapp');
                $value = boolProperties2String($value);
                foreach($altvals as $altk => $altv){
                    $value = preg_replace($altk, $altv, $value); 
                }
            }else if(is_string($value)){
            }else{
                $value = "";
            }
            return true;
        };  
    }
}




class Form {
    public $interestedValues = array(
        'prosales'=>array('prosalesdemoversion'), 
        'ar'=>array('augmented-reality'), 
        'vt'=>array('virtual-tour'), 
        'crm'=>array('crm'), 
        'saleskit'=>array('saleskit'),
        'mobileapp'=>array('mobileapplication'));
    public $readFields = array("id","name","email","contact","company","businessType","interested","website","createdAt","updatedAt");
    public $editFields = array("name","email","contact","company","businessType","interested","website");
    public $importFields = array("name","email","contact","company","businessType","interested","website","createdAt","updatedAt");
    public $config;
    public $con;
    public $fields = array(
        'name'=>null, 'email'=>null, 'contact'=>null, 'company'=>null, 
        'businessType'=>null, 'startDate'=>null, 'website'=>null,
        'message'=>null, 'budget'=>null, 'interested'=>null
    );
    public $table = "User";
    
    public function getFixedInterested($value) {
        $array = explode(', *', $value);
        foreach($array as $k => $v) {
            foreach($this->interestedValues as $ak => $av) {
                if(in_array($av, $v)){
                    $array[$k] = $ak;   
                }
            }
        }
        return implode(',', $array);
    }
    
    public function set($post) {
        foreach ($post as $key => $value) {
            if(!array_key_exists($key, $this->fields)) {
                continue;   
            }
            $displayName = $key;   
            $displayValue = "";
            if($key == "interested"){
                $displayValue = boolProperties2String($value);
            }else{
                $displayValue = $value; 
            }
            $this->fields[$key] = $displayValue;
        }
    }

    public function getReadQuery() {
        $q2 = "";
        foreach($this->readFields as $key => $value){
            if($q2 === "") $q2 .= $value;
            else $q2 .= "," . $value;
        }
        $q = "SELECT $q2 FROM {$this->table} WHERE role = 'client'";  
        return $q;
    }
    
    public function getEditQuery($user) {
        getEscapeObjectProperties($user);
        $q2 = "";
        foreach($user as $key => $value) {
            if(!in_array($key, $this->editFields)) continue;
            if($q2 === "") $q2 .= "$key = '$value'";
            else $q2 .= " , $key = '$value'";
        }
        $q = "UPDATE {$this->table} SET $q2 WHERE id = ${user['id']}";
        return $q;
    }
    public function getDeleteQuery($user) {
        getEscapeObjectProperties($user);
        $q = "DELETE FROM {$this->table} WHERE id = ${user['id']}";   
        return $q;
    }
               
    public function getNewQuery($user) {
        getEscapeObjectProperties($user);
        $q2 = "";
        foreach($user as $key => $value) {
            if(!array_key_exists($key, $this->fields)) continue;
            if($q2 === "") $q2 .= $key;
            else $q2 .= " , " . $key;
        }
        $q3 = "";
        foreach($user as $key => $value) {
            if(!array_key_exists($key, $this->fields)) continue;
            if($q3 === "") $q3 .= ($value === null ? 'NULL' : "'" . $value . "'");
            else $q3 .= " , " . ($value === null ? 'NULL' : "'" . $value . "'");
        }
        $q = "INSERT INTO {$this->table} ($q2) VALUES ($q3)";
        return $q;
    }
    
    public function getInsertQuery() {
        $q2 = "";
        foreach($this->fields as $key => $value){
            if($q2 === "") $q2 .= $key;
            else $q2 .= ',' . $key;
        }
        $q3 = "";
        foreach($this->fields as $key => $value){
            //if($key == "interested") {
            //    $value = getFixedInterested($value);  
            //}
            if($q3 === "") $q3 .= ($value === null ? 'NULL' : "'" . $value . "'");
            else $q3 .= ',' . ($value === null ? 'NULL' : "'" . $value . "'");
        }
        $q = "INSERT INTO {$this->table} ($q2) VALUES ($q3)";
        return $q;
    }
    
    public function getOnInsertQuery($user, $con) {
        $id = mysqli_insert_id($con);
        $q2 = "id = $id";
        $q = "UPDATE {$this->table} SET createdAt = now(), updatedAt = now() WHERE $q2"; 
        return $q;
    }
    public function getOnUpdateQuery($user) {
        getEscapeObjectProperties($user);
        $q2 = "id = ${user['id']}";
        $q = "UPDATE {$this->table} SET updatedAt = now() WHERE $q2";   
        return $q;
    }
    
    
    public function export() {
        $q = $this->getReadQuery();
        
        $res=mysqli_query($this->con, $q);//get the result (ressource)
        /** Include PHPExcel */


        // Create new PHPExcel object
        $objPHPExcel = new PHPExcel();
        $F=$objPHPExcel->getActiveSheet();
        $Line=1;
        $col=0;
        foreach($this->readFields as $key => $value) {
            $F->setCellValueByColumnAndRow($col, $Line, $value);
            $col++;
        }
        ++$Line;
        while($r=mysqli_fetch_assoc($res)){//extract each record
            $col = 0;
            foreach($r as $key => $value) {
                if($value === null) $value = '';
                $F->setCellValueByColumnAndRow($col, $Line, $value);
                $col++;
            }
            ++$Line;
        }
        // Redirect output to a client’s web browser (Excel5)
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="report.xls"');
        header('Cache-Control: max-age=0');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        $objWriter->save('php://output');
    }
    
    public function import($files, $con) {
        if($files == null || count($files) == 0) {
            echo getResponseJSONString(1, 0, 'No file is uploaded', '');
            die();
        }
        try {
            $objPHPExcel = PHPExcel_IOFactory::load($files[0]['tmp_name']);
            $worksheet = $objPHPExcel->getActiveSheet();
            $highestRow         = $worksheet->getHighestRow(); // e.g. 10
            $highestColumn      = $worksheet->getHighestColumn(); // e.g 'F'
            $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);

            for ($row = 2; $row <= $highestRow; ++ $row) {
                $q = "";
                $q2 = "";
                $q3 = "";
                $q4 = "";
                $id = "";
                for ($col = 0; $col < $highestColumnIndex; ++ $col) {
                    $propName = $worksheet->getCellByColumnAndRow($col, 1);
                    if($propName == "id") {
                        $cell = $worksheet->getCellByColumnAndRow($col, $row);
                        $id = mysql_real_escape_string($cell->getValue());
                        continue;
                    }
                    if(!in_array($propName, $this->importFields)) continue;


                    $cell = $worksheet->getCellByColumnAndRow($col, $row);
                    $val = mysql_real_escape_string($cell->getValue());

                    //insert fields, values
                    $q3 .= ($q3 === ""?"":", ") . $propName;
                    $q4 .= ($q4 === ""?"":", ") . "'$val'";
                    //update
                    $q2 .= ($q2 === ""?"":", ") .  " $propName = '$val' ";
                }
                if($id == ""){
                    $q = "INSERT INTO $this->table ($q3) VALUES($q4)";
                }else{
                    $q = "UPDATE $this->table SET $q2 WHERE id = $id";
                }
                $res = mysqli_query($con, $q);
                if (mysqli_errno($con)) {
                    echo getResponseJSONString(1, 0, "MySQL error: " . mysqli_error($con));
                    die();
                }
            }
        } catch(Exception $e) {
            echo getResponseJSONString(1, 0, 'Error loading file '.$e->getMessage());
            die();
        }
    }
};

class NotifyOnRegistrationEmailTemplate {
    public function render($data) {
        $body = "";
        
        foreach($data as $key => $value){
            $body .= "<b>" . ucfirst($key) . ":</b> $value<br/><br/>";
        }
        return $body;
    }
}

class Mail {
    public $templateData;
    public $template;
    public $config;
    public $subject = "Registration";
    public $addresses;
    public function send() {
        $body = $this->template->render($this->templateData);
        $email = "mail.infradesign.com.my";
        $name = "no-reply@infradesign.com.my";
        $sender = "no-reply@infradesign.com.my";
        $subject = $this->subject;
        
        $mailer = new PHPMailer();
        $mailer->IsSMTP();
        $mailer->SMTPDebug = false;
        $mailer->SMTPAuth = true;
        $mailer->Host = $this->config['smtp']['host'];
        $mailer->Port = $this->config['smtp']['port'];
        $mailer->Username = $this->config['smtp']['user'];
        $mailer->Password = $this->config['smtp']['pass'];
        $mailer->CharSet = "UTF-8";
        $mailer->SetFrom($sender, $name);
        foreach($this->addresses as $k => $address) {
            $mailer->AddAddress($address[0], $address[1]);
        }
        $mailer->Subject = $subject;
        $mailer->MsgHTML($body);
        
        if(!$mailer->send()) {
            echo getResponseJSONString(1, 0, 'Error sending email', '');
            die();
        }
    }
}
?>