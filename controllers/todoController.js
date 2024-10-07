const Todo = require('../models/Todo');

// Create a new to-do
exports.createTodo = async (req, res) => {
    const { task } = req.body;
    try {
        const newTodo = new Todo({
            task
        });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create to-do' });
    }
};

// Get all to-dos
exports.getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch to-dos' });
    }
};

// Update a to-do
exports.updateTodo = async (req, res) => {
    const { id } = req.params;
    const { task, completed } = req.body;
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(id, { task, completed }, { new: true });
        res.status(200).json(updatedTodo);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update to-do' });
    }
};

// Delete a to-do
exports.deleteTodo = async (req, res) => {
    const { id } = req.params;
    try {
        await Todo.findByIdAndDelete(id);
        res.status(200).json({ message: 'To-do deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete to-do' });
    }
};
