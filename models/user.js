const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
        default : 'users',
    },
    age:{
        type: Number,
    },
    gender:{
        type: String,
    },
    blood:{
        type: String,
    },
    weight:{
        type: Number,
    },
    height:{
        type: Number,
    },
    allergies:{
        type: String,
    },
    meds:{
        type: String,
    },
    bpul:{
        type: Number,
    },
    bpll:{
        type: Number,
    },
    hrul:{
        type: Number,
    },
    hrll:{
        type: Number,
    },
    boul:{
        type: Number,
    },
    boll:{
        type: Number,
    },
    btul:{
        type: Number,
    },
    btll:{
        type: Number,
    },
    bsul:{
        type: Number,
    },
    bsll:{
        type: Number,
    },
})

const User = mongoose.model('User', userSchema);

module.exports = User;