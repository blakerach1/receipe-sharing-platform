// models/Recipe.js

const mongoose = require('mongoose');

// Define the schema for the recipe
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
});

// Create the 'Recipe' model using the schema
const Recipe = mongoose.model('Recipe', recipeSchema);

// Export the model to be used in other files
module.exports = Recipe;
