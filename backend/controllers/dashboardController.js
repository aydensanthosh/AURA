//All models from MongoDB
const Task = require('../models/Task');
const Habit = require('../models/Habit');
const Expense = require('../models/Expense');
const Note = require('../models/Note');
const Workout = require('../models/Workout');
const mongoose = require('mongoose');

// @desc    Get dashboard summary
// @route   GET /api/dashboard
// @access  Private
const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Pending Tasks
    const tasksDueToday = await Task.countDocuments({
      userId,
      status: 'pending',
    });

    // Active Habit Streaks
    const activeHabits = await Habit.find({ userId });
    const activeStreaksCount = activeHabits.filter(h => h.currentStreak > 0).length;

    // Monthly Finances (Aggregation)
    const monthlyFinancesResult = await Expense.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: firstDayOfMonth },
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        }
      }
    ]);
    
    let monthlyIncome = 0;
    let monthlySpend = 0;
    
    monthlyFinancesResult.forEach(f => {
      if (f._id === 'income') monthlyIncome = f.total;
      else monthlySpend += f.total; // Default to expense for anything else/null
    });
    
    const netBalance = monthlyIncome - monthlySpend;

    // Expense Breakdown (Aggregation for Chart)
    const expenseBreakdown = await Expense.aggregate([
      {
        $match: {
          userId: userId,
          type: { $ne: 'income' } // Include 'expense' and null (old records)
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Top 3 most recent notes
    const recentNotes = await Note.find({ userId })
      .sort({ date: -1, createdAt: -1, _id: -1 })
      .limit(3)
      .lean();

    // Weekly Workout Summary
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyWorkouts = await Workout.countDocuments({
      userId,
      date: { $gte: oneWeekAgo },
    });

    res.json({
      tasksDueToday,
      activeStreaksCount,
      monthlyIncome,
      monthlySpend,
      netBalance,
      expenseBreakdown,
      recentNotes,
      weeklyWorkouts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
};
