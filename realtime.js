module.exports = function(server) {
	const io = require('socket.io')(server);
	const redis = require('redis');

	const client = redis.createClient();

	client.subscribe('video');

	client.on('message', (channel, message) => {
		//console.log(channel, message);
		if(channel === 'video'){
			io.emit('status', message);
		}
	})

	// io.sockets.on('connection', (_) => {
	// 	//console.log(socket.request);
	// });
};
