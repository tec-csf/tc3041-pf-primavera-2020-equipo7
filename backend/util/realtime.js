const { hset, hdel } = require('./redis');
const io = require('socket.io');

const status = {
	EXTRACT: 'extract',
	PROCESS: 'process',
	SAVE: 'save',
	COMPLETE: 'complete'
};
let socket;

exports.realtime = function (server) {
	socket = io(server);
	
	socket.sockets.on('connection', async s => {
		s.on('join', uid => {
			console.log(`User ${uid} is connected.`);
			s.join(uid);
		});
	});
};

exports.publish = async (user, id, videoStatus) => {
	const entry = JSON.stringify({user, id, status: videoStatus});

	socket.to(user).emit('status', entry);

	if (videoStatus === status.COMPLETE) {
		await hdel(user, id);
	} else {
		await hset(user, id, entry);
	}
};

exports.status = status;
