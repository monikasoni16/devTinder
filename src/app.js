const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { authUser } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

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
    try {
        validateSignupData(req);
        const { firstName, lastName, emailId, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send("User added successfully");
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            //create JWT token
            const token = await user.getJwt();

            //Add token to cookie
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
            res.send("Login successful");
        } else {
            throw new Error("Invalid credentials");
        }

    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
})

app.get("/profile", authUser, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
})

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


