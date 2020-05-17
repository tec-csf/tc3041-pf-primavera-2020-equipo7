var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
    path: String,
    instant: Number,
    idVideo: Schema.Types.ObjectId,
    metadata: {
        filename: String, 
        filesize: Number,
        imageSize: [Number, Number]
    }
    });

module.exports = imageSchema;