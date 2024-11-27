const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/app', )
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Define a User model
const User = mongoose.model('users', {
    name: String,
    email: String,
    phone: String,
    dob: String,
    username: String,
    password: String,
});

// Create Account Route
app.post('/create', async (req, res) => {
    try {
        const { name, email, phone, dob, username, password } = req.body;

        // Validate the request body
        if (!name || !email || !phone || !dob || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check for existing user
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Save new user
        const newUser = new User({ name, email, phone, dob, username, password });
        await newUser.save();

        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        console.error('Error in /create route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate the request body
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Find user in the database
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error in /login route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
