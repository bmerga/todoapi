const express = require("express");
const router = express.Router();
const User = require("../models/user");
const checkRole = require("../middleware/check-role");
const auth = require("../middleware/auth")
;

router.post("/create-admin", auth, checkRole("admin"), async(req, res)=>{
    try {
        const existingUser = await User.findOne ({
            email: req.body.email,
            });
        if (existingUser) {
            return res.status(400).json({message:"Email already used"});
        }

        const role = req.body.role || "level-one_user";
        if (role === "admin") {
            return res.status(403).json({
                message: "Cannot create as admin user through signup endpoint",
            });
        }
        const user = new User ({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            role: "admin"
        });
        await user.save();
        res.status(201).json({
           message:"admin user created succesfully",
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        },
    });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.patch("/users/:id/role", auth, checkRole("admin"), async(req, res)=>{
    console.log(req, "rr")
    try {
        const user = await User.findById(req.params.id);
        const isRoleValid = ["admin", "level_one_user", "level_two_user"].includes(
            req.body.role
        );
        if (!req.body.role || !isRoleValid) {
            return res.status(400).json({message: "Invalid role"});
            }

        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        user.role = req.body.role
        await user.save();
        res.json({
            message: "Updated role succesfully",
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        });
     } catch (error) {
            res.status(500).json({message: error.message, user:user});
        }
    });

    router.post("/create-first-admin", auth, async (req, res) => {
        try {
            const existingUser = await User.findOne({
                email: req.body.email,
            })
            if (existingUser) {
                return res.status(400).json({message: "Email already used"});
            }

            const adminAlreadyExists = await User.findOne({role: "admin"});
            if (adminAlreadyExists) {
                return res.status(403).json({message:"Admin already exists"});
            }
            
            const user = new User({
               firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                role: "admin"
            });
            await user.save();
            res.status(201).json({
                message: "first admin user created succesfully",
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                },
            });
        } catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    });

module.exports = router