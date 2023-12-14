const express = require('express');
const router = express.Router();

router
  .route('/createCountdown/:id')
  .get(() => {})
  .delete(() => {})
  .put(() => {});

router
  .route('user/:id')
  .get(() => {})
  .delete(() => {})
  .put(() => {});

module.exports = router;
