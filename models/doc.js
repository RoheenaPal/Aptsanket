const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({
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
        default : 'doctors',
    },
})

const Doctor = mongoose.model('Doctor', docSchema);

module.exports = Doctor;