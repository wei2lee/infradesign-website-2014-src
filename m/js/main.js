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
        //console.log((typeof evt.pathNames) + ',length=' + evt.pathNames.length + ', [' + evt.pathNames + '],' + this.isRoot + ', ' +  (evt.pathNames[0] == '') + ',' + (evt.pathNames[0] == '/') );
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
                if(_this != controller) controller.hide();
            });
            this.show();
            return true;   
        }
        return false;
    },
    init : function() {
        this.$sel = $(this.sel);   
    },
    onPostInit : function() {
        
    },
    onInitialized : function() {
        
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
        
        this.$sliderContents.stop(true).animate({scrollTop:1},500);
    },
    onHide : function(a) {
        this.hammer.off('swipeleft swiperight');
        $(document).off('keydown', this._onKeyDown);
        this.$sliderContents.scrollTop(1);
    },
    onHidden : function(a) {
        this.$slider.goToSlide(0);   
    },
    onKeyDown : function(evt){
        if(evt.keyCode == 37) this.$slider.goToPrevSlide()
        else if(evt.keyCode == 39) this.$slider.goToNextSlide()
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
    preload : {
        state : 0,
        loaded : 0,
        total : 0,
        objs : [],
        startAnimOnPreloaded : false
    },
    foliosanim1delay : null,
    foliosanim1 : null,
    foliosanim1_1 : null,
    foliosanim2delay : null,
    foliosanim2 : null,
    isinitcycle : true,
    
    init : function() {
        SliderController.prototype.init.call(this);
        this.preload.startAnimOnPreloaded = false;
        this.preloadFoliosImage();
    },
    stopPreloadFoliosImage : function() {
        var _this = this;
        if(this.preload.state == 1){
            this.preload.state = 0;
            this.preload.loaded = 0;
            this.preload.total = 0;
            $.each(this.preload.objs, function(i,obj){
                obj.img.onload = null;
            });
            this.preload.objs = [];
        }
    },
    preloadFoliosImage : function() { console.log('preloadFoliosImage');
        
        this.preload.state = 1;
        this.preload.total = this.$sel.find(".folios_page>div").length;
        this.preload.loaded = 0;
        this.preload.objs = []; 
        
        var _this = this;
        
        this.$sel.find(".folios_page>div").each(function(i, ele) {
            var backgroundimage = $(this).css('background-image');
            var reg = /url\((.+?)\)/;
            var m = reg.exec(backgroundimage);
            var obj = { 'ele':$(this), 'img': new Image() };
            obj.img.onload = function() { 
                _this.preload.loaded++;
                console.log('preloadFoliosImage@img.onload, loaded='+_this.preload.loaded + ',' + _this.preload.total);
                if (_this.preload.loaded == _this.preload.total && _this.preload.state == 1) {
                    _this.preload.state = 2;
                    _this.onPreloadedFoliosImage();
                }
                obj.img.onload = null;
            }
            obj.img.src = m[1];
            _this.preload.objs.push(obj);
        });
    },

    onPreloadedFoliosImage : function() { console.log('onPreloadedFoliosImage');
        var _this = this;
        $.each(this.preload.objs, function(i, obj) {
            var grayScaleData = Filters.filterImage(Filters.grayscale, obj.img);
            var grayScaleDataUrl = grayScaleData.canvas.toDataURL("image/png")
            var style = 
                "left:0px; top:0px; " + 
                "width:" + obj.ele.css('width') + ";" + 
                "height:" + obj.ele.css('height') + ";" +
                "background-image:url(" + grayScaleDataUrl + ")";
            obj.ele.empty();
            obj.ele.append($("<div class='grayscale' style='" + style + "';></div>"));
        });
        if(this.preload.startAnimOnPreloaded) this.startFoliosAnimation();
    },
    
    stopFoliosAnimation : function() { console.log('stopFoliosAnimation');
        if(this.foliosanim1delay){
            this.foliosanim1delay.kill();
            this.foliosanim1.kill();
            this.foliosanim1_1.kill();
            this.foliosanim2delay.kill();
            this.foliosanim2.kill();
        }
        TweenMax.set($("#folios_page1>div"), { alpha: 0 });
        TweenMax.set($("#folios_page2>div"), { alpha: 0 });
        $("#folios_page1").css("pointer-events", "none");
        $("#folios_page2").css("pointer-events", "none");
        $("#folios_page1>div").unbind('mouseenter mouseleave mouseover mouseout');
        $("#folios_page1").unbind('mouseenter mouseleave mouseover mouseout');
        $("#folios_page2>div").unbind('mouseenter mouseleave mouseover mouseout');
        $("#folios_page2").unbind('mouseenter mouseleave mouseover mouseout');
    },
    
    startFoliosAnimation : function() { console.log('startFoliosAnimation');
        var _this = this;
        var pagedelay = 2;
        var pagedelay2 = 1.5;
        var alphatweendelay = 0.1;
        var randomdelayk = 0.3;
        var tweenduration = 0.7;
        var leftdelayk = 0.0040;
        var pagewidth = 320;

        this.isinitcycle = true;
        this.foliosanim1delay = new TimelineMax({paused: true, overwrite:'none'});
        this.foliosanim1 = new TimelineMax({paused: true, overwrite:'none'});
        this.foliosanim1_1 = new TimelineMax({paused: true, overwrite:'none'});
        this.foliosanim2delay = new TimelineMax({paused: true, overwrite:'none'});
        this.foliosanim2 = new TimelineMax({paused: true, overwrite:'none'});

        TweenMax.set($(".folios_page"), { perspective: 2000 });
        TweenMax.set($("#folios_page1>div"), { alpha: 0 });
        TweenMax.set($("#folios_page2>div"), { alpha: 0 });
        $("#folios_page1").css("pointer-events", "none");
        $("#folios_page2").css("pointer-events", "none");
        $("#folios_page1>div").unbind('mouseenter mouseleave mouseover mouseout');
        $("#folios_page1").unbind('mouseenter mouseleave mouseover mouseout');
        $("#folios_page2>div").unbind('mouseenter mouseleave mouseover mouseout');
        $("#folios_page2").unbind('mouseenter mouseleave mouseover mouseout');
                                       
        this.foliosanim1delay.insert(TweenMax.to({x: 0}, pagedelay, {x: 0}));
                                       
        this.foliosanim1delay.append(TweenMax.delayedCall(0, function() {
            console.log("FoliosAnimation-1");
            _this.foliosanim1.restart();
        }));

        this.foliosanim1.insert(TweenMax.delayedCall(0, function() {
            console.log("FoliosAnimation-2-isinitcycle="+_this.isinitcycle);
            $("#folios_page1").show();
            $("#folios_page1").css("pointer-events", "visible");
            $("#folios_page2").css("pointer-events", "none");
            if (_this.isinitcycle) {
                TweenMax.set($("#folios_page2>div"), { alpha: 0 });
                TweenMax.set($("#folios_page1>div"), { alpha: 0 });
            }
            $("#folios_page2>div").unbind('mouseenter mouseleave mouseover mouseout');
            $("#folios_page2").unbind('mouseenter mouseleave mouseover mouseout');
        }));
        $("#folios_page2>div").each(function() {
            var left = parseInt($(this).css('left'));
            var randomdelay = Math.random() * randomdelayk;
            _this.foliosanim1.insert(TweenMax.fromTo($(this), tweenduration, 
            { alpha: 1 }, { alpha: 0 }), 
            (pagewidth - left) * leftdelayk + randomdelay + alphatweendelay);
            
            _this.foliosanim1.insert(TweenMax.fromTo($(this), tweenduration, 
            { rotationY: 0 }, { rotationY: -180, transformOrigin: "center center" }), 
            (pagewidth - left) * leftdelayk + randomdelay);
        });
//return;
        $("#folios_page1>div").each(function() {
            var left = parseInt($(this).css('left'));
            var randomdelay = Math.random() * randomdelayk;
            _this.foliosanim1_1.insert(TweenMax.fromTo($(this), tweenduration, 
            { alpha: 0 }, { alpha: 1, ease: Quad.easeIn }), 
            0 + 0.5 + left * leftdelayk + randomdelay + alphatweendelay);
            _this.foliosanim1_1.insert(TweenMax.fromTo($(this), tweenduration, 
            { rotationY: -200 }, { rotationY: 0, transformOrigin: "center center" }), 
            0 + 0.5 + left * leftdelayk + randomdelay);
        });
        this.foliosanim1.insert(TweenMax.delayedCall(pagedelay2, function(){ _this.foliosanim1_1.restart(); }));
        this.foliosanim1_1.append(TweenMax.delayedCall(0, function() {
            console.log("FoliosAnimation-3");
            _this.foliosanim2delay.restart();
            $("#folios_page1>div").hover(function() {
                _this.foliosanim2delay.pause();
            });
            $("#folios_page1").hover(
                function() {
                    _this.foliosanim2delay.pause();
                },
                function() {
                    _this.foliosanim2delay.resume();
                }
            );
        }));
//return;
        this.foliosanim2delay.insert(TweenMax.to({ x: 0 }, pagedelay, { x: 0 }));
        this.foliosanim2delay.append(TweenMax.delayedCall(0, function() {
            console.log("FoliosAnimation-4");
            _this.foliosanim2.restart();
        }));
//return;
        this.foliosanim2.insert(TweenMax.delayedCall(0, function() {
            console.log("FoliosAnimation-5");
            $("#folios_page2").show();
            $("#folios_page1").css("pointer-events", "none");
            $("#folios_page2").css("pointer-events", "visible");
            $("#folios_page1>div").unbind('mouseenter mouseleave mouseover mouseout');
            $("#folios_page1").unbind('mouseenter mouseleave mouseover mouseout');
        }));
//return;
        $("#folios_page1>div").each(function() {
            var left = parseInt($(this).css('left'));
            var randomdelay = Math.random() * randomdelayk;
            _this.foliosanim2.insert(TweenMax.fromTo($(this), tweenduration, 
            { alpha: 1 }, { alpha: 0 }), 
            left * leftdelayk + randomdelay + alphatweendelay);
            _this.foliosanim2.insert(TweenMax.fromTo($(this), tweenduration, 
            { rotationY: 0 }, { rotationY: 180, transformOrigin: "center center" }), 
            left * leftdelayk + randomdelay);
        });
//return;
        $("#folios_page2>div").each(function() {
            var left = parseInt($(this).css('left'));
            var randomdelay = Math.random() * randomdelayk;
            _this.foliosanim2.insert(TweenMax.fromTo($(this), tweenduration, 
            { alpha: 0 }, { alpha: 1, ease: Quad.easeIn }), 
            pagedelay2 + (pagewidth - left) * leftdelayk + randomdelay + alphatweendelay);
            _this.foliosanim2.insert(TweenMax.fromTo($(this), tweenduration, 
            { rotationY: 200 }, { rotationY: 0, transformOrigin: "center center" }), 
            pagedelay2 + (pagewidth - left) * leftdelayk + randomdelay);
        });

        this.foliosanim2.append(TweenMax.delayedCall(0, function() {
            console.log("FoliosAnimation-6");
            _this.isinitcycle = false;
            _this.foliosanim1delay.restart();
            $("#folios_page2>div").hover(function() {
                _this.foliosanim1delay.pause();
            });
            $("#folios_page2").hover(
                function() {
                    _this.foliosanim1delay.pause();
                },
                function() {
                    _this.foliosanim1delay.resume();
                }
            );
        }));

        TweenMax.set($("#folios_page1>div"), { alpha: 0 });
        TweenMax.set($("#folios_page2>div"), { alpha: 0 });
        this.foliosanim1_1.restart();
    },
    
    onShown : function(a) {         console.log('onShown');
        SliderController.prototype.onShown.call(this,a);
        this.stopPreloadFoliosImage();  
        this.stopFoliosAnimation();
        if(this.preload.state == 0){
            this.preload.startAnimOnPreloaded = true;
            this.preloadFoliosImage();
        }else if(this.preload.state == 2){
            this.startFoliosAnimation();
        }
    },
    
    onHide : function(a) {
        SliderController.prototype.onHide.call(this,a);
        this.stopPreloadFoliosImage();  
        this.stopFoliosAnimation();
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
        var _this = this;
        var fields = {};
        $('#contact form')
            .bootstrapValidator({
                fields: fields = {
                    cu_name: {
                        validators: {
                            notEmpty: {
                                message: 'The name is required and cannot be empty.'
                            }
                        }
                    },
                    cu_contact: {
                        validators: {
                            notEmpty: {
                                message: 'The contact is required and cannot be empty.'
                            }
                        }
                    },
                    cu_email: {
                        validators: {
                            notEmpty: {
                                message: 'The email address is required and cannot be empty.'
                            },
                            emailAddress: {
                                message: 'The email address is not valid.'
                            }
                        }
                    },
                    cu_message: {
                        validators: {
                            notEmpty: {
                                message: 'The message is required and cannot be empty.'
                            }
                        }
                    }
                }
            })

        .on('success.form.bv', function(e) {
                // Reset the message element when the form is valid
                var progressDialog = bootbox.dialog({
                    message: "Sending Enquiry...",
                    closeButton: false
                });
                var bv = $('#contact form').data('bootstrapValidator'); 
                var data = {};
                $.each(fields, function(name){
                   data[name.substring(3)] = bv.getFieldElements(name).val(); 
                });
                console.log(data);
                $.ajax(
                {
                    type: "POST",
                    url: "../contact.php",
                    data:data,
                    success: function(response)
                    {
                        $("#mainContainer").css("cursor", "auto");
                        progressDialog.close();
                        bootbox.dialog({
                            message: "Your enquiry is sent, Thank you!",
                            closeButton: true
                        });
                        $.cookie("signed", "yes", { expires:365 });
                    },
                    error: function(xhr, optns, err)
                    {
                        $("#mainContainer").css("cursor", "auto");
                        progressDialog.close();
                        bootbox.dialog({
                            message: "Your enquiry is sent, Thank you!",
                            closeButton: true
                        });
                    }
                });
            
            })
            .on('error.form.bv', function(e) {
                // Reset the message element when the form is valid
                var alert_message = '';
                var bv = $('#contact form').data('bootstrapValidator');   
                var msgs = bv.getMessages();
                for (k in msgs) alert_message += '<p>' + msgs[k] + '</p>';
                alert_message = '<div class="cu_form_danger">' + alert_message + '</div>';
                bootbox.dialog({
                    className: "",
                    title: 'Form Validation Error',
                    message: alert_message
                });
                //$(bv.getInvalidFields()[0]).focus();
            })
            .on('error.field.bv', function(e, data) {
                data.element
                    .data('bv.messages')
                    .find('.help-block[data-bv-for="' + data.field + '"]')
                    .hide();
            })
            .on('success.field.bv', function(e, data) {
                // Remove the field messages

            });
        $('#contact form [type=reset]').click(function(){
            $('#contact form').data('bootstrapValidator').resetForm();
        });
        
    }
});



$(document).ready(function(){
    $("body").on("show", ".modal", function () { console.log('modal show');
        $(this).css({
            'top': '50%',
            'margin-top': function () {
                return -($(this).height() / 2);
            }
        });
    });

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