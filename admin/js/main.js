
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

    if($('#user-data-table').length) {
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
        var $userDataTable = $('#user-data-table');
        $.each(columns, function(i, col){
            $userDataTable.find('thead tr').append('<th>'+col.data+'</td>');
            $userDataTable.find('tfoot tr').append('<th>'+col.data+'</td>');
        });
        var userDataTable = $('#user-data-table').dataTable({
            ajax:'../resources/api_admin.php?action=read&target=user',
            columns: columns,
            columnDefs: columnDefs
            //responsive: true
        });
        var tableTools = new $.fn.dataTable.TableTools( $userDataTable, {
            fnPreRowSelect : function(evt, node) {
                console.log('prerowselect');
            },
        
        } );
    }
});