const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
// jsonwebtoken is used to generate a token

// 1. Signup
router.post("/signup", async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already used" });
        }

const role = req.body.role || "level_one_user";
        if(role==="admin"){
            return res.status(403).json({message:"Cannot create an admin user through signup end point"})
        }

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password, 
        });

        await user.save();
        res.status(201).json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// 2. Signin
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body; 
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password); 
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "24h" }
        );

        res.json({
            jwt: token,
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

module.exports = router;