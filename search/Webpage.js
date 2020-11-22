const mongoose = require('mongoose');

const Webpage = new mongoose.Schema({
    url: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        unique: false,
        required: true
    },
    title: {
        type: String,
        unique: false,
        required: true
    },
    host: {
        type: String,
        unique: false,
        required: true
    },
    timescrawled: {
        type: Number,
        unique: false,
        required: true,
        default: 0
    },
});

Webpage.index({
    url: 'text',
    description: 'text',
    title: 'text'
});

module.exports = mongoose.model('Webpage', Webpage, "Webpage")