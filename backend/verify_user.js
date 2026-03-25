require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("Connected to MongoDB!");
        const db = mongoose.connection.db;
        const result = await db.collection('users').updateOne(
            { email: "anjankumarln120@gmail.com" },
            { $set: { isVerified: true } }
        );
        console.log("Modified count:", result.modifiedCount);
        process.exit(0);
    })
    .catch(err => {
        console.error("Connection error:", err);
        process.exit(1);
    });
