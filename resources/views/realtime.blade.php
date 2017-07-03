<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="{{ mix('/css/realtime.css') }}">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">

    <title>Project 7/8 – RealTime</title>
</head>
<body class="realtime">
    <div id="app">
        <div id="map_realtime"></div>

        <div id="map_date" class="map_ui"><datepicker :monday-first="true" format="dd-MM-yyyy" v-model="date"></datepicker></div>
        <button id="map_status" class="map_ui" :class="{ 'map_live': live }" v-on:click="enableLive"><i class="map_dot">&#9679;</i> Live</button>

        <div id="devices">
            <div class="map_ui map_ui--transparent device" v-for="device in devices">
                #@{{ device.id }}<br>

                Status: <i class="map_dot">&#9679;</i><br>
                Last update:<br>@{{ device.updated_at }}

            </div>
        </div>

        <div id="map_playback">
            <button id="map_playback--control" class="map_ui map_ui--transparent" v-on:click="togglePlaying">
                <span v-if="playing">
                    Playing
                </span>
                <span v-else>
                    Paused
                </span>
            </button>
            
            <div id="map_playback--timeline" class="map_ui map_ui--transparent">
                <div class="map_playback--time">@{{ formattedTimestamp }} / 23:59:59</div>
                <div class="map_playback--range"><input type="range" min="0" max="86399" v-model.number="timestamp" v-on:change="manualOverwrite"></div>
            </div>

            <button id="map_speed" class="map_ui map_ui--transparent" v-on:click="incrementSpeed">@{{ speed / 1000 }}x</button>
        </div>
    </div>

    <script src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_API_KEY') }}"></script>
    <script src="{{ mix('/js/app.js') }}"></script>
</body>
</html>