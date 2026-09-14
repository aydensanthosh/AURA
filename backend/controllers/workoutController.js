const Workout = require('../models/Workout');

// @desc    Get workouts
// @route   GET /api/workouts
// @access  Private
const getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    next(error);
  }
};

// @desc    Create workout
// @route   POST /api/workouts
// @access  Private
const createWorkout = async (req, res, next) => {
  try {
    const { name, date, exercises } = req.body;

    const workout = await Workout.create({
      userId: req.user._id,
      name,
      date: date || Date.now(),
      exercises: exercises || [],
    });

    res.status(201).json(workout);
  } catch (error) {
    next(error);
  }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private
const updateWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      res.status(404);
      throw new Error('Workout not found');
    }

    if (workout.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedWorkout);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      res.status(404);
      throw new Error('Workout not found');
    }

    if (workout.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await workout.deleteOne();
    res.json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
};
