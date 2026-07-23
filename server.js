const express = require("express");
console.log("🔥 SERVER STARTING...");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const reviewRoutes=require("./routes/reviewRoutes");

const app = express();



// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/reviews", reviewRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname)));

// Routes
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews",reviewRoutes);

// MongoDB Connection
mongoose.connect("mongodb+srv://contactmanager:kavya123@contact-manager-cluster.qzgr4qu.mongodb.net/waste_management")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
// Test route (VERY IMPORTANT for debugging)
app.get("/", (req, res) => {
    res.send("Server is working");
});

// Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("🔥 SERVER FILE STARTED");
});