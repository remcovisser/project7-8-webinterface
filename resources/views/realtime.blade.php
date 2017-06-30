<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" type="text/css" href="{{ mix('/css/app.css') }}">

    <title>Project 7-8 - RealTime</title>
</head>
<body>

    <div id="app">
        <div id="map_realtime"></div>
    </div>

    <script src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_API_KEY') }}"></script>
    <script src="{{ mix('/js/app.js') }}"></script>
</body>
</html>