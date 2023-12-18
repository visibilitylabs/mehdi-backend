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

router.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

router.post('/api/check', verifyUser, (req, res) => {
  try {
    res.send('Healthy!');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.route('/api/user/login').post(loginUser);
router.route('/api/user/signup').post(createUser);
router.get('/api/countdown/:id', getCountDown);

router.use(verifyUser);
router
  .route('/api/countdown/:id')
  .post(createCountDown)
  .delete(deleteCountDown)
  .put(updateCountDown);
router.route('/api/countdowns').get(getCountDowns);
router.route('/api/user/:id').get(getUser).delete(deleteUser).put(updateUser);

export default router;
