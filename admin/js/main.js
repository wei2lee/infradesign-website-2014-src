
$(function() {

    if($('.login-form').length){
        $('.login-form').loginForm({
            action : '../resources/api_admin.php?action=login',
            successRedirectURL : 'content.html'
        });
    }
    
    if($('.logout-btn').length) {
        $('.logout-btn').click(function(){
            var redirectURL = 'index.html';
            var action = '../resources/api_admin.php?action=logout';
            $.ajax({
                type:'POST',
                url:action,
                dataType:'json',
                complete: function() { 
                    console.log($(this));
                    console.log(this);
                    window.location.href = this.redirectURL;
                },
                redirectURL:redirectURL
            });
        });
    }
    
    if($('.user-crud').length){
        $('.user-crud').crud({
            tableSel : '.user-crud table',
            columns : [
                { data: "name", nullable : false,
                    validators: { 
                        notEmpty: {
                            message: 'The name is required and cannot be empty.'
                        }
                    }
                },
                { data: "email", nullable : true,
                    validators: { 
                        emailAddress : {
                            message: 'The input is not a valid email address.'
                        }
                    }
                },
                { data: "contact", nullable : true, validators: {  } },
                { data: "company", nullable : true, validators: {  } },
                { data: "website", nullable : true, render:GetColumnRenderer('link'),
                    validators: { 
                        callback: trueValidator ,
                        uri: { message: 'The input is not a valid url.' }
                    }
                },
                { data: "businessType", nullable : true, validators: {  } },
                { data: "interested", nullable : true, validators: {  } },
                { data: "createdAt", nullable : true, validators: {  }, type: 'date' },
                { data: "updatedAt", nullable : true, validators: {  }, type: 'date' }
            ],
            
            //ajax : '../resources/api_admin.php?action=read&target=user',
            serverSide : true,
            processing : true,
            ajax : '../resources/api_crud_user.php',
            actions : {
                add : '../resources/api_admin.php?action=new&target=user',
                delete : '../resources/api_admin.php?action=delete&target=user',
                update : '../resources/api_admin.php?action=update&target=user',
            },
            target : 'user',
            editorForm : { 
                tempSel : '#user-form', 
                columns : {
                    name:{render:'str2text'},
                    email:{render:'str2text'},
                    contact:{render:'str2text'},
                    company:{render:'str2text'},
                    website:{render:'str2text'},
                    businessType:{render:'str2text'},
                    interested:{render:'strs2checkboxes'}
                    
                }
            },
            addForm : {
                tempSel : '#user-form', 
                columns : {
                    name:{render:'str2text'},
                    email:{render:'str2text'},
                    contact:{render:'str2text'},
                    company:{render:'str2text'},
                    website:{render:'str2text'},
                    businessType:{render:'str2text'},
                    interested:{render:'strs2checkboxes'}
                }
            }
        });
    }  
    //post init
    $('[data-template]').remove();
  
});