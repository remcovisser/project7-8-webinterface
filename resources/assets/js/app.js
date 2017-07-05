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
		locations: {},

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
		focusDevice(id) {
			if (id in this.entities && typeof this.entities[id].maps !== "undefined")
			{
				this.googleMaps.setCenter(this.entities[id].maps.marker.getPosition());
			}
		},

		// Load all registered devices from database.
		loadDevices() {
			$.get('/devices', devices => {

				devices.forEach(device => {
					if (device.id in this.entities)
					{
						// Update existing
						this.entities[device.id].device = device;
					}
					else
					{
						// Create new object
						this.addDevice(device);
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

				if (this.playing)
				{
					this.timestamp++;
					this.updateMap();
				}
			}

			// TODO: Make sure this does not get ahead of the application.
			setTimeout(this.incrementTimestamp, speed);
		},

		// Apply location and line to map based on timestamp.
		updateMap() {
			const date = this.dateToNiceDate(this.date);
			if (!(date in this.locations)) return this.getLocations(date, this.updateMap);

			// Compile data
			let locations = {};
			this.locations[date].forEach(location => {
				let createdAt = new Date(location.created_at);
				if (this.timestamp < (createdAt.getHours() * 3600) + (createdAt.getMinutes() * 60) + createdAt.getSeconds()) return; // Only apply locations before current timestamp

				// Create array
				if (!(location.device_id in locations)) locations[location.device_id] = [];

				// Apply LatLng
				locations[location.device_id].push(new google.maps.LatLng(location.gps_latitude, location.gps_longitude));
			});

			// Locations to entities
			for (let id in this.entities)
			{
				//noinspection JSUnfilteredForInLoop
				let entity = this.entities[id];

				if (id in locations)
				{
					//noinspection JSUnfilteredForInLoop
					let positions = locations[id];
					let maps = entity.maps;

					// Set path
					maps.line.setPath(positions);

					// Set position to latest path position
					if (typeof maps.marker.getMap() === "undefined") maps.marker.setMap(this.googleMaps);
					maps.marker.setPosition(positions[positions.length - 1]); // Apply marker to last known position
				}
				else
				{
					entity.maps.line.setPath([]);
					entity.maps.marker.setMap(null);
				}
			}

			// console.log('Drawn timestamp: ' + this.timestamp);
		},

		getLocations(date, callback) {
			const wasPlaying = this.playing;

			// Pause playback while requesting data
			if (wasPlaying) this.playing = false;

			const that = this;
			return $.get('/locations/' + date, locations => {
				that.locations[date] = locations;

				// Loading is done, continue playback
				if (wasPlaying) this.playing = true;

				callback();
			});
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
				case 50000:
					this.speed = 60000; // one second is one minute
					break;
				default:
					this.speed = 1000; // one second is one second
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

			return this.dateToNiceDateTime(date);
		},

		dateToNiceDate(date) {
			return (
				("00" + date.getDate()).slice(-2) + '-' +
				("00" + (date.getMonth() + 1)).slice(-2) + '-' +
				date.getFullYear()
			);
		},

		dateToNiceDateTime(date) {
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
			const device = data.device,
				location = data.location;

			// Create new entity
			if (!(device.id in this.entities)) this.addDevice(device);
			const entity = this.entities[device.id];

			// Update device
			entity.device = device;

			// Check whether we need to apply a new location
			if (!(typeof location !== "undefined")) return;
			const position = new google.maps.LatLng(location.gps_latitude, location.gps_longitude);

			// Update marker
			const maps = entity.maps;
			maps.marker.setPosition(position);
			maps.marker.setMap(this.googleMaps);

			// Extend line
			const path = maps.line.getPath();
			path.push(position);
			maps.line.setPath(path);
		},

		addDevice(device) {
			this.entities[device.id] = {
				device: device,
				maps: {
					marker: new google.maps.Marker({
						icon: this.icon,
						title: '#' + device.id + ' (' + device.mac + ')'
					}),
					line: new google.maps.Polyline({
						path: [],
						map: this.googleMaps,
						strokeColor: '#' + device.colour
					})
				}
			};
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