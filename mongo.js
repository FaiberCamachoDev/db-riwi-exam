const mongoose = require("mongoose");

async function connectMongo() {
    try {
        await mongoose.connect("mongodb://localhost:27017/db_deletionlogs");
        console.log("MongoDB connected :)");
    } catch (err) {
        console.error("Mongo connection error:", err);
        process.exit(1);
    }
};

module.exports = connectMongo;