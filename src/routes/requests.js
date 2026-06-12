const express = require("express");
const requestRouter = express.Router();
const { authUser } = require("../middlewares/auth");

requestRouter.post("/sendConnectRequest", authUser, async (req, res) => {
    const user = req.user;
    console.log("Sending connect request");
    res.send(user.firstName + " sent connection request");
})

module.exports = requestRouter;