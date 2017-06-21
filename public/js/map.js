var api_url = "http://project7-8-webinterface.dev/locations";
var markers = [];
var map;
var updateMarkersRate = 10000;

// Set all the markers every <updateMarkersRate> seconds
$(function() {
    var timerLoop;
    var timer = function(){
        // Clear markers
        for (var i = 0; i < markers.length; i++ ) {
            markers[i].setMap(null);
        }
        markers.length = 0;
        // Add markers
        $.get( api_url, function( data ) {
            for(var i = 0; i < data.length; i++) {
                var location = data[i];

                var marker = new google.maps.Marker({
                    label: location.cart_id.toString(),
                    position: new google.maps.LatLng(location.latitude, location.longitude),
                    map: map
                });
                markers.push(marker);
            }
        });
        timerLoop = setTimeout(timer, updateMarkersRate);
    };
    timer();
});


// Initialize the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new google.maps.LatLng(51.917937, 4.487838)
    });

    /* Update the position of a marker
    setInterval(function(){
        var newPosition = new google.maps.LatLng(marker.position.lat() +0.1, marker.position.lng());
        marker.setPosition(newPosition);
    },1000);
    */
}

// Center map to the position of a marker
function blockClicked(block_id) {
    var marker = markers[block_id];
    map.setCenter(new google.maps.LatLng(marker.position.lat(), marker.position.lng()));
}