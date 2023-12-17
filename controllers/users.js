import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const createUser = async(req, res) => {
    const { email, password, name } = req.body;
    const newUser = new User({
        email,
        password,
        name,
    });
    try {
        const user = await newUser.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginUser = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(422).json({ error: 'Invalid Email or password' });
        }
        const doMatch = user.password === password; // await bcrypt.compare(password, user.password);

        if (doMatch) {
            // res.json({ message: 'Successfully signed in' });
            const token = jwt.sign({ _id: user._id, userId: user._id },
                process.env.JWT_SECRET,
            );
            const { _id, name, email } = user;
            res.json({ token, user: { _id, name, email } });
        } else {
            return res.status(422).json({ error: 'Invalid Email or password' });
        }
    } catch (err) {}
};

const getUsers = async(req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUser = async(req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async(req, res) => {
    const { id } = req.params;
    const { email, password, name } = req.body;
    const updatedUser = {
        email,
        password,
        name,
    };

    try {
        const user = await User.findByIdAndUpdate(id, updatedUser);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async(req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndRemove(id);
        res.json(deletedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    loginUser,
};