$.fn.tree = function(_option){
    var option = _option || {};
    var option = $.extend({
        'actions':null,
        'target':null,
        'icon-plus-sign':"fa-plus-square",
        'icon-minus-sign':"fa-minus-square"
    }, _option);
    this.option = option;
    
    this.option.$feedback = $();
    this.option.$feedback_loading= $();
    
    this.each(function() {
        var treeobj = {
            'option' : option,
            '$this' : $(this),
            'data' : null,
            'load' : function(){
                option.$feedback_loading.show();
                $.ajax({
                    treeobj : treeobj,
                    type:'POST',
                    url:option.actions.read,
                    dataType:'json',
                    success: function(response)
                    {
                        if(response.error_exist){
                            this.treeobj.option.$feedback.html(response.error_msg).show();
                            return;   
                        }
                        treeobj.setmodel(response.data);
                    },
                    error: function(xhr, optns, err)
                    {
                        console.log(xhr.responseText);
                        if(optns == 'parsererror'){
                            this.treeobj.option.$feedback.html('Fail to receive reply from server, please try again later.').show();
                        }else{
                            this.treeobj.option.$feedback.html('Fail to connect to server, please try again later.').show();
                        }
                    },
                    complete: function() {
                        this.treeobj.option.$feedback.html('');
                        this.treeobj.option.$feedback_loading.hide();
                    }
                });
            },
            setmodel : function(data){
                this.model = data;
                this.redraw(this.model.children[0]);  
            },
            renderNode : function(data, node){
                var ln = data.lastName || '';
                var fn = data.firstName || '';
                var ns = [];
                if(ln != '') ns.push(ln.capitalizeFirstChar());
                if(fn != '') ns.push(fn.capitalizeFirstChar());
                
                
                //var text = '<span><i class="fa"></i>' + ns.join(' ') + '</span>';
                var text = '<a class="btn btn-default"><i class="fa"></i>' + ns.join(' ') + '</a>';
                return text;
            },
            drawNode : function($parent, node){                
                $node = $('<li>').append($(this.renderNode(node.data, node)));
                $parent.append($node);

                if(node.children && node.children.length){
                    $ul = $('<ul>');
                    $node.append($ul);
                    for(i in node.children){
                        this.drawNode($ul, node.children[i]);
                    }
                }
                
                return $node;
            },
            
            drawNodeToolbar : function(node) {
                $text = $(           
'<div class="btn-group">'+
'  <button type="fa fa-trash button delete-btn" class="btn btn-default">Left</button>'+
'  <button type="fa fa-pencil add-btn" class="btn btn-default">Middle</button>'+
'</div>');
                return $text;
            },
            
            redraw : function(data){
                var $this = this.$this; 
                $this.empty();
                $ul = $('<ul>');
                $this.append($ul);
                $node = this.drawNode($ul, data, $this);
                this.styleAndEvent();
            },
            
            styleAndEvent : function(){
                var $this = this.$this;
                $this.find('li:has(ul)').addClass('parent_li');
                $this.find('li.parent_li > .btn > i').addClass('fa');
                $this.find('li.parent_li > .btn').each(function(){
                    var children = $(this).parent('li.parent_li').find(' > ul > li');
                    if (children.is(":visible")) {
                        $(this).find(' > i').addClass(option['icon-plus-sign']).removeClass(option['icon-minus-sign']);
                    } else {
                        $(this).find(' > i').addClass(option['icon-minus-sign']).removeClass(option['icon-plus-sign']);
                    }
                });
                $this.on('click', 'li.parent_li > .btn', function (e) {
                    var children = $(this).parent('li.parent_li').find(' > ul > li');
                    if (children.is(":visible")) {
                        children.hide('fast');
                        $(this).find(' > i').addClass(option['icon-plus-sign']).removeClass(option['icon-minus-sign']);
                    } else {
                        children.show('fast');
                        $(this).find(' > i').addClass(option['icon-minus-sign']).removeClass(option['icon-plus-sign']);
                    }
                    e.stopPropagation();
                });
            }
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