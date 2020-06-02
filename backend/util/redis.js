const { promisify } = require('util');

const redis = require('redis').createClient();

exports.hset = promisify(redis.hset).bind(redis);
exports.hgetall = promisify(redis.hgetall).bind(redis);
exports.hdel = promisify(redis.hdel).bind(redis);
