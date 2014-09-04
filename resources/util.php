<?php
include_once "lib/class.phpmailer.php";
function getResponseJSONString($error_exist, $error_no, $error_msg, $data) {
    $ret = array();
    $ret['error_exsit'] = $error_exist;
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

class Form {
    public $readFields = array("id","name","email","contact","company","businessType","interested","startDate","message","budget","createdAt","updatedAt");
    public $editFields = array("name","email","contact","company","businessType","interested","startDate","message","budget");
    public $config;
    public $fields = array(
        'name'=>null, 'email'=>null, 'contact'=>null, 'company'=>null, 
        'businessType'=>null, 'startDate'=>null, 
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
    public function getLoginQuery($user) {
        getEscapeObjectProperties($user);
        $authName = $user['authName'] || '';
        $authPassword = $user['$authPassword'] || '';
        $q = "SELECT count(*) FROM $table WHERE client = 'client' AND authName = '$authName' AND authPassword = '$authPassword'";
        return $q;
    }
    
    public function getReadQuery() {
        $q2 = "";
        foreach($this->readFields as $key => $value){
            if($q2 === "") $q2 .= $value;
            else $q2 .= "," . $value;
        }
        $q = "SELECT $q2 FROM $table";
        return $q;
    }
    
    public function getEditQuery($user) {
        getEscapeObjectProperties($user);
        $q2 = "";
        foreach($user as $key => $value) {
            if(!in_array($key, $this->editFields)) continue;
            if($q2 === "") $q2 .= $key . " = " . $value;
            else $q2 .= " , " . $key . " = " . $value;
        }
        $q = "UPDATE $table SET " . $q2 . "WHERE id = " . $user['id'];
        return $q;
    }
    public function getDeleteQuery($user) {
        getEscapeObjectProperties($user);
        $q = "DELETE FROM $table WHERE id = " . $user['id'];   
        return $q;
    }
               
    public function getNewQuery($user) {
        getEscapeObjectProperties($user);
        $q2 = "";
        foreach($user as $key => $value) {
            if(!in_array($key, $this->fields)) continue;
            if($q2 === "") $q2 .= $key;
            else $q2 .= " , " . $key;
        }
        $q3 = "";
        foreach($user as $key => $value) {
            if(!in_array($key, $this->fields)) continue;
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