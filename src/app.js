const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Virat",
        lastName: "Kohli",
        emailId: "virat@kohli.com",
        password: "virat123",
        age: 34,
        gender: "Male"
    });

    try {
        await user.save();
        res.send("User added successfully");
    } catch (error) {
        res.status(400).send("Error adding user" + error.message);
    }
});

connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
        console.log("server listening on 7777...");
    });
}).catch((err) => {
    console.error("Database cannot be connected");
});


