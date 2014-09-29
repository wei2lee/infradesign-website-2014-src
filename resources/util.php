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
        //$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        //$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
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

class TreeCRUD {

    
    public $db;
    public $selectfields;
    public $insertfields;
    public $table;
    public $parentId = 'parentId';
    public $childId = 'childId';
    
    public $isSingleRoot = true;
    public $isParentChildSameTable = true;
    
    public $parentTableId = 'id';
    public $parentTable;//which table will included in select when output tree
    public $parentTableFields; //which column will included in select when output tree
    
    public $childTableId = 'id';
    public $childTable;
    public $childFields;
    
    public $nodeDataProp = 'data';
    public $nodeChildrenProp = 'children';
    public $nodeTreeProp = 'tree';
    
    public $validators;
    
    public function __construct($db) {
        $this->db=$db;
    }
    
    public function select_no_parent() {
        $col = implode(', ', $this->parentTableFields);
        $q = "SELECT $col FROM {$this->parentTable} WHERE {$this->parentTable}.{$this->parentTableId} NOT IN (SELECT DISTINCT {$this->childId} FROM {$this->table})";
        $stmt = $this->db->prepare($q);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }
    
    public function select($data = null) {
        $id = null;
        if($data && array_key_exists("id", $data)) $id = $data["id"];
        
        $col = implode(', ', $this->parentTableFields);
        $parentfieldq = "SELECT $col FROM {$this->parentTable} WHERE {$this->parentTableId} = :{$this->parentTableId} LIMIT 1";   
        $parentfieldstmt = $this->db->prepare($parentfieldq);
        
        $selectchildq = "SELECT {$this->childId} FROM {$this->table} WHERE {$this->parentId} = :{$this->parentId}";
        $selectchildstmt = $this->db->prepare($selectchildq);
        
        $selectchildnullq = "SELECT {$this->childId} FROM {$this->table} WHERE {$this->parentId} IS NULL LIMIT 1";
        $selectchildnullstmt = $this->db->prepare($selectchildnullq);

        $class = __CLASS__;
        $recursiveSelect = function($_id) use ($class, &$recursiveSelect, $selectchildstmt, $selectchildnullstmt, $parentfieldstmt){
            $id = $_id == null ? null : intval($_id);
            
            $class::stmt_bind_value($parentfieldstmt, $this->parentTableId, $id);
            $parentfieldstmt->execute();
            $data = $parentfieldstmt->fetchAll(PDO::FETCH_ASSOC);
            if(count($data)) $data = $data[0];
            else $data = null;
            
            if(!is_null($id)){
                $class::stmt_bind_value($selectchildstmt, $this->parentId, $id);
                $selectchildstmt->execute();
                $childids = $selectchildstmt->fetchAll(PDO::FETCH_ASSOC);
                
            }else{
                $selectchildnullstmt->execute();
                $childids = $selectchildnullstmt->fetchAll(PDO::FETCH_ASSOC);
                
            }

            $node = array();
            $node[$this->nodeDataProp] = $data;
            
            $node[$this->nodeChildrenProp] = array();
            foreach($childids as $childid){
                $childnode = $recursiveSelect($childid[$this->childId]);
                $node[$this->nodeChildrenProp][] = $childnode;
            }
            return $node;
        };
        $root = $recursiveSelect($id);
        if(is_null($id) && $this->isSingleRoot && count($root[$this->nodeChildrenProp])){
            //$root = $root[$this->nodeChildrenProp][0];
        }
        return array($this->nodeTreeProp => $root);
    }
       
    public static function findObjectWithProp($key, $val, $array) {
        $ret = array();
        foreach($array as $ele){
            if(array_key_exists($key, $ele)){
                if($ele[$key] === $val) $ret[] = $ele;
            }
        }
        return $ret;
    }
    
    public function insert($data){
        if(!is_array($data)) $data = array($data);
        $q = "INSERT INTO {$this->table} ({$this->parentId}, {$this->childId}) VALUES (:{$this->parentId}, :{$this->childId})";
        $stmt = $this->db->prepare($q);
        $allowfield = array($this->parentId, $this->childId);
        foreach($data as $d){
            //self::stmt_bind($stmt, $d, $allowfield);
            $stmt->bindValue(":{$this->parentId}", empty($d[$this->parentId]) ? null : $d[$this->parentId]);
            $stmt->bindValue(":{$this->childId}", $d[$this->childId]);
            $stmt->execute();
        }
    }
    public function delete($data){
        if(!is_array($data)) $data = array($data);
        
        $q = "SELECT {$this->childId} FROM {$this->table} WHERE {$this->parentId} = :{$this->parentId}";
        $stmt = $this->db->prepare($q);
        
        $delchildq = "DELETE FROM {$this->table} WHERE {$this->parentId} = :{$this->parentId}";
        $delchildstmt = $this->db->prepare($delchildq);
        
        $delselfq = "DELETE FROM {$this->table} WHERE {$this->childId} = :{$this->childId}";
        $delselfstmt = $this->db->prepare($delselfq);
          
        $class = __CLASS__;
        $recursiveDelete = function($parentid) use ($class, &$recursiveDelete, $stmt, $delchildstmt, $delselfstmt){
            $class::stmt_bind_value($stmt, $this->parentId, $parentid);
            $stmt->execute();
            $childrows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $class::stmt_bind_value($delselfstmt, $this->childId, $parentid);
            $delselfstmt->execute();
            
            foreach($childrows as $childrow){
                $recursiveDelete($childrow[$this->childId]);   
            }
        };
        
        foreach($data as $d){
            $id = $d[$this->parentTableId];
            $id = $id == null ? null : intval($id);
            $recursiveDelete($id);    
        }
    }
    public function update($data){
        
    }
    
    public static function stmt_bind($stmt, $value, $allowfields = null){
        foreach($value as $c => $v){
            if($allowfields == null || in_array($c, $allowfields)){
                //$stmt->bindValue(':'.$c, $v);
                self::stmt_bind_value($stmt, $c, $v);
            }
        }
    }
    
    public static function stmt_bind_value($stmt, $key, $value){
        $valid = true;
        $param = FALSE;
        if(is_int($value))
            $param = PDO::PARAM_INT;
        elseif(is_bool($value))
            $param = PDO::PARAM_BOOL;
        elseif(is_null($value))
            $param = PDO::PARAM_NULL;
        elseif(is_string($value))
            $param = PDO::PARAM_STR;
        else
            $valid = false;

        if($valid){
            $stmt->bindValue(":$key",$value,$param);
        }
    }
}

class RelationCRUD {
    public $db;
    public $selectfields;
    public $insertfields;
    public $table;
    public $parentId = 'parentId';
    public $childId = 'childId';
    
    public $isParentChildSameTable = false;
    
    public $parentTableId = 'id';
    public $parentTable;//which table will included in select when output tree
    public $parentTableFields; //which column will included in select when output tree
    
    public $childTableId = 'id';
    public $childTable;
    public $childFields;
    
    public $nodeDataProp = 'data';
    public $nodeChildrenProp = 'children';
    public $nodeTreeProp = 'tree';
    
    public $validators;
}

class AgentHierachy extends TreeCRUD {
    public function __construct($db) {
        $this->db=$db;
        
        $this->selectfields = array('parentId', 'childId');
        $this->insertfields = array('parentId', 'childId');
        $this->table = 'AUserHierachy';
        $this->parentId = 'parentId';
        $this->childId = 'childId';
        
        $this->parentTableId = 'id';
        $this->parentTable = 'AUser';
        $this->parentTableFields = array('id', 'firstName', 'lastName', 'role');
    }
}

class AgentFollowup extends RelationCRUD {
    public function __construct($db) {
        $this->db=$db;
        
        $this->selectfields = array('parentId', 'childId');
        $this->insertfields = array('parentId', 'childId');
        $this->table = 'AUserFollowup';
        $this->parentId = 'parentId';
        $this->childId = 'childId';
        
        $this->parentTableId = 'id';
        $this->parentTable = 'AUser';
        $this->parentTableFields = array('id', 'firstName', 'lastName');
        
        $this->childTableId = 'id';
        $this->childTable = 'User';
        $this->childTableFields = array('id', 'name');
    }
    
    public function select($columns=null, $rowids=null, $filter=null, $order=null, $limit=null) {
        $class = __CLASS__;
        
        $map = function($v){ return "$this->childTable.$v"; };
        $col = array_map($map, $this->childTableFields);
        $col = implode(', ', $col);
        
        $q = 
        " SELECT {$this->table}.{$this->parentId}, $col FROM {$this->table} INNER JOIN {$this->childTable} ON {$this->table}.{$this->childId} = {$this->childTable}.{$this->childTableId} ";
        if(is_array($rowids) && count($rowids)) $q .= " WHERE {$this->table}.{$this->childId} = :{$this->childId}";
        
        $stmt = $this->db->prepare($q);
        
        $res = array();
        if(is_array($rowids) && count($rowids)){
            foreach($data as $d){
                $stmt->bindValue(":{$this->childId}", $rowids[$this->childId]);
                $stmt->execute();
                $res[] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
        }else{
            $stmt->execute();
            $res[] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        return $res;
    }
    
    public function insert($data) {
        if(!is_array($data)) $data = array($data);
    }
    
    public function delete($data){
        if(!is_array($data)) $data = array($data);
    }
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
                   
    public static function stmt_bind($stmt, $value, $allowfields = null){
        foreach($value as $c => $v){
            if($allowfields == null || in_array($c, $allowfields))
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
            
            self::stmt_bind($stmt, $value, $this->insertfields);
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
        
        $q2 = "UPDATE {$this->table} SET updatedAt = now() WHERE {$this->pk} = $pkbind";
        $stmt2 = $this->db->prepare($q2);
        
        foreach($values as $value){
            self::stmt_bind($stmt, $value, $this->updatefields);
            $stmt->bindValue($pkbind, $value[$this->pk]);
            if($stmt->execute() && $this->onupdatedatetime){
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
        
        $q2 = "UPDATE {$this->table} SET updatedAt = now() WHERE {$this->pk} = $pkbind";
        $upded_stmt = $this->db->prepare($q2);
        
        $q3 = "INSERT INTO {$this->table} ($col) VALUES($insbind)";
        $ins_stmt = $this->db->prepare($q2);
        
        foreach($values as $value){
            self::stmt_bind($upd_stmt, $value, $this->updatefields);
            $upd_stmt->bindValue($pkbind, $value[$this->pk], PDO::PARAM_INT);
            $upded_stmt->execute();
            if($upd_stmt->rowCount()){
                if($this->onupdatedatetime){
                    $upded_stmt->bindValue($pkbind, intval($value[$this->pk]), PDO::PARAM_INT);
                    $upded_stmt->execute();
                }
            }else{
                self::stmt_bind($ins_stmt, $value, $this->updatefields);
                if($ins_stmt->execute() && $this->onupdatedatetime){
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
            $stmt->bindValue($pkbind, intval($value[$this->pk]), PDO::PARAM_INT);
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

        $col = implode(', ', $this->loginfields);
        $q = 
        " SELECT $col " . 
        " FROM {$this->table} " . 
        " WHERE (username = :authName OR email = :authName) AND password = :authPassword" .
        " LIMIT 1 " ;
        $stmt = $this->db->prepare($q);
        $stmt->bindValue(':authName', $user['authName'], PDO::PARAM_STR);
        $stmt->bindValue(':authPassword', $user['authPassword'], PDO::PARAM_STR);
        
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
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