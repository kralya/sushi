(function(){
    function Studio8(){
        this.widgets = {};
        this.initDocumentReady = [];
    };
    Studio8.prototype.Widget = function(name, callback){
        if(!this.hasWidget(name) && typeof callback == 'object')
            this.widgets[name] = callback;
        else if( this.hasWidget(name) )
        	return this.widgets[name];

        if( this.widgets[name].documentReady === true && document.readyState != 'complete' ){
        	this.initDocumentReady.push(name);
        } else {
            this.loadWidget(name);
        }
    };
    Studio8.prototype.hasWidget = function(name){
        if( this.widgets[name] !== undefined )
            return true;
        
        return false;
    };
    Studio8.prototype.initReady = function(){
    	for (var i = 0; i < this.initDocumentReady.length; i++) {
    		this.loadWidget(this.initDocumentReady[i]);
    	}
    };
    Studio8.prototype.loadWidget = function(name){
    	if( this.widgets[name]['init'] && typeof this.widgets[name]['init'] == 'function' ){
            this.widgets[name]['init']();
        }
    }

    if( window.Studio8 === undefined )
        window.Studio8 = new Studio8();
})();

Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}

$(document).ready(function(){
    Studio8.initReady();
});

Studio8.Widget('main', {
    documentReady: true,
    init: function(){
        this.initEvents();
        this.stickyRelocate();
        // this.initToolTip(".price","bd-tooltip");
        this.hoverSubMenu();
        
        $('#delivery_time').attr('time-delivery', $('#delivery_time').val());

        // maybe disable this
        this.chosenSelect();
    },
    initEvents: function(){
        var self = this;
        $(window).scroll(self.stickyRelocate);
        $(document).on('click', self.closePopUpAndOverlay);
        $('.geo_location .change_icon, .geo_location .current_city').click(self.citySelector);
    },
    // Animate city selector
    citySelector: function(){
        var $this = $('.geo_location .change_icon');
        var $changeCity = $this.prev();
        if( $this.hasClass('open') ){
            $changeCity.animate({"width":"0px"}, 300);
            $this.text(">");
        } else {
        	var width = "150px";
        	if( $(window).width() < 750 )
        		width = "215px";
            $changeCity.animate({"width":width}, 300);
            $this.text("<");
        }
        $this.toggleClass("open");
    },
    // Gift menu + and mobile adaptive menu
    stickyRelocate: function() {
        var window_top = $(window).scrollTop();
        var div_top = $('.togmenu').offset().top;
        if (window_top > div_top) {
            $('.poplavok').addClass('stick');
        } else {
            $('.poplavok').removeClass('stick');
        }
    },
    // close all popups window if click outside area
    closePopUpAndOverlay: function(e){
        if ($(e.target).closest(".tovar_zoom").length === 0 && $(e.target).closest(".pic").length === 0 && $('.tovar_zoom.animate').is(':visible')) {
            var zoom = $('.tovar_zoom.animate');
            $(zoom).find('.recomend').hide();
            $(zoom).removeClass('animate');
            if($(zoom).hasClass('last_zoom')){
                $(zoom).css('left','0');
            }
        }
        
        if($(e.target).closest("#paid").length === 0 && $('#paid').is(':visible')){
            $('#paid').hide();
        }
        if($(e.target).closest("#error").length === 0 && $('#error').is(':visible')){
            $('#error').hide();
        }
        if($(e.target).closest("#cart").length === 0 && $('#cart').is(':visible') && $(e.target).closest('.window_popup').length===0 ){
            $("#popup-overlay").hide('fast');
            $('#overlay').fadeOut();
            $('#cart').addClass('animate_out');
        }
        
        if($(e.target).closest("#thank").length === 0 && $('#thank').is(':visible')){
            $('#thank').addClass('animate_out');
        }

        if( $(e.target).closest("#oform").length === 0 && $('#oform').is(':visible') && $('.autocomplete-suggestions').length === 0 ){
            $('#oform').addClass('animate_out');
            setDevliveryPrice(0,0);
            setTimeout(function(){
                $('#overlay').fadeOut();
                $('#oform').removeClass('animate_out').hide();
            }, 1000);
        }

        if($(e.target).closest('.phone').length === 0 && $(e.target).closest(".call_back_popup").length === 0 && $('.call_back_popup').is(':visible')){
            $('.call_back_popup').addClass('animate_out');
        }
    },
    // tooltip for price in value before denomination
    initToolTip: function(target_items, name){
        $(target_items).each(function(i){
            $("body").append("<div class='"+name+"' id='"+name+i+"'><p>Цена в старой валюте: <span class='denom-price'>"+$(this).text()+"</span></p></div>");
            var my_tooltip = $("#"+name+i);

            $(this).mouseover(function(){
                var price = parseFloat($(this).children().text());
                var new_val = price*10000;
                    new_val = number_format(new_val, 0, '.', ' ');
                my_tooltip.css({opacity:0.8, display:"none"}).stop().fadeIn(400).find('.denom-price').text(new_val+" бел. руб.");
            }).mousemove(function(kmouse){
                my_tooltip.css({left:kmouse.pageX+15, top:kmouse.pageY-35});
            }).mouseout(function(){
                my_tooltip.stop().fadeOut(100);
            });
        });
    },
    // I don't know was its made this code(((
    chosenSelect: function(){
        if ($('.chosen-select').length || ('.chosen-select-no-single').length) {
            var config = {
              '.chosen-select'           : {},
              '.chosen-select-deselect'  : {allow_single_deselect:true},
              '.chosen-select-no-single' : {disable_search_threshold:10},
              '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
              '.chosen-select-width'     : {width:"95%"}
            }
            
            for (var selector in config) {
              $(selector).chosen(config[selector]);
            }
        }
    },

    // всплывающее меню
    hoverSubMenu: function(){
        $(".sec_menu li").hover(
        function () {
            if ($(this).find(".sec_menu").length) {
                clearTimeout($.data(this, 'timer'));
                $('ul', this).stop(true, true).slideDown(200);
            }
        },
        function () {
            $.data(this, 'timer', setTimeout($.proxy(function () {
                if ($(this).find(".sec_menu").length) {
                    $('ul', this).stop(true, true).slideUp(200);
                }
            }, this), 100));
        });
    }
});

Studio8.Widget('mobileAdaptiv', {
    documentReady: true,
    init:function(){
        if( 
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && 
            !this.getCookie('mobile.app.info')
        ) {
                var w_height = $(window).height();
                $('.window_popup.mobile_app').css('top', parseInt(w_height/2));
                this.setCookie('mobile.app.info', true);
                $('.window_popup.mobile_app').show();
            }
    },
    setCookie: function(name, value, options) {
        options = options || {};

        var expires = options.expires;

        if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + "=" + value;

        for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
    },
    getCookie: function(name) {
        var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
});

Studio8.Widget('modalWindows', {
    documentReady: true,
    init: function(){
        this.events();
    },
    events: function(){
        var self = this;
        // заказать звонок
        $('#headphone').click(function(e){
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            $('.call_back_popup').css('top', ((scrollTop)) +89 + 'px');
            $('.cb_start').show();
            $('.cb_start').removeClass('animate_out').addClass('animate_in');
            e.preventDefault();
        });

        // заказать звонок - закрыть
        $('.call_back_popup .close').click(function(e){
            $('.call_back_popup').addClass('animate_out');
            e.preventDefault();
        }); 

        // универсальное модальное окно - закрыть
        $('.window_popup .close').click(function(e){
            $('.window_popup').addClass('animate_out');
            e.preventDefault();
        });

        // Спасибо - закрыть
        $('#thank .close').click(function(e){
            $('#thank').hide();
            e.preventDefault();
        });

        // Оплата - закрыть
        $('#paid .close').click(function(e){
            $('#paid').hide();
            e.preventDefault();
        });

        // ошибка оплаты - закрыть
        $('#error .close').click(function(e){
            $('#error').hide();
            e.preventDefault();
        }); 
            
        // подарки - открыть
        $('.podarki_close .open').click(function(e){
            $('.podarki_close .open').hide();
            $('.podarki_close .shkala').hide();
            $('.podarki_open').removeClass('animate_out').addClass('animate_in').show();
            $('.podarki_open').find('.shkala').show();
            $('.podarki_close').addClass('animate_out');
            e.preventDefault();
        });

        // подарки - закрыть
        $('.podarki_open .close').click(function(e){
            
            $('.podarki_close .shkala').show();
            $('.podarki_close').removeClass('animate_out').addClass('animate_in').show();
            $('.podarki_open').find('.shkala').hide();
            $('.podarki_open').removeClass('animate_in').addClass('animate_out');
            
            $('.podarki_close .open').addClass('animate');
            setTimeout(function(){
            $('.podarki_close .open').show();   
            },100);
            
            e.preventDefault();
        }); 

        // корзина - закрыть
        $('#cart .close').click(function(e){
            $('#cart').addClass('animate_out');
            $('#overlay').fadeOut();
            e.preventDefault();
        });
        
        // оформление заказа - закрыть
        $('#oform .close').click(function(e){
            $('#oform').addClass('animate_out');
            setDevliveryPrice(0,0);
            setTimeout(function(){
                $('#oform').removeClass('animate_out').hide();  
            }, 800);
            e.preventDefault();
        });             
        
        // мобильное меню - закрыть
        $('#mobmenu').click(function(e){
            $('.togmenu').slideToggle();
            e.preventDefault();
        }); 

        // (хз) мобильное меню - закрыть
        $('.togmenu .close').click(function(e){
            $('.togmenu').slideToggle();
            e.preventDefault();
        });

        // дописывалось потом, некоторое модальное окно - закрытие
        $('#modalClose, #overlay').click( function(){
            if(!$("#oform").is(':visible') && !$("#thank").is(':visible'))
                self.closeModalBox('#modalBox');
        });

        // доп обработчик, потом нужно перенести в необходимые методы
        $("#oform .close, #cart .close, #thank .close").click(function(){
            self.closeModalBox('#modalBox');
        });
    },
    closeModalBox: function(selector){
        $(selector).animate(
            {opacity: 0, top: '45%'}, 
            200,
            function(){
                $(this).css('display', 'none');
                $('#overlay').fadeOut(400);
            }
        );
    }
});

Studio8.Widget('productCard', {
    documentReady: true,
    init: function(){
        // I don't know why use setTimeout (((
        setTimeout(Studio8.Widget('productCard').registerProductListeners, 1000);
    },
    // Crazy code!
    registerProductListeners: function(){
        $('.txt_col_tov').attr('readonly','readonly');
        $('.tovar .pic').off().on('click',function(event){

            var prev_zoom = $('.tovar_zoom.animate');
            $(prev_zoom).find('.recomend').hide();
            $(prev_zoom).removeClass('animate');
            if($(prev_zoom).hasClass('last_zoom')){
                $(prev_zoom).css('left','0');
            }


            var zoom = $(this).parent().find('.tovar_zoom');
            
            $(zoom).addClass('animate');

            setTimeout(function(){
                $(zoom).find('.recomend').show();
                $(zoom).find('.zoom').show();
            }, 200);

            

            if($(zoom).hasClass('last_zoom')){
                if(window.innerWidth <=750){
                    $(zoom).css('left','-267px');
                }else{
                    $(zoom).css('left','-247px');
                }
            }
        });
        $('.tovar_zoom .pic').off().on('click',function(event){
            
            var zoom = $(this).parent();
            $(zoom).find('.recomend').hide();
            $(zoom).find('.zoom').hide();
            $(zoom).removeClass('animate');
            if($(zoom).hasClass('last_zoom')){
                $(zoom).css('left','0');
            }
            
        });
        
        var perRow = Studio8.Widget('productCard').calculateRow();
        
        $('.tovar_zoom').each(function(i,elem){
            $(elem).removeClass('last_zoom');
            if((i+1)%perRow==0){
                $(elem).addClass('last_zoom');
            }
        });
        
        setTimeout(function(){
            $('.tovar').removeClass('animate');
        }, 1000);
            
        $(window).resize(function(){
            var perRow = Studio8.Widget('productCard').calculateRow();    
            $('.tovar_zoom').each(function(i,elem){
                $(elem).removeClass('last_zoom');
                if((i+1)%perRow==0){
                    $(elem).addClass('last_zoom');
                }
            });
        });
        
        var tovar_class="tovar";
        if($('.detail_tovar').length>0){
            tovar_class = 'detail_tovar';
        }
        $('.addtocart').off().on('click',function(){
            var product = $(this).closest('.'+tovar_class);

            //для лапши сначала нужно выбрать тип
            var category_id = parseInt($(product).data('category-id'));
            if($.inArray(category_id, [11,26,27,28,29]) !== -1) {
                $('#modalBox').data("tovar-id", product.attr("id"));
                $('#overlay').fadeIn(400,
                    function(){
                        $('#modalBox')
                            .css('display', 'block')
                            .animate({opacity: 1, top: $(this).offset().top}, 200);


                    });
                return;
            }

            addToBasket(product);
        });
        //выбор лапши
        $(".modalSelect").off().on('click',function(){
            var product =  $("#" + $('#modalBox').data("tovar-id"));
            $(product).data("category-id",$(this).data("category-id"));
            $(product).data("category-name",$(this).data("category-name"));
            addToBasket(product);
            closeModalBox('#modalBox');
            $(product).data("category-id","11");
            $(product).data("category-name","Лапша");

        });
        $('.'+tovar_class+' .minus_tov').off().on('click',function(e){
            var product = $(this).closest('.'+tovar_class)
            changeProdutValue(product, 'decrease', 1);
            e.preventDefault();
        });
        
        $('.'+tovar_class+' .plus_tov').off().on('click',function(e){
            var product = $(this).closest('.'+tovar_class)
            changeProdutValue(product, 'increase', 1);
            e.preventDefault();
        });
        $('.'+tovar_class+' .minus_half_tov').off().on('click',function(e){
            var product = $(this).closest('.'+tovar_class)
            changeProdutValue(product, 'decrease', 0.5);
            e.preventDefault();
        });

        $('.'+tovar_class+' .plus_half_tov').off().on('click',function(e){
            var product = $(this).closest('.'+tovar_class)
            changeProdutValue(product, 'increase', 0.5);
            e.preventDefault();
        });
        $('.like').off().on('click',function(){
            var link = $(this);
            $.ajax({
                type: 'POST',
                url: '/bdhandlers/likes_bd.php',
                dataType: 'json',
                data: {item_id: $(this).closest('.'+tovar_class).data('id')},
                success: function (data) {
                    if(data.user_like==0){
                        $(link).addClass('you_not_like_bitch');
                    }else{ 
                        $(link).removeClass('you_not_like_bitch');
                    }
                    if(parseInt(data.total)>0){
                        $(link).removeClass('likes_disabled').find('span').text(data.total);
                    }else{
                        $(link).addClass('likes_disabled').find('span').html('');
                    }
                }
            });
            return false;
        });
        $('.tovar_cost').each(function(i,item){ 
            $(item).find('.balloon').remove();
            $(item).append("<img class='balloon' src='/local/templates/bd_sushi_shop_default/images/balloon.png' style='display:none;'>");
        });
    },
    calculateRow: function(){
        var productsPerRow = parseInt($('.tovar_box').width()/220);
        return productsPerRow;
    }
});

Studio8.Widget('statisticForModalWSelectGarnir', {
    documentReady: true,
    init: function(){
        $('.cb_garnir .add-garnir').on('click', function(){
            $(this).closest('.window_popup').find('.close').click();
            try {
                ga('send', 'event', 'knopka','dobavit_garnir');
                window.yaCounter.reachGoal('dobavit_garnir');
            } catch( e ){
                console.log("Error: don't send statisic to yandex or google");
            }
        });

        $('.cb_garnir .order-dont-garnir').on('click', function(){
            $(this).closest('.window_popup').find('.close').click();
            $('#cart .cart_meta input[type=submit]').click();
            try {
                ga('send', 'event', 'knopka','bez_garnira');
                window.yaCounter.reachGoal('bez_garnira');
            } catch( e ){
                console.log("Error: don't send statisic to yandex or google");
            }
        });
    }
});
