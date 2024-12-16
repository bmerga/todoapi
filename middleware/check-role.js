// Middleware
const checkRole = (...roles) => {
    return (req, res, next) => {
        if(!req.user){
        return res.status(401).json({message: "unauthorized"});
            }
        if(!roles.includes(req.user.role)){
         return res.status(403).json({message:"Insufficient permission"})
            }
        next();
        };
    };
module.exports = checkRole;