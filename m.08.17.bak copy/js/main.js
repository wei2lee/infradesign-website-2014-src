/*
var _gaq=[['_setAccount','UA-42485850-1'],['_trackPageview', '/our-contact']];
(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
s.parentNode.insertBefore(g,s)}(document,'script'));
//*/

var app = new AppController();
var controllers = {};
var contentSliderOption = {
    mode: 'horizontal',
    controls: false,
    pager: false,
    touchEnabled: false,
    infiniteLoop: false,
    startSlide: 0
};

var sectionContainerSlider;
var sectionContainerSliderOption;
var sectionPageSliders = [];
var sectionSlideHandles = [];
var sections;
var isRegistered = false;

var popupRegisterHtml;
var popupThankHtml;
var popupVideoHtml;
var popupThankCloseTimeout;

var delayHomeSliderStartAutoAfterPagerClick;
var homeSlider;
var homeSliderOption;
var showcase360panorama;

function AppController(){
    this.documentReadyState = 0;   
    this.keyNavEnable = true;
}
function Controller(selector, pathNames) {
    this.sel = selector;
    this.pathNames = pathNames;
    return this;
}
Controller.prototype = {
    processPathNames: function(pathNames, value) {
        var _this = this;
        var ret = false;
        ret = pathNames[0] == this.pathNames;
        if (ret) {
            $.each(controllers, function(ind, ele) {
                if (_this == ele) {
                    if (!$(ele.sel).is(':visible')) {
                        ele.show(app.documentReadyState == 1);
                    }
                } else {
                    if ($(ele.sel).is(':visible')) {
                        ele.hide();
                    }
                }
            });
        }
        return ret;
    },
    onLoad: function() {
        $(this.sel).data('controller', this);
    },
    show: function(animated) {
        this.onShow(animated);
        $(this.sel).show();
        this.onShown(animated);
        $(window).trigger('resize');
    },
    hide: function() {
        this.onHide();
        $(this.sel).hide();
        this.onHidden();
    },
    onShow: function(animated) {
        $(window).on('resize', this, this._onResize);
    },
    onShown: function() {},
    onHide: function() {},
    onHidden: function() {
        $(window).off('resize', this._onResize);
    },
    onResize: function() {},
    _onResize: function(evt) {
        evt.data.onResize();
    }
};

function SliderContentController(sel, pathNames) {
    this.sliderOption = $.extend({}, contentSliderOption);
}
SliderContentController.prototype = $.extend(Object.create(Controller.prototype), {
    hammer: null,

    processPathNames: function(pathNames, value) {
        var ret = Controller.prototype.processPathNames.call(this, pathNames, value);
        if (ret) {
            var toslide = this.subadrs.indexOf(value);
            if(app.documentReadyState == 0){
                console.log('reload');
                //this.slider.reloadSlider({startSlide:toslide});
            }else{
                //if (toslide >= 0) this.slider.goToSlide(toslide);
            }
        }
        return ret;
    },
    onSliderKeyDown: function onSliderKeyDown(evt) {
        if (!app.keyNavEnable) return;
        var keys = {
            38: "up",
            40: "down",
            37: "left",
            39: "right"
        };
        switch (keys[evt.keyCode]) {
            case "left":
                evt.data.slider.goToPrevSlide();
                return false;
                break;
            case "right":
                evt.data.slider.goToNextSlide();
                return false;
                break;
            default:
                break;
        }
    },
    onLoad: function() {
        Controller.prototype.onLoad.call(this);
        var _this = this;
        this.sliderOption.onSlideAfter = function($slideElement, oldIndex, newIndex) {
            $.address.value(_this.subadrs[newIndex]);
        };
        //this.slider = $(this.slidersel).bxSlider(this.sliderOption);
        //var $sliderContent = $(this.sel).find('.sliderContent');
        //console.log('sliderContent.count = ' + $sliderContent.length);
        //console.log('sliderContent.height = ' + $sliderContent.height());
        //console.log('scrollHeight='+$sliderContent[0].scrollHeight + ',offsetHeight=' + $sliderContent[0].offsetHeight);
        
        //this.slider.redrawSlider();
        this.hammer = new Hammer($(this.sel)[0], {});
        this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
    },
    onShow: function() {
        Controller.prototype.onShow.call(this);
    },
    onShown: function() {
        var _this = this;
        Controller.prototype.onShown.call(this);
        //this.hammer.on('swipeleft swiperight', function(evt){
        //    if(evt.type != 'swipeleft') _this.slider.goToPrevSlide();
        //    else _this.slider.goToNextSlide();
        //});
        //$(document).on('keydown', this, this.onSliderKeyDown);
    },
    onHide: function() {
        Controller.prototype.onHide.call(this);
        //this.hammer.off('swipeleft swiperight');
        //$(document).off('keydown', this.onSliderKeyDown);
    },
    onHidden: function() {
        Controller.prototype.onHidden.call(this);
        //this.slider.goToSlide(0, 'reset');
    },
    onResize: function() {
        Controller.prototype.onResize.call(this);
        //this.slider.redrawSlider();
    },
});

function AboutController(sel, pathNames) {
    this.sel = '#mainContainer #about';
    this.pathNames = 'about';
    this.slidersel = '#about .slider';
    this.subadrs = ['/about/what-define-us', '/about/what-we-do', '/about/how-we-work'];
    this.subsels = ['#what-define-us', '#what-we-do', '#how-we-work'];
    this.sliderOption = $.extend({}, contentSliderOption);
    return this;
}
AboutController.prototype = $.extend(Object.create(SliderContentController.prototype), {});

function PlatformController(sel, pathNames) {
    this.sel = '#mainContainer #platform';
    this.pathNames = 'platform';
    this.slidersel = '#platform .slider';
    this.subadrs = ['/platform/branding', '/platform/web-development', '/platform/integrated-communication'];
    this.subsels = ['#platform-branding', '#platform-web-development', '#platform-integrated-communication'];
    this.sliderOption = $.extend({}, contentSliderOption);
    return this;
}
PlatformController.prototype = $.extend(Object.create(SliderContentController.prototype), {});

function FoliosController(sel, pathNames) {
    this.sel = '#mainContainer #folios';
    this.pathNames = 'folios';
    return this;
}
FoliosController.prototype = $.extend(Object.create(Controller.prototype), {
    isinitcycle : true,
    animationinited : false,
    imgs : [],
    total : 0,
    loaded : 0,
    preloadState : 0,
    foliosanim1delay : null,
    foliosanim1 : null,
    foliosanim2delay : null,
    foliosanim2 : null,
    onLoad: function() {
        Controller.prototype.onLoad.call(this);
        var _this = this;
        /*folios*/
        preloadFoliosImage.call(this);

        function stopPreloadFoliosImage() {
            console.log('stopPreloadFoliosImage@preloadState='+this.preloadState);
            $.each(this.imgs, function(ind,img){
               img.img.onload = null; 
            });
            this.total = this.loaded = 0;
            this.imgs = [];
            
            this.preloadState = 0;
        }
        
        function preloadFoliosImage(isOnShow) {
            console.log('preloadFoliosImage(isOnShow:'+isOnShow+')@preloadState='+this.preloadState);
            this.preloadState = 1;
            
            this.total = $(".folios_page>div").length;
            this.loaded = 0;

            var imgs = []; 
            this.imgs = imgs;
            
            $(".folios_page>div").each(function(ind, ele) {
                var backgroundimage = $(ele).css('background-image');
                var reg = /url\((.+?)\)/;
                var m = reg.exec(backgroundimage);
                var img = new Image();
                var $that = $(this);
                imgs.push({
                    'ele': $that,
                    'img': img
                });
                img.onload = function() {
                    if (_this.preloadState == 2) {
                        return;
                    }
                    _this.loaded++;
                    console.log('loaded='+_this.loaded+',total='+_this.total+',isOnShow='+isOnShow);
                    if (_this.loaded == _this.total && _this.preloadState == 1) {
                        _this.preloadState = 2;
                        onPreloadedFoliosImage.call(_this,imgs,isOnShow);
                    }
                    img.onload = null;
                }
                img.src = m[1];
            });
        }

        function onPreloadedFoliosImage(imgs,isOnShow) {
            console.log('onPreloadedFoliosImage(isOnShow:'+isOnShow+')');
            $.each(imgs, function(ind, preloadobj) {
                var obj = Filters.filterImage(Filters.grayscale, preloadobj.img);

                //preloadobj.ele.css('width', parseInt(preloadobj.ele.css('width')) + 1 + 'px');
                //preloadobj.ele.css('height', parseInt(preloadobj.ele.css('height')) + 1 + 'px');
                var style = "left:0px; top:0px; width:" + preloadobj.ele.css('width') + 
                    "; height:" + preloadobj.ele.css('height') + 
                    "; background-image:url(" + obj.canvas.toDataURL("image/png") + ")";
                preloadobj.ele.empty();
                preloadobj.ele.append($("<div class='grayscale' style='" + style + "';></div>"));
                
                
            }); //*/
            if(isOnShow)
                startFoliosAnimation.call(this);
        }

        function startFoliosAnimation() {
            console.log('startFoliosAnimation@animationinited='+this.animationinited);
            var pagedelay = 2;
            var pagedelay2 = 1.5;
            var alphatweendelay = 0.1;
            var randomdelayk = 0.3;
            var tweenduration = 0.7;
            var leftdelayk = 0.0040;
            var pagewidth = 320;
            
            stopFoliosAnimation.call(this);
            
            _this.foliosanim1delay = new TimelineMax({
                paused: true
            });
            _this.foliosanim1 = new TimelineMax({
                paused: true
            });
            _this.foliosanim2delay = new TimelineMax({
                paused: true
            });
            _this.foliosanim2 = new TimelineMax({
                paused: true
            });
            
            TweenMax.to($(".folios_page"), 0, {
                perspective: 2000
            });

            _this.foliosanim1delay.insert(TweenMax.to({
                x: 0
            }, pagedelay, {
                x: 0
            }));
            _this.foliosanim1delay.append(TweenMax.delayedCall(0, function() {
                console.log("foliosanim1.restart");
                _this.foliosanim1.restart();
            }));

            _this.foliosanim1.insert(TweenMax.delayedCall(0, function() {
                console.log("foliosanim1 started");
                $("#folios_page1").show();
                $("#folios_page1").css("pointer-events", "visible");
                $("#folios_page2").css("pointer-events", "none");
                if (_this.isinitcycle) {
                    TweenMax.set($("#folios_page2>div"), {
                        alpha: 0
                    });
                    TweenMax.set($("#folios_page1>div"), {
                        alpha: 0
                    });
                }
                $("#folios_page2>div").unbind('mouseover mouseout');
                $("#folios_page2").unbind('mouseover mouseout');
            }));
            $("#folios_page2>div").each(function(ind, ele) {
                var left = parseInt($(ele).css('left'));
                var randomdelay = Math.random() * randomdelayk;
                _this.foliosanim1.insert(TweenMax.fromTo($(ele), tweenduration, {
                    alpha: 1
                }, {
                    alpha: 0
                }), (pagewidth - left) * leftdelayk + randomdelay + alphatweendelay);
                _this.foliosanim1.insert(TweenMax.fromTo($(ele), tweenduration, {
                    rotationY: 0
                }, {
                    rotationY: -180,
                    transformOrigin: "center center"
                }), (pagewidth - left) * leftdelayk + randomdelay);
            });

            $("#folios_page1>div").each(function(ind, ele) {
                var left = parseInt($(ele).css('left'));
                var randomdelay = Math.random() * randomdelayk;
                _this.foliosanim1.insert(TweenMax.fromTo($(ele), tweenduration, {
                    alpha: 0
                }, {
                    alpha: 1,
                    ease: Quad.easeIn
                }), pagedelay2 + 0.5 + left * leftdelayk + randomdelay + alphatweendelay);
                _this.foliosanim1.insert(TweenMax.fromTo($(ele), tweenduration, {
                    rotationY: -200
                }, {
                    rotationY: 0,
                    transformOrigin: "center center"
                }), pagedelay2 + 0.5 + left * leftdelayk + randomdelay);
            });
            _this.foliosanim1.append(TweenMax.delayedCall(0, function() {
                console.log("foliosanim2delay restart");
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

            _this.foliosanim2delay.insert(TweenMax.to({
                x: 0
            }, pagedelay, {
                x: 0
            }));
            _this.foliosanim2delay.append(TweenMax.delayedCall(0, function() {
                console.log("foliosanim2 restart");
                _this.foliosanim2.restart();
            }));

            _this.foliosanim2.insert(TweenMax.delayedCall(0, function() {
                console.log("foliosanim2 started");
                $("#folios_page2").show();
                $("#folios_page1").css("pointer-events", "none");
                $("#folios_page2").css("pointer-events", "visible");
                $("#folios_page1>div").unbind('mouseover mouseout');
                $("#folios_page1").unbind('mouseover mouseout');
            }));
            $("#folios_page1>div").each(function(ind, ele) {
                var left = parseInt($(ele).css('left'));
                var randomdelay = Math.random() * randomdelayk;
                _this.foliosanim2.insert(TweenMax.fromTo($(ele), tweenduration, {
                    alpha: 1
                }, {
                    alpha: 0
                }), left * leftdelayk + randomdelay + alphatweendelay);
                _this.foliosanim2.insert(TweenMax.fromTo($(ele), tweenduration, {
                    rotationY: 0
                }, {
                    rotationY: 180,
                    transformOrigin: "center center"
                }), left * leftdelayk + randomdelay);
            });

            $("#folios_page2>div").each(function(ind, ele) {
                var left = parseInt($(ele).css('left'));
                var randomdelay = Math.random() * randomdelayk;
                _this.foliosanim2.insert(TweenMax.fromTo($(ele), tweenduration, {
                    alpha: 0
                }, {
                    alpha: 1,
                    ease: Quad.easeIn
                }), pagedelay2 + (pagewidth - left) * leftdelayk + randomdelay + alphatweendelay);
                _this.foliosanim2.insert(TweenMax.fromTo($(ele), tweenduration, {
                    rotationY: 200
                }, {
                    rotationY: 0,
                    transformOrigin: "center center"
                }), pagedelay2 + (pagewidth - left) * leftdelayk + randomdelay);
            });

            _this.foliosanim2.append(TweenMax.delayedCall(0, function() {
                //console.log("foliosanim1delay restart");
                _this.isinitcycle = false;
                _this.foliosanim1delay.restart();
                $("#folios_page2>div").hover(function() {
                    _this.foliosanim1delay.pause();
                });
                $("#folios_page2").hover(
                    function() {
                        //console.log("folios_page2 hover");
                        _this.foliosanim1delay.pause();
                    },
                    function() {
                        //console.log("folios_page2 hover");
                        _this.foliosanim1delay.resume();
                    }
                );
            }));

            _this.foliosanim1.restart();
        }

        function stopFoliosAnimation() {
            console.log('stopFoliosAnimation');
            if(this.foliosanim1delay){
                this.foliosanim1delay.kill();
                this.foliosanim1.kill();
                this.foliosanim2delay.kill();
                this.foliosanim2.kill();
            }
        }
        FoliosController.prototype.onShow = function() {
            Controller.prototype.onShow.call(this);
            this.isinitcycle = true;
            $("#folios_page1, #folios_page2").css("pointer-events", "none");
            $("#folios_page1>div, #folios_page2>div").each(function(ind, ele) {
                TweenMax.to($(ele), 0, { alpha: 1 });
            });
            console.log('onShow@preloadState='+this.preloadState);
            if(this.preloadState == 0){
                preloadFoliosImage.call(this, true);    
            }else if(this.preloadState == 1){
                stopPreloadFoliosImage.call(this);  
                preloadFoliosImage.call(this, true);
            }else if(this.preloadState == 2){
                startFoliosAnimation.call(this);   
            }
        };
        FoliosController.prototype.onHide = function() {
            stopFoliosAnimation.call(this);
            this.isinitcycle = true;
            $("#folios_page1, #folios_page2").css("pointer-events", "none");
            $("#folios_page1>div, #folios_page2>div").each(function(ind, ele) {
                TweenMax.to($(ele), 0, { alpha: 1 });
            });
        };
    }
});

function CrewController(sel, pathNames) {
    this.sel = '#mainContainer #crew';
    this.pathNames = 'crew';
    return this;
};
CrewController.prototype = $.extend(Object.create(Controller.prototype), {
    onLoad: function() {
        Controller.prototype.onLoad.call(this);
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
    }
});

function ContactController(sel, pathNames) {
    this.sel = '#mainContainer #contact';
    this.pathNames = 'contact';
    return this;
}
ContactController.prototype = $.extend(Object.create(Controller.prototype), {
    onLoad: function() {
        Controller.prototype.onLoad.call(this);
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
    },
    onShow: function() {
        Controller.prototype.onShow.call(this);
    }

});


$(document).ready(function() {
    test(); return;

    //bouncefix.add('mainContent');
    //bouncefix.add('sliderContent');
    
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
    
    
    controllers.about = new AboutController();
    controllers.platform = new PlatformController();

    function initHome() { console.log('initHome return'); return;
        /* header */


        /* sections */
        sections = $("#goSlider .section");
        $("#goContainer").fadeIn();
        section_content_containers = {};
        sections.each(function(ind, ele) {
            var key = $(ele).attr('data-slideindex');
            var val = $(ele).find('.section_content_container');
            section_content_containers[key] = val;
        });
        sectionSlideHandles = {
            0: onSectionHomeSlide,
            5: onSection360Slide
        };
        sectionLogonHandles = {
            5: onSection360Logon
        }
        var sectionKeyNavEnable = true;

        sectionContainerSliderOption = {
            mode: 'horizontal',
            controls: true,
            pager: false,
            touchEnabled: false,
            startSlide: 0,
            onSlideBefore: function($slideElement, oldIndex, newIndex) {
                var f = sectionSlideHandles[newIndex];
                if (f) {
                    f("willSlideTo");
                }
                commonSlideHandle("willSlideTo", $slideElement, oldIndex, newIndex);
                f = sectionSlideHandles[oldIndex];
                if (f) {
                    f("willSlideFrom");
                }
                commonSlideHandle("willSlideFrom", $slideElement, oldIndex, newIndex);
            },
            onSlideAfter: function($slideElement, oldIndex, newIndex) {
                var f = sectionSlideHandles[newIndex];
                if (f) {
                    f("didSlideTo");
                }
                commonSlideHandle("didSlideTo", $slideElement, oldIndex, newIndex);
                f = sectionSlideHandles[oldIndex];
                if (f) {
                    f("didSlideFrom");
                }
                commonSlideHandle("didSlideFrom", $slideElement, oldIndex, newIndex);
            }
        };

        function commonSlideHandle(type, $slideElement, oldIndex, newIndex) {
            switch (type) {
                case "willSlideTo":
                    if (newIndex != 0) {
                        section_content_containers[newIndex].css("overflow", "auto");
                        section_content_containers[newIndex].scrollTop(0);
                        $("#fb-btn, #tw-btn").removeClass("bright");
                    }
                    break;
                case "didSlideTo":

                    break;
                case "willSlideFrom":
                    section_content_containers[oldIndex].css("overflow", "hidden");
                    break;
                case "didSlideFrom":
                    section_content_containers[oldIndex].scrollTop(0);
                    break;
            }
        }

        sectionContainerSlider = $("#goContainer>.sliderContainer>ul.slider").bxSlider(sectionContainerSliderOption);
        sectionContainerSlider.parent().parent().find(".bx-controls-direction").hide();

        $(document).keydown(function(evt) {
            if (!sectionKeyNavEnable) return;
            var keys = {
                38: "up",
                40: "down",
                37: "left",
                39: "right"
            };
            switch (keys[evt.keyCode]) {
                case "left":
                    sectionContainerSlider.goToPrevSlide();
                    return false;
                    break;
                case "right":
                    sectionContainerSlider.goToNextSlide();
                    return false;
                    break;
                default:
                    break;
            }
        });

        $('a.section_down_btn').click(function() {
            openRegisterPopup();
        });


        /* Section Home */
        function onSectionHomeSlide(type) {
            var sectionControl = sectionContainerSlider.parent().parent().find(".bx-controls-direction");
            switch (type) {
                case "willSlideTo":
                    homeSlider.goToSlide(0, 'reset');
                    sectionControl.fadeOut();
                    break;
                case "didSlideTo":
                    homeSlider.startAuto();
                    break;
                case "willSlideFrom":
                    if (delayHomeSliderStartAutoAfterPagerClick) clearTimeout(delayHomeSliderStartAutoAfterPagerClick);
                    homeSlider.stopAuto();
                    sectionControl.fadeIn();
                    break;
                case "didSlideFrom":
                    homeSlider.goToSlide(0, 'reset');
                    $('#section_home #home_slide02 p').hide();
                    break;
            }
        }
        homeSliderOption = {
            mode: 'horizontal',
            controls: false,
            pager: true,
            touchEnabled: false,
            startSlide: 0,
            auto: false,
            speed: 750,
            pause: 5500,
            onSlideBefore: function($slideElement, oldIndex, newIndex) {
                if (newIndex == 0) {} else {
                    $('#section_home #home_slide02 p').show();
                }
                if (newIndex == 0) {
                    $("#fb-btn, #tw-btn").removeClass("bright");
                } else {
                    $("#fb-btn, #tw-btn").addClass("bright");
                }
            },
            onSlideAfter: function($slideElement, oldIndex, newIndex) {

            }
        };
        homeSlider = $("#goBannerSlider").bxSlider(homeSliderOption);

        function startHomeSliderAuto() {
            if (homeSliderOption.auto) {
                homeSlider.startAuto();
            }
        }

        function stopHomeSliderAuto() {
            homeSlider.stopAuto();
        }
        homeSlider.parent().parent().find("a[data-sectionid]").click(function() {
            var to_sectionid = $(this).attr("data-sectionid");
            $(".section").each(function(ind, ele) {
                var sectionid = ele.id;
                if (sectionid == to_sectionid) {
                    sectionContainerSlider.goToSlide($(this).attr("data-slideindex"));
                    return false;
                }
            })
        }).hover(
            stopHomeSliderAuto,
            startHomeSliderAuto
        );

        if (homeSliderOption.auto) {
            homeSlider.parent().parent().find(".bx-pager").click(function() {
                if (delayHomeSliderStartAutoAfterPagerClick) clearTimeout(delayHomeSliderStartAutoAfterPagerClick);
                delayHomeSliderStartAutoAfterPagerClick = setTimeout(function() {
                    startHomeSliderAuto();
                    delayHomeSliderStartAutoAfterPagerClick = 0;
                }, homeSliderOption.pause);
            });
        }

        $("a.video_play_btn").click(function() {
            var videosrcs = [];
            for (i = 1; i <= 3; i++) {
                var attr = $(this).attr('datasrc' + i);
                if (typeof attr !== typeof undefined && attr !== false) {
                    videosrcs.push({
                        src: $(this).attr('datasrc' + i),
                        type: $(this).attr('datatype' + i)
                    });
                }
            }
            if (videosrcs.length > 0) {
                openVideoPopup(videosrcs);
            }
        });

        /* Section Prosales */
        $("a.demoversion").click(function() {
            if (!isRegistered) {
                openRegisterPopup();
            }
        });
        /* Section 360 */
        showcase_panorama = $("#section_360 .section_content_extra #showcase_panorama_view");
        showcase_tour = $("#section_360 .section_content_extra #showcase_360_view");
        showcase_tour.find("iframe").bind("mousewheel", function() {
            return false;
        });

        function onSection360Slide(type) {
            switch (type) {
                case "willSlideTo":
                    break;
                case "didSlideTo":
                    if (isRegistered) {
                        startShowcasePanoramaSlideShow();
                        startShowcase360tour();
                    }
                    break;
                case "willSlideFrom":
                    stopShowcasePanoramaSlideShow();
                    break;
                case "didSlideFrom":
                    stopShowcase360tour();
                    break;
            }
        }

        function onSection360Logon() {
            startShowcasePanoramaSlideShow();
            startShowcase360tour();
        }

        function startShowcase360tour() {
            var datasrc = showcase_tour.attr('data-src');
            showcase_tour.find('iframe').attr('src', datasrc);
        }

        function stopShowcase360tour() {
            showcase_tour.find('iframe').attr('src', '');
        }

        function startShowcasePanoramaSlideShow() {
            var datasrc = showcase_panorama.attr('data-src');
            showcase_panorama.css({
                'background-position-x': '0%',
                'background-position-y': '0%'
            });
            showcase_panorama.css({
                'background-image': 'url(' + datasrc + ')'
            });
            showcase_panorama.hide();
            animateShowcasePanoramaSlideShow();
        }

        function animateShowcasePanoramaSlideShow() {
            showcase_panorama.stop(true).fadeIn();
            return;
        }

        function stopShowcasePanoramaSlideShow() {
            showcase_panorama.stop(true);
        }

        /* popup */
        var popupRegisterContainer = $("#popup_register_container");
        popupRegisterHtml = $("#popup_content_register").wrap('<div>').parent().html();
        popupThankHtml = $("#popup_content_thank").wrap('<div>').parent().html();
        popupVideoHtml = $("#popup_content_video").wrap('<div>').parent().html();
        popupRegisterContainer.remove();
        var submitted = false;

        function openRegisterPopup() {
            sectionKeyNavEnable = false;
            submitted = false;
            $.fancybox.open({
                content: popupRegisterHtml,
                afterClose: onRegisterPopupClosed
            });
            $("#popup_content_register .error p").html("&nbsp;");
            $("#popup_content_register input[type=submit]").click(onPopupRegisterSubmit);
            $("#popup_content_register input[type=reset]").click(onPopupRegisterReset);
            $("#register_name").focus();
        }

        function onRegisterPopupClosed() {
            sectionKeyNavEnable = true;
        }

        function onPopupRegisterReset() {
            $("#popup_content_register .error p").html("&nbsp;");
            $("#register_name").focus();
        }

        function onPopupRegisterSubmit() {
            $("#popup_content_register .error p").html("&nbsp;");
            var reason = "";
            var user = {};
            user.name = $("#register_name").val().trim();
            user.email = $("#register_email").val().trim();
            user.contact = $("#register_contact").val().trim();
            user.company = $("#register_company").val().trim();
            user.businesstype = $("#register_businesstype").val().trim();
            user.interest = {};
            user.interest.prosalesdemoversion = $("#register_prosalesdemoversion").is(':checked');
            user.interest.ar = $("#register_ar").is(':checked');
            user.interest.crm = $("#register_crm").is(':checked');
            user.interest.virtualtour = $("#register_virtualtour").is(':checked');
            user.interest.mobileapplication = $("#register_mobileapplication").is(':checked');

            try {
                if (user.name == "") {
                    $("#register_name").focus();
                    reason = "Error : Please enter your name.";
                    throw reason;
                }
                if (user.email == "") {
                    $("#register_name").focus();
                    reason = "Error : Please enter your email.";
                    throw reason;
                }
                if (!isEmailAddress(user.email)) {
                    $("#register_email").focus();
                    reason = "Error : Please enter correct format email.";
                    throw reason;
                }
                if (user.contact == "") {
                    $("#register_contact").focus();
                    reason = "Error : Please enter your contact.";
                    throw reason;
                }
                if (!isPhoneNumber(user.contact)) {
                    $("#register_contact").focus();
                    reason = "Error : Please enter correct format contact.";
                    throw reason;
                }
                if (user.company == "") {
                    $("#register_company").focus();
                    reason = "Error : Please enter your company.";
                    throw reason;
                }

                var anyInterest = false;
                for (var key in user.interest) {
                    if (user.interest[key] == true) {
                        anyInterest = true;
                        break;
                    }
                }
                if (!anyInterest) {
                    reason = "Please tick at least one interest.";
                    throw reason;
                }
            } catch (err) {
                $("#popup_content_register .error p").delay(200).html(reason).show();
                return;
            }
            submitted = true;
            $.fancybox.close();
            openThankPopup();
        }

        function openThankPopup() {
            $.fancybox.open({
                content: popupThankHtml,
                afterClose: onThankPopupClosed
            });
            popupThankCloseTimeout = setTimeout(function() {
                $.fancybox.close();
            }, 5000);
        }

        function onThankPopupClosed() {
            sectionKeyNavEnable = true;
            if (popupThankCloseTimeout) {
                clearTimeout(popupThankCloseTimeout);
                popupThankCloseTimeout = 0;
            }
            if (submitted) {
                setRegistered(true);
            }
        }

        function openVideoPopup(videosrcs) {
            stopHomeSliderAuto();
            $.fancybox.open({
                content: popupVideoHtml,
                beforeClose: onVideoPopupBeforeClose,
                afterClose: onVideoPopupAfterClose
            });
            $("#popup_content_video video").attr('autoplay', 'autoplay');
            for (var key in videosrcs) {
                $("#popup_content_video video").append($('<source></source>').attr('src', videosrcs[key].src).attr('type', videosrcs[key].type));
            }
        }

        function onVideoPopupBeforeClose() {

        }

        function onVideoPopupAfterClose() {
            startHomeSliderAuto();
            sectionKeyNavEnable = true;
        }

        //openRegisterPopup();

        /* resize */
        $(window).resize(function() {
            var ww = Math.max($(window).width(), 0);
            var wh = Math.max($(window).height(), 0);
            var hh = $("#header").height();
            var ch = wh - hh;
            $('#goContainer .sliderContent').css({
                width: ww,
                height: wh
            });
            $('#goContainer .section_content_container').css({
                width: ww,
                height: wh - hh
            });
            $('#goContainer #section_home .section_content_container').css({
                width: ww,
                height: wh
            });
            $('#goContainer .home_slide').css({
                width: ww,
                height: wh
            });
            $('#goContainer #home_slide01').css({
                width: ww,
                height: wh - hh
            });
            sectionContainerSlider.redrawSlider();
            homeSlider.redrawSlider();
        });

        /* login */
        function setRegistered(_isRegistered) {
            if (isRegistered == _isRegistered) return;
            isRegistered = _isRegistered;
            if (isRegistered) {
                $("#goContainer").addClass("islogon");
                $(".section_content_extra>*").hide().fadeIn();
                var f = sectionLogonHandles[sectionContainerSlider.getCurrentSlide()];
                if (f) {
                    f();
                }
            } else {
                $("#goContainer").removeClass("islogon");
            }
        }

        /* post initialization */
        if ($.cookie) {
            setRegistered($.cookie("signed") == "yes");
        } else {
            setRegistered(false);
        }
        $(window).trigger('resize');
        sectionContainerSlider.redrawSlider();
        setTimeout(function() {
            $(window).trigger('resize');
        }, 100);
    }

    /*home*/
    initHome();



    $.each(controllers, function(ind, controller) {
        controller.onLoad();
    });

    /* resize */
    
    function onResize() {
        var ww = Math.max($(window).width(), 0);
        var wh = Math.max($(window).height(), 0);
        var hh = parseInt($('#header').height());
        $('#goContainer').css({
            width: ww + 'px',
            height: wh + 'px'
        });
        /*
        $('#home.mainContent').css({
            width: ww + 'px',
            height: wh + 'px',
            top: 0 + 'px'
        });
        $(':not(#home).mainContent').css({
            width: ww + 'px',
            height: (wh - hh) + 'px',
            top: hh + 'px'
        });//*/

        $('.mainContent>.sliderContainer>.bx-wrapper>.bx-viewport>ul>li>.sliderContent, .mainContent>.sliderContainer>.bx-wrapper>.bx-viewport>ul>li').css({
        //$('.mainContent>.sliderContainer>.bx-wrapper>.bx-viewport>ul>li>.sliderContent').css({
            width: ww + 'px',
            height: (wh - hh) + 'px'
        });

        $('[data-scale-fit-width]').each(function(ind, ele) {
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
    $(window).resize(onResize);
    //*/


    var lastProcessedEvent = null;
    $.address.init(function(event) {
        var prevvalue = lastProcessedEvent ? lastProcessedEvent.value : "";
        console.log('address.init@' + prevvalue + ' > '+event.value);
        /*
        log('init: ' + serialize({
            value: $.address.value(), 
            path: $.address.path(),
            pathNames: $.address.pathNames(),
            parameterNames: $.address.parameterNames(),
            queryString: $.address.queryString()
        }));//*/

        $('a').each(function() {
            var alink = $(this).attr('href') || "";
            if (alink.indexOf('#') == 0) {
                alink = '/' + alink.substring(1);
                $(this).toggleClass('selected', alink == event.value);
            }
        });
        $.each(controllers, function(name, controller) {
            if (controller.processPathNames(event.pathNames, event.value)) {
                lastProcessedEvent = event;
                return false;
            }
        });

    }).bind('change', function(event) {
        var prevvalue = lastProcessedEvent ? lastProcessedEvent.value : "";
        console.log('address.change@' + prevvalue + ' > '+event.value);
        /*
        var names = $.map(event.pathNames, function(n) {
            return n.substr(0, 1).toUpperCase() + n.substr(1);
        }).concat(event.parameters.id ? event.parameters.id.split('.') : []);
        var links = names.slice();
        var match = links.length ? links.shift() + ' ' + links.join('.') : 'Home';
        log('change: ' + serialize(event, /parameters|parametersNames|path|pathNames|queryString|value/));
        //$.address.title(names.length == 1 ? names[0] : names.join(' - '));
        //*/
        if (lastProcessedEvent && lastProcessedEvent.value == event.value) return;

        $('a').each(function() {
            var alink = $(this).attr('href') || "";
            if (alink.indexOf('#') == 0) {
                alink = '/' + alink.substring(1);
                $(this).toggleClass('selected', alink == event.value);
            }
        });
        //console.log((lastProcessedEvent?lastProcessedEvent.value:'') + '>' + event.value);
        var processed = false;
        $.each(controllers, function(name, controller) {
            if (controller.processPathNames(event.pathNames, event.value)) {
                lastProcessedEvent = event;
                processed = true;
                return false;
            }
        });
        //if(!processed){
        //    $.address.value(lastProcessedEvent.value);
        //}
    });

    /* post init */
    
    
    $(window).trigger('resize');
    $('#mainContainer').fadeIn();

    
    app.documentReadyState = 1;
    
    console.log('document.ready end');
});