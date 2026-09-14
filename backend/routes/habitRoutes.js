const express = require('express');
const router = express.Router();
const {
  getHabits,
  createHabit,
  checkInHabit,
  deleteHabit,
} = require('../controllers/habitController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getHabits).post(protect, createHabit);
router.route('/:id').delete(protect, deleteHabit);
router.route('/:id/checkin').post(protect, checkInHabit);

module.exports = router;
