const express = require("express");
const requestRouter = express.Router();
const { authUser } = require("../middlewares/auth");
const User = require("../models/user");

const ConnectionRequest = require("../models/connectionRequest");
requestRouter.post("/request/send/:status/:toUserId", authUser, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ['ignored', 'interested'];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type." + status });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found." });
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [{ fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }],
        });

        if (existingConnectionRequest) {
            return res.status(400).send("Connection request already exists.");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await connectionRequest.save();
        res.json({ message: `${req.user.firstName} sent ${status} request to ${toUser.firstName}`, data });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
    //res.send(user.firstName + " sent connection request");
})

module.exports = requestRouter;