function initMap() {
    var uluru = {lat: 47.836880, lng: 35.134461};
    var map = new google.maps.Map(document.getElementById('map'), {
        center: uluru,
        zoom: 16
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map,
        label: 'B'
    });
}

function initMap1() {
    var uluru1 = {lat: 47.820749, lng: 35.052308};
    var map1 = new google.maps.Map(document.getElementById('map1'), {
        center: uluru1,
        zoom: 16
    });
    var marker1 = new google.maps.Marker({
        position: uluru1,
        map: map1,
        label: 'A'
    });
}

function init() {
    initMap1();
    initMap();
}
