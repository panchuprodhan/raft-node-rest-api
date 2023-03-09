const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true
    },
    released_on: {
        required: true,
        type: Date,
        trim: true
    }
})

module.exports = mongoose.model('Movie', MovieSchema);