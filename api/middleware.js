import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const verifyUser = (req, res, next) => {
    const {
        authorization, // Bearer <token>
    } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'You must be logged in.' });
    }

    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_SECRET, async(err, payload) => {
        if (err) {
            return res.status(401).json({ error: 'You must be logged in.' });
        }

        const { userId } = payload;

        const user = await User.findById(userId);
        req.user = user;
        next();
    });
};

export { verifyUser };