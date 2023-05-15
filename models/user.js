const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String
    },
    passwordHash: {
        required: true,
        min:8,
        max:20,
        type: String
    },
    role:{
        default: "client",
        type: String,
        required: true,
        enum: ["client", "certificator"],
    },
    firstName: {
        required: true,
        type: String,
    },
    lastName: {
        required: true,
        type: String,
    },
    phone: {
        required: true,
        type: String,
    },
    isVerified: {
        default: false,
        type: Boolean,
    },
})

module.exports = mongoose.model('User', userSchema)