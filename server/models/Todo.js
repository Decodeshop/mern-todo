const mongoose = require('mongoose');

// Define the Todo schema
const TodoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: [true, 'Task is required.'],
        minlength: [3, 'Task must be at least 3 characters long.'],
        maxlength: [100, 'Task cannot exceed 100 characters.'],
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, { 
    timestamps: true // Automatically creates `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('Todo', TodoSchema);
