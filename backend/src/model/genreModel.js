const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String, // Path to the image file
        default: null,
    },
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;