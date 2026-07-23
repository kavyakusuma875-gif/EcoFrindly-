const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// ==========================
// Create uploads folder
// ==========================

const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

// ==========================
// Multer Storage
// ==========================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }

});

const upload = multer({ storage });

// ==========================
// Email Transport
// ==========================

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: "kmanya123@gmail.com",

        pass: "YOUR_GOOGLE_APP_PASSWORD"

    }

});

// ==========================
// ADD REPORT
// ==========================

router.post("/", upload.single("image"), async (req, res) => {

    try {

        console.log("Body:", req.body);
        console.log("File:", req.file);

        // Detect Waste Type Automatically
// Detect Waste Type
let wasteType = "Other";

const title = (req.body.title || "").toLowerCase().trim();

if (title.includes("plastic") || title.includes("bottle")) {
    wasteType = "Plastic";
}
else if (title.includes("paper") || title.includes("newspaper")) {
    wasteType = "Paper";
}
else if (title.includes("food") || title.includes("banana")) {
    wasteType = "Organic";
}
else if (
    title.includes("battery") ||
    title.includes("mobile") ||
    title.includes("electronic")
) {
    wasteType = "E-Waste";
}

// ✅ Create suggestion AFTER wasteType
let suggestion = "";

if (wasteType === "Plastic") {
    suggestion = "🟦 Put this waste in the Blue Recycling Bin.";
}
else if (wasteType === "Paper") {
    suggestion = "📄 Recycle this paper waste.";
}
else if (wasteType === "Organic") {
    suggestion = "🌿 Put this waste in the Green Compost Bin.";
}
else if (wasteType === "E-Waste") {
    suggestion = "🔋 Dispose at an E-Waste Collection Center.";
}
else {
    suggestion = "♻ Dispose of this waste responsibly.";
}

// ✅ Now create report
const newReport = new Report({
    title: req.body.title,
    email: req.body.email,
    location: req.body.location,
    description: req.body.description,
    wasteType: wasteType,
    suggestion: suggestion,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    image: req.file ? req.file.filename : null,
    status: "Pending"
});

        await newReport.save();
        console.log(newReport);

        res.status(201).json({

            message: "Report Submitted Successfully",

            report: newReport

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

});

// ==========================
// GET REPORTS
// ==========================

router.get("/", async (req, res) => {

    try {

        const reports = await Report.find().sort({

            createdAt: -1

        });

        res.json(reports);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

// ==========================
// APPROVE REPORT
// ==========================
// ==========================
// APPROVE REPORT
// ==========================

router.put("/approve/:id", async (req, res) => {

    try {

        const report = await Report.findByIdAndUpdate(

            req.params.id,

            {
                status: "Approved"
            },

            {
                new: true
            }

        );

        if (!report) {

            return res.status(404).json({

                message: "Report not found"

            });

        }

        // Send Email

        await transporter.sendMail({

            from: "kmanya123@gmail.com",

            to: report.email,

            subject: "♻ Waste Report Approved",

            html: `....'

                <h2>Hello ${report.email}</h2>

                <p>Your waste report has been <b style="color:green;">Approved</b>.</p>

                <p>Thank you for helping keep our city clean 🌱</p>

                <hr>

                 <h3>Report Details</h3>

                <p><b>Title:</b> ${report.title}</p>

                <p><b>Location:</b> ${report.location}</p>

                <p><b>Waste Type:</b> ${report.wasteType}</p>

                <p><b>Status:</b> Approved</p>

                 <p><b>Suggestion:</b> ${report.suggestion}</p>

        <br>

        <h3 style="color:green;">🌍 Keep contributing to a cleaner environment!</h3>

            `

        });

        res.json({

            message: "✅ Report Approved Successfully"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

});

// ==========================
// DELETE REPORT
// ==========================

router.delete("/:id", async (req, res) => {

    try {

        const report = await Report.findByIdAndDelete(req.params.id);

        if (!report) {

            return res.status(404).json({

                message: "Report not found"

            });

        }

        res.json({

            message: "🗑 Report Deleted Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

module.exports = router;