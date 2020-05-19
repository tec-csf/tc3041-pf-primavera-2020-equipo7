var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var videoSchema = new Schema({
    path: String,
    plan: String,
    //fr ?
    metadata: {
        filename: String,
        fileSize: Number,
        videoSize: [Number, Number],
        frameRate: Number,
        duration: Number
    }
    });

module.exports = videoSchema;
