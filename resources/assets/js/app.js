window.$ = window.jQuery = require('jquery');

require('./map').map();

/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

//require('./bootstrap');

window.Vue = require('vue');

// const socket = require('socket.io-client')(window.location.hostname + ':3000');
const socket = require('socket.io-client')('http://project.maarten.co.uk:3000');

const app = new Vue({
	el: '#app',

	data: {
		// locations: [],
		googleMaps: {},
		entities: {},
		icon: { url: "http://icons.iconarchive.com/icons/iconsmind/outline/512/Shopping-Cart-icon.png", scaledSize: new google.maps.Size(50, 50), anchor: new google.maps.Point(25, 25) }
	},

	mounted: function() {
		if (document.getElementById('map_realtime') === null) return;

		socket.on('stream', this.addLocation);
		this.initMap();
	},

	methods: {
		initMap() {
			this.googleMaps = new google.maps.Map(document.getElementById('map_realtime'), {
				zoom: 14,
				center: { lat: 52.081387, lng: 4.345626 }
			});
		},

		addLocation(data) {
			const id = data.device.mac;

			// Check if device is known
			if (id in this.entities)
			{
				console.log('update position');
				const coords = new google.maps.LatLng(data.gps_latitude, data.gps_longitude);
				this.entities[id].setPosition(coords);
			}
			else
			{
				console.log('add marker');
				this.entities[id] = new google.maps.Marker({
					icon: this.icon,
					position: new google.maps.LatLng(data.gps_latitude, data.gps_longitude),
					map: this.googleMaps
				});
			}
		}
	}
});