<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" type="text/css" href="{{ mix('/css/app.css') }}">

    <title>Project 7-8</title>
</head>
<body>

<div id="app">
    <div id="side-menu">
        @foreach($devices as $device)
            <div class="block" onclick="blockClicked({{$device->id -1}})">
                <span class="block-title">Device {{ $device->id }}</span>
                <span class="block-content">Some kind of description</span>
                <div class="block-line"></div>
                <span class="block-info">Meer info</span>
            </div>
        @endforeach
    </div>

    <div id="map"></div>
    <p id="play" onclick="play()">Play</p>

</div>
<script src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_API_KEY') }}"></script>
<script src="{{ mix('/js/app.js') }}"></script>
</body>
</html>