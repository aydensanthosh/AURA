const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      }
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.index({ title: 'text', body: 'text' });

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
