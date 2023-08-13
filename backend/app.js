const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
const app = express(); // Create the Express app
const Users = require('./models/Users');
const Recipe = require('./models/Recipe'); // Import the Recipe Model


// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Set up session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// User registration endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

// User login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if the password matches
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Store user ID in the session to maintain the user's login status
        req.session.userId = user._id;

        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Create a POST endpoint to add a new recipe
app.post('/recipes', async (req, res) => {
    try {
      // Get the recipe data from the request body
      const { title, ingredients, instructions } = req.body;
  
      // Create a new recipe using the Recipe model
      const newRecipe = new Recipe({
        title,
        ingredients,
        instructions,
      });
  
      // Save the new recipe to the database
      const savedRecipe = await newRecipe.save();
  
      res.status(201).json(savedRecipe);
    } catch (error) {
      console.error('Error adding recipe:', error);
      res.status(500).json({ error: 'Failed to add recipe.' });
    }
  });


