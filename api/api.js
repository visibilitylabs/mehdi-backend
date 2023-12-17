import express from 'express';
import {
    createCountDown,
    deleteCountDown,
    updateCountDown,
    getCountDowns,
    getCountDown,
} from '../controllers/countdowns.js';
import {
    getUser,
    deleteUser,
    updateUser,
    createUser,
    loginUser,
} from '../controllers/users.js';

const router = express.Router();

router
    .route('/countdown/:id')
    .get(getCountDown)
    .post(createCountDown)
    .delete(deleteCountDown)
    .put(updateCountDown);

router.route('/countdowns').get(getCountDowns);
router
    .route('/user/:id')
    .get(getUser)
    .delete(deleteUser)
    .put(updateUser)
    .post(createUser);

router.route('/user/login').post(loginUser);
router.route('/user/signup').post(createUser);

export default router;