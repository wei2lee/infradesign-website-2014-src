$.fn.tree = function(_option){
    var option = _option || {};
    var option = $.extend({
        'actions':null,
        'target':null,
        'icon-plus-sign':"fa-plus-square",
        'icon-minus-sign':"fa-minus-square"
    }, _option);
    this.option = option;
    this.option.uniqueRoot = true;
    
    option.addForm.html = $(option.addForm.tempSel).show().wrap('<div>').parent().html();
    
    this.each(function() {
        var treeobj = {
            'option':option,
            '$rootul' : null,
            '$toolbar' : null,
            'option' : option,
            '$this' : $(this),
            'data' : null,
            'load' : function(){
                $.ajax({
                    treeobj : treeobj,
                    type:'POST',
                    url:option.actions.read,
                    dataType:'json',
                    success: function(response)
                    {
                        if(response.error_exist){
                            return;   
                        }
                        treeobj.setmodel(response.data);
                    },
                    error:AJAX_HANDLES.error,
                    complete: function() { }
                });
            },
            
            updateToolbar : function() {
                var hasroot = this.$rootul.find('>li').length>0;
                this.$toolbar.find('.add-root-btn').setBTDisabled(hasroot);
            },
            
            setmodel : function(data){
                this.data = data;
                this.redraw(this.data.tree.children[0]);  
            },
            
            
            toolbarRender : function() {
                var $this = this.$this;
                
                this.$toolbar = $text = $(           
'<div class="btn-toolbar"><div class="btn-group">'+
'  <button type="button" class="refresh-btn btn btn-default">Refresh</button>'+
'  <button type="button" class="expand-all-btn btn btn-default">Expand All</button>'+
'  <button type="button" class="add-root-btn btn btn-default">Add Admin</button>'+
'</div></div>');
                
                $text.find('.refresh-btn').on('click', this, function(evt){
                    var treeobj = evt.data;
                    treeobj.load();
                });
                
                $text.find('.expand-all-btn').on('click', this, function(evt){
                    var treeobj = evt.data;
                    treeobj.nodeExpandAll($this, true, true);
                });
                
                $text.find('.expand-all-btn').on('click', this, function(evt){
                    var treeobj = evt.data;
                    treeobj.nodeExpandAll($this, true, true);
                });
                
                $text.find('.add-root-btn').on('click', this, function(evt){
                    var treeobj = evt.data;
                    treeobj.nodeAdd(null, { data:{lastName:'yee chuan', firstName:'lee', role:'system'}   }, true);
                });
                
                return $text;
            },
            
            nodeContentRender : function(node){
                var data = node.data;
                var ln = data.lastName || '';
                var fn = data.firstName || '';
                var ns = [];
                if(ln != '') ns.push(ln.capitalizeFirstChar());
                if(fn != '') ns.push(fn.capitalizeFirstChar());
                var text = '<a class="btn btn-default"><i class="fa"></i>' + ns.join(' ') + '</a>';
                return text;
            },
            nodeRender : function($parent, node){                
                $node = $('<li>').append($(this.nodeContentRender(node)));
                $node.data('tree.node', node);
                $node.append(this.nodeToolbarRender($node, node));
                $parent.append($node);
                if(node.children && node.children.length){
                    $node.addClass('parent_li');
                    $ul = $('<ul>');
                    $node.append($ul);
                    for(i in node.children){
                        this.nodeRender($ul, node.children[i]);
                    }
                }
                return $node;
            },
            
            nodeToolbarRender : function($node, node) {
                var treeobj = this;
                
                $toolbar = $(           
'<div class="btn-group">'+
'  <button type="button" class="btn-icon fa fa-plus add-btn btn-xs btn btn-default"></button>'+
'  <button type="button" class="btn-icon fa fa-trash delete-btn btn-xs btn btn-default"></button>'+
'</div>');
          
                $toolbar.find('.add-btn').on('click', {treeobj:this, '$parentnode':$node}, function(evt){
                    var treeobj = evt.data.treeobj;
                    var $parentnode = evt.data.$parentnode;
                    var node = $parentnode.data('tree.node');
                    var target = treeobj.option.target;
                    var addForm = treeobj.option.addForm;
                    var nodedata = $parentnode.data('tree.node').data;
                    var dialog_option = {
                        title:'Select an Agent to add under ' + joinName(nodedata.lastName, nodedata.firstName),
                        message:addForm.html
                    };
                    $dialog = bootbox.dialog(dialog_option);
                    $form = $dialog.find('form');
                    $form.hide();
                    $loading = $('<div class="loading"><i class="fa fa-cog fa-spin"></i>Loading...</div>').css('height', '460px');
                    $form.parent().append($loading);
                    $form.find('#'+target+'-close').on('click', function(){
                         setTimeoutEx(function(){
                             bootbox.hideAll();
                         }, 0.25);
                    });
                    $form.find('#'+target+'-commit').prop('disabled', true);
                    
                    $dialog.on('shown.bs.modal', function(){
                        $.ajax({
                            type:'POST',
                            url:treeobj.option.actions.select_no_parent,
                            dataType:'json',
                            data:{},
                            success: function(response)
                            {
                                if(!AJAX_HANDLES.success(response))return;
                                $loading.hide();
                                $form.fadeIn(300);
                                
                                $table = $dialog.find('table');
                                $table.css('height', '300px');
                                
                                var _columns = [];
                                for(i in addForm.columns) _columns.push({title:addForm.columns[i].capitalizeFirstChar()});
                                var _data = [];
                                for(i in response.data) {
                                    var row = [];
                                    for(j in addForm.columns){
                                        row.push(response.data[i][addForm.columns[j]]);   
                                    }
                                    row.id = response.data[i].id;
                                    row._data = response.data[i];
                                    _data.push(row);
                                }
                                
                                $dataTable = $table.dataTable({
                                    dom: 'frtp',
                                    data:_data,
                                    columns: _columns,
                                    iDisplayLength: 7,
                                    responsive: false,
                                });
                                
                                function validate(){
                                    var selected = $tableTool.fnGetSelected().length > 0;
                                    $form.find('#'+target+'-commit').prop('disabled', !selected);
                                }
                                
                                var $tableTool = new $.fn.dataTable.TableTools($dataTable, {
                                    sRowSelect: "os",
                                    fnRowDeselected:validate,
                                    fnRowSelected:validate
                                });
                                
                                $form.find('#'+target+'-commit').on('click', function(){
                                    var parentId = $parentnode.data('tree.node').data.id;
                                    var users = $tableTool.fnGetSelectedData ().map(function(data){
                                         return {'parentId':parseInt(parentId), 'childId':parseInt(data.id)};
                                    });
                                    var nodes = $tableTool.fnGetSelectedData ().map(function(data){
                                        return {data:data._data}; 
                                    });
                                    $.ajax({
                                        type:'POST',
                                        url:treeobj.option.actions.add,
                                        dataType:'json',
                                        data:{users:users},
                                        success:function(response){
                                            if(!AJAX_HANDLES.success(response))return;
                                            for(i in nodes) { treeobj.nodeAdd($parentnode, nodes[i], true); }
                                            setTimeoutEx(bootbox.hideAll, 0.1);
                                        },
                                        error:AJAX_HANDLES.error
                                    });
                                });
                            },
                            error:AJAX_HANDLES.error
                        });
                    });
                });

                $toolbar.find('.delete-btn').on('click', {treeobj:this, '$parentnode':$node.parent().closest('li.parent_li'), '$node':$node}, function(evt){
                    var treeobj = evt.data.treeobj;
                    var $parentnode = evt.data.$parentnode;
                    var $node = evt.data.$node;
                    
                    var users = [];
                    console.log($node.data('tree.node'));
                    console.log($parentnode.data('tree.node'));
                    
                    function getusers($parent, $node){
                        var parentnodeid = $parent || $parent.length==0 ? $parent.data('tree.node').data.id : null;
                        var nodeid = $node.data('tree.node').data.id;
                        var user = {'parentId':parentnodeid, 'childId':nodeid};
                        users.push(user);
                        $node.find('>ul>li').each(function(){
                            getusers($node, $(this)); 
                        });
                    }
                    getusers($parentnode, $node);
                    
                    console.log(users);
                    
                    return;
                    bootbox.confirm("Do you want to delete " + joinName(node.data.lastName, node.data.firstName) + " and all agents under him?", function(result){
                        if(result){
                            setTimeoutEx(function(){
                                $.ajax({
                                    type:'POST',
                                    url:treeobj.option.actions.delete,
                                    dataType:'json',
                                    data:{users:users},
                                    success:function(response){
                                        if(!AJAX_HANDLES.success(response))return;
                                        for(i in nodes) { treeobj.nodeAdd($parentnode, nodes[i], true); }
                                        setTimeoutEx(bootbox.hideAll, 0.1);
                                    },
                                    error:AJAX_HANDLES.error
                                });
                                treeobj.nodeRemove($parentnode, $node, true);
                            },250);
                        }
                    });
                });
                return $toolbar;
            },    
            

            
            nodeExpandAll : function($node, b, a) {
                $nodes = $node.find('li.parent_li').addBack('li.parent_li');
                this.nodeExpand($nodes, b, a);
            },
            
            nodeExpand : function($node, b, a) {
                $children = $node.find('>ul>li');
                if(b){
                    if(a) $children.show('fast');   
                    else $children.show();
                }else{
                    if(a) $children.hide('fast');
                    else $children.hide();
                }
                if(b) $node.find('>.btn>i').removeClass(option['icon-plus-sign']).addClass(option['icon-minus-sign']);
                else $node.find('>.btn>i').addClass(option['icon-plus-sign']).removeClass(option['icon-minus-sign']);
            },
            
            nodeToggleExpand : function($node, a){
                var _this = this;
                $node.each(function(){
                    var $children = $node.find('>ul>li');
                    var b = $children.find(':visible').length>0;
                    _this.nodeExpand($(this), !b, a);
                });
            },
            
            nodeAdd : function($parentnode, node, a) {
                if($parentnode == null){
                    $ul = this.$rootul;
                    $node = this.nodeRender($ul, node);
                }else{
                    $ul = $parentnode.find('> ul');
                    if($ul.length == 0){
                        $ul = $('<ul>'); 
                        $parentnode.append($ul);
                    }
                    $parentnode.addClass('parent_li');
                    $node = this.nodeRender($ul, node);
                    $parentnode.find('>.btn>i').addClass(option['icon-minus-sign']);
                }
                
                this.updateToolbar();
            },
            
            nodeRemove : function($parentnode, $node, a) {
                $node.remove();
                var haschild = $parentnode.find('>ul>li').length;
                if(!haschild){
                    $parentnode.toggleClass(option['icon-plus-sign'] + ' ' + option['icon-minus-sign'], false);    
                    $parentnode.find('>ul').remove();
                    $parentnode.toggleClass('parent_li', false);
                }
                
                this.updateToolbar();
            },
            
            redraw : function(data){
                var $this = this.$this; 
                $this.empty();
                $this.append(this.toolbarRender());
                this.$rootul = $ul = $('<ul>');
                $this.append($ul);
                $node = this.nodeRender($ul, data, $this);
                this.nodeExpandAll($this.find('li.parent_li').first(), true, false);
                this.installevent();
                this.updateToolbar();
            },
            
            
            installevent : function(){
                var $this = this.$this;
                var _this = this;
                $this.off('click', 'li.parent_li > .btn > i');
                $this.on('click', 'li.parent_li > .btn > i', this, this.onNodeIconClick);
                
                $this.off('click', 'li > .btn');
                $this.on('click', 'li > .btn', this, this.onNodeClick);
            },
            onNodeClick : function(e){  console.log('btn click');
                e.stopPropagation();
            },
            onNodeIconClick : function(e){ console.log('btni click');
                var $node = $(this).closest('li.parent_li');
                e.data.nodeToggleExpand($node, true);
                e.stopPropagation();
            },
        }
        

        
        $(this).data('tree', treeobj);
        

        //treeobj.styleAndEvent();return;
        
        $(this).addClass('tree');
        if(!option.actions || !option.target) {
            treeobj.styleAndEvent();
        }else{
            treeobj.load();
        }
    });
    return this;
};