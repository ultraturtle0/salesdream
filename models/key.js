const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const KeySchema = new Schema({
    sub: {
        type: String,
        required: true
    },
    scopes: [{
        type: String,
        default: []
    }],
    token: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Key', KeySchema);
