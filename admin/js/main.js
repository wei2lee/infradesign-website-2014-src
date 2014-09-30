
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
                    window.location.href = this.redirectURL;
                },
                redirectURL:redirectURL
            });
        });
    }
    
    if($('.user-crud').length){
        $('.user-crud').crud({
            toolbar : [
                {
                    'refresh':null,
                    'add':null,
                    'delete':null,
                    'edit':null,
                    'select-all':null
                },
                {
                    'mail':null
                },
                {
                    'import':null,
                    'export':null
                }
            ],
            columns : [
                { data: "name", title: "Name", nullable : false, render:GetColumnRenderer('text'),
                    validators: { 
                        notEmpty: {
                            message: 'The name is required and cannot be empty.'
                        }
                    }
                },
                { data: "email", title: "Email", nullable : true, render:GetColumnRenderer('text'),
                    validators: { 
                        emailAddress : {
                            message: 'The input is not a valid email address.'
                        }
                    }
                },
                { data: "contact", title: "Contact", nullable : true, render:GetColumnRenderer('phone'), validators: {  } },
                { data: "company", title: "Company", nullable : true, render:GetColumnRenderer('text'), validators: {  } },
                { data: "website", title: "Website", nullable : true, render:GetColumnRenderer('link'),
                    validators: { 
                        callback: {
                            callback: GetBVValidators('true'),
                            message: '' 
                        },
                        uri: { 
                            message: 'The input is not a valid url.<br/>(valid pattern : http://www.abc.com)' 
                        }
                    }
                },
                { data: "interested", title: "Interested", nullable : true, render:GetColumnRenderer('text'), validators: {  } },
                { data: "businessType", title: "Business Type", nullable : true, render:GetColumnRenderer('text'), validators: {  } },
                { data: "remark", title: "Remark", nullable : true, render:GetColumnRenderer('text'), validators: {  }},
                { data: "updatedAt", title: "LastModified", nullable : true, render:GetColumnRenderer('text'), validators: {  }, type: 'date' }
                
                
            ],
            serverSide : false,
            processing : false,
            //ajax : '../resources/api_crud_user.php',
            "ajax":{
                url:"../resources/api_admin.php?action=select&target=user",
                type:"POST",
                dataSrc:function(json){ return json.data;}
            },
            actions : {
                add : '../resources/api_admin.php?action=new&target=user',
                delete : '../resources/api_admin.php?action=delete&target=user',
                update : '../resources/api_admin.php?action=update&target=user',
                export : '../resources/api_admin.php?action=export&target=user',
                import : '../resources/api_admin.php?action=import&target=user'
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
    
    if($('.agent-crud').length){
        $('.agent-crud').crud({
            toolbar : [
                {
                    'refresh':null,
                    'add':null,
                    'delete':null,
                    'edit':null,
                    'select-all':null
                },
                {
                    'mail':null
                },
                {
                    'import':null,
                    'export':null
                }
            ],
            columns : [
                { data: "firstName", title: "FirstName", nullable : false, render:GetColumnRenderer('text'),
                    validators: { 
                        notEmpty: {
                            message: 'The first name is required and cannot be empty.'
                        }
                    }
                },
                { data: "lastName", title: "LastName", nullable : false, render:GetColumnRenderer('text'),
                    validators: { 
                        notEmpty: {
                            message: 'The last name is required and cannot be empty.'
                        }
                    }
                },
                
                { data: "email", title: "Email", nullable : true, render:GetColumnRenderer('text'),
                    validators: { 
                        emailAddress : {
                            message: 'The input is not a valid email address.'
                        }
                    }
                },
                { data: "mobile", title: "Mobile", nullable : true, render:GetColumnRenderer('phone'), validators: {  } },
                { data: "role", title: "Role", nullable : false, render:GetColumnRenderer('text') },
                //{ data: "notifyOnRegistration", title: "Email Notify", nullable : false, render:GetColumnRenderer('bool') },
                { data: "remark", title: "Remark", nullable : true, render:GetColumnRenderer('text'), validators: {  }},
                { data: "updatedAt", title: "LastModified", nullable : true, render:GetColumnRenderer('text'), validators: {  }, type: 'date' }
                
                
            ],
            
            //ajax : '../resources/api_admin.php?action=read&target=user',
            serverSide : true,
            processing : true,
            ajax : '../resources/api_crud_agent.php',
            actions : {
                add : '../resources/api_admin.php?action=new&target=agent',
                delete : '../resources/api_admin.php?action=delete&target=agent',
                update : '../resources/api_admin.php?action=update&target=agent',
                export : '../resources/api_admin.php?action=export&target=agent',
                import : '../resources/api_admin.php?action=import&target=agent'
            },
            target : 'agent',
            editorForm : { 
                tempSel : '#agent-form', 
                columns : {
                    lastName:{render:'str2text'},
                    firstName:{render:'str2text'},
                    email:{render:'str2text'},
                    mobile:{render:'str2text'},
                    role:{render:'str2select'},
                    notifyOnRegistration:{render:'str2checkbox'},
                    remark:{render:'str2text'}
                }
            },
            addForm : {
                tempSel : '#agent-form', 
                columns : {
                    lastName:{render:'str2text'},
                    firstName:{render:'str2text'},
                    email:{render:'str2text'},
                    mobile:{render:'str2text'},
                    role:{render:'str2select'},
                    notifyOnRegistration:{render:'str2checkbox'},
                    remark:{render:'str2text'}
                }
            }
        });
    }  
    if($.fn.tree){
        if($('.agent-hierachy-crud').length){
            $('.agent-hierachy-crud').tree({
                toolbar : [
                    {
                        'refresh':null,
                        'expand-all':null,
                        'add-root':null
                    }
                ],
                target:'agent-hierachy',
                actions:{
                    read : '../resources/api_admin.php?action=read&target=agent-hierachy',
                    add : '../resources/api_admin.php?action=new&target=agent-hierachy',
                    delete : '../resources/api_admin.php?action=delete&target=agent-hierachy',
                    select_no_parent : '../resources/api_admin.php?action=select_no_parent&target=agent-hierachy'
                },
                addForm : {
                    tempSel : '#agent-hierachy-form',
                    columns: [
                        'lastName', 'firstName', 'role'
                    ]
                }
            });   
            
            var $hierachy = $('.agent-hierachy-crud');
            var $followup = $('.agent-followup-crud');
            $hierachy.on('click', 'li>.btn', function(){
                var users = [];
                var node = $(this).closest('li').data('tree.node');
                if(node && node.data) users.push(node.data);
                $followup.find('table').data("filter.users", users);
                $followup.find('table').DataTable().ajax.reload(); 
                $hierachy.find('li>.btn').removeClass('active');
                $(this).addClass('active');
            });
        }
        
        if($('.agent-followup-crud').length){
            var $followup = $('.agent-followup-crud');
            $followup.crud({
                toolbar : [
                    {
                        'refresh':null,
                        'add':null,
                        'delete':null,
                        'select-all':null
                    }
                ],
                columns : [
                    { data: "name", title: "Name", nullable : false, render:GetColumnRenderer('text') },
                    { data: "company", title: "Company", nullable : false, render:GetColumnRenderer('text') }
                ],
                iDisplayLength : 10,
                serverSide : false,
                processing : false,
                "ajax":{
                    url:"../resources/api_admin.php?action=read&target=agent-followup",
                    type:"POST",
                    data:function(req){
                        var users = $followup.find('table').data("filter.users") || [];
                        req.users = users;
                        return req;
                    },
                    dataSrc:function(json){ return json.data[0];}
                },
                "columns": [
                    { "data": "name", "title": "Name" },
                    { "data": "company", "title": "Company" }
                ],
                "actions": {
                    "add": "../resources/api_admin.php?action=add&target=agent-followup",
                    "delete": "../resources/api_admin.php?action=delete&target=agent-followup"
                },
                target : 'agent-followup',
                addForm : {
                    title : function(rowdata){
                        return 'Select follow-up users to Agent' + joinName(rowdata.lastName, rowdata.firstName);
                    },
                    tempSel : '#agent-followup-form', 
                    columns : {
                        'name':{},
                        'company':{}
                    },
                    selectRowsTableOption : {
                        dom: 'frtp',
                        ajax: {
                            url:"../resources/api_admin.php?action=select_no_parent&target=agent-followup",
                            type:"POST",
                            data:function(req){
                                var users = $followup.find('table').data("filter.users") || [];
                                req.users = users;
                                return req;
                            },
                            dataSrc:function(json){
                                return json.data[0];   
                            }
                        },
                        columns: [
                            {"data":"name", "title":"Name", "width":"50%"},
                            {"data":"company", "title":"Company", "width":"50%"}
                        ],
                        iDisplayLength: 7,
                        responsive: false
                    }
                }
            });
        }
    }
    
    
    function loadPage(evt) {
        var $container = $('#page-wrapper');
        var $prevcontentwrapper = $('.content-wrapper:visible');
        var defPathNames = ['user', 'users'];
        var error404url = 'error404';
        var $error404 = $('#content-wrapper-error404');
        var $loadingpage = $('#content-wrapper-pageloading');
        
        var pathNames = defPathNames;
        if(evt.pathNames.length > 0) pathNames = evt.pathNames;
        
        var currcontentwrapperid = 'content-wrapper-'+pathNames.join('-');
        var $currcontentwrapper = $('#'+currcontentwrapperid);
        if($currcontentwrapper.length == 0) {
            $prevcontentwrapper.hide();
            $error404.show();
            return;
        }else if($currcontentwrapper.is(':visible')) {
            return;
        }
        
        function onPreload(){
            $prevcontentwrapper.hide();
            $loadingpage.show();
        }
        function onLoaded(){
            $loadingpage.hide();
            $currcontentwrapper.delay(50).fadeIn(300);
        }
        onPreload();
        setTimeoutEx(onLoaded, Math.random() * 0.5);
        
        $('nav a[href!="#"]').each(function(){
            var href = $(this).attr('href');
            $(this).toggleClass('active', href == '#' + pathNames.join('/'));
        });
    }
    
    if($.address) {
    
        $.address.prevEvent = null;
        $.address.init(function(event) {
            $.address.prevEvent = event;
            loadPage(event);
        }).bind('change', function(event) {
            if($.address.prevEvent == null || event.value == $.address.prevEvent.value) return;
            $.address.prevEvent = event;
            loadPage(event);
        });
        
    }

    
    //post init
    $('[data-template]').remove();
  
});