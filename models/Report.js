const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    image: {
        type: String,
        default: null
    },

    status: {
        type: String,
        default: "Pending"
    },

    // Google Maps Coordinates
    latitude: {
        type: Number,
        default: null
    },

    longitude: {
        type: Number,
        default: null
    },

    wasteType: {
    type: String,
    default: "Other"
},


    suggestion:{
    type:String,
    default:""
},
    

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Report", reportSchema);