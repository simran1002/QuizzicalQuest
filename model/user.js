const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'], // Assuming you have these roles
    default: 'user',
  },
});

// Create a User model using the schema
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
