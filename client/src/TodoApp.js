import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoApp.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrashAlt , faEdit } from '@fortawesome/free-solid-svg-icons';

const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editTodoId, setEditTodoId] = useState(null);
    const [editTodoValue, setEditTodoValue] = useState('');

    // Fetch todos from the server
    const fetchTodos = async () => {
        try {
            const response = await axios.get('https://mern-todo-rosy-eight.vercel.app/');
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    // Add a new todo
    const addTodo = async (e) => {
        e.preventDefault(); // Prevent page refresh
        if (!newTodo) return; // Prevent adding empty tasks

        try {
            const response = await axios.post('https://mern-todo-rosy-eight.vercel.app/', {
                task: newTodo,
                completed: false,
            });
            setTodos([...todos, response.data]); // Add the new todo to the list
            setNewTodo(''); // Clear the input
        } catch (error) {
            console.error('Error adding todo:', error);
            alert('Failed to add todo: ' + error.message); // Show an alert for error
        }
    };

    // Toggle completed status
    const toggleComplete = async (id) => {
        try {
            const todoToUpdate = todos.find(todo => todo._id === id);
            const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed }; // Toggle completed status

            const response = await axios.put(`https://mern-todo-rosy-eight.vercel.app/${id}`, updatedTodo);
            setTodos(todos.map(todo => (todo._id === id ? response.data : todo))); // Update the state
        } catch (error) {
            console.error('Error updating todo:', error);
            alert('Failed to update todo: ' + error.message);
        }
    };

    // Start editing a todo
    const startEdit = (id, task) => {
        setEditTodoId(id);
        setEditTodoValue(task);
    };

    // Update a todo
    const updateTodo = async (e) => {
        e.preventDefault(); // Prevent page refresh
        if (!editTodoValue) return; // Prevent updating to empty task

        try {
            const response = await axios.put(`https://mern-todo-rosy-eight.vercel.app/${editTodoId}`, {
                task: editTodoValue,
                completed: false,
            });

            setTodos(todos.map(todo => (todo._id === editTodoId ? response.data : todo))); // Update the state
            setEditTodoId(null); // Hide the update form after successful update
            setEditTodoValue(''); // Clear edit input
        } catch (error) {
            console.error('Error updating todo:', error);
            alert('Failed to update todo: ' + error.message);
        }
    };

    // Delete a todo
    const deleteTodo = async (id) => {
        try {
            await axios.delete(`https://mern-todo-rosy-eight.vercel.app/${id}`); // Send DELETE request
            setTodos(todos.filter(todo => todo._id !== id)); // Remove the deleted todo from the state
        } catch (error) {
            console.error('Error deleting todo:', error);
            alert('Failed to delete todo: ' + error.message);
        }
    };

    // Fetch todos when the component mounts
    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div>
            
            <h1>OOAD Assignment</h1>
            <h2>Daniyal (14735)</h2>
            <h1>mern-TO DO</h1>
            <form onSubmit={addTodo}>
                <input
                    type="text"
                    placeholder="Add a new task"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <button type="submit">Add Todo</button>
            </form>

            {editTodoId && ( // Only show the update form if there's an editTodoId
                <form onSubmit={updateTodo}>
                    <input
                        type="text"
                        placeholder="Edit task"
                        value={editTodoValue}
                        onChange={(e) => setEditTodoValue(e.target.value)}
                    />
                    <button type="submit">Update Todo</button>
                </form>
            )}

            <ul>
                {todos.map((todo) => (
                    <li key={todo._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                            {todo.task}
                        </span>
                        <span style={{ marginLeft: '10px' }}>
                            <FontAwesomeIcon
                                icon={faCheck}
                                onClick={() => toggleComplete(todo._id)}
                                style={{ cursor: 'pointer', color: 'green' }}
                            />
                            <FontAwesomeIcon
                                 icon={faEdit}
                                onClick={() => startEdit(todo._id, todo.task)}
                                style={{ cursor: 'pointer', color: 'blue', marginLeft: '10px' }}
                            />
                            <FontAwesomeIcon
                                icon={faTrashAlt}
                                onClick={() => deleteTodo(todo._id)}
                                style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }}
                            />
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoApp;
