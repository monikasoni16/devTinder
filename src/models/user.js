const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter strong password");
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Invalid gender");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo URL");
            }
        }
    },
    about: {
        type: String,
        default: "Hey there! I am using DevTinder.",
    },
    skills: {
        type: [String],
    },
},
    {
        timestamps: true
    }
);

userSchema.methods.getJwt = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "Dev@tinder$123", { expiresIn: "1h" });
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputbyUser) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordInputbyUser, user.password);
    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);
