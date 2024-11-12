const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./config/dbConnect');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/User');
const taskRoutes = require('./routes/Task');
const cors = require('cors');

app.use(cors());

const PORT = process.env.PORT || 3000; 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to database');
  }
});

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {   
    console.log(`Server is running on port ${PORT}`);
});

/*
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    dueDate DATE,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

*/