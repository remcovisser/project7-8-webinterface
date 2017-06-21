<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" type="text/css" href="{{ asset('css/style.css') }}">

    <title>Project 7-8</title>
</head>
<body>

<div id="side-menu">
    @foreach($carts as $cart)
        <div class="block" onclick="blockClicked({{$cart->id -1}})">
            <span class="block-title">{{ $cart->name }}</span>
            <span class="block-content">{{ $cart->description }}</span>
        </div>
    @endforeach
</div>

<div id="map"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script async defer src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_API_KEY') }}&callback=initMap"></script>
<script src="{{ asset('js/map.js') }}"></script>
</body>
</html>