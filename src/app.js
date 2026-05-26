const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());
app.post("/signup", async (req, res) => {
    console.log(req.body);
    const user = new User(req.body);

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


