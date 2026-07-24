const express = require("express");

const router = express.Router();

const Review = require("../models/review");

// =======================
// ADD REVIEW
// =======================

router.post("/", async(req,res)=>{

    try{

        const review = new Review(req.body);

        await review.save();

        res.json({

            message:"⭐ Thank you for your feedback!"

        });

    }

    catch(err){

        res.status(500).json({

            message:err.message

        });

    }

});


// =======================
// GET REVIEWS
// =======================

router.get("/", async(req,res)=>{

    try{

        const reviews = await Review.find().sort({

            createdAt:-1

        });

        res.json(reviews);

    }

    catch(err){

        res.status(500).json({

            message:err.message

        });

    }

});

module.exports = router;