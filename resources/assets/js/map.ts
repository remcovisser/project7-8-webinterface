import {} from '@types/googlemaps';
import * as $ from "jquery";

export function map(): void {
    // Declare local variables
    let api_url: string = "http://project7-8-webinterface.dev/locations";
    let markers: any[] = [];
    let circles: any[] = [];
    let map: any;
    let updateMarkersRate: number = 10000; // 10 seconds

    // Set all the markers every <updateMarkersRate> milliseconds
    $(function(): void {
        let timerLoop: number;
        let timer = function(){
            // Clear markers and circles
            for (let i = 0; i < markers.length; i++ ) {
                markers[i].setMap(null);
                circles[i].setMap(null);
            }
            // Add markers and circles
            $.get( api_url, function( data: any ): void {
                for(let i = 0; i < data.length; i++) {
                    let location = data[i];

                    // Create Icon object for a marker
                    let icon = {
                        url: "http://icons.iconarchive.com/icons/iconsmind/outline/512/Shopping-Cart-icon.png", // url
                        scaledSize: new google.maps.Size(50, 50), // scaled size
                        anchor: new google.maps.Point(25, 25) // anchor
                    };

                    // Create a marker at the location of a cart
                    let marker = new google.maps.Marker({
                        icon: icon,
                        position: new google.maps.LatLng(location.gps_latitude, location.gps_longitude),
                        map: map
                    });
                    markers.push(marker);

                    // Create a circle around a cart to show its accuracy
                    let circle = new google.maps.Circle({
                        center: markers[i].position,
                        radius: location.gps_accuracy,
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
        initMap();
    });

    // Initialize the map
    function initMap(): void {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: new google.maps.LatLng(51.917937, 4.487838)
        });
    }

    // Center map to the position of a marker
    function blockClicked(block_id: number): void {
        let marker = markers[block_id];
        map.setCenter(new google.maps.LatLng(marker.position.lat(), marker.position.lng()));
        map.setZoom(17);
    }
}