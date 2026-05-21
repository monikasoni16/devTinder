const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://sonimonika1692_db_user:bwn7VQCcetR3ma0p@monikanode.li1i8zm.mongodb.net/devTinder"
    );
};

module.exports = connectDB;