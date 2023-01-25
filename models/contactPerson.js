const mongoose = require('mongoose');

const contactPersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Username cannot be blank'],
    },
    username: {
        type: String,
        required: [true, 'Email cannot be blank'],
        unique: true,

    },
    password: {
        type: String,
        lowercase: [true, 'Password cannot be blank'],
    },
    role: {
        type: String,
        default : 'contactpeople',
    },
})

const ContactPerson = mongoose.model('ContactPerson', contactPersonSchema);

module.exports = ContactPerson;