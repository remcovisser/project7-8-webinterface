var api_url = "http://project7-8-webinterface.dev/locations";
var markers = [];
var circles = [];
var map;
var updateMarkersRate = 10000;

// Set all the markers every <updateMarkersRate> seconds
$(function() {
    var timerLoop;
    var timer = function(){
        // Clear markers
        for (var i = 0; i < markers.length; i++ ) {
            markers[i].setMap(null);
            circles[i].setMap(null);
        }
        // Add markers
        $.get( api_url, function( data ) {
            for(var i = 0; i < data.length; i++) {
                var location = data[i];

                // Create Icon object for a marker
                var icon = {
                    url: "http://icons.iconarchive.com/icons/iconsmind/outline/512/Shopping-Cart-icon.png", // url
                    scaledSize: new google.maps.Size(50, 50), // scaled size
                    anchor: new google.maps.Point(25, 25) // anchor
                };
                // Create a marker at the location of a cart
                var marker = new google.maps.Marker({
                    icon: icon,
                    position: new google.maps.LatLng(location.latitude, location.longitude),
                    map: map
                });
                markers.push(marker);
                // Create a circle around a cart to show its accuracy
                var circle = new google.maps.Circle({
                    center: markers[0].position,
                    radius: 100,
                    map: map,
                    fillColor: '#24a337',
                    fillOpacity: 0.1,
                    strokeColor: '#ffffff',
                    strokeOpacity: 0.3
                });
                circles.push(circle);
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
    map.setZoom(17);
}