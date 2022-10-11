const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    customerName: {type: String, require: true},
    customerDescription: {type: String, require: false},
    avatar: {type: String, require: false},
    company: {type: String, required: false},
    location: {type: String, required: false},
    website: {type: String, required: false},
    twitter: {type: String, required: false},
    linkedin: {type: String, required: false},
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('customers', schema);