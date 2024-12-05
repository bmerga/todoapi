const express = require("express");
const router = express.Router();
const Todo = require("../models/todo");
const { default: mongoose } = require("mongoose");


// Get all todos
router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//create  a new todo

router.post("/", async (req, res) => {
    console.log(req.body);
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


// edit with put and patch

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
        // to send to the database from the backend
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
module.exports = router;