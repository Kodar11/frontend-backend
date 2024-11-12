// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import Tasks from './components/Tasks';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        // Optional: If there's a token, you might want to set it in localStorage
        if (token) {
            localStorage.setItem('token', token);
        }
    }, [token]);

    return (
        <Router>
            <NavBar token={token} setToken={setToken} />
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to login */}
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tasks" element={<Tasks token={token} />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;
