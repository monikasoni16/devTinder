const express = require("express");
const profileRouter = express.Router();
const { authUser } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", authUser, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
})

profileRouter.patch("/profile/edit", authUser, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid edit request");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((field) => {
            loggedInUser[field] = req.body[field];
        });
        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName} your profile updated successfully`,
            data: loggedInUser,
        });
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
})

module.exports = profileRouter;