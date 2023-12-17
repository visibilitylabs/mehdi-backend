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

import { verifyUser } from './middleware.js';

const router = express.Router();

router.post('/check', verifyUser, (req, res) => {
  try {
    res.send('Healthy!');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.route('/user/login').post(loginUser);
router.route('/user/signup').post(createUser);

router.use(verifyUser);
router
  .route('/countdown/:id')
  .get(getCountDown)
  .post(createCountDown)
  .delete(deleteCountDown)
  .put(updateCountDown);
router.route('/countdowns').get(getCountDowns);
router.route('/user/:id').get(getUser).delete(deleteUser).put(updateUser);

export default router;
