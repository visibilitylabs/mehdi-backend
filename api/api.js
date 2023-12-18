import express from 'express';
import path from 'path';

let __dirname = path.resolve();
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

import { verifyUser } from './middleware.js';

const router = express.Router();


router.post('/check', (req, res) => {
    try {
        res.send('Healthy!');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});





router.route('/user/login').post(loginUser);
router.route('/user/signup').post(createUser);
router.get('/countdowns/:id', getCountDown);



//  Authentication applied 
router.use(verifyUser);

router
    .route('/countdowns/:id')

.delete(deleteCountDown)
    .put(updateCountDown);

router.route('/countdowns').get(getCountDowns).post(createCountDown)
router.route('/user/:id').get(getUser).delete(deleteUser).put(updateUser);



export default router;