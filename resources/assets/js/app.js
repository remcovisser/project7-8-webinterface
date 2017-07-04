window.$ = window.jQuery = require('jquery');

require('./map').map();

/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

//require('./bootstrap');

window.Vue = require('vue');
import Datepicker from 'vuejs-datepicker';

// const socket = require('socket.io-client')(window.location.hostname + ':3000');
const socket = require('socket.io-client')('http://project.maarten.co.uk:3000');

const app = new Vue({
	el: '#app',

	components: {
		'datepicker': Datepicker
	},

	data: {
		googleMaps: {},
		icon: { url: "http://icons.iconarchive.com/icons/iconsmind/outline/512/Shopping-Cart-icon.png", scaledSize: new google.maps.Size(50, 50), anchor: new google.maps.Point(25, 25) },
		entities: {},

		live: false,
		playing: true,
		timestamp: 0,
		speed: 1000,
		date: new Date()
	},

	mounted() {
		if (document.getElementById('map_realtime') === null) return;

		// Switch to live to activate socket stream.
		this.live = true;

		// Bootstrap application
		this.initMap();
		this.loadDevices();
		this.incrementTimestamp();
	},

	watch: {
		live: function(value) {
			if (value)
			{
				// Start listening to socket stream.
				socket.on('stream', this.addLocation);
			}
			else
			{
				// Stop listening to socket stream.
				socket.removeAllListeners('stream')
			}
		}
	},

	computed: {
		formattedTimestamp() {
			return new Date(this.timestamp * 1000).toISOString().substr(11, 8);
		}
	},

	methods: {
		// Creates a new Google Maps instance.
		initMap() {
			this.googleMaps = new google.maps.Map(document.getElementById('map_realtime'), {
				zoom: 14,
				center: { lat: 51.917937, lng: 4.487838 } // Wijnhaven, Rotterdam.
			});
		},

		// Focus Google Maps onto selected device
		focusDevice(mac_address) {
			if (mac_address in this.entities && typeof this.entities[mac_address].maps !== "undefined")
			{
				this.googleMaps.setCenter(this.entities[mac_address].maps.marker.getPosition());
			}
		},

		// Load all registered devices from database.
		loadDevices() {
			$.get('/devices', devices => {

				devices.forEach(device => {
					if (device.mac in this.entities)
					{
						// Update existing
						this.entities[device.mac].device = device;
					}
					else
					{
						// Create new object
						this.entities[device.mac] = { device: device }
					}
				});
			});
		},

		// Keep count of the current date depending on speed or live.
		incrementTimestamp() {
			let speed = (1000 / (this.speed / 1000));

			if (this.live)
			{
				// Live time
				const dt = new Date();
				this.timestamp = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours());
				speed = 1000;
			}
			else
			{
				// Increment time
				if (this.playing) this.timestamp++;
			}

			// TODO: Make sure this does not get ahead of the application.
			setTimeout(this.incrementTimestamp, speed);
		},

		// Increment application speed in steps.
		incrementSpeed() {
			switch (this.speed)
			{
				case 1000:
					this.speed = 2000;
				break;
				case 2000:
					this.speed = 5000;
				break;
				case 5000:
					this.speed = 10000;
				break;
				case 10000:
					this.speed = 20000;
				break;
				case 20000:
					this.speed = 50000;
				break;
				default:
					this.speed = 1000; // real time
				break;
			}
		},

		// Overwriting time.
		manualOverwrite() {
			this.live = false;
		},

		// Enabling live data feed.
		enableLive() {
			this.live = true;
			this.playing = true;
		},

		// Toggle paused or playing mode.
		togglePlaying() {
			this.playing = !this.playing;

			if (this.playing === false)
			{
				this.live = false;
			}
		},

		// Set date to EU format.
		formatDate(datetime) {
			const date = new Date(datetime);

			return (
				("00" + date.getDate()).slice(-2) + '-' +
				("00" + (date.getMonth() + 1)).slice(-2) + '-' +
				date.getFullYear() + " " +
				("00" + date.getHours()).slice(-2) + ':' +
				("00" + date.getMinutes()).slice(-2) + ':' +
				("00" + date.getSeconds()).slice(-2)
			);
		},

		// Add marker and line to Google Maps instance.
		addLocation(data) {
			const device = data.device;
			const location = data.location;
			const position = (typeof location !== "undefined") ? new google.maps.LatLng(location.gps_latitude, location.gps_longitude) : null;


			if (device.mac in this.entities)
			{
				this.entities[device.mac].device = device;
			}
			else
			{
				this.entities[device.mac] = { device: device };
			}

			if (position === null) return;

			const entity = this.entities[device.mac];

			// Check if previous location is known
			if ('maps' in entity)
			{
				console.log('existing marker');
				// Update existing marker
				entity.maps.marker.setPosition(position);

				// Extend existing line
				const line = entity.maps.line;

				const path = line.getPath();
				path.push(position);
				line.setPath(path);
			}
			else
			{
				console.log('new marker');
				// Create new marker
				const marker = new google.maps.Marker({
					icon: this.icon,
					position: position,
					map: this.googleMaps,
					title: '#' + device.id + ' (' + device.mac + ')'
				});

				// Create new line
				const line = new google.maps.Polyline({
					path: [position],
					map: this.googleMaps,
					strokeColor: '#' + device.colour
				});

				entity.maps = { marker: marker, line: line }
			}
		},

		// Returns time in seconds.
		getTimeDifference(lastDateTime) {
			const now = new Date().getTime();
			const last = new Date(lastDateTime).getTime();

			return Math.floor((now - last) / 1000);
		},

		// Check whether device is considered live.
		deviceStatusLive(device) {
			const difference = this.getTimeDifference(device.updated_at);

			return (difference <= 15);
		},

		// Check whether device is considered warning.
		deviceStatusWarning(device) {
			const difference = this.getTimeDifference(device.updated_at);

			return (difference <= 60);
		},

		// Check whether device is considered offline.
		deviceStatusOffline(device) {
			const difference = this.getTimeDifference(device.updated_at);

			return (difference > 60);
		}
	}
});