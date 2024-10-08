const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const Todo = require('./models/Todo'); // Adjust the path if needed
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors(
    {
        origin: ["https://mern-todo-ptv8.vercel.app/"],
        methods: ["POST" , "GET"],
        credentials: true
    }
)); // Enable CORS
app.use(express.json()); // For parsing application/json

mongoose.connect('mongodb://localhost:27017/mern-todo')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Middleware
app.use(express.json()); // For parsing application/json

// Sample route for the root path
app.get('/', (req, res) => {
    res.send('Welcome to the To-Do List API!');
});

// GET /todos: Retrieve all to-do items
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /todos: Add a new to-do item
app.post('/todos', async (req, res) => {
    const todo = new Todo({
        task: req.body.task,
        completed: req.body.completed,
    });

    try {
        const savedTodo = await todo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /todos/:id: Update a specific to-do item
app.put('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        todo.task = req.body.task || todo.task;
        todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /todos/:id: Delete a specific to-do item
app.delete('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
