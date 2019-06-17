const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid/v4');

const LinkSchema = new Schema({
    firstName: String,
    lastName: String,
    link: {
        type: String,
    },
    salesforce: {
        type: String
    },
    questionnaire: Object,
    email: {
        type: String,
        match: [/.+\@.+\..+/, "Please fill in a valid email address"]
    },
    completed: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// generate uuid link parameter
LinkSchema.pre('save', function (next) {
    this.link = uuid();
    next();
    return null;
});

LinkSchema.set('toJSON', {
    getters: true,
    virtuals: true
});


mongoose.model('Link', LinkSchema);
