const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Report = require("../models/Report");

router.get("/stats", async (req, res) => {

    const totalUsers = await User.countDocuments();

    const totalReports = await Report.countDocuments();

    const approvedReports = await Report.countDocuments({
        status: "Approved"
    });

    const users = await User.find();

    const totalPoints = users.reduce((sum, user) => sum + (user.points || 0), 0);

    res.json({
        totalUsers,
        totalReports,
        approvedReports,
        totalPoints
    });

});

module.exports = router;