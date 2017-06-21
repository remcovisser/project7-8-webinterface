<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Project 7-8</title>
    <style>
        html, body {
            padding: 0px;
            margin: 0px;
        }
        #map {
            height: 100%;
            width: 100%;
            display:block;
            position:absolute;
        }
    </style>
</head>
<body>

<div id="map"></div>

<script>
    function initMap() {
        var position = new google.maps.LatLng(51.917937, 4.487838);

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: position
        });
        var marker = new google.maps.Marker({
            position: position,
            map: map
        });

        setInterval(function(){
            var newPosition = new google.maps.LatLng(marker.position.lat() + 1, marker.position.lng());
            marker.setPosition(newPosition);
            console.log(marker.position.lat() + " - " + marker.position.lng())
        },1000);

    }
</script>
<script async defer
        src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_API_KEY') }}&callback=initMap">
</script>
</body>
</html>