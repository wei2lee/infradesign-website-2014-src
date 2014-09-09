var bootbox_alert2 = function(option) {
    option.title = option.title;
    option.message = '<p class="text-danger">' + option.message + '</p>';
    option.className = 'modal-alert2',
    option.buttons = {
            Close:{
                label:'Close',
                className:'btn-primary',
                callback:function(){
                    //bootbox.hideAll();    
                }
            }
        }
    
    var $dialog = bootbox.dialog(option);
    /*
    var $md = $dialog.find('.modal-dialog');
    var w = $md.width();
    var mtop = parseInt($md.css('margin-top'));
    $md.css('margin-top', mtop*2+'px');
    $md.width(0.9 * w);//*/
}

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

$.event.special.inputchange = {
    setup: function() {
        var self = this, val;
        $.data(this, 'timer', window.setInterval(function() {
            val = self.value;
            if ( $.data( self, 'cache') != val ) {
                $.data( self, 'cache', val );
                $( self ).trigger( 'inputchange' );
            }
        }, 20));
    },
    teardown: function() {
        window.clearInterval( $.data(this, 'timer') );
    },
    add: function() {
        $.data(this, 'cache', this.value);
    }
};



var formFieldRenderers = {
    str2text:{
        render:function(raw, $ele, col){
            if(raw === null)raw=''; 
            $ele.val(raw); 
        },
        get:function(raw, $ele, col){
            var v = $ele.val().trim(); 
            if(col.nullable && v === '') v = null; 
            return v; 
        }
    },
    strs2checkboxes:{
        render:function(raw, $ele, col){
            if(raw===null)raw='';
            var v2 = raw.split(','); 
            if(!v2) v2 = [];
            v2 = v2.map(function(s){ return s.trim(); });
            var $checkboxes = $ele;
            $checkboxes.find('input[type=checkbox]').each(function(){
                $(this).prop('checked', v2.indexOf($(this).val())>=0);
            });
        },
        get:function(raw, $ele, col){
            var ret = '';
            var $checkboxes = $ele;
            $checkboxes.find('input[type=checkbox]').each(function(){
                if($(this).prop('checked')){
                    ret += (ret==''?'':',') + $(this).val();   
                }
            });
            return ret;
        }
    }
};
function GetFormFieldRenderer(s){
    if(formFieldRenderers[s]){
        return formFieldRenderers[s];   
    }else{
        return formFieldRenderers['str2text']; 
    }
}
var columnRenderers = {
    link : function(data, type, row) { return data===null?'':('<a href="'+data+'" target="_blank">'+data+'</a>'); },
    text : function(data, type, row) { return data===null?'':data; }
}
function GetColumnRenderer(s){
    if(columnRenderers[s]){
        return columnRenderers[s];   
    }else{
        return columnRenderers['text'];   
    }
}

var trueValidator = {
    message : '',   
    callback : function(value, validator, $field) { return true; }
};



(function( $ ) {
    $.fn.detectFormFieldChange = function(option) {
        var $form = this;
        var onChanged = option.onChanged;
        $form.find(':text').keypress(function(e) { // text written
            onChanged(e, $(this));
        });

        $form.find(':text').keyup(function(e) {
            if (e.keyCode == 8 || e.keyCode == 46) { //backspace and delete key
                onChanged(e, $(this));
            } else { // rest ignore
                e.preventDefault();
            }
        });
        $form.find(':text').bind('paste', function(e) { // text pasted
            onChanged(e, $(this));
        });

        $form.find('select').change(function(e) { // select element changed
            onChanged(e, $(this));
        });

        $form.find(':radio').change(function(e) { // radio changed
            onChanged(e, $(this));
        });

        $form.find(':password').keypress(function(e) { // password written
            onChanged(e, $(this));
        });
        $form.find(':password').bind('paste', function(e) { // password pasted
            onChanged(e, $(this));
        });
        return this;
    }
    
    
    $.fn.setBTDisabled = function(b) {
        this.prop('disabled', b);
        return this;
    };
    $.fn.isBTDisabled = function() {
        return this.prop('disabled');
    }

    $.fn.loginForm = function(option) {
        var _this = this;

        this.action = option.action;
        this.successRedirectURL = option.successRedirectURL;
        
        this.bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                username: {
                    validators: {
                        notEmpty: {
                            message: 'The username is required and cannot be empty.'
                        }
                    }
                },
                password: {
                    validators: {
                        notEmpty: {
                            message: 'The password is required and cannot be empty.'
                        }
                    }
                }
            }
        }).on('success.form.bv', function(evt) {
            evt.preventDefault();
            
            var $form = $(evt.target);
            var bv = $form.data('bootstrapValidator');
            var authName = $form.find('input[name=username]').val().trim();
            var authPassword = $form.find('input[name=password]').val().trim();
            
            $.ajax({
                type:'POST',
                url:_this.action,
                dataType:'json',
                data:{
                    'user':{
                        'authName':authName,
                        'authPassword':authPassword
                    }
                },
                success: function(response)
                {
                    if(response.error_exist){
                        $form.find('.feedback').html(response.error_msg);
                        return;   
                    }
                    window.location = _this.successRedirectURL; 
                },
                error: function(xhr, optns, err)
                {
                    console.log(xhr.responseText);
                    if(optns == 'parsererror'){
                        $form.find('.feedback').html('Fail to receive reply from server, please try again later.');
                    }else{
                        $form.find('.feedback').html('Fail to connect to server, please try again later.');
                    }
                },
                complete: function() { 
                    bv.resetForm(true);
                }
            });
        }).on('success.field.bv', function(evt,data) {
            var $form = data.bv.$form;
            $form.find('.feedback').html('');
        });
        
        return this;
    }
    
    $.fn.crud = function(option) {
        var _this = this;
        var sel = this.selector;
        var tableSel = option.tableSel;
        var columns = option.columns;
        var ajax = option.ajax;
        var serverSide = option.serverSide;
        var processing = option.processing;
        var target = option.target;
        var editForm = option.editorForm;
        var addForm = option.addForm;
        var actions = option.actions;

        if($(editForm).length) {
            editForm.html = $(editForm.tempSel).show().wrap('<div>').parent().html();
        }//*/
        if($(addForm).length) {
            addForm.html = $(addForm.tempSel).show().wrap('<div>').parent().html();
        }
        var columnDefs = [
            {
                "searchable": false,
                "orderable": false,
                "targets": 0
            }
        ];
        var $dataTable;
        var $tableTool;
        var $sel = $(sel);
        var $tableSel = $(tableSel);
        $.each(columns, function(i, col){
            $tableSel.find('thead tr').append('<th>'+col.data+'</th>');
            $tableSel.find('tfoot tr').append('<th>'+col.data+'</th>');
        });
        $dataTable = $tableSel.dataTable({
            dom: '<"row"<"col-xs-10 btn-toolbar top"><"col-xs-2"<"clear">>>lfrtip',
            serverSide:serverSide,
            processing:processing,
            ajax:{
                url:ajax,
                data:function(d){
                    console.log(d);
                    d.myKey = 'abc';      
                }
            },
            columns: columns,
            //columnDefs: columnDefs,
            drawCallback: drawCallback,
            iDisplayLength: 50,
            order: [[ 0, 'asc' ]]
            
            //scrollX:true
        });
        
        //console.log($dataTable);
        //new $.fn.dataTable.FixedHeader($dataTable);
        var $tableTool = new $.fn.dataTable.TableTools($dataTable, {
            sRowSelect: "os"
        });
        
        /*
        $dataTable.api().on('order.dt search.dt', function () {
            $dataTable.api().column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
                cell.innerHTML = i+1;
            });
        }).draw();//*/

        buttonhtml = 
        "<div class='btn-group'>" +
        "        <button type='button' class='refresh-btn btn btn-default'><span class='glyphicon glyphicon-refresh'></span><span>Refresh</span></button>" +
        "        <button type='button' class='add-btn btn btn-default'><span class='glyphicon glyphicon-plus'></span><span>Add</span></button>" +
        "        <button type='button' class='remove-btn btn btn-default'><span class='glyphicon glyphicon-remove'></span><span>Delete</span></button>" +
        "        <button type='button' class='edit-btn btn btn-default'><span class='glyphicon glyphicon-pencil'></span><span>Edit</span></button>" +
        "        <button type='button' class='select-all-btn btn btn-default toggle-1'><span class='glyphicon glyphicon-refresh'></span><span class='toggle-item-1'>Select all</span><span class='toggle-item-2'>Deselect all</span></button>" +
        "</div>" +
        "<div class='btn-group'>" +
        "        <button type='button' class='mail-btn btn btn-default'><span class='glyphicon glyphicon-envelope'></span><span>Mail</span></button>" + 
        "</div>" +
        "<div class='btn-group'>" +
        "        <button type='button' class='import-btn btn btn-default'><span class='glyphicon glyphicon-envelope'></span><span>Import</span></button>" + 
        "        <button type='button' class='import-btn btn btn-default'><span class='glyphicon glyphicon-envelope'></span><span>Export</span></button>" + 
        "</div>";
        var $functions = $sel.find('.btn-toolbar').append($(buttonhtml));
        //$functions.append($($tableTool.fnContainer()));
        var data = {
            columns:columns,
            dataTable:$dataTable, 
            tableTool:$tableTool, 
            functions:$functions, 
            api:$dataTable.DataTable(), 
            editForm:editForm, 
            addForm:addForm,
            target:target,
            actions:actions
        };
        $dataTable.data('data', data);
        $dataTable.on('click', 'tr', function () {
            onTableUpdateOrDraw(data);
        });

        $functions.find('.select-all-btn').on('click', data, function(evt){
            if($(this).hasClass('toggle-1')) data.tableTool.fnSelectAll();
            else data.tableTool.fnSelectNone();
            onTableUpdateOrDraw(data);
        });

        $functions.find('.refresh-btn').on('click', data, function(evt){
            onTableUpdateOrDraw(data);
            data.functions.find('.refresh-btn').prop('disabled',true);
            evt.data.api.ajax.reload(function(){
                onTableUpdateOrDraw(data);
                data.functions.find('.refresh-btn').prop('disabled',false);
            });
        });
        $functions.find('.select-all-btn').on('click', data, function(evt){
            onTableUpdateOrDraw(data);
        });
        $functions.find('.remove-btn').on('click', data, function(evt){
            var $api = data.api;
            var $actions = data.actions;
            var $tableTool = data.tableTool;
            var datas = evt.data.api.rows('.selected').data();
            var rowdatas = [];
            
            
            
            for(i = 0, len = datas.length ; i < len ; i++){
                rowdatas.push({id:datas[i].id});
            }
            $.ajax({
                type:'POST',
                url:actions.delete,
                dataType:'json',
                data:{ users : rowdatas },
                success: function(response)
                {
                    if(response.error_exist){
                        $form.find('fieldsets').prop('disabled',false);
                        console.log(response);
                        bootbox_alert2({ 
                            title:'Server Error',
                            message:'Reason: '+response.error_msg + '<br/>' + 'please try again later.'
                        });
                        return;   
                    }
                    bootbox.hideAll();
                },
                error: function(xhr, optns, err)
                {
                    console.log(optns + ',' + xhr.responseText);
                    if(optns == 'parsererror'){
                        bootbox_alert2({ 
                            title:'Server Error',
                            message:'Fail to receive reply from server, please try again later.'
                        });
                    }else{
                        bootbox_alert2({ 
                            title:'Server Error',
                            message:'Fail to connect to server, please try again later.'
                        });
                    }
                },
                complete: function() { 
                    $dataTable.fnDraw();
                }
            });
        });
        
        var formRenderer = {
            data : null,
            render : function(rowdata, $form) {
                for(k in this.data.editForm.columns){
                    var $ele = $form.find('#'+this.data.target+'-'+k);
                    var col = null;
                    for(j in this.data.columns) 
                        if(this.data.columns[j].data == k){
                            col = this.data.columns[j]; 
                            break; 
                        }
                    GetFormFieldRenderer(this.data.editForm.columns[k].render).render(rowdata[k], $ele, col);
                }                    
            },
            get : function(rowdata, $form) {
                for(k in this.data.editForm.columns){
                    var $ele = $form.find('#'+this.data.target+'-'+k);
                    var col = null;
                    for(j in this.data.columns) 
                        if(this.data.columns[j].data == k){
                            col = this.data.columns[j]; 
                            break; 
                        }
                    rowdata[k] = GetFormFieldRenderer(this.data.editForm.columns[k].render).get(rowdata[k], $ele, col);
                }   
            }
        }
        var formValidatorOption = {
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {}
        };
        for(k in columns){
            if(columns[k].validators){
                formValidatorOption.fields[data.target+'-'+columns[k].data] = { validators : columns[k].validators };
            }
        }
        

        $functions.find('.add-btn').on('click', data, function(evt){
            var $form = $(data.addForm.html);
            var $dialog = bootbox.dialog({
                title:'Add ' + target,
                message:$form,
                backdrop:'static',
                keyboard: true,
            });
            var enableSuccessFormBV = false;
            $dialog.on('shown.bs.modal', function(){ 
                $form.find('input').first().focus();
                enableSuccessFormBV = true;
            });
            
            $form.find('#'+data.target+'-undo').on('click', function(){
                var bv = $form.data('bootstrapValidator');
                bv.resetForm(true);
                $form.find('.input-group-btn .btn').prop('disabled',true);
                $form.find('input').first().focus();
            });
            $form.find('#'+data.target+'-commit').on('click', function(){
                $form.find('fieldsets').prop('disabled',true);
            });
            $form.find('.input-group-btn .btn').prop('disabled',true);
            $form.find('.link-btn').on('click', function() {
                var link = $(this).closest('.input-group').find('input').val();
                window.open(link, '_blank');
                window.focus();
            });
            $form.bootstrapValidator(formValidatorOption
            ).on('success.form.bv', function(evt) { 
                evt.preventDefault();
                if(!enableSuccessFormBV)return;
                
                var $form = $(evt.target);
                var bv = $form.data('bootstrapValidator');
                var rowdata = {};
                formRenderer.data = data;
                formRenderer.get(rowdata, $form);
                
                $.ajax({
                    type:'POST',
                    url:actions.add,
                    dataType:'json',
                    data:{ users : [rowdata] },
                    success: function(response)
                    {
                        if(response.error_exist){
                            $form.find('fieldsets').prop('disabled',false);
                            console.log(response);
                            bootbox_alert2({ 
                                title:'Server Error',
                                message:'Reason: '+response.error_msg + '<br/>' + 'please try again later.'
                            });
                            return;   
                        }
                        bootbox.hideAll();
                    },
                    error: function(xhr, optns, err)
                    {
                        console.log(xhr.responseText);
                        $form.find('fieldsets').prop('disabled',false);
                        if(optns == 'parsererror'){
                            bootbox_alert2({ 
                                title:'Server Error',
                                message:'Fail to receive reply from server, please try again later.'
                            });
                        }else{
                            bootbox_alert2({ 
                                title:'Server Error',
                                message:'Fail to connect to server, please try again later.'
                            });
                        }
                    },
                    complete: function() { 
                        $dataTable.fnDraw();
                    }
                });
            }).on('error.field.bv', function(evt, data) {
                var $form = data.bv.$form;
                var $addonbtn = $form.find('#'+data.field).next('.input-group-btn').find('.btn');
                $addonbtn.prop('disabled',true);
            }).on('success.field.bv', function(evt,data) {
                var $form = data.bv.$form;
                var $input = $form.find('#'+data.field);
                var $addonbtn = $input.next('.input-group-btn').find('.btn');
                var hasinput = $input.val().trim().length > 0;
                $addonbtn.prop('disabled', !hasinput);
            });
            if(data.addForm.init)
                data.addForm.init(data, $form, $dialog);
        });
        $functions.find('.edit-btn').on('click', data, function(evt){
            var columns = data.columns;
            var $functions = data.functions;
            var $api = data.api;
            var numSelectedRowInCurrentView = $api.rows('.selected')[0].length;
            var actions = data.actions;
            var $dataTable = data.dataTable;
            if(numSelectedRowInCurrentView == 0)return;
            var $form = $(data.editForm.html);
            var $dialog = bootbox.dialog({
                className:'abc',
                title:'Edit ' + target,
                message:$form,
                backdrop:'static',
                keyboard: true
            });
            var rowdata = $api.row('.selected').data();
            formRenderer.data = data;
            formRenderer.render(rowdata, $form);
            $form.find('#'+data.target+'-undo').setBTDisabled(true);
            
            var enableSuccessFormBV = false;
            $dialog.on('shown.bs.modal', function(){ 
                $form.find('input, button').blur().focusout();
                $form.data('bootstrapValidator').validate();
                enableSuccessFormBV = true;
                formFieldChanged = false;
            });
            
            
            var formFieldChanged = false;
            $form.detectFormFieldChange({
                onChanged : function(e, $ele) {
                    $form.find('#'+data.target+'-undo').setBTDisabled(false); 
                    formFieldChanged = true;
                }
            });
            $form.find('#'+data.target+'-undo').on('click', function(){
                var bv = $form.data('bootstrapValidator');
                enableSuccessFormBV = false;
                formRenderer.render($api.row('.selected').data(), $form);
                $form.find('#'+data.target+'-undo').setBTDisabled(true);
                $form.data('bootstrapValidator').validate();
                enableSuccessFormBV = true;
                formFieldChanged = false;
            });
            $form.bootstrapValidator(formValidatorOption
            ).on('success.form.bv', function(evt) {
                evt.preventDefault();
                var $form = $(evt.target);
                var bv = $form.data('bootstrapValidator');
                if(!enableSuccessFormBV)return;
                
                var updaterowdata = $.extend(true, {}, rowdata);
                formRenderer.data = data;
                formRenderer.get(updaterowdata, $form);
                
                
                $.ajax({
                    type:'POST',
                    url:actions.update,
                    dataType:'json',
                    data:{ users : [updaterowdata] },
                    success: function(response)
                    {
                        if(response.error_exist){
                            console.log(response.error_msg);
                            bootbox_alert2({ 
                                title:'Server Error',
                                message:'Reason: '+response.error_msg + '<br/>' + 'please try again later.'
                            });
                            return;   
                        }
                        bootbox.hideAll();
                    },
                    error: function(xhr, optns, err)
                    {
                        console.log(xhr.responseText);
                        if(optns == 'parsererror'){
                            bootbox_alert2({ 
                                title:'Server Error',
                                message:'Fail to receive reply from server, please try again later.'
                            });
                        }else{
                            bootbox_alert2({ 
                                title:'Server Error',
                                message:'Fail to connect to server, please try again later.'
                            });
                        }
                    },
                    complete: function() { 
                        $dataTable.fnDraw();
                    }
                });
            }).on('error.field.bv', function(evt, data) {
                var $form = data.bv.$form;
                var $addonbtn = $form.find('#'+data.field).next('.input-group-btn').find('.btn');
                $addonbtn.prop('disabled',true);
            }).on('success.field.bv', function(evt,data) {
                var $form = data.bv.$form;
                var $input = $form.find('#'+data.field);
                var $addonbtn = $input.next('.input-group-btn').find('.btn');
                var hasinput = $input.val().trim().length > 0;
                $addonbtn.prop('disabled', !hasinput);
            });    //*/
            if(data.editForm.init)
                data.editForm.init(data, $form, $dialog, $api.row('.selected'));
        });
        function drawCallback(settings){
            console.log('drawCallback');
            if(this.data('data'))
                onTableUpdateOrDraw(this.data('data'));   
        }
        function onTableUpdateOrDraw(data) { 
            var $functions = data.functions;
            var $api = data.api;
            var numSelectedRowInCurrentView = $api.rows('.selected')[0].length;
            var numSelectedRow = data.tableTool.fnGetSelected().length;
            var numRow = $api.rows()[0].length;
            console.log(numSelectedRowInCurrentView+'('+$api.rows('.selected')[0].length+')/'+numSelectedRow+'/'+numRow);
            $selectall = $functions.find('.select-all-btn');
            $selectall.setBTDisabled(numRow == 0);
            if(numRow == 0 || numSelectedRow != numRow){
                $selectall.addClass('toggle-1').removeClass('toggle-2');
            }else{
                $selectall.removeClass('toggle-1').addClass('toggle-2');   
            }
            $functions.find('.remove-btn').setBTDisabled(numSelectedRowInCurrentView == 0);
            $functions.find('.edit-btn').setBTDisabled(numSelectedRowInCurrentView != 1);
            
            $functions.find('.mail-btn, .sms-btn').setBTDisabled(numSelectedRow == 0);
        }

        onTableUpdateOrDraw(data);
        return this;
    }
    
    
}(jQuery));
