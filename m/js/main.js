function AppController() {
    this.header = {
        height : 53  
    };
    this.footer = {
        height : 53  
    };
    this.controllers = {};
    this.init = function(){
        $.each(this.controllers, function(i,controller){
            controller.init();
        });
    };
    this.onInitialized = function() {
        
    };
    
    return this;   
}
app = new AppController();

function Controller() {
    return this;   
}
Controller.prototype = {
    url : '',
    suburls : '',
    sel : '',
    subsels : null,
    $sel : null,
    isRoot : false,
    testURL : function(lastevt, evt){        
        console.log((typeof evt.pathNames) + ',length=' + evt.pathNames.length + ', [' + evt.pathNames + '],' + this.isRoot + ', ' +  (evt.pathNames[0] == '') + ',' + (evt.pathNames[0] == '/') );
        if(evt.pathNames.length == 0){
            return this.isRoot;   
        }else{
            return evt.pathNames[0] == this.url;   
        }
    },
    processURL : function(lastevt, evt){
        var _this = this;
        if(this.testURL(lastevt, evt)){
            $.each(app.controllers, function(i,controller){
                if(_this == controller) controller.show();
                else controller.hide();
            });
            return true;   
        }
        return false;
    },
    init : function() {
        this.$sel = $(this.sel);   
    },
    show : function(a) {
        if(this.$sel.is(':visible'))return;
        $(window).on('resize', this, this._onResize);
        this.onShow(a);
        this.$sel.show();
        this.onShown(a);
        $(window).trigger('resize');
    },
    hide : function(a) {
        if(!this.$sel.is(':visible'))return;   
        $(window).off('resize', this._onResize);
        this.onHide(a);
        this.$sel.hide();
        this.onHidden(a);
    },
    onShow : function(a){
    },
    onShown : function(a){
    },
    onHide : function(a){
    },
    onHidden : function(a){
    },
    onResize : function(evt){
    },
    
    
    _onResize : function(evt){
        evt.data.onResize(evt);   
    }
};

function SliderController() {
    Controller.prototype.constructor.call(this);
    return this;   
}
SliderController.prototype = $.extend(Object.create(Controller.prototype), {
    $slider : null,
    $sliderContents : null,
    hammer: null,
    sliderOption : {
        mode: 'horizontal',
        controls: false,
        pager: false,
        touchEnabled: false,
        infiniteLoop: false,
        startSlide: 0
    },
    processURL : function(lastevt, evt) {
        var ret = Controller.prototype.processURL.call(this, lastevt, evt);  
        if(!ret)return false;
        var i = evt.pathNames.length < 2 ? 0 : this.suburls.indexOf(evt.pathNames[1]);
        this.$slider.goToSlide(i);
        return true;
    },
    init : function() {
        var _this = this;
        Controller.prototype.init.call(this);
        this.$sliderContents = this.$sel.find('.sliderContent');
        this.sliderOption.onSlideBefore = function($slideElement, oldIndex, newIndex){
            _this.$sliderContents.eq(newIndex).scrollTop(1);
        };
        this.sliderOption.onSlideAfter = function($slideElement, oldIndex, newIndex){
            $.address.value('/' + _this.url + '/' + _this.suburls[newIndex]);
        };
        this.$slider = this.$sel.find('.slider').bxSlider(this.sliderOption);
    },
    onShow : function(a) {
        var _this = this;
        this.hammer = new Hammer(this.$sel.find('.sliderContainer').addBack('.sliderContainer')[0], {});
        this.hammer.on('swipeleft swiperight', function(evt){
            if(evt.type == 'swipeleft') _this.$slider.goToNextSlide();
            else _this.$slider.goToPrevSlide();
        });
        $(document).on('keydown', this, this._onKeyDown);
    },
    onHide : function(a) {
        this.hammer.off('swipeleft swiperight');
        $(document).off('keydown', this._onKeyDown);
    },
    onHidden : function(a) {
        console.log(this.sel + ' onHidden');
        //this.$slider.goToSlide(0);   
        //this.$sliderContents.scrollTop(1);
    },
    onKeyDown : function(evt){
        
    },
    onResize : function(evt){
        var ww = $(window).width();
        var wh = $(window).height();
        this.$sliderContents.css({width:ww, height:wh - app.header.height, 'margin-top':app.header.height}); 
        this.$sel.find('.bx-wrapper, .bx-viewport').css({height:wh}); 
        this.$slider.redrawSlider();  
    },
    
    _onKeyDown : function(evt){
        evt.data.onKeyDown(evt);   
    }
});
function HomeController() {
    this.sel = '#about';
    this.url = 'about';
    this.isRoot = true;
    this.suburls = ['what-define-us', 'what-we-do', 'how-we-work'];
    return this;   
}
HomeController.prototype = $.extend(Object.create(SliderController.prototype), {});

function PlatformController() {
    this.sel = '#platform';
    this.url = 'platform';
    this.suburls = ['entry', 'branding', 'web-development', 'integrated-communication'];
    this.subsels = ['#platform-entry', '#platform-branding', '#platform-web-development', '#platform-integrated-communication'];
    return this;   
}
PlatformController.prototype = $.extend(Object.create(SliderController.prototype), {
    init : function() {
        var _this = this;
        SliderController.prototype.init.call(this);
        this.$sel.find('[data-slidercontent]').click(function(){
            
            var i = _this.subsels.indexOf($(this).attr('data-slidercontent'));
            console.log('click!!!' + $(this).attr('data-slidercontent') + ','+i);
            if(i>=0){
                _this.$slider.goToSlide(i);   
            }
        });
    }
});

function CrewController() {
    this.sel = '#crew';
    this.url = 'crew';
    this.suburls = [];
    return this;   
}
CrewController.prototype = $.extend(Object.create(SliderController.prototype), {
    init : function() {
        SliderController.prototype.init.call(this);
        var highlightCrewIndex = -1;
        var $crew = $('#crew1,#crew2,#crew3,#crew4,#crew5,#crew6');
        $crew.each(function(ind, ele) {
            $detail = $(this).find('.crewDetail');
            if ($detail.length == 0) {
                $(this).click(function() {
                    setHighlightCrew(-1);
                });
            } else {
                $(this).click(function() {
                    var index = parseInt($(this).attr('id').substring(4));
                    var top = $(this).position().top;
                    setHighlightCrew(index - 1);
                    //$('#crew').stop(true).animate({scrollTop:top},500);
                });
            }
        });

        function setHighlightCrew(index, a) {
            highlightCrewIndex = index;
            $crew.each(function(ind, ele) {
                if (index != -1) {
                    if (ind == index) {
                        $(this).addClass('selected');
                        $(this).removeClass('others');

                    } else {
                        $(this).removeClass('selected');
                        $(this).addClass('others');
                    }
                } else {
                    $(this).removeClass('selected');
                    $(this).removeClass('others');
                }
            });
        }
    },
    onResize : function(evt) {
        SliderController.prototype.onResize.call(this);
        this.$sel.find('[data-scale-fit-width]').each(function(ind, ele) {
            var pw = Math.floor($(this).parent().width());
            var w = $(this).width();
            var s = pw / w;
            $(this).css({
                'transform-origin': '0 0',
                '-webkit-transform': 'scale(' + s + ')',
                '-ms-transform': 'scale(' + s + ')',
                'transform': 'scale(' + s + ')'
            });
        });
    }
});

function FoliosController() {
    this.sel = '#folios';
    this.url = 'folios';
    this.suburls = [];
    return this;   
}
FoliosController.prototype = $.extend(Object.create(SliderController.prototype), {
    init : function() {
        SliderController.prototype.init.call(this);
    },
    onResize : function(evt) {
        SliderController.prototype.onResize.call(this);
        this.$sel.find('[data-scale-fit-width]').each(function(ind, ele) {
            var pw = Math.floor($(this).parent().width());
            var w = $(this).width();
            var s = pw / w;
            $(this).css({
                'transform-origin': '0 0',
                '-webkit-transform': 'scale(' + s + ')',
                '-ms-transform': 'scale(' + s + ')',
                'transform': 'scale(' + s + ')'
            });
        });
    }
});

function ContactController() {
    this.sel = '#contact';
    this.url = 'contact';
    this.suburls = [];
    return this;   
}
ContactController.prototype = $.extend(Object.create(SliderController.prototype), {
    init : function() {
        SliderController.prototype.init.call(this);
    }
});



$(document).ready(function(){
    bouncefix.add('sliderContent');
    bouncefix.add('mainScrollContent');
    
    $("#mainContainer nav ul").slideUp(0);
    $("#mainContainer nav .navbtn").click(function(evt) {
        var hidden = $("#mainContainer nav ul").is(":hidden");
        if (hidden) {
            $("#mainContainer nav ul").slideDown(0);
        } else {
            $("#mainContainer nav ul").slideUp(0);
        }
    });
    $("#mainContainer nav a").click(function(evt) {
        $("#mainContainer nav ul").slideUp(0);
    });
    
    app.controllers.home = new HomeController();
    app.controllers.platform = new PlatformController();
    app.controllers.crew = new CrewController();
    app.controllers.folios = new FoliosController();
    app.controllers.contact = new ContactController();
    app.init();
    
    var lastProcessedEvent = null;
    $.address.init(function(event) {
        var prevvalue = lastProcessedEvent ? lastProcessedEvent.value : "";
        console.log('address.init@' + prevvalue + ' > '+event.value);
        $.each(app.controllers, function(name, controller) {
            if (controller.processURL(lastProcessedEvent, event)) {
                lastProcessedEvent = event;
                return false;
            }
        });
        $('a').each(function() {
            var alink = $(this).attr('href') || "";
            if (alink.indexOf('#') == 0) {
                alink = '/' + alink.substring(1);
                $(this).toggleClass('selected', alink == event.value);
            }
        });
    }).bind('change', function(event) {
        var prevvalue = lastProcessedEvent ? lastProcessedEvent.value : "";
        console.log('address.change@' + prevvalue + ' > '+event.value);
        if (lastProcessedEvent && lastProcessedEvent.value == event.value) return;

        $('a').each(function() {
            var alink = $(this).attr('href') || "";
            if (alink.indexOf('#') == 0) {
                alink = '/' + alink.substring(1);
                $(this).toggleClass('selected', alink == event.value);
            }
        });
        var processed = false;
        $.each(app.controllers, function(name, controller) {
            if (controller.processURL(lastProcessedEvent, event)) {
                lastProcessedEvent = event;
                processed = true;
                return false;
            }
        });
    });
    
    
});