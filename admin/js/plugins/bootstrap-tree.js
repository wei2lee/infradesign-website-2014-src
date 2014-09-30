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
            openDeleteForm : function(evt) {
                var treeobj = evt.data.treeobj;
                var $parentnode = evt.data.$node.parent().closest('li.parent_li');
                var $node = evt.data.$node;
                var node = $node.data('tree.node');
                var users = [{id:node.data.id}];
                bootbox.confirm("Do you want to delete " + joinName(node.data.lastName, node.data.firstName) + " and all agents under him?", function(result){
                    if(!result)return;
                    $.ajax({
                        type:'POST',
                        url:treeobj.option.actions.delete,
                        dataType:'json',
                        data:{users:users},
                        success:function(response){
                            if(!AJAX_HANDLES.success(response))return;
                            treeobj.nodeRemove($node, true);
                            setTimeoutEx(bootbox.hideAll, 0.2);
                        },
                        error:AJAX_HANDLES.error
                    });
                });
            },
            openAddForm : function(evt) {
                var treeobj = evt.data.treeobj;
                var $parentnode = evt.data.$parentnode;
                var target = treeobj.option.target;
                var addForm = treeobj.option.addForm;
                
                var dialogtitle = "";
                if($parentnode){
                    var nodedata = $parentnode.data('tree.node').data;
                    dialogtitle = 'Select an Agent to add under ' + joinName(nodedata.lastName, nodedata.firstName);
                }else{
                    dialogtitle = 'Select an Agent to add as Root';
                }
                var dialog_option = {
                    title:dialogtitle,
                    message:addForm.html
                };
                $dialog = bootbox.dialog(dialog_option);
                $form = $dialog.find('form');
                $form.hide();
                $loading = $('<div class="loading"><i class="fa fa-cog fa-spin"></i>Loading...</div>').css('height', '460px');
                $form.parent().append($loading);
                $form.find('.close-btn').on('click', function(){
                     setTimeoutEx(function(){
                         bootbox.hideAll();
                     }, 0.25);
                });
                $form.find('.commit-btn').prop('disabled', true);

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
                                $form.find('.commit-btn').prop('disabled', !selected);
                            }

                            var $tableTool = new $.fn.dataTable.TableTools($dataTable, {
                                sRowSelect: "os",
                                fnRowDeselected:validate,
                                fnRowSelected:validate
                            });

                            $form.find('.commit-btn').on('click', function(){
                                var parentId = $parentnode ? parseInt($parentnode.data('tree.node').data.id) : null;
                                var users = $tableTool.fnGetSelectedData ().map(function(data){
                                     return {'parentId':parentId, 'childId':parseInt(data.id)};
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
                                    error:AJAX_HANDLES.error,
                                    complete:AJAX_HANDLES.complete
                                });
                            });
                        },
                        error:AJAX_HANDLES.error
                    });
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
                
                $text.find('.add-root-btn').on('click', {treeobj:this, $parentnode:null}, function(evt){
                    evt.data.treeobj.openAddForm(evt);
                });
                
                return $text;
            },
            
            nodeContentRender : function(node){
                var data = node.data;
                var name = joinName(data.lastName, data.firstName);
                var $content = $('<a class="btn btn-default"><i class="fa"></i>' + name + '</a>');
                return $content;
            },
            nodeRender : function($parent, node){                
                $node = $('<li>').append(this.nodeContentRender(node));
                $node.data('tree.node', node);
                $node.append(this.nodeToolbarRender($node, node));
                $parent.append($node);
                if(node.children && node.children.length){
                    $node.addClass('parent_li');
                    $parentul = $('<ul>');
                    $node.append($parentul);
                    for(i in node.children){
                        this.nodeRender($parentul, node.children[i]);
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
                    evt.data.treeobj.openAddForm(evt);
                });

                
                $toolbar.find('.delete-btn').on('click', {treeobj:this, '$node':$node}, function(evt){
                    evt.data.treeobj.openDeleteForm(evt);
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
                    $parentul = this.$rootul;
                    $node = this.nodeRender($parentul, node);
                }else{
                    $parentul = $parentnode.find('> ul');
                    if($parentul.length == 0){
                        $parentul = $('<ul>'); 
                        $parentnode.append($parentul);
                    }
                    $parentnode.addClass('parent_li');
                    $node = this.nodeRender($parentul, node);
                    $parentnode.find('>.btn>i').addClass(option['icon-minus-sign']);
                }
                
                this.updateToolbar();
            },
            
            nodeRemove : function($node, a) {
                $parentnode = $node.parent().closest('li.parent_li');
                $node.remove();
                var haschild = $parentnode.find('>ul>li').length;
                if(!haschild){
                    $parentnode.find('>.btn>i').removeClass(option['icon-plus-sign']).removeClass(option['icon-minus-sign']);    
                    $parentnode.find('>ul').remove();
                    $parentnode.removeClass('parent_li');
                }
                this.updateToolbar();
            },
            
            redraw : function(rootnode){
                var $this = this.$this; 
                $this.empty();
                $this.append(this.toolbarRender());
                this.$rootul = $parentul = $('<ul>');
                $this.append($parentul);
                if(rootnode){
                    $rootnode = this.nodeRender($parentul, rootnode, $this);
                    this.nodeExpandAll($this.find('li.parent_li').first(), true, false);
                    this.installevent();
                }
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
            onNodeClick : function(e){ 
                e.stopPropagation();
            },
            onNodeIconClick : function(e){ 
                var $node = $(this).closest('li.parent_li');
                e.data.nodeToggleExpand($node, true);
                e.stopPropagation();
            },
        }
        

        
        $(this).data('tree', treeobj);
        

        //treeobj.styleAndEvent();return;
        
        $(this).addClass('tree');
        if(!option.actions || !option.target) {
            treeobj.redraw();
        }else{
            treeobj.load();
        }
    });
    return this;
};