const { Schema, model } = require('mongoose');

const link = new Schema({
    originalLink: String,
    shortLink: String
});

module.exports = model('Link', link);
