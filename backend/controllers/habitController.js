const Habit = require('../models/Habit');
const { calculateStreak } = require('../utils/streakCalculator');

// @desc    Get all habits
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ userId: req.user._id });
    res.json(habits);
  } catch (error) {
    next(error);
  }
};

// @desc    Create habit
// @route   POST /api/habits
// @access  Private
const createHabit = async (req, res, next) => {
  try {
    const { name } = req.body;

    const habit = await Habit.create({
      userId: req.user._id,
      name,
    });

    res.status(201).json(habit);
  } catch (error) {
    next(error);
  }
};

// @desc    Check in a habit
// @route   POST /api/habits/:id/checkin
// @access  Private
const checkInHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      res.status(404);
      throw new Error('Habit not found');
    }

    if (habit.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hasCheckedInToday = habit.checkIns.some(
      (checkIn) => new Date(checkIn).setHours(0, 0, 0, 0) === today.getTime()
    );

    if (hasCheckedInToday) {
      res.status(400);
      throw new Error('Already checked in today');
    }

    habit.checkIns.push(new Date());

    const { currentStreak, longestStreak } = calculateStreak(habit.checkIns);
    habit.currentStreak = currentStreak;
    habit.longestStreak = longestStreak;

    await habit.save();

    res.json(habit);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      res.status(404);
      throw new Error('Habit not found');
    }

    if (habit.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await habit.deleteOne();
    res.json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHabits,
  createHabit,
  checkInHabit,
  deleteHabit,
};
