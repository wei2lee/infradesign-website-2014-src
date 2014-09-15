<?php
include_once "lib/class.phpmailer.php";
include_once 'lib/PHPExcel.php';

function getResponseJSONString($error_exist, $error_no, $error_msg, $data) {
    $ret = array();
    $ret['error_exist'] = $error_exist;
    $ret['error_no'] = $error_no;
    $ret['error_msg'] = $error_msg;
    $ret['data'] = $data;
    return json_encode($ret);
}

function boolProperties2String($o){
    $ret = "";
    foreach($o as $key => $value){
        if($value == "true"){
            if($ret == "") $ret .= $key;
            else $ret .= ", " . $key;
        }
    }
    return $ret;
}

function getEscapeObjectProperties($o){
    foreach($o as $key => $value) {
        if(is_string($value)){
            $o[$key] = mysql_real_escape_string($value);   
        }
    }
}

class AUser {
    public $con;
    public $fields = array("id", "firstName", "lastName", "username", "email", "mobile", "mailChimpUsername", "role", "updatedAt");
    public $table = "AUser";
    public function getLoginQuery($user) {
        getEscapeObjectProperties($user);
        $authName = $user['authName'];
        $authPassword = $user['authPassword'];
        
        $q2 = "";
        foreach($this->fields as $key => $value) {
            if($q2 === "") $q2 .= " $value ";
            else $q2 .= " ,$value ";
        }
        
        $q = 
        " SELECT $q2 " . 
        " FROM {$this->table} " . 
        " WHERE role = 'admin' AND (username = '$authName' OR email = '$authName') AND password = '$authPassword'";
        return $q;
    }
    public function getOnLoginQuery($id) {
        $q = "UPDATE {$this->table} SET lastLoginAt = now() WHERE id = $id";
        return $q;
    }
}

class Form {
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
            if($q3 === "") $q3 .= ($value === null ? 'NULL' : "'" . $value . "'");
            else $q3 .= ',' . ($value === null ? 'NULL' : "'" . $value . "'");
        }
        $q = "INSERT INTO {$this->table} ($q2) VALUES ($q3)";
        return $q;
    }
    
    public function getMailMsgHTML() {
        $body = "";
        foreach($this->fields as $key => $value){
            $body .= "<b>" . ucfirst($key) . ":</b> $value<br/><br/>";
        }
        return $body;
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

class Mail {
    public $form;
    public $config;
    public function send() {
        $body = $form->getMailMsgHTML();
        $email = "mail.infradesign.com.my";
        $name = "no-reply@infradesign.com.my";
        $sender = "no-reply@infradesign.com.my";
        $subject = "Registration";
        $mailer = new PHPMailer();
        $mailer->IsSMTP();
        $mailer->SMTPDebug = 2;
        $mailer->SMTPAuth = true;
        $mailer->Host = $this->config['mail']['host'];
        $mailer->Port = $this->config['mail']['port'];
        $mailer->Username = $this->config['mail']['user'];
        $mailer->Password = $this->config['mail']['pass'];
        $mailer->CharSet = "UTF-8";
        $mailer->SetFrom($sender, $name);
        $mailer->AddAddress("christina@infradesign.com.my", "Christina Leong");
        $mailer->Subject = $subject;
        $mailer->MsgHTML($body);
    }
}
?>