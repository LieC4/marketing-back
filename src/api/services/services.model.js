const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    serviceTitle: {type: String, require: true},
    serviceDescription: {type: String, require: false},
    serviceSpotify: {type: String, require: false},
    avatar: {type: String, require: false},
    serviceVideo: {type: String, require: false},
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('services', schema);