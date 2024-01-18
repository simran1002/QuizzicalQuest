const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { connectDB } = require("./db/connection");
const User = require('./model/user');

const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the root folder
app.use(express.static(__dirname));

// Check for MongoDB connection errors
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  //   console.log('Connected to MongoDB');
});

// app.get('/login', (req, res) => {
//   // Render the login.html file
//   res.sendFile(__dirname + '/login.html');
// });

app.get('/register', (req, res) => {
    // Render the registration.html file
    res.sendFile(__dirname + '/registration.html');
  });

// Add a new route for registration
app.post('/register', async (req, res) => {
    const { registerEmail, registerPassword } = req.body;

    try {
        // Check if the user with the same email already exists
        const existingUser = await User.findOne({ email: registerEmail });

        if (existingUser) {
            res.status(400).send('User with this email already exists.');
        } else {
            // Create a new user using the User model
            const newUser = new User({ email: registerEmail, password: registerPassword });

            // Save the new user to the database
            await newUser.save();

            res.status(200).send('Registration successful. You can now log in.');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database by email
    const user = await User.findOne({ email, password });

    if (user) {
      // Send success response
      res.json({ success: true });
    } else {
      // Send error response
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
