const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.get("/user", async (req, res) => {
    try {
        const user = await User.find({ emailId: req.body.emailId });
        if (!user) {
            return res.status(404).send("User not found");
        } else {
            res.send(user);
        }
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
});

// Get all users for feed
app.get("/feed", async (req, res) => {

    try {
        const users = await User.find({});
        if (users.length === 0) {
            return res.status(404).send("No users found");
        } else {
            res.send(users);
        }
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
})

// Signup user
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

// Delete user
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findOneAndDelete(userId);
        if (!user) {
            return res.status(404).send("User not found");
        } else {
            res.send("User deleted successfully");
        }
    } catch (error) {
        res.status(400).send("Error deleting user" + error.message);
    }
});

// Update user details
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = ["password", "age", "gender", "photoUrl", "about", "skills"];
        const isUpdateAllowd = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowd) {
            throw new Error("Update not allowed");
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            runValidators: true,
        });
        res.send("User updated successfully");

    } catch (error) {
        res.status(400).send("Error updating user: " + error.message);
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


