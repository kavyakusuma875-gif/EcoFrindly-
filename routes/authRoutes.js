const express = require("express");
const router = express.Router();
const User = require("../models/user");

/* ===========================
   LOGIN
=========================== */

router.post("/login", async (req, res) => {

    try {

        console.log("Login API Hit");

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: "User not found"
            });

        }

        if (user.password !== password) {

            return res.status(400).json({
                message: "Invalid password"
            });

        }

        // Daily Login Reward
        const today = new Date();

        if (
            !user.lastLogin ||
            new Date(user.lastLogin).toDateString() !== today.toDateString()
        ) {

            user.streak += 1;

            user.points += 5;

            user.lastLogin = today;

            await user.save();

        }

        res.status(200).json({

            message: "Login Successful",

            user

        });

    }

    catch (error) {

        console.log("LOGIN ERROR:",error);

        res.status(500).json({

            message: "Server Error"

        });

    }

});


/* ===========================
   PROFILE
=========================== */

router.get("/profile/:email", async (req, res) => {

    try {

        const user = await User.findOne({

            email: req.params.email

        });

        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }

        res.json(user);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


/* ===========================
   POINTS
=========================== */

router.get("/points/:email", async (req, res) => {

    try {

        const user = await User.findOne({

            email: req.params.email

        });

        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }

        res.json({

            points: user.points

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


/* ===========================
   LEADERBOARD
=========================== */

router.get("/leaderboard", async (req, res) => {
    try {

        const users = await User.find({})
            .sort({ points: -1 })
            .select("name points");

        res.json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

/* ===========================
   ADD BONUS POINTS
=========================== */

router.post("/addPoints", async (req, res) => {

    try {

        const { email, points } = req.body;

        const user = await User.findOne({

            email

        });

        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }

        user.points += Number(points);

        await user.save();

        res.json({

            message: `${points} Points Added Successfully`

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

/* ===========================
   SIGNUP
=========================== */

router.post("/signup", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "Email already registered"
            });

        }

        const newUser = new User({

            name,
            email,
            password,

            points: 0,

            streak: 0,

            lastLogin: null

        });

        await newUser.save();

        res.status(201).json({

            message: "Account Created Successfully"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

});

module.exports = router;