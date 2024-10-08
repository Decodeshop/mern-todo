import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editTodoId, setEditTodoId] = useState(null);
    const [editTodoValue, setEditTodoValue] = useState('');

    // Base URL for API
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // Fetch todos from the server
    const fetchTodos = async () => {
        try {
            const response = await axios.get(`${API_URL}/todos`);
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    // Add a new todo
    const addTodo = async () => {
        if (!newTodo) return; // Prevent adding empty tasks

        try {
            const response = await axios.post(`${API_URL}/todos`, {
                task: newTodo,
                completed: false,
            });
            setTodos([...todos, response.data]); // Update the state
            setNewTodo(''); // Clear input field
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    // Update a todo
    const updateTodo = async (id) => {
        const todoToUpdate = todos.find(todo => todo._id === id);
        const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed }; // Toggle completed status

        try {
            const response = await axios.put(`${API_URL}/todos/${id}`, updatedTodo);
            setTodos(todos.map(todo => (todo._id === id ? response.data : todo))); // Update the state
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    // Edit a todo
    const editTodo = async () => {
        if (!editTodoValue) return; // Prevent updating to empty task

        try {
            const response = await axios.put(`${API_URL}/todos/${editTodoId}`, {
                task: editTodoValue,
                completed: false,
            });
            setTodos(todos.map(todo => (todo._id === editTodoId ? response.data : todo))); // Update the state
            setEditTodoValue(''); // Clear input field
            setEditTodoId(null); // Reset edit state
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    // Delete a todo
    const deleteTodo = async (id) => {
        try {
            await axios.delete(`${API_URL}/todos/${id}`); // Send DELETE request
            setTodos(todos.filter(todo => todo._id !== id)); // Remove the deleted todo from the state
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <div>
            <h1>To-Do List</h1>
            <input 
                type="text" 
                value={newTodo} 
                onChange={(e) => setNewTodo(e.target.value)} 
                placeholder="Add a new task" 
            />
            <button onClick={addTodo}>Add</button>

            <ul>
                {todos.map(todo => (
                    <li key={todo._id}>
                        {editTodoId === todo._id ? (
                            <>
                                <input 
                                    type="text" 
                                    value={editTodoValue} 
                                    onChange={(e) => setEditTodoValue(e.target.value)} 
                                    placeholder="Edit task" 
                                />
                                <button onClick={editTodo}>Update</button>
                            </>
                        ) : (
                            <>
                                <span 
                                    style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                                    onClick={() => updateTodo(todo._id)}
                                >
                                    {todo.task}
                                </span>
                                <button onClick={() => { setEditTodoId(todo._id); setEditTodoValue(todo.task); }}>Edit</button>
                                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoApp;
