/*if( typeof arStreets == 'undefined' )
	var arStreets = false;*/

/*
 показывает или скрывает определённые поля в зависимости от варианта
 */
function showFieldsByVariant(variant){
    switch (variant) {
        case "navynos":
            $(".delivery_time_wrap, .address_delivery, .destrict_delivery, .user_address").hide();
            $(".order_address_ulica, .order_address_dom, .order_address_kvartira").hide();
            $(".phone_field, .order_email, .user_name_field").hide();
            $(".colich_tov_field, .payment_type_field, .need_short_change_container, .comment_wrap").hide();
            
            $(".user_address, .order_address_ulica, .order_address_dom, .order_address_kvartira").removeClass("required");
            $(".user_name, .phone, .delivery_list, .receiver_name, .receiver_phone, .rt").removeClass("required");
            
            $(".discount").addClass("required");
            
            var form = $("#oform .order_form_fields");
            form.find('.restaurant_list').trigger("chosen:updated");
            setDevliveryPrice(0,0);
            break;
        case "dostavka":
            $(".user_address, .order_address_ulica, .order_address_dom, .order_address_kvartira").addClass("required");
            $(".discount, .user_name, .phone, .delivery_list, .receiver_name, .receiver_phone").addClass("required");
            $(".discount").removeClass("required");
            
            $(".delivery_time_wrap, .address_delivery, .destrict_delivery, .user_address").show();
            $(".order_address_ulica, .order_address_dom, .order_address_kvartira").show();
            $(".phone_field, .user_name_field, .colich_tov_field, .payment_type_field").show();
            $(".payment_type_field, .need_short_change_container, .comment_wrap").show();
    }
    
        $(".receiver_name_wrap, .receiver_phone_wrap").hide();
        $(".receiver_name, .receiver_phone").removeClass("required");

    if( variant == 'dostavka' ){
    	$('#delivery_time').val($('#delivery_time').attr('time-delivery'));
    }
}

function showFieldsByDostavka(){
    $(".address_delivery, .destrict_delivery").show();
    $(".user_address, .order_address_ulica, .order_address_dom, .order_address_kvartira").addClass("required");
    $(".restaurant_address").hide();
    $(".delivery_time_wrap").show();
    $(".delivery_time_wrap .txt").text('Дата и время доставки');
    $(".restaurant_list").removeClass("required");
    $(".receiver_name_wrap, .receiver_phone_wrap").hide();
    $(".receiver_name, .receiver_phone").removeClass("required");
}


$(document).ready(function(){

	/*
    корзина, выбор варианта
     */
    $('.variant_list').on('change',function(){
        showFieldsByVariant($(this).find(':selected').data('id'));
    });
	
	setDevliveryPrice(0,0);
	if(window.location.pathname=='/thank-you/'){
		$('#paid').show();
		$.ajax({
            type: 'POST',
            url: '/bdhandlers/order.php?t='+new Date().getTime(),
            data: {action: 'setStatus', order_id: $.cookie('order_id'),status:"success_pay"},
            success: function (data) {}
        });
	}
	if(window.location.pathname=='/sorry/'){
		$('#error').show();
		$.ajax({
            type: 'POST',
            url: '/bdhandlers/order.php?t='+new Date().getTime(),
            data: {action: 'setStatus', order_id: $.cookie('order_id'),status:"pay_fail"},
            success: function (data) {}
        });
	}
	$('.call_back_popup form .ln input[type=submit]').on('click',function(e){
		e.preventDefault();
// CALL PHONE AJAX CALLED                
//		try {
//			ga('send', 'event', 'knopka',' callback-submit');
//			window.yaCounter.reachGoal('callback-submit',{});
//		} catch(e) {
//			console.log('Error: init yandex counter');
//		}
		return false;
	});
	$('.callback_order').on('click',function(){

		if($('.callback_name').val().trim()==''){
			$('.callback_name').removeClass('success').addClass('error');
		}else{
			$('.callback_name').removeClass('error').addClass('success');
		}
//		if($('.callback_phone').val().length !== 16){
//			$('.callback_phone').removeClass('success').addClass('error');
//		}else{
//			$('.callback_phone').removeClass('error').addClass('success');
//		}
		if($('.callback_name').val().trim()!=='' && $('.callback_phone').val()!==""){
			$.ajax({
		        type: 'POST',
		        url: '/bdhandlers/order.php?t='+new Date().getTime(),
		        dataType: 'json',
		        data: {CB_NAME: $('.callback_name').val(),CB_PHONE: $('.callback_phone').val()},
		        success: function (data) {
			       $('.callback_phone').val('');
			       $('.callback_name').val('');
			       
		           $('.callback_phone').removeClass('error');
		           $('.callback_name').removeClass('error');
		           
		           $('.call_back_popup').hide();
		           $('.cb_ok').show();
		           $('.callback_phone').removeClass('error').removeClass('success');
		           $('.callback_name').removeClass('error').removeClass('success');
		        }
    		});	
		}		
	});
	registerChangeAmountEvent();

	$('#oform .minus_tov').off().on('click',function(e){
		var product_id = $(this).closest('li').data('id');
		if($(this).closest('li').data('is-gift')==0 || $(this).closest('li').data('is-gift')==undefined){
			var minus_tov = $(this).next('.txt_col_tov');
			var minus_tov_val = minus_tov.val();
			if (minus_tov_val>0) {
				minus_tov_val--;
				minus_tov.val(minus_tov_val);
			}
		}
		e.preventDefault();
	});

	$('#oform .plus_tov').off().on('click',function(e){
		var product_id = $(this).closest('li').data('id');
		if($(this).closest('li').data('is-gift')==0 || $(this).closest('li').data('is-gift')==undefined){
			var plus_tov = $(this).prev('.txt_col_tov');
			var plus_tov_val = plus_tov.val();
			plus_tov_val++;
			plus_tov.val(plus_tov_val);
		}
		e.preventDefault();
	});

	
	$('.delivery_list').on('change',function(event){
		setDevliveryPrice($('.delivery_list option:selected').data('delivery-price'),$('.delivery_list option:selected').data('free-delivery'));
	});
	
	$('.send_order_btn').on('click',function(event){
		event.preventDefault();
		var is_ok = 1;
		$('.order_form_fields .required').each(function(i,item){
			if($(item).val().trim()==''){
				$(item).addClass('error');
				$(item).removeClass('success');
				is_ok = 0;
			}else{
				$(item).removeClass('error');
				$(item).addClass('success');
			}
		});
			var filter = /^[0-9-+ ]+$/;

		if(jQuery.inArray($('.order_form_fields .order_address_ulica').val(),arStreets) <= 0 && $('.address_delivery').is(':visible'))
		{
			$('.order_form_fields .order_address_ulica').addClass('error');
			$('.order_form_fields .order_address_ulica').removeClass('success');
			is_ok = 0;		
		}
		else
		{
			$('.order_form_fields .order_address_ulica').removeClass('error');
			$('.order_form_fields .order_address_ulica').addClass('success');
		}
		
		if(is_ok==0){
			return false;
		}else{
			var payment_text = $('option:selected', '.payment_type').text();    
	    	var payment_id = $('.payment_type').val();
			
			$("#oform .ajax-loader").fadeIn(400);

			$.ajax({
                type: 'POST',
                url: '/bdhandlers/order.php?t=' + new Date().getTime(),
                dataType: 'json',
                data: {
                    DISCOUNT: $('.discount').val(),
                    PHONE: $('.order_form_fields .phone').val(),
                    NAME: $('.user_name').val(),
                    CITY: $('.order_form_fields .city').val(),
                    DELIVERY_NAME: $('.delivery_list option:selected').text(),
                    ORDER_EMAIL: $('.order_email').val(),
                    ADDRESS: $('.user_address').val(),
					ADDRESS_ULICA: $('.order_address_ulica').val(),
					ADDRESS_DOM: $('.order_address_dom').val(),
					ADDRESS_KORPUS: $('.order_address_korpus').val(),
					ADDRESS_PODEZD: $('.order_address_podezd').val(),
					ADDRESS_ETAZ: $('.order_address_etaz').val(),
					ADDRESS_KVARTIRA: $('.order_address_kvartira').val(),
                    DISTRICT: $('.delivery_list').val(),
                    ORDER_STATUS_ID: 'new',
                    PROMOCODE: $('.promo_value').val(),
                    PAY_SYS: payment_id,
                    PAY_SYS_TEXT: payment_text,
                    DELIVERY_PRICE:$('.delivery_price_value').text(),
                    PERSONS: $('.persons').val(),
                    CHANGE: $('.need_short_change').val(),
                    ORDER_VARIANT: $('.variant_list').val(),
                    RESTAURANT_ADDRESS: $('.restaurant_list').val(),
                    RECEIVER_NAME: $('.receiver_name').val(),
                    RECEIVER_PHONE: $('.receiver_phone').val(),
					COMMENT: $('.comment').val(),
					DELIVERY_TIME: $('.delivery_time').val()

                },
                success: function (order_id) {
                	$("#oform .ajax-loader").fadeOut(400);
                	$('.out_sum').val($('.cart_btn span').text().split(' ').join(''));
                	$.cookie('order_id',order_id,{path:'/'});
	                $('.cart_btn').find('span').text('').parent().removeClass('cart_full').addClass('cart').html("");
	                renderGiftScale(0);
	                refreshGifts(0);
	                refreshGiftsInCart(0);
                    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    var goods = new Array();
                    
                    $('.zakaz_list li').each(function(i,item){
	                   goods.push({id: $(item).data('id'), name: $(item).find('.name span').text(), price: $(item).data('price'), quantity: $(item).find('.txt_col_tov').val()}) 
                    });

					try{
						ga('send', 'event', 'knopka',' order-submit');
                    	window.yaCounter.reachGoal('order-submit', {order_id: Math.floor(Math.random() * (1 - 9999999 + 1)) + 1 ,currency: 'RUB',order_price: parseInt($('.cart_btn span').text().split(' ').join('')), goods: goods});
					} catch(e) {
						console.log('Error: init yandex counter');
					}               
                    
                    var is_online_pay = false;
                    
                    if($('.payment_type').length>0 && $('.payment_type').val()=='online'){
	                    is_online_pay = true;
                    }else{
	                    is_online_pay = false;
                    }
                    
                    if(is_online_pay){
	                    $('.id_rb').val(order_id);
						$('.crc').val(md5($('.login_rb').val()+':'+$('.out_sum').val()+':'+$('.id_rb').val()+':'+$('.pass_rb').val()));

						$('.payment_form').submit();
						
                    }else{
	                	$('#oform').hide();
	                    $('#cart').hide();
	                    $('#thank').show(); 
	                    var thxTop = parseInt($('#thank').offset().top) - 30;
	                    $('html, body').stop().animate({scrollTop:thxTop}, '500');   
                    }                   
				}
            });
		}
	});
	
//	$("input.phone").inputmask_phone();
	
//	$("input.phone").val('+375');
	
		
	$('.promo_value').on('keydown',function(event){
		if ((event.keyCode >= 48 && event.keyCode <= 57) || 
			(event.keyCode >= 65 && event.keyCode <= 90) || 
			(event.keyCode >= 96 && event.keyCode <= 110) ||
			event.keyCode==8 ||
			event.keyCode==13
		){
			if($(this).val().length>=4 || ($(this).val()=='' && event.keyCode!==8 && event.keyCode!==46 )){
				checkPromo();
			}else{
				$('.promo_value').removeClass('success');
				$('.promo_value').removeClass('error');
			}
		}
	});
	
	var infoGarnir = true;
	$('.cart_meta input[type="submit"]').on('click',function(){
		var garnirs = $('#scrollbar1 li[data-min-total="undefined"]');
		
		var showGarnirWindow = false;
		var realGarnirs = false;
		var idRealGarnirs = ["238", "235", "237", "236", "234", "233", "232", "239"];
		$.each(idRealGarnirs, function(i, e){
			if( $('#scrollbar1 li[data-id="'+e+'"]').length > 0 ) realGarnirs = true;
		});
		
		if(garnirs.length > 0 && !realGarnirs){
		    showGarnirWindow = true;
		    var images = [];
		    
		    garnirs.each(function(i, e){
			if( showGarnirWindow && $(e).find('.txt_col_tov').val() > 0 ){
			    showGarnirWindow = false;
			}
			var imageSrc = $(e).find('.pic img').attr('src');
			images.push(imageSrc);
		    });
		}
		
		if( !infoGarnir && showGarnirWindow){
		    $.each(images, function(i, e){
			$('.cb_garnir .garnir-images').append($('<img>').attr('src', e));
		    });
		    //$('.cb_garnir').css('top', document.documentElement.scrollTop+innerHeight/2-$('.cb_garnir').height()).show();
		    $('.cb_garnir').css('top', window.pageYOffset+innerHeight/2-$('.cb_garnir').height()).show();
		    infoGarnir = true;
		    return false;
		}
		
		$('#cart').hide();
		$('#oform').show();
		$('.out_sum').val($('.cart_btn span').text().split(' ').join(''));
//		try{
//			ga('send', 'event', 'knopka',' go-to-order');
//			window.yaCounter.reachGoal('go-to-order',{});
//		} catch(e) {
//			console.log('Error: init yandex counter');
//		}  
		if($('.payment_type').length>0 && $('.payment_type').val()=='offline'){
			$('.need_short_change_container').show();
		}
		// alert($('.variant_list :selected').data('id'));
		// console.log($('.variant_list :selected').data('id'));
		showFieldsByVariant($('.variant_list :selected').data('id'));
		// setDevliveryPrice($('.delivery_list option:selected').data('delivery-price'),$('.delivery_list option:selected').data('free-delivery'));
		return false; 
	});
	
	$('.back_to_cart, .back_to_cart_bottom').on('click',function(){
		$('#oform').hide(); 
		$('#cart').removeClass('animate_in').show();
		setDevliveryPrice(0,0);
		return false;
	});
	
	if($('.gift_box_products.active').length>0){
		$('.gift_box_products').each(function(i,item){
			if(!$(item).hasClass('active')){
				$(item).find('.maska').show();
			}
		})
	}
	
	$('.pol').on('click',function(){
		if($('.gift_box_products.active').length==0){
			$('.gift_box_products').find('.maska').show();
			$('.need_more').css('background-color','#8B8B8B');
			$(this).closest('.gift_box_products').addClass('active').find('.maska').hide();
			var product = $(this).closest('.gift_box_products');
			addToBasket(product);
		}
	});
	
	$('.neh').on('click',function(){
		$('.gift_box_products').find('.maska').hide();
		$('.need_more').each(function(i,item){
			$(item).css('background-color',$(item).data('normal-bg'));
			
			var product_id = $(item).closest('.gift_box_products').data('id');
			var category_id = $(item).closest('.gift_box_products').data('category-id');

			$.ajax({
	            type: 'POST',
	            url: '/bdhandlers/basket.php?t='+new Date().getTime(),
	            data: {action: 'deleteById', item_id: product_id, category_id: category_id},
	            success: function (data) {
		            animateNumbers($('.cart_btn span'),data);
	            }
        	});
        	
		});
		$(this).closest('.gift_box_products').removeClass('active');
		
	});

	/* хз зачем, пока отключил: HACK
	$.ajax({
        type: 'POST',
        url: '/bdhandlers/basket.php?t='+new Date().getTime(),
        dataType: 'json',
        data: {action: 'getBasket'},
        success: function (data) {
            renderGiftScale(data.total);
            if(data.total!==0){
	            $('.cart_btn').removeClass('cart').addClass('cart_full').html("<span>"+number_format(data.total, 0, '.', ' ')+'</span>');
            }
        }
    });*/
    $('.payment_type').on('change',function(){
		if($(this).val()=='online' ){
			$('.send_order_btn').val(BX.message('PAYIT'));
			$('.need_short_change_container').hide();
			//$('.need_short_change').removeClass('required');
		}else{
			$('.send_order_btn').val(BX.message('ORDERBUTTON'));
			$('.need_short_change_container').show();
			//$('.need_short_change').addClass('required');
			
		}    
    });  
	$('.cart_btn').on('click',function(){        
		if($(this).hasClass('cart')){
			return false;
		}
		$('#overlay').fadeIn(400);
		$('.cart_spinner').show();
		$('.zakaz_list').html('');
		
		$.ajax({
            type: 'POST',
            url: '/bdhandlers/basket.php?t='+new Date().getTime(),
            dataType: 'json',
            data: {action: 'getBasket'},
            success: function (data) {
	            if(window.shop_min_sum!==undefined && data.total<window.shop_min_sum){
		            $('.not_enough').show();
		            $('.cart_meta input[type="submit"]').hide();
	            }else{
		            $('.not_enough').hide();
		            $('.cart_meta input[type="submit"]').show();
	            }
//	            try {
//	            	ga('send', 'event', 'knopka',' go-to-basket');
//	            	window.yaCounter.reachGoal('go-to-basket',{});
//				} catch(e) {
//					console.log('Error: init yandex counter');
//				}
                                
	            $.each(data.basket, function(i, item) {
				    $('.zakaz_list').append(renderCartItem(i,data.basket[i]));
				}); 
				
				$('.cart_popup').find('.summa span').text(number_format(data.total, 2, '.', ' '));
				$('#oform').find('.summa span').text(number_format(data.total, 2, '.', ' '));

				// $('.summa-order.small-price span').text(number_format(parseFloat(data.total) * 10000, 0, '.', ' '));
				
				var $scrollbar = $("#scrollbar1");
				$scrollbar.tinyscrollbar();	
				var scrollbar__ = $scrollbar.data("plugin_tinyscrollbar")
				scrollbar__.update();
				$('.promo_value').val(data.code);
				
				if(data.code!=''){
					$('.promo_value').removeClass('error');
					$('.promo_value').addClass('success');
					$('.discount_value').text(data.discount);
					$('.discount_notice').show();
				}else{
					$('.promo_value').removeClass('error').removeClass('success');
					$('.discount_value').text('');
					$('.discount_notice').hide();
				}
				
				registerCartListeners();
				
				refreshGiftNotify(data.total);
				$('.cart_spinner').hide();
				
				// не знаю на*уя это шука тут стояла, но мешала...
				// я понял суть, начальная инициализация цены, переделал без учета доставки, просто скрываю ненужные поля
				showFieldsByDostavka();

            }
        });
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        $('.cart_popup').css('top', ((scrollTop)) +89 + 'px');
        $('.panda_popup').css('top', ((scrollTop)) +89 + 'px');
		$('#cart').show();
		
		$('#cart').removeClass('animate_out').addClass('animate_in');
		
		return false;
	});
	
	
	
});
function setDevliveryPrice(price, free) {
    $.ajax({
        type: 'POST',
        url: '/bdhandlers/basket.php?t=' + new Date().getTime(),
        dataType: 'json',
        data: {action: 'setDeliveryPrice', price: price, free: free},
        success: function (data) {
            animateNumbers($('#cart').find('.summa span'), data.total);
            animateNumbers($('#oform').find('.summa span'), data.total);
            if ($('.cart_btn span').length == 0) {
                $('.cart_btn').append($("<span></span>"));
            }
            if (data.total > 0) {
                $('.cart_btn').addClass('cart_full').removeClass('cart');
                animateNumbers($('.cart_btn span'), data.total);
            }
            // animateNumbers($('#oform .summa-order.small-price span'), parseFloat(data.total) * 10000);
            $('.delivery_price_value').text(data.delivery_price);
            if (data.delivery_price == 0) {
                $('.delivery_with_price').hide();
                $('.delivery_free').show();
                if ($('.variant_list').find(':selected').data('id') != 'navynos')
                    $('.delivery_price').show();
                else
                    $('.delivery_price').hide();
            } else {
                $('.delivery_with_price').show();
                $('.delivery_free').hide();
                $('.delivery_price').show();
            }
        }
    });
}
function checkPromo(){
	setTimeout(function(){
			$.ajax({
				type: 'GET',
				dataType: 'json',
				url: '/bdhandlers/common.php?t='+new Date().getTime(),
				data: {code: $('.promo_value').val()},
				success: function (data) {
					if(window.shop_min_sum!==undefined && data<window.shop_min_sum){
			            $('.not_enough').show();
			            $('.cart_meta input[type="submit"]').hide();
		            }else{
			            $('.not_enough').hide();
			            $('.cart_meta input[type="submit"]').show();
	            	}
					animateNumbers($('#cart').find('.summa span'),data.total);
					animateNumbers($('#oform').find('.summa span'),data.total);
					// $('.summa-order.small-price span').text(number_format(parseFloat(data.total) * 10000, 0, '.', ' '));
					animateNumbers($('.cart_btn span'),data.total);
					refreshGiftNotify(data.total);
					refreshGiftsInCart(data.total);
					renderGiftScale(data.total);
					refreshGifts(data.total);
					if(parseInt(data.status)==1){
						
						$('.discount_value').text(data.discount);
						$('.discount_notice').show();
						
						$('.promo_value').removeClass('error');
						$('.promo_value').addClass('success');
					}
					if(parseInt(data.status)==0){
						
						$('.discount_value').text('');
						$('.discount_notice').hide();
						
						$('.promo_value').addClass('error');
						$('.promo_value').removeClass('success');				
					}
					if($('.promo_value').val().length==0){
						$('.promo_value').removeClass('success');
						$('.promo_value').removeClass('error');
					}
				}
			});
		
	}, 300)
	
}

function refreshGiftNotify(total){
	if(total<window.gift_level_1){
		animateNumbers($('.need_to_gift'),window.gift_level_1-total);
		$('.empty_podarok').show();
		$('.podarok').hide();
		$('.podarok_complete').hide();
	}else{
		$('.empty_podarok').hide();
		$('.podarok_complete').hide();
		$('.podarok').show();
	}
	var has_gift = 0;
	$('.zakaz_list').find('li').each(function(i,item){
		backgroundRedColorIfZeroValue($(item));
		if($(item).data('is-gift')==1){
			$('.empty_podarok').hide();
			$('.podarok').hide();
			$('.podarok_complete').show();
			has_gift = 1;
		}
	});	
	
}

function backgroundRedColorIfZeroValue($item){
	var inputField = $item.find('.colich_tov .txt_col_tov');
	if( inputField.val() == 0 ){
		inputField.addClass('zero-value');
	} else {
		inputField.removeClass('zero-value');
	}
}

function updateCountInCart(item_id, count){
	$.ajax({
            type: 'POST',
            url: '/bdhandlers/basket.php?t='+new Date().getTime(),
            dataType: 'json',
            data: {action: 'updateCount', item_id: item_id, count: count},
            success: function (data) {
	            if(window.shop_min_sum!==undefined && data<window.shop_min_sum){
		            $('.not_enough').show();
		            $('.cart_meta input[type="submit"]').hide();
	            }else{
		            $('.not_enough').hide();
		            $('.cart_meta input[type="submit"]').show();
	            }
	            animateNumbers($('#cart').find('.summa span'),data);
	            animateNumbers($('#oform').find('.summa span'),data);
	            // animateNumbers($('#cart .summa-order.small-price span'), parseFloat(data)*10000);
	            renderGiftScale(data);
	            refreshGifts(data);
	            animateNumbers($('.cart_btn').find('span'),data);
	            refreshGiftsInCart(data);
	            refreshGiftNotify(data);
            }
        });
}

function refreshGiftsInCart(total){
	$('.zakaz_list li').each(function(i,item){
		if($(item).data('is-gift')==1){ 
			if(total<$(item).data('min-total')){
				deleteCartItem($(item).data('index'));
				refreshGifts(total);
				
				$('.need_more').each(function(i,item){
					$(item).closest('.gift_box_products').removeClass('active');
					$(item).closest('.gift_box_products').find('.maska').hide();
					$(item).css('background-color',$(item).data('normal-bg'));
				});
			}
		}
	});
}

function changeProdutValue(product,direction,count){
	    count = (count > 0) ? count : 1;
	
		var plus_tov = $(product).find('.txt_col_tov').first();
		var plus_tov_val = plus_tov.val();
		
		if(direction=='increase')
			plus_tov_val = parseFloat(plus_tov_val) + parseFloat(count);
			
		if(direction=='decrease' && ((count >=1 && plus_tov_val>1) || (count == 0.5 && plus_tov_val>=1)))
			plus_tov_val = parseFloat(plus_tov_val) - parseFloat(count);

		animateNumbers($(product).find('.price span').first(),parseFloat($(product).data('price'))*plus_tov_val);
		animateNumbers($(product).find('.price span').last(),parseFloat($(product).data('price'))*plus_tov_val);
		animateNumbers($(product).find('.old_price span').first(),parseFloat($(product).data('old-price'))*plus_tov_val);
		animateNumbers($(product).find('.old_price span').last(),parseFloat($(product).data('old-price'))*plus_tov_val);

		$(product).find('.txt_col_tov').val(plus_tov_val);
		
}
function refreshGifts(total){
	if($('.need_more').length>0){
		$('.need_more').each(function(i,item){
			if(parseInt(total)>=parseInt($(item).data('min-total'))){
				$(item).hide();
				$(item).parent().find('.down').show();
				
			}else{
				$(item).show();
				$(item).parent().find('.down').hide();
				
			}
			
		});
	}
}

function registerChangeAmountEvent(){
    $('#cart .minus_tov, #cart .plus_tov, #cart .minus_half_tov, #cart .plus_half_tov').off().on('click',function(e){
        var $this = $(this);
		var $li = $this.closest('li');
		var product_id = $this.closest('li').data('index');
        if($li.data('is-gift')==0 || $li.data('is-gift')==undefined){
            var countContainer = $this.siblings('.txt_col_tov');
            var countValue = countContainer.val();
            if($this.hasClass("minus_tov")) {
                if (countValue>0) {
                    countValue--;
                    countContainer.val(countValue);
                }
            }
            else if($this.hasClass("plus_tov")) {
                countValue++;
                countContainer.val(countValue);
            }
            else if($this.hasClass("minus_half_tov")) {
                if (countValue>=1) {
                    countValue = parseFloat(countValue) - 0.5;
                    countContainer.val(countValue);
                }
            }
            else if($this.hasClass("plus_half_tov")) {
                countValue = parseFloat(countValue) + 0.5;
                countContainer.val(countValue);
            }
            var priceVal = $li.attr('data-price');
            var newPrice = parseFloat(priceVal*countValue);

			animateNumbers($this.parent().next(), newPrice);
            updateCountInCart(product_id, countContainer.val());
        }
        e.preventDefault();
    });
}

function registerCartListeners(){
	$('.delete_basket_item').off().on('click',function(){
		if($(this).closest('li').data('is-gift')==1){
			setTimeout(function(){
				$('.empty_podarok').hide();
				$('.podarok_complete').hide();
				$('.podarok').show();	
			}, 900);
			
			$('.gift_box_products').find('.maska').hide();
			$('.need_more').each(function(i,item){
				$(item).css('background-color',$(item).data('normal-bg'));	
			});		
			$('.gift_box_products').removeClass('active');
			$('.podarok_complete').addClass('bounceOutLeft');
			$('.podarok').addClass('bounceInLeft');
		}
		deleteCartItem($(this).closest('li').data('index'));
		try {
			ga('send', 'event', 'knopka','delete_item'); 
			window.yaCounter.reachGoal('delete_item');
		} catch( e ){
			console.log("Error: don't send statisic to yandex or google");
		}
	});
	
	registerChangeAmountEvent();
	
}

function animateNumbers(elem,new_val){
	$({val_i: parseInt($(elem).text().split(' ').join(''))}).animate({val_i: parseInt(new_val)}, {
		duration: 500,
		easing: 'swing',
		step: function () {
			$(elem).text(parseInt(this.val_i));
		},
		complete: function () {
			if(new_val < 5000)
				$(elem).text(number_format(new_val, 2, '.', ' '));
			else
				$(elem).text(number_format(new_val, 0, '.', ' '));
		}
	})
}

function deleteCartItem(item_id){
	$.ajax({
            type: 'POST',
            url: '/bdhandlers/basket.php?t='+new Date().getTime(),
            data: {action: 'delete', item_id: item_id},
            success: function (data) {
	            if(window.shop_min_sum!==undefined && data<window.shop_min_sum){
		            $('.not_enough').show();
		            $('.cart_meta input[type="submit"]').hide();
	            }else{
		            $('.not_enough').hide();
		            $('.cart_meta input[type="submit"]').show();
	            }
	            animateNumbers($('#cart').find('.summa span'),data);
	            animateNumbers($('#oform').find('.summa span'),data);

	            renderGiftScale(data);
	            refreshGiftsInCart(data);
	            refreshGifts(data); 
				var index = $('.zakaz_list').find('li[data-id="'+item_id+'"]').index();
	            var scrollToItem = index*100;
	            
	            $('.zakaz_list').find('li[data-index="'+item_id+'"]').addClass('basket_remove_animate');
		            
	            	
	            setTimeout(function(){
			        $('.zakaz_list').find('li[data-index="'+item_id+'"]').remove(); 
			        if($('.zakaz_list').find('li').length==0){
						$('.cart_popup .close').trigger('click');
						$('.cart_btn').removeClass('cart_full').addClass('cart').html("");
					}else{
						animateNumbers($('.cart_btn').find('span'),data);
					}
	            },700);
	            refreshGiftNotify(data);
	            
	            var $scrollbar = $("#scrollbar1");
				$scrollbar.tinyscrollbar();	
				var scrollbar__ = $scrollbar.data("plugin_tinyscrollbar");
	            setTimeout(function(){ 
		            if($('.zakaz_list').find('li').length>=3 && index>3){
						scrollbar__.update(scrollToItem-300);
		            }else{
			        	scrollbar__.update();    
		            }
	            },900);
	            
				
				
				
            }
        });
}

function renderCartItem(i,item){
    var plusHalf = "";
    var minusHalf = "";
    var categoryName = "";
    if(item.half_enabled == "yes") {
        plusHalf = '<input type="button" value="+&frac12;" class="plus_half_tov"/>';
        minusHalf = '<input type="button" value="-&frac12;" class="minus_half_tov"/>';
    }
    /*if(item.category_name !== undefined) {
        if(item.category_name.length) {
            categoryName = " (" + item.category_name + ")";
        }
    }*/
    var priceVal = item.item_price*item.count;
	return '<li  data-index="'+i+'" data-is-gift="'+item.is_gift+'" data-price="'+item.item_price+'" data-min-total="'+item.min_total+'" data-id="'+item.item_id+'"><div class="pic"><img src="'+item.item_img+'" alt=""></div>'+
                            '<div class="name"><span>'+item.item_name+categoryName+'</span></div>'+
                            '<div class="colich_tov">'+
                                '<input type="button" value="-" class="minus_tov">'+
                                minusHalf +
                                '<input type="text" value="'+item.count+'" class="txt_col_tov" readonly="readonly">'+
                                plusHalf +
                                '<input type="button" value="+" class="plus_tov">'+
                            '</div>'+                
                            '<div class="price">'+priceVal.toFixed(2)+'</div>'+
                            // '<div class="price">'+priceVal.toFixed(2)+' <div class="small-price">('+parseFloat(item.item_price*item.count)*10000+')</div></div>'+
                            '<span class="delete delete_basket_item" data-id="'+item.item_id+'"></span>'+
                        '</li>';
}



function renderGiftScale(total){

    var percent = 0;
    var firstPart = 0;
    var secondPart = 0;
    var thirdPart = 0;

    /*
    на сколько процентов нужно заполнить шкалу, чтобы она совпадала с картинками
     */
    var giftLevel1Percent = 28;
    var giftLevel2Percent = 63;
    var giftLevel3Percent = 100;

    /*
    "стоимость" одного процента на разных уровнях
     */
    var percentCostBefore1 = window.gift_level_1 / giftLevel1Percent;
    var percentCostBefore2 = (window.gift_level_2 - window.gift_level_1) / (giftLevel2Percent - giftLevel1Percent);
    var percentCostBefore3 = (window.gift_level_3 - window.gift_level_2) / (giftLevel3Percent - giftLevel2Percent);

    /*
    промежуточная сумма, которую нужно набрать на каждом уровне
     */
    var part1 = window.gift_level_1;
    var part2 = window.gift_level_2 - window.gift_level_1;
    var part3 = window.gift_level_3 - window.gift_level_2;
    firstPart = (total - window.gift_level_1 > 0) ? part1 : total;
    if(total >= window.gift_level_1) {
        secondPart = (total - window.gift_level_2 > 0) ? part2 : total - window.gift_level_1;
        if(total >= window.gift_level_2) {
            thirdPart = (total - window.gift_level_3 > 0) ? part3 : total - window.gift_level_2;
        }
    }

    percent = firstPart / percentCostBefore1 + secondPart / percentCostBefore2 + thirdPart / percentCostBefore3;

	$('.delenija').css('height',percent+'%');
	if(total>=window.gift_level_1){
		$('.free_panda.lit').addClass('active');
		if(total>=window.gift_level_2){
			$('.free_panda.mid').addClass('active');
			$('.free_panda.lit .zabr').hide();
			if(total>=window.gift_level_3){
				$('.free_panda.hot').addClass('active');
				$('.free_panda.lit .zabr').hide();
				$('.free_panda.mid .zabr').hide();
			}else{
				$('.free_panda.hot').removeClass('active');
				$('.free_panda.mid .zabr').show();
			}
		}else{
			$('.free_panda.mid').removeClass('active');
			$('.free_panda.hot').removeClass('active');
			$('.free_panda.lit .zabr').show();
			$('.free_panda.mid .zabr').hide();
		}
	}else{
		$('.free_panda').removeClass('active');
		$('.free_panda.mid').removeClass('active');
		$('.free_panda.hot').removeClass('active');
		$('.free_panda.lit .zabr').hide();
		$('.free_panda.mid .zabr').hide();
	}
}


function addToBasket(product) {
    	var product_id = parseInt($(product).data('id'));
    	try {
    		ga('send', 'event', 'knopka',' add-to-basket');
    		window.yaCounter.reachGoal('add-to-basket',{});
		} catch(e) {
//			console.log('Error: init yandex counter');
		}
        $('.cart_summa').removeClass('cart_summa_empty');
        $('.cart_summa').find('.rouble').show();
        $('.cart_summa').find('.summ_count').show();

        $('.cart_empty_block').hide();
        $('.summa').show();
        $('.down_box').show();
		$('.addtocart').attr('disabled','disabled');
		setTimeout(function(){
			$('.addtocart').removeAttr('disabled');
		}, 500);
        
        var cart = $('.cart_btn').delay(1000);

        var imgtodrag = $(product).find('.balloon').eq(0);

        var amount = 1; 
        var is_gift = 1;
        
        if(!$(product).hasClass('gift_box_products')){
	    	amount = $(product).find('.txt_col_tov').first().val();    
	    	is_gift = 0;
			var min_total =  0;	
        }else{
	        var min_total = $(product).find('.need_more').data('min-total');
        }
        var item_ = {
            item_id: product_id,
            count: amount,
            category_id:$(product).data('category-id'),
            category_name:$(product).data('category-name'),
            item_name: $(product).find('.title:first').text(),
            item_img: $(product).find('.pic').first().find('img').attr('src'),
            item_price: $(product).attr('data-price'),
            item_old_price: $(product).attr('data-old-price'),
            is_gift: is_gift,
            min_total:min_total,
            half_enabled:$(product).data('half-enabled')};
        $.ajax({
            type: 'POST',
            url: '/bdhandlers/basket.php?t='+new Date().getTime(),
            dataType: 'json',
            data: {action: 'addToBasket', item: item_},
            success: function (data) {
	            renderGiftScale(data.total);
	            if($('.cart_btn').html().trim()==''){
		            $('.cart_btn').html('<span>0</span>');
	            }
	            $('.cart_btn').removeClass('cart').addClass('cart_full');
	            animateNumbers($('.cart_btn').find('span'),data.total);
            }
        });
        
		if(!$(product).hasClass('gift_box_products')){
	        if (imgtodrag) {
	            var imgclone = imgtodrag.clone()
	                .offset({
	                    top: $(product).find('.addtocart').offset().top,
	                    left: $(product).find('.addtocart').offset().left
	                })
	                .css({
	                    'opacity': '1',
	                    'position': 'absolute',
	                    'z-index': '100',
	                    'visibility': 'visible',
	                    'display': 'block',
	                })
	                .appendTo('body')
	                .animate({
	                    'top': cart.offset().top,
	                    'left': cart.offset().left,
	            }, 500);
	
	            imgclone.fadeOut('fast', function () {
	                $(this).detach()
	            });
            }

    }
}

function number_format( number, decimals, dec_point, thousands_sep ) {	
	
	var i, j, kw, kd, km;
	if( isNaN(decimals = Math.abs(decimals)) ){
		decimals = 2;
	}
	if( dec_point == undefined ){
		dec_point = ",";
	}
	if( thousands_sep == undefined ){
		thousands_sep = ".";
	}

	i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

	kw = i.split( /(?=(?:\d{3})+$)/ ).join( thousands_sep );
	kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");


	return kw + kd;
}

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (Register as an anonymous module)
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (arguments.length > 1 && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {},
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling $.cookie().
			cookies = document.cookie ? document.cookie.split('; ') : [],
			i = 0,
			l = cookies.length;

		for (; i < l; i++) {
			var parts = cookies[i].split('='),
				name = decode(parts.shift()),
				cookie = parts.join('=');

			if (key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));
String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');} 
