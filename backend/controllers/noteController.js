const Note = require('../models/Note');

// @desc    Get notes for user
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res, next) => {
  try {
    let query = { userId: req.user._id };
    
    // Add text search if search query exists
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const notes = await Note.find(query).sort(req.query.search ? { score: { $meta: 'textScore' } } : { date: -1 });
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

// @desc    Create note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const { title, body, tags, date } = req.body;

    const note = await Note.create({
      userId: req.user._id,
      title,
      body,
      tags: tags || [],
      date: date || Date.now(),
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404);
      throw new Error('Note not found');
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedNote);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404);
      throw new Error('Note not found');
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await note.deleteOne();
    res.json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};
