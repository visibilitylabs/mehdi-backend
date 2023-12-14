const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
