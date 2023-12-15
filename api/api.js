const express = require('express');
const router = express.Router();
const {
  createCountDown,
  deleteCountDown,
  updateCountDown,
  getCountDowns,
  getCountDown,
} = require('../controllers/countdowns');
const {
  getUser,
  deleteUser,
  updateUser,
  createUser,
  loginUser,
} = require('../controllers/users');

router
  .route('/createCountdown/:id')
  .get(getCountDown)
  .post(createCountDown)
  .delete(deleteCountDown)
  .put(updateCountDown);

router
  .route('user/:id')
  .get(getUser)
  .delete(deleteUser)
  .put(updateUser)
  .post(createUser);

router.route('user/login', loginUser);
module.exports = router;
