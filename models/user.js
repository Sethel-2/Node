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
    }

})

module.exports = mongoose.model('User', userSchema)