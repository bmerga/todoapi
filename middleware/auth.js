const jwt = require("jsonwebtoken");
const User = require( "../models/user")

const auth = async (req, res, next) => {
try {
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();
    if(!token) {
        return res.status(401).json({ message: "Invalid token" }); 
    }
    const decoded = jwt.verify
        (token, 
        process.env.JWT_SECRET) 
const user = await User.findById(decoded.userId);
if(!user) {
    return res.status(401).json({ message: "User not found" });
}
req.user = user;
req.token = token;
next();
} catch (error) {
    
    res.status(401).json({message: "Please re login"});
}
};

module.exports = auth;