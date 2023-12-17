import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import { verifyUser } from './api/middleware.js';
import router from './api/api.js';
import bodyParser from 'body-parser';

let __dirname = path.resolve();

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser({ limit: '50mb' }));
dotenv.config();
const db = process.env.MONGO_URI;

if (db !== '[YOUR CONNECTION STRING HERE]') {
    mongoose
        .connect(db, { useNewUrlParser: true })
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.log(err));
}

app.use(cors('*'));

app.use(express.urlencoded({ extended: true }));;
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

app.use('/', router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));