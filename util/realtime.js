const { promisify } = require('util');

const io = require('socket.io');
const redis = require('redis');

const subscriber = redis.createClient();
const publisher = redis.createClient();
const cache = redis.createClient();

const hgetall = promisify(cache.hgetall).bind(cache);
const hset = promisify(cache.hset).bind(cache);

exports.realtime = function (server) {
	const socket = io(server);

	subscriber.subscribe('video');
	subscriber.on('message', (channel, message) => {
		//console.log(channel, message);
		if (channel === 'video') {
			socket.emit('status', message);
		}
	});
	socket.on('connection', async s => {
		const videos = await hgetall('video');
		s.emit('all', JSON.stringify(videos));
	});
};

exports.publish = async (user, id, status) => {
	const entry = JSON.stringify({user, id, status});
	await hset('video', user, entry);
	publisher.publish('video', entry);
};

exports.status = {
	EXTRACT: 'extract',
	PROCESS: 'process',
	SAVE: 'save',
	COMPLETE: 'complete'
}
