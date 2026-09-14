const mongoose = require('mongoose');

const setSchema = mongoose.Schema({
  reps: { type: Number, required: true },
  weight: { type: Number, required: true },
});

const exerciseSchema = mongoose.Schema({
  name: { type: String, required: true },
  sets: [setSchema],
});

const workoutSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    name: {
      type: String,
      required: true,
    },
    exercises: [exerciseSchema],
  },
  {
    timestamps: true,
  }
);

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;
