require("dotenv").config();
const mongoose = require("mongoose");
const models = require("./models");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/kanak_digifex_project_mart";

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB database successfully");
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
    });

console.log("DB MONGO URI:", MONGODB_URI);

module.exports = models;