import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import router from './api/api.js';
import morgan from 'morgan';
import apiErrorHandler from './api/lib/index.js';
import bodyParser from 'body-parser';

let __dirname = path.resolve();

const app = express();

app.use(express.static(path.join(__dirname, 'frontend/build')));

dotenv.config();
const db = process.env.MONGO_URI;

if (db !== '[YOUR CONNECTION STRING HERE]') {
    mongoose
        .connect(db, { useNewUrlParser: true })
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.log(err));
}

app.use(cors('*'));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

app.use('/api', router);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});


// Write the not found handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'Resource not found' });
});

app.use(apiErrorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));