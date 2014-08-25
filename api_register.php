<?php
	require_once("inc/class.phpmailer.php");
    function boolProperties2String($o){
        $ret = "";
        foreach($o as $key => $value){
            if($value){
                if($ret == "") $ret .= $key;
                else $ret .= ", " . $key;
            }
        }
        return $ret;
    }
    $body = "";
    $email = "mail.infradesign.com.my"
    $name = "infradesign.com.my Admin";
    foreach ($_POST as $key => $value) {
        $displayName = "";
        $displayValue = "";

        $displayName = $key;   
        if($key == "interest"){
            $displayValue = boolProperties2String($value);
        }else{
            $displayValue = $value; 
        }
        $displayName = ucfirst($displayName);
        $body .= "<b>$displayName:</b> $displayValue<br/><br/>";
    }

	
	$sender = ($email != "" ? $email : "info@infradesign.com.my");
	$subject = "Registration";
	
	$mailer = new PHPMailer();
	$mailer->IsSMTP();
	$mailer->SMTPDebug = 2;
	$mailer->SMTPAuth = true;
	$mailer->Host = "mail.infradesign.com.my";
	$mailer->Port = 25;
	$mailer->Username = "site@infradesign.com.my";
	$mailer->Password = "m6z--K5[bU?W";
	$mailer->CharSet = "UTF-8";
	$mailer->SetFrom($sender, $name);
	$mailer->AddReplyTo($sender, $name);
	$mailer->AddAddress("christina@infradesign.com.my", "Christina Leong");
	$mailer->Subject = $subject;
	$mailer->MsgHTML($body);
	
	if($mailer->Send())
		print "result=true";
	else
		print "result=false";
?>
