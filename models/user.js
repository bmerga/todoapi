const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// bcrypt used to encrypt or change ur password before saving

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email Invalid"],
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        default: "level_one_user",
        enum: ["admin", "level_one_user", "level_two_user"],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
})

userSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt);
        next()
    } catch (error) {
        next(error);
    }
    
})
userSchema.methods.comparePasswords = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model("User", userSchema)