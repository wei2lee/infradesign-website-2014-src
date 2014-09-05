

$(function() {
    if($('.login-form').length) {
        
        $('.login-form').bootstrapValidator({
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
                url:'../resources/api_admin.php?action=login',
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
                    window.location = 'content.html'; 
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

    
    var sel = '#user-data-table';
    var $functions = $('#user-crud .data-table-function-group');
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
    var columnDefs = [
        {
            render : function(data,type,row) { return data === null ? '' : data; },
            targets : columns.map(function(v,i) { return i; })
        }
    ];
    var $dataTable;
    var source = '../resources/api_admin.php?action=read&target=user';
    if($(sel).length) {
        var $sel = $(sel);
        $.each(columns, function(i, col){
            $sel.find('thead tr').append('<th>'+col.data+'</td>');
            $sel.find('tfoot tr').append('<th>'+col.data+'</td>');
        });
        $dataTable = $sel.dataTable({
            ajax:source,
            columns: columns,
            columnDefs: columnDefs
        });
        var data = {dataTable:$dataTable, functions:$functions, api:$dataTable.DataTable()};
        
        $dataTable.on('click', 'tr', function () {
            $(this).toggleClass('selected');
            updateButtons(data);
        });
        
        $functions.find('.refresh-btn').on('click', data, function(evt){
            evt.data.api.ajax.reload();
            updateButtons(data);
        });
        $functions.find('.select-all-btn').on('click', data, function(evt){
            evt.data.dataTable.find('tr').addClass('selected');
            updateButtons(data);
        });
        $functions.find('.remove-btn').on('click', data, function(evt){
            evt.data.api.rows('.selected').remove().draw(false);
            updateButtons(data);
        });
        
        function updateButtons(data) {
            var $api = data.api;
            var numSelectedRow = $api.rows('.selected')[0].length;
            var numRow = $api.rows()[0].length;
            console.log('selected : ' + numSelectedRow + '/' + numRow);
            /*
            if(numRow == 0){
                $functions.find('.select-all-btn').removeClass('toggle-1 toggle-2');
            }else{
                if(numSelectedRow == numRow){
                    $functions.find('.select-all-btn').removeClass('toggle-1').addClass('toggle-2');   
                }else{
                    $functions.find('.select-all-btn').addClass('toggle-1').removeClass('toggle-2');   
                }
            }//*/
            $functions.find('.remove-btn').prop('disabled', numSelectedRow == 0);
            $functions.find('.mail-btn').prop('disabled', numSelectedRow == 0);
            $functions.find('.edit-btn').prop('disabled', numSelectedRow == 0);
        }
        
        updateButtons(data);
    }
});