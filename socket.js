const app = require('express')(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

server.listen(3000, function() {
	console.log('Socket is live.');
});

app.post('/submit', function(req, res) {
	console.log(req.body);
	io.emit('stream', req.body);
	res.status(204).send();
});