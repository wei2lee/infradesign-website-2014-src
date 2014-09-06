(function( $ ) {
    $.fn.setBTDisabled = function(b) {
        /*
        if(!(prop === undefined || prop === null))
            this.prop('disabled',prop);
        if(!(look === undefined || look === null))
            this.toggleClass('disabled',look);
        //*/
        this.toggleClass('disabled', b).prop('disabled', b);
        return this;
    };
    $.fn.isBTDisabled = function() {
        //return {prop:this.prop('disabled'), look:this.hasClass('disabled')};   
        return this.hasClass('disabled');
    }
}(jQuery));


$(function() {
    var sel = '.login-form';
    var action = '../resources/api_admin.php?action=login';
    var onLogonRedirect = 'content.html';
    if($(sel).length) {
        $(sel).bootstrapValidator({
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
                url:action,
                dataType:'json',
                data:{
                    'user':{
                        'authName':authName,
                        'authPassword':authPassword
                    }
                },
                success: function(response)
                {
                    console.log(response);
                    if(response.error_exist){
                        $form.find('.feedback').html(response.error_msg);
                        return;   
                    }
                    window.location = onLogonRedirect; 
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
                }
            });

            bv.resetForm(true);
        }).on('success.field.bv', function(evt,data) {
            var $form = data.bv.$form;
            $form.find('.feedback').html('');
        });
        
    }

    var sel = '#user-crud';
    var tableSel = sel + ' table';
    var columns = [
        { "data": "name"},
        { "data": "email" },
        { "data": "contact" },
        { "data": "company" },
        { "data": "businessType" },
        { "data": "interested" },
        { "data": "message" },
        { "data": "startDate", type: 'date' },
        { "data": "createdAt", type: 'date' },
        { "data": "updatedAt", type: 'date' },
    ];    
    var source = '../resources/api_admin.php?action=read&target=user';
    var target = 'user';
    if($(sel).length && $(tableSel).length) {
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
            ajax:source,
            columns: columns,
            columnDefs: columnDefs,
            drawCallback: drawCallback
        });
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
        var data = {dataTable:$dataTable, tableTool:$tableTool, functions:$functions, api:$dataTable.DataTable()};
        $dataTable.data('data', data);
        $dataTable.on('click', 'tr', function () {
            onTableUpdateOrDraw(data);
        });
        
        $functions.find('.select-all-btn').on('click', data, function(evt){
            if($(this).isBTDisabled())return;
            
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
            bootbox.dialog({
                title:'Create New ' + target,
                message:'I am a custom form',
                backdrop:'static',
                keyboard: true
            });
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
    }
});