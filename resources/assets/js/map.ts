import {} from '@types/googlemaps';
import * as $ from "jquery";

export function map(): void {
    if (document.getElementById('map') == null) return;

    // Declare local variables
    let api_url: string = "/";
    let markers: any[] = [];
    let circles: any[] = [];
    let lines: any[] = [];
    let map: any;
    let play: boolean = false;
    let updateMarkersRate: number = 10000; // 10 seconds
    let icon = {
        url: "http://icons.iconarchive.com/icons/iconsmind/outline/512/Shopping-Cart-icon.png", // url
        scaledSize: new google.maps.Size(50, 50), // scaled size
        anchor: new google.maps.Point(25, 25) // anchor
    };

    // Set all the markers every <updateMarkersRate> milliseconds
    $(function(): void {
        initMap();
        let timerLoop: number;
        let timer = function() {
            // Clear all the markers
            for (let i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = [];
            // Clear all the circles
            for (let i = 0; i < circles.length; i++) {
                circles[i].setMap(null);
            }
            circles = [];

            if (updateMarkersRate != 0) {
                // Add markers and circles
                $.get(api_url + "get-last-location", function (data: any): void {
                    for (let i = 0; i < data.length; i++) {
                        let location = data[i];

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
            }
        };
        timer();
    });

    // Initialize the map
    function initMap(): void {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: new google.maps.LatLng(51.917937, 4.487838)
        });
    }

    // Center map to the position of a marker
    (<any>window).blockClicked = function(block_id: number): void {
        let marker = markers[block_id];
        map.setCenter(new google.maps.LatLng(parseFloat(marker.position.lat()), parseFloat(marker.position.lng())));
        map.setZoom(17);
    };

    // Play animation of the movement of all the cards for this day
    (<any>window).play = function(): void {
        if(play) {
            $("#play").text("Play");
            play = false;
        } else {
            $("#play").text("Stop");
            play = true;
        }
        // Get the GPS data for each device for this day
        let devices: any[] = [];
        $.get(api_url + "get-daily-locations", function (data: any): void {
            $.each(data, function (key: number, value: any[]) {
                devices.push(value);
            });

            // Disable the current update for the map
            updateMarkersRate = 0;

            // Iterate trough all the known locations of a device and display them
            let timerLoop: number;
            let i: number = 0;

            let timer = function () {
                i++;
                // Clear all the markers
                for (let i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                markers = [];
                // Clear all the circles
                for (let i = 0; i < circles.length; i++) {
                    circles[i].setMap(null);
                }
                circles = [];

                // Draw markers
                for (let x = 0; x < devices.length; x++) {
                    let device = devices[x];
                    if (i < device.locations.length) {
                        // Create a marker at the location of a cart
                        let marker = new google.maps.Marker({
                            icon: icon,
                            position: new google.maps.LatLng(device.locations[i].gps_latitude, device.locations[i].gps_longitude),
                            map: map
                        });
                        markers.push(marker);
                        // Create a circle around a cart to show its accuracy
                        let circle = new google.maps.Circle({
                            center: markers[x].position,
                            radius: device.locations[i].gps_accuracy,
                            map: map,
                            fillColor: '#24a337',
                            fillOpacity: 0.1,
                            strokeColor: '#ffffff',
                            strokeOpacity: 0.3
                        });
                        circles.push(circle);

                        lines.push({
                            lat: parseFloat(device.locations[i].gps_latitude),
                            lng: parseFloat(device.locations[i].gps_longitude)
                        });
                        let cartPath = new google.maps.Polyline({
                            path: lines,
                            geodesic: true,
                            strokeColor: '#FF0000',
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                        });
                        cartPath.setMap(map);

                    // If it's the last known location of a device, always use this location
                    } else {
                        let marker = new google.maps.Marker({
                            icon: icon,
                            position: new google.maps.LatLng(device.locations[device.locations.length - 1].gps_latitude, device.locations[device.locations.length - 1].gps_longitude),
                            map: map
                        });
                        markers.push(marker);
                    }
                }
                // Repeat every 0.5 seconds
                timerLoop = setTimeout(timer, 500);
            };
            timer();
        });
    }

}