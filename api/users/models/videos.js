var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var videoSchema = new Schema({
    metaData: String,
    path: String,
    plan: String,
    metadata: {
        filename: String,
        fileSize: Number,
        videoSize: [Number, Number],
        frameRate: Number,
        duration: Number
    }
    });

module.exports = videoSchema;
