window.$ = window.jQuery = require('jquery');

require('./map').map();

/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

//require('./bootstrap');

window.Vue = require('vue');

const socket = require('socket.io-client')(window.location.hostname + ':3000');

const app = new Vue({
	el: '#app',

	data: {
		messages: [],
	},

	mounted: function() {
		const that = this;

		socket.on('stream', function(data) {
			console.log(data);
			that.messages.push(data);
		});
	},

	// methods: {
	// 	send: function(e) {
	// 		socket.emit('test', 123);
	//
	// 		e.preventDefault()
	// 	}
	// }
});