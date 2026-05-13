const express = require("express");

const app = express();

app.use("/test", (req, res) => {
    res.send("Hello from test path");
})

app.use("/", (req, res) => {
    res.send("Hello from main dashboard");
})

app.use((req, res) => {
    res.send("Hello from server");
})

app.listen(3000, () => {
    console.log("server listeing on 3000...");
});

