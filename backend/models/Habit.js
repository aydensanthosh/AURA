const mongoose = require('mongoose');

const habitSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    checkIns: [
      {
        type: Date,
      }
    ],
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Habit = mongoose.model('Habit', habitSchema);
module.exports = Habit;
