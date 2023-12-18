import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';

const verifyUser = (req, res, next) => {
    const {
        authorization, // Bearer <token>
    } = req.headers;
    console.log('authorization', authorization);
    if (!authorization) {
        return res.status(401).json({ error: 'You must be logged in.' });
    }

    const token = authorization.replace('Bearer', '').trim();


    jwt.verify(token, process.env.JWT_SECRET, async(err, payload) => {
        console.log(err);
        if (err) {
            return res.status(401).json({ error: 'You must be logged in.' });
        }

        const { userId } = payload;

        const user = await User.findById(userId);


        console.log(user)
        req.user = user;
        next();
    });
};

export { verifyUser };