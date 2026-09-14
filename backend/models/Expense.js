const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      default: 'expense',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
