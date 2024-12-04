const express = require("express");
const router = express.Router();
const Todo = require("../models/todo");


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

module.exports = router;