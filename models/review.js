const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    rating:{
        type:Number,
        required:true
    },

    feedback:{
        type:String,
        required:true
    }

},{
    timestamps:true
});

module.exports = mongoose.model("review", reviewSchema);