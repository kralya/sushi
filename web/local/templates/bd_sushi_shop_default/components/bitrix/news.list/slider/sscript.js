Studio8.Widget('slider', {
    documentReady: true,
    init: function(){
        this.owl();
    },
    owl: function(){
        if($('.slider')){
            $('.slider').owlCarousel({singleItem:true,autoHeight: true, autoPlay:3000, stopOnHover: true, afterAction:function(){
                $('.owl-item .placeholder').css('height',$('.slider').height()-20+'px');
            }});

            setTimeout(function(){
                $('.owl-item .placeholder').css('height',$('.slider').height()-20+'px');
            }, 200);
        }

    }
});