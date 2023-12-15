const { configDotenv } = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

//Set Up the Assets Folder
app.use(express.static(path.join(__dirname, 'public')));

// DB Config
// const db = require('./config/keys').MongoURI;
configDotenv();
const db = process.env.MONGO_URI;
// Db Connection from .env file
// const db = process.env.MONGO_URI;

// Connect to MongoDB
if (db !== '[YOUR CONNECTION STRING HERE]') {
  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
}

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/', require('./routes/index.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
