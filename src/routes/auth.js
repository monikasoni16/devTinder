const express = require("express");
const { validateSignupData } = require("../utils/validation");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup user
authRouter.post("/signup", async (req, res) => {
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

// Login user
authRouter.post("/login", async (req, res) => {
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

// Logout user
authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logout successful");
})


module.exports = authRouter;