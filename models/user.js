const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    points: {
        type: Number,
        default: 0
    },

    streak: {
        type: Number,
        default: 0
    },

    lastLogin: {
        type: Date,
        default: null
    }

});

module.exports = mongoose.model("User", UserSchema);