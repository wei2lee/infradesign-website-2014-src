function isEmailAddress(email)
{
	var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}


/* Validate phone number */

function isPhoneNumber(numb)
{
	var intRegex = /[0-9 -()+]+$/;
	return (numb.length >= 9 && intRegex.test(numb));
}

var app = null;

function AppController() {
    this.header = {
        height : 53  
    };
    this.footer = {
        height : 53  
    };
    this.controllers = {};
    this.init = function(){
        this.initHeader();
        $.each(this.controllers, function(i,controller){
            controller.init();
        });
    };
    this.onInitialized = function() {
        
    };
    
    this.initHeader = function() {
        $("#mainContainer nav ul").show();
        $("#mainContainer nav ul").slideUp(0);
        this.navVisible = false;
        
        $("#mainContainer nav .navbtn").click(function(evt) {
            var hidden = $("#mainContainer nav ul").is(":hidden");
            if (hidden) {
                $('.overlay').stop(true).fadeIn(200);
                $("#mainContainer nav ul").slideDown(200);
                $('.video-container').addClass('overlayed');
                this.navVisible = true;
            } else {
                $('.overlay').stop(true).fadeOut(200);
                $("#mainContainer nav ul").slideUp(200);
                $('.video-container').removeClass('overlayed');
                this.navVisible = false;
            }
        });
        $("#mainContainer nav a").click(function(evt) {
            $("#mainContainer nav ul").slideUp(200);
            $('.overlay').stop(true).fadeOut(200);
            $('.video-container').removeClass('overlayed');
            this.navVisible = false;
        });
    }
    
    this.controllers.home = new HomeController();
    this.controllers.about = new AboutController();
    this.controllers.platform = new PlatformController();
    this.controllers.crew = new CrewController();
    this.controllers.folios = new FoliosController();
    this.controllers.contact = new ContactController();
    
    return this;   
}

function Controller() {
    return this;   
}
Controller.prototype = {
    isFullPage : false,
    url : '',
    suburls : '',
    sel : '',
    subsels : null,
    $sel : null,
    isRoot : false,
    controllers : [],
    controllerkeys : [],
    visible : false,
    testURL : function(lastevt, evt){      
        if(typeof lastevt == 'string') {
            var url = lastevt;
            if(url == '' || url == '/') return this.isRoot;
            else return url.indexOf(this.url) == 1; 
        }else{
            if(evt.pathNames.length == 0){
                return this.isRoot;   
            }else{
                return evt.pathNames[0] == this.url;   
            }
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
        if(this.visible)return;
        
        this.visible = true;
        $(window).on('resize', this, this._onResize);
        this.onShow(a);
        //this.$sel.show();
        this.$sel.fadeIn(400);
        this.onShown(a);
        $(window).trigger('resize');
    },
    hide : function(a) {
        if(!this.visible)return;   
        
        this.visible = false;
        $(window).off('resize', this._onResize);
        this.onHide(a);
        //this.$sel.hide();
        this.$sel.fadeOut(400);
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
    },
    onSlideBefore : function(oldIndex,newIndex){
    },
    onSlideAfter : function(oldIndex,newIndex){
    },
    onWillSlideToSelf : function(){
    },
    onDidSlideToSelf : function(){
    },
    onWillSlideFromSelf : function(){
    },
    onDidSlideFromSelf : function(){
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
        
        this.$sliderContents = this.$sel.find('>.slider>li>.sliderContent');
        
        
        this.sliderOption.onSlideBefore = function($slideElement, oldIndex, newIndex){
            _this.$sliderContents.eq(newIndex).scrollTop(0);
            _this.onSlideBefore(oldIndex, newIndex);
            
            var c; 
            var k;
            
            k = _this.controllerkeys[oldIndex];
            if(k){
                c = _this.controllers[k];     
                if(c){
                    c.onWillSlideFromSelf();  
                }
            }
            k = _this.controllerkeys[newIndex];
            if(k){
                c = _this.controllers[k];     
                if(c){
                    c.onWillSlideToSelf();  
                }
            }
        };
        this.sliderOption.onSlideAfter = function($slideElement, oldIndex, newIndex){
            $.address.value('/' + _this.url + '/' + _this.suburls[newIndex]);
            _this.onSlideAfter(oldIndex, newIndex);
            
            var c; 
            var k;
            
            k = _this.controllerkeys[oldIndex];
            if(k){
                c = _this.controllers[k];     
                if(c){
                    c.onDidSlideFromSelf();  
                }
            }
            k = _this.controllerkeys[newIndex];
            if(k){
                c = _this.controllers[k];     
                if(c){
                    c.onDidSlideToSelf();  
                }
            }
        };
        this.$slider = this.$sel.find('>.slider').bxSlider(this.sliderOption);
        this.hammer = new Hammer(this.$sel[0], {}); 
    },
    
    onSlideBefore : function(oldIndex, newIndex) {
        
    },
    
    onSlideAfter : function(oldIndex, newIndex) {
        
    },
    
    onShow : function(a) { 
        var _this = this;
        this.hammer.on('swipeleft swiperight', function(evt){
            if(evt.type == 'swipeleft') _this.$slider.goToNextSlide();
            else _this.$slider.goToPrevSlide();
        });
        $(document).on('keydown', this, this._onKeyDown);
    },
    onHide : function(a) {
        this.hammer.off('swipeleft swiperight');
        $(document).off('keydown', this._onKeyDown);
        this.$sliderContents.scrollTop(0);
        this.$slider.goToSlide(0);   
        
        //fix bxslider wouldnt udpate to proper state 
        //if the slider is hidden before the transition is ended
        this.$slider.slider.working = false;
        this.$slider.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
    },
    onHidden : function(a) {
        //
    },
    onKeyDown : function(evt){ 
        if(evt.keyCode == 37) this.$slider.goToPrevSlide()
        else if(evt.keyCode == 39) this.$slider.goToNextSlide()
    },
    onResize : function(evt){ 
        var ww = $(window).width();
        var wh = $(window).height();
        if(this.isFullPage) this.$sliderContents.css({width:ww, height:wh, 'margin-top':0}); 
        else this.$sliderContents.css({width:ww, height:wh - app.header.height, 'margin-top':app.header.height}); 
        this.$sel.find('>.bx-wrapper, >.bx-wrapper>.bx-viewport').css({height:wh}); 
        this.$slider.redrawSlider();  
    },
    
    _onKeyDown : function(evt){
        evt.data.onKeyDown(evt);   
    }
});

function HomeController() {
    var _this = this;
    this.sel = '#home';
    this.url = 'home';
    this.controllermaps = [
        {name:'banner', controller:new BannerController(), subsel:'#banner', suburl:'banner'}, 
        {name:'prosales', controller:new ProsalesController(), subsel:'#prosales', suburl:'prosales'}, 
        {name:'saleskit', controller:new SaleskitController(), subsel:'#saleskit', suburl:'saleskit'}, 
        {name:'vr', controller:new VRController(), subsel:'#virtual-tour', suburl:'virtual-tour'}, 
        {name:'ar', controller:new ARController(), subsel:'#augmented-reality', suburl:'augmented-reality'}
    ];
    this.subsels = [];
    this.suburls = [];
    this.controllerkeys = [];
    this.controllers = [];
    for(k in this.controllermaps){
        var v = this.controllermaps[k];
        this.subsels.push(v.subsel);
        this.suburls.push(v.suburl);
        this.controllerkeys.push(v.name);
        this.controllers[v.name] = v.controller;
    }


    this.registerHtml = $("#popup_register").wrap('<div>').parent().html();
    this.popupThankHtml = $("#popup_content_thank").show().wrap('<div>').parent().html();
    $("#popup_content_register").remove();
    $("#popup_content_thank").remove();
    $.each(this.controllermaps, function(i,map){
        if(map.name == 'banner')return;
        map.controller.$register = $(_this.registerHtml).show();        
        var prefix = map.suburl + '_';
        map.controller.$register.attr('data-input-id-prefix', prefix);
        map.controller.$register.data('data-input-id-prefix', prefix);
        map.controller.$register.find('label[for]').each(function(){
             $(this).attr('for', prefix + $(this).attr('for')) ;
        });
        map.controller.$register.find('input[id]').each(function(){
             $(this).attr('id', prefix + $(this).attr('id')) ;
        });
        $(map.subsel).find('.register-container').append(map.controller.$register);
        map.controller.$register.find('input[type=submit]').on('click', _this, _this.onRegisterSubmit);
        map.controller.$register.find('input[type=reset]').on('click', _this, _this.onRegisterReset);
    });
    $(this.sel).find('a.scroll-to-register').click(function(){
        var $sliderContent = $(this).parents('.sliderContent'); 
        var top = $sliderContent.find('form').position().top;
        var time = 750;
        var speed = 3300 / 750 * 0.9;
        //console.log('scroll top='+top+',time='+time);
        time = top / speed;
        $sliderContent.stop(true).animate({scrollTop:top}, time);
    });
    return this;   
}
HomeController.prototype = $.extend(Object.create(SliderController.prototype), {
    isFullPage : true,
    onRegisterSubmit : function(evt){
        var _this = evt.data;
        var form = $(this).parents('form');
        if(form.data('submitting')){
            console.log('submitting!');
            return;
        }
        form.data('submitting', false);
        
        var id = $(this).attr('id');
        var prefix = '';
        var regex = /(.+?_).+/;
        var m = id.match(regex)
        if(m.length>0) prefix = m[1];   
        else console.log('form error');
        form.find(".error p").html("&nbsp;");
        
        var reason = "";
        var user = {};
        user.name = $("#"+prefix+"register_name").val().trim();
        user.email = $("#"+prefix+"register_email").val().trim();
        user.contact = $("#"+prefix+"register_contact").val().trim();
        user.company = $("#"+prefix+"register_company").val().trim();
        user.businessType = $("#"+prefix+"register_businesstype").val().trim();
        user.interest = {};
        user.interest.prosalesdemoversion = $("#"+prefix+"register_prosalesdemoversion").is(':checked');
        user.interest.ar = $("#"+prefix+"register_ar").is(':checked');
        user.interest.crm = $("#"+prefix+"register_crm").is(':checked');
        user.interest.virtualtour = $("#"+prefix+"register_virtualtour").is(':checked');
        user.interest.mobileapplication = $("#"+prefix+"register_mobileapplication").is(':checked');
        
        try {
            if(user.name == ""){
                $("#"+prefix+"register_name").focus();
                reason = "Error : Please enter your name.";   
                throw reason;
            }
            if(user.email == ""){
                $("#"+prefix+"register_name").focus();
                reason = "Error : Please enter your email.";   
                throw reason;
            }
            if(!isEmailAddress(user.email)){
                $("#"+prefix+"register_email").focus();
                reason = "Error : Please enter correct format email.";   
                throw reason;
            }
            if(user.contact == ""){
                $("#"+prefix+"register_contact").focus();
                reason = "Error : Please enter your contact.";   
                throw reason;
            }
            if(!isPhoneNumber(user.contact)){
                $("#"+prefix+"register_contact").focus();
                reason = "Error : Please enter correct format contact."; 
                throw reason;
            }
            if(user.company == ""){
                $("#"+prefix+"register_company").focus();
                reason = "Error : Please enter your company.";   
                throw reason;
            }

            var anyInterest = false;
            for(var key in user.interest){
                if(user.interest[key] == true){
                    anyInterest = true;
                    break;   
                }
            }
            if(!anyInterest){
                reason = "Please tick at least one interest.";   
                throw reason;
            }
            $("#container").css("cursor", "wait");
            
            
            form.data('submitting', true);
            
            
            bootbox.dialog({
                message:"Your registration is processing...",
                closeButton:false
            });
            
            $.ajax(
            {
                type: "POST",
                url: "../api_register.php",
                data:user,
                success: function(response)
                {
                    console.log("../api_register.php response="+response);
                    
                    $("#container").css("cursor", "auto");
                    _this.resetForm(form, true);
                    //form.find(".error p").html("Enquiry has been sent.");
                    form.find(".error p").stop().hide(0).fadeIn(150);
                    

                    
                    form.data('submitting', false);
                    _this.openThankPopup();
                },
                error: function(xhr, optns, err)
                {
                    
                    $("#container").css("cursor", "auto");
                    //form.find(".error p").html("Error: " + (err || "Cannot connect to server!"));
                    form.find(".error p").stop().hide(0).fadeIn(150);
                    
                    form.data('submitting', false);
                    _this.openThankPopup();
                }
            });
            
            
        } catch(err){
            form.find(".error p").delay(200).html(reason).show();
            return;
        }
        
    },
    resetForm : function($form, flag) {
        $form.find("input[type=text], input[type=textarea]").val("");
        $form.find("input[type=checkbox]").attr("checked", false);
        $form.find(".error p").html("&nbsp;");
    },
    
    onRegisterReset : function() {
        var form = $(this).parents('form'); 
        
        
        
        var ele_id = $(this).attr('id');
        var prefix = '';
        var regex = /(.+?_).+/;
        var m = ele_id.match(regex)
        if(m.length>0) prefix = m[1];   
        else console.log('form error');   
        form.find(".error p").html("&nbsp;");
        $("#"+ prefix +"register_name").focus();
    },
    openThankPopup : function(){
        var _this = this;
        function close() {
            bootbox.hideAll();
            if(_this.popupThankCloseTimeout){
                clearTimeout(_this.popupThankCloseTimeout);
                _this.popupThankCloseTimeout = 0;
            }
        }
        bootbox.dialog({
            message: _this.popupThankHtml,
            closeButton: true,
            className: 'my-modal'
        });
        $('.my-modal').on('hidden.bs.modal', close);
        this.popupThankCloseTimeout = setTimeout(close,5000);
    },
    
    init : function() {
        SliderController.prototype.init.call(this);
        for(k in this.controllers){
            this.controllers[k].init();  
        };
    },
    show : function() { 
        SliderController.prototype.show.call(this);  
        for(k in this.controllers){
            this.controllers[k].show();  
        }
    },
    
    hide : function() {
        for(k in this.controllers){
            this.controllers[k].hide();  
        }
        SliderController.prototype.hide.call(this);  
    },
    
    onShow : function() {
        SliderController.prototype.onShow.call(this);
    },
    
    onHide : function() {
        SliderController.prototype.onHide.call(this);
    },
    
    onResize : function(evt) {
        var ww = $(window).width();
        var wh = $(window).height();
        for(k in this.controllers){
            var controller = this.controllers[k];
            if(controller.isFullPage) controller.$sel.css({width:ww, height:wh, 'margin-top':0}); 
            else controller.$sel.css({width:ww, height:wh - app.header.height, 'margin-top':app.header.height}); 
        }
        this.$sel.find('>.bx-wrapper, >.bx-wrapper>.bx-viewport').css({height:wh}); 
        this.$slider.redrawSlider();  
    }
    
});

////Child Controllers inside HomeController
function BannerController() {
    this.sel = '#home #banner';
}
BannerController.prototype = $.extend(Object.create(Controller.prototype), {
    isFullPage : true,
    sliderOption : {
        mode: 'horizontal',
        controls: false,
        pager: true,
        touchEnabled: false,
        infiniteLoop: true,
        startSlide: 0,
        auto:false,
        speed:750,
        pause:5500
    },
    init : function() { 
        var _this = this;
        Controller.prototype.init.call(this);
        this.$sliderContents = this.$sel.find('.slider>li>.sliderContent');
        this.sliderOption.onSlideBefore = function($slideElement, oldIndex, newIndex){
            if(newIndex == 0){
                $('footer').find("#fb-btn, #tw-btn").removeClass("bright");   
            }else{
                $('footer').find("#fb-btn, #tw-btn").addClass("bright");
            }
        };       
                       
        this.$slider = this.$sel.find('.slider').bxSlider(this.sliderOption);
        
        this.$sel.find('[data-slidercontent]').click(function(){
            var i = app.controllers.home.subsels.indexOf($(this).attr('data-slidercontent'));
            if(i>=0){
                app.controllers.home.$slider.goToSlide(i);   
            }
        });
        
        
    },
    onDidSlideToSelf : function() {
        this.$slider.startAuto();
    },
    onWillSlideFromSelf : function() {
        this.$slider.goToSlide(0);   
        this.$slider.stopAuto();
    },

    onHide : function(a) {
        this.$sliderContents.scrollTop(0);
        this.$slider.goToSlide(0);   
        this.$slider.stopAuto();
        //fix bxslider wouldnt udpate to proper state 
        //if the slider is hidden before the transition is ended
        this.$slider.slider.working = false;
        this.$slider.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
    },
    onHidden : function(a) {
        //
    },
    onResize : function(evt){ 
        var ww = $(window).width();
        var wh = $(window).height();
        this.$sliderContents.css({width:ww, height:wh}); 
        this.$sel.find('>.bx-wrapper, >.bx-wrapper>.bx-viewport').css({height:wh}); 
        this.$slider.redrawSlider();  
    },
});

function ProsalesController() {
    this.sel = '#home #prosales';
}
ProsalesController.prototype = $.extend(Object.create(Controller.prototype), {
    $video : null,
    videoSrc : '',
    
    init : function() {
        var _this = this;
        Controller.prototype.init.call(this);
        this.$video = this.$sel.find('video');
        var video = this.$video.get(0);
        video.onloadedmetadata = function() {
            this.onloadedmetadata = null;   
            _this.videoSrc = this.currentSrc;
        }
        /*
        this.$video.click(function(){
            if(video.paused)video.play(); 
            else video.pause();
        });//*/
    },
    
    onWillSlideFromSelf : function() { 
        try{ this.$video.get(0).pause(); }
        catch(ex){ console.log(ex); }        
    },
    onWillSlideToSelf : function() {
    },
    onShow : function() {
        Controller.prototype.onShow.call(this);
    },
    onHide : function() {
        Controller.prototype.onHide.call(this);
        try{ this.$video.get(0).currentTime = 0; }
        catch(ex){ console.log(ex); }
        try{ this.$video.get(0).pause(); }
        catch(ex){ console.log(ex); }
    },
    onResize : function() {
        Controller.prototype.onResize.call(this);
        var parent = this.$video.parent();
        var pw = parent.width();
        var ph = parent.height();
        this.$video.css({'width':pw+'px', 'height':ph+'px'});
    }
});

function SaleskitController() {
    this.sel = '#home #saleskit';
}
SaleskitController.prototype = $.extend(Object.create(Controller.prototype), {});

function VRController() {
    this.sel = '#home #virtual-tour';
}
VRController.prototype = $.extend(Object.create(Controller.prototype), {
    
    showcase_panorama : null,
    showcase_tour : null,
    panoramaShowcaseTime : -1,
    panoramaShowcaseTimeline : null,
    
    startShowcase360tour : function(){
        var datasrc = this.showcase_tour.attr('data-src');
        this.showcase_tour.find('iframe').attr('src', datasrc);
    },
    stopShowcase360tour : function(){
        this.showcase_tour.find('iframe').attr('src', '');
    },
    
    startShowcasePanoramaSlideShow : function(){
        this.setPanoramaShowcaseTime(0);
        new Image().src = this.showcase_panorama.attr('data-src-1');
        this.showcase_panorama.css({'background-size':(1735/1024*100)+'%'});
        this.showcase_panorama.css({'background-position': '0% 50%' });
        //this.showcase_panorama.hide();
        this.animateShowcasePanoramaSlideShow();
    },
    stopShowcasePanoramaSlideShow : function(){
        this.showcase_panorama.stop(true);
        if(this.panoramaShowcaseTimeline)
            this.panoramaShowcaseTimeline.kill();
        this.showcase_panorama.attr('src','');
        
        this.showcase_panorama.removeClass('showcase-panorama-view-animation');
    },
    
    setPanoramaShowcaseTime : function(i,a) {
        var _this = this;
        
        if(i == 'evening') i = 0;
        else if(i == 'night') i = 1;
        if(this.panoramaShowcaseTime == i)return;
        this.panoramaShowcaseTime = i; 
        
        if(i == -1){
            return;   
        }
        
        this.$sel.find('.change-time-btn-group a').removeClass('selected');
        this.$sel.find('.change-time-btn-group a[data='+['evening','night'][i]+']').addClass('selected');
        
        var datasrcs = [this.showcase_panorama.attr('data-src-0'), this.showcase_panorama.attr('data-src-1')];
        if(!a){
            if(i == 0){
                this.showcase_panorama.css({'background-image':'url('+datasrcs[0]+')'});
            }else if(i == 1){
                this.showcase_panorama.css({'background-image':'url('+datasrcs[1]+')'});
            }
        }else{
            var tl = new TimelineMax({paused:true});
            tl.append(TweenMax.to(this.showcase_panorama, 0.3, {alpha:0}));
            tl.append(TweenMax.delayedCall(0,function(){
                if(i == 0){
                    _this.showcase_panorama.css({'background-image':'url('+datasrcs[0]+')'});
                }else if(i == 1){
                    _this.showcase_panorama.css({'background-image':'url('+datasrcs[1]+')'});
                }
            }));
            tl.append(TweenMax.to(this.showcase_panorama, 0.3, {alpha:1}));
            tl.play();
        }
    },

    animateShowcasePanoramaSlideShow : function() {
        var _this = this;
        this.showcase_panorama.stop(true).fadeIn();
        this.showcase_panorama.addClass('showcase-panorama-view-animation');
        return;
    },
    
    init : function() {
        var _this = this;
        Controller.prototype.init.call(this);
        this.showcase_panorama = this.$sel.find("#showcase_panorama_view");
        this.showcase_tour = this.$sel.find("#showcase_360_view");
        this.showcase_tour.find("iframe").bind("mousewheel", function(){ return false; });
        this.$sel.find('.change-time-btn-group a').on('click', this, function(evt){
            var data = $(this).attr('data');
            evt.data.setPanoramaShowcaseTime(data,true);
        });
    },
    onWillSlideToSelf : function(){
    },
    onDidSlideToSelf : function(){
        this.startShowcasePanoramaSlideShow();
        this.startShowcase360tour();
    },
    onWillSlideFromSelf : function(){
        this.stopShowcasePanoramaSlideShow();
        this.stopShowcase360tour();
    },
    onDidSlideFromSelf : function(){
    },
    
    onShow : function() { 
        Controller.prototype.onShow.call(this); 
    },
    
    onHide : function() {
        Controller.prototype.onHide.call(this);
        this.stopShowcasePanoramaSlideShow();
        this.stopShowcase360tour();
    },
    
    onResize : function() {
        Controller.prototype.onResize.call(this);
    }
});


function ARController() {
    this.sel = '#home #augmented-reality';
}
ARController.prototype = $.extend(Object.create(Controller.prototype), {});



////END -- Child Controller inside HomeController



function AboutController() {
    this.sel = '#about';
    this.url = 'about';
    this.isRoot = true;
    this.suburls = ['what-define-us', 'what-we-do', 'how-we-work'];
    return this;   
}

AboutController.prototype = $.extend(Object.create(SliderController.prototype), {});

function PlatformController() {
    this.sel = '#platform';
    this.url = 'platform';
    this.suburls = ['entry', 'branding', 'web-development', 'integrated-communication'];
    this.subsels = ['#platform-entry', '#platform-branding', '#platform-web-development', '#platform-integrated-communication'];
    return this;   
}
PlatformController.prototype = $.extend(Object.create(SliderController.prototype), {
    videoSrc : '',
    $video : null,
    iframeSrc : '',
    $iframe : null,
    
    imageGalleryOption : {
        mode: 'horizontal',
        controls: false,
        pager: true,
        touchEnabled: false,
        infiniteLoop: true,
        startSlide: 0,
        auto:false,
        speed:750,
        pause:5500,
        autoDirection:'next'
    },
    $pav : null,
    $cg : null,
    
    
    init : function() {
        var _this = this;
        SliderController.prototype.init.call(this);
        this.$sel.find('[data-slidercontent]').click(function(){
            var i = _this.subsels.indexOf($(this).attr('data-slidercontent'));
            if(i>=0){
                _this.$slider.goToSlide(i);   
            }
        });


        this.$video = this.$sel.find('#ic-video');
        var video = this.$video.get(0);
        video.onloadedmetadata = function() {
            this.onloaodedmetadata = null;
            _this.videoSrc = this.currentSrc;
        };
        /*
        video.click(function(){
            if(video.paused)video.play(); 
            else video.pause();
        });//*/
        
        this.$iframe = this.$sel.find('iframe');
        this.iframeSrc = this.$iframe.attr('data-src');
        
        this.$pav = this.$sel.find('#pav-image-gallery').bxSlider($.extend(this.imageGalleryOption, {}));
        this.$cg = this.$sel.find('#cg-image-gallery').bxSlider($.extend(this.imageGalleryOption, {}));
    },
    
    onSlideAfter : function(oldIndex,newIndex) {
        SliderController.prototype.onSlideAfter.call(this,oldIndex,newIndex);
        var $igs = [this.$pav, this.$cg];
        if(newIndex==3){
            for(k in $igs){
                var $ig = $igs[k];    
                $ig.startAuto();
            }  
        }
    },
    onSlideBefore : function(oldIndex,newIndex) {
        SliderController.prototype.onSlideBefore.call(this,oldIndex,newIndex);
        var $igs = [this.$pav, this.$cg];
        if(oldIndex==3){
            for(k in $igs){
                var $ig = $igs[k];    
                $ig.stopAuto();
                $ig.goToSlide(0);
            }  
            try{ this.$video.get(0).pause(); }
            catch(ex) { console.log(ex); }
        }
    },
    
    onResize : function() {
        SliderController.prototype.onResize.call(this);
        var parent = this.$video.parent();
        var pw = parent.width();
        var ph = parent.height();
        this.$video.css({'width':pw+'px', 'height':ph+'px'});
        
        var $igs = [this.$pav, this.$cg];
        for(k in $igs){
            var $ig = $igs[k];    
            parent = $ig.parent().parent().parent();
            pw = parent.width();
            ph = parent.height();
            $ig.find('>div').css({width:pw+'px', height:ph+'px'});
            $ig.redrawSlider();
        }
    },
    
    onShow : function() {
        SliderController.prototype.onShow.call(this);
        if(this.videoSrc){
            //this.$video.get(0).src = this.videoSrc;
        }
        this.$iframe.attr('src', this.iframeSrc);
    },
    
    onHide : function() {
        SliderController.prototype.onHide.call(this);
        this.$iframe.attr('src', '');
        //this.$video.get(0).src = '';
        this.$video.get(0).pause();
        try{
            this.$video.get(0).currentTime = 0;
        }catch(ex){
            console.log(ex);
        }
        
        var $igs = [this.$pav, this.$cg];
        for(k in $igs){
            var $ig = $igs[k];
            $ig.stopAuto();
            $ig.goToSlide(0);
            //fix bxslider wouldnt udpate to proper state 
            //if the slider is hidden before the transition is ended
            $ig.slider.working = false;
            $ig.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
        }
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
    preloadFoliosImage : function() { 
        
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

    onPreloadedFoliosImage : function() { 
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
    
    stopFoliosAnimation : function() { 
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
    
    startFoliosAnimation : function() { 
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
    
    onShown : function(a) {         
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

app = new AppController();
$(document).ready(function(){

    bouncefix.add('sliderContent');
    bouncefix.add('mainScrollContent');
    
    app.init();
    
    var lastProcessedEvent = null;
    $.address.init(function(event) {
        var prevvalue = lastProcessedEvent ? lastProcessedEvent.value : "";
        
        var match = '';
        var matchedcontroller = null;
        $.each(app.controllers, function(name, controller) {
            if (controller.processURL(lastProcessedEvent, event)) {
                match = controller.sel;
                matchedcontroller = controller;
                lastProcessedEvent = event;
                return false;
            }
        });
        console.log('address.init@' + prevvalue + ' > '+event.value + ', match:'+match);
        if(matchedcontroller){
            $('a').each(function() {
                var alink = $(this).attr('href') || "";
                if (alink.indexOf('#') == 0) {
                    alink = '/' + alink.substring(1);
                    $(this).toggleClass('selected', matchedcontroller.testURL(alink));
                }
            });
        }
    }).bind('change', function(event) {
        var prevvalue = lastProcessedEvent ? lastProcessedEvent.value : "";
        
        if (lastProcessedEvent && lastProcessedEvent.value == event.value) return;
        
        var processed = false;
        var match = '';
        var matchedcontroller = null;
        $.each(app.controllers, function(name, controller) {
            if (controller.processURL(lastProcessedEvent, event)) {
                lastProcessedEvent = event;
                processed = true;
                match = controller.sel;
                matchedcontroller = controller;
                return false;
            }
        });
        console.log('address.change@' + prevvalue + ' > '+event.value);
        if(matchedcontroller){
            $('a').each(function() {
                var alink = $(this).attr('href') || "";
                if (alink.indexOf('#') == 0) {
                    alink = '/' + alink.substring(1);
                    $(this).toggleClass('selected', matchedcontroller.testURL(alink));
                }
            });
        }
    });
});