if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

function FormFieldRenderer() { return this; };
FormFieldRenderer.prototype = {
    render:function(raw, $ele){ return null; },
    get:function(raw, $ele){ return null; }
};
function Str2TextFormFieldRenderer() { return this; }
Str2TextFormFieldRenderer.prototype = $.extend(FormFieldRenderer.prototype, {
    render:function(raw, $ele){ $ele.val(raw); },
    get:function(raw, $ele){ return $ele.val().trim(); }
});
function Strs2CheckboxesFormFieldRenderer() { return this; }
Strs2CheckboxesFormFieldRenderer.prototype = $.extend(FormFieldRenderer.prototype, {
    render:function(raw, $ele){
        if(raw===null)raw='';
        var v2 = raw.split[',']; if(!v2) v2 = [];
        v2 = v2.map(function(s){ return s.trim(); });
        var $checkboxes = $ele;
        $checkboxes.find('input[type=checkbox]').each(function(){
            $(this).prop('checked', v2.indexOf($(this).val())>=0);
        });
    },
    get:function(raw, $ele){
        var ret = '';
        var $checkboxes = $ele;
        $checkboxes.find('input[type=checkbox]').each(function(){
            if($(this).prop('checked')){
                ret += (ret==''?'':',') + $(this).val();   
            }
        });
        return ret;
    }
});

var formFieldRenderers = {
    'str2text':new Str2TextFormFieldRenderer(),
    'strs2checkboxes':new Strs2CheckboxesFormFieldRenderer()
};

function GetFormFieldRenderer(s){
    if(formFieldRenderers[s]){
        return formFieldRenderers[s];   
    }else{
        return formFieldRenderers['str2text']; 
    }
}

(function( $ ) {
    $.fn.setBTDisabled = function(b) {
        this.toggleClass('disabled', b).prop('disabled', b);
        return this;
    };
    $.fn.isBTDisabled = function() {
        return this.hasClass('disabled');
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
                    if(optns == 'parseerror'){
                        console.log(xhr.responseText);
                        $form.find('.feedback').html('Fail to receive reply from server, please try again later.');
                    }else{
                        console.log(xhr.responseText);
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

        if($(editForm).length) {
            editForm.html = $(editForm.tempSel).show().wrap('<div>').parent().html();
        }//*/
        if($(addForm).length) {
            addForm.html = $(addForm.tempSel).show().wrap('<div>').parent().html();
        }
        var columnDefs = [
            {
                render : function(data,type,row) { return data === null ? '' : data; },
                targets : columns.map(function(v,i) { return i; })
            }
        ];
        var $dataTable;
        var $tableTool;
        var $sel = $(sel);
        var $tableSel = $(tableSel);
        $.each(columns, function(i, col){
            $tableSel.find('thead tr').append('<th>'+col.data+'</td>');
            $tableSel.find('tfoot tr').append('<th>'+col.data+'</td>');
        });
        $dataTable = $tableSel.dataTable({
            dom: 'lfrtip',
            serverSide:serverSide,
            processing:processing,
            ajax:ajax,
            columns: columns,
            //columnDefs: columnDefs,
            drawCallback: drawCallback
        });
        //new $.fn.dataTable.FixedHeader($dataTable);
        var $tableTool = new $.fn.dataTable.TableTools($dataTable, {
            sRowSelect: "os"
        });

        buttonhtml = 
        "<div class='row'>" +
        "    <div class='col-xs-12'>" +
        "        <button type='button' class='refresh-btn btn btn-default'><span class='glyphicon glyphicon-refresh'></span>Refresh</button>" +
        "        <button type='button' class='add-btn btn btn-default'><span class='glyphicon glyphicon-plus'></span>Add</button>" +
        "        <button type='button' class='remove-btn btn btn-default'><span class='glyphicon glyphicon-remove'></span>Delete</button>" +
        "        <button type='button' class='edit-btn btn btn-default'><span class='glyphicon glyphicon-pencil'></span>Edit</button>" +
        "        <button type='button' class='mail-btn btn btn-default'><span class='glyphicon glyphicon-envelope'></span>Mail</button>" + 
        "        <button type='button' class='select-all-btn btn btn-default toggle-1'><span class='glyphicon glyphicon-refresh'></span><span class='toggle-item-1'>Select all</span><span class='toggle-item-2'>Deselect all</span></button>" +
        "    </div>" +
        "</div>";
        var $functions = $sel.find('.data-table-function-group').append($(buttonhtml));
        var data = {
            dataTable:$dataTable, 
            tableTool:$tableTool, 
            functions:$functions, 
            api:$dataTable.DataTable(), 
            editForm:editForm, 
            addForm:addForm,
            target:target
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
            evt.data.api.rows('.selected').remove().draw(false);
            onTableUpdateOrDraw(data);
        });
        $functions.find('.add-btn').on('click', data, function(evt){
            console.log(data);
            var $form = $(data.addForm.html);
            var $dialog = bootbox.dialog({
                title:'Create New ' + target,
                message:$form,
                backdrop:'static',
                keyboard: true,
                
            });
            if(data.addForm.init)
                data.addForm.init(data, $form, $dialog);
        });
        $functions.find('.edit-btn').on('click', data, function(evt){
            var $functions = data.functions;
            var $api = data.api;
            var numSelectedRowInCurrentView = $api.rows('.selected')[0].length;
            if(numSelectedRowInCurrentView == 0)return;
            var $form = $(data.editForm.html);
            var $dialog = bootbox.dialog({
                title:'Edit ' + target,
                message:$form,
                backdrop:'static',
                keyboard: true
            });
            var rowdata = $api.row('.selected').data();
            for(k in rowdata){
                var v = rowdata[k];
                var $ele = $form.find('#'+data.target+'-'+k);
                var renderer = GetFormFieldRenderer(data.editForm.columns[k]);
                renderer.render(rowdata[k], $ele);
            }
            if(data.editForm.init)
                data.editForm.init(data, $form, $dialog, $api.row('.selected'));
        });
        function drawCallback(settings){
            //console.log('drawCallback');
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
            $functions.find('.mail-btn').setBTDisabled(numSelectedRow == 0);
            $functions.find('.edit-btn').setBTDisabled(numSelectedRowInCurrentView != 1);
        }

        onTableUpdateOrDraw(data);
        return this;
    }
    
    
}(jQuery));
