const express = require("express");
const router = express.Router();
const Todo = require("../models/todo");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
// mongoose is used to interact with the database
const UserService = require("../services/user-service");

// Get all todos
router.get("/", auth, async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//create a new todo 

router.post("/", async (req, res) => {
    
    const todo = new Todo({
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed
    })
    try {
         const newTodo = await todo.save();
         res.status(201).json(newTodo);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
   })

   // get todo by id

   router.get("/:_id", async (req, res) => {
    
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params._id)) {
                res.status(400).json({message:"Invalid Id Found"})
        }
        
        const todo = await Todo.findById(req.params._id);
        if(todo){
            res.json(todo)
        }
        else{
            res.status(404).json({message:"Todo Not Found"});
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
   })


// edit with put (to replace the whole with new) and 
// patch (to replace the part and keep the remaining)

router.patch("/:_id", async (req, res) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params._id)) {
            res.status(400).json({message:"Invalid Id Found"})
        }
        const todo = await Todo.findById(req.params._id);
        if(req.body.title !==null){
            todo.title = req.body.title;
        }
        if (req.body.description !==null){
            todo.description = req.body.description;
        }
        if(req.body.completed !==null){
            todo.completed = req.body.completed;
        }
        // to send to the data to the database
        const updatedTodo = await todo.save()
        res.json(updatedTodo)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// Delete
router.delete("/:_id", async (req, res) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params._id)) {
            res.status(400)({message:"Invalid Id Found"})
        }
        const todo = await Todo.findById(req.params._id);
    await todo.deleteOne()
    res.json({message: "Delete succesfull"});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
    
})
const userService = new UserService();
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
(async ()=>{
    try {
        await userService.connect()
        console.log("userService is connected to the database")
    } catch (error) {
        console.error("connection fail")
        process.exit(1)
    }
    
})();
router.post("/fancy_user", 
    asyncHandler( async (req, res) =>{
    const user = await userService.createUser(req.body)
    res.status(201).json({
        sucess: true,
        data: user,
    });
}))
module.exports = router;