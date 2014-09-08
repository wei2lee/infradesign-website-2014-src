
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
                { "data": "name"},
                { "data": "email" },
                { "data": "contact" },
                { "data": "company" },
                { "data": "businessType" },
                { "data": "interested" },
                { "data": "message" },
                { "data": "startDate", type: 'date' },
                { "data": "createdAt", type: 'date' },
                { "data": "updatedAt", type: 'date' }
            ],
            
            //ajax : '../resources/api_admin.php?action=read&target=user',
            serverSide : true,
            processing : true,
            ajax : '../resources/api_crud_user.php',
            target : 'user',
            editorForm : { 
                tempSel : '#user-form', 
                columns : {
                    name:{converter:'str2text'},
                    email:{converter:'str2text'},
                    contact:{converter:'str2text'},
                    company:{converter:'str2text'},
                    businessType:{converter:'str2text'},
                    message:{converter:'str2text'},
                    interested:{converter:'strs2checkboxes'}
                }
            },
            addForm : {
                tempSel : '#user-form', 
                columns : {
                    name:{converter:'str2text'},
                    email:{converter:'str2text'},
                    contact:{converter:'str2text'},
                    company:{converter:'str2text'},
                    businessType:{converter:'str2text'},
                    message:{converter:'str2text'},
                    interested:{converter:'strs2checkboxes'}
                }
            }
        });
    }  
    //post init
    $('[data-template]').remove();
  
});