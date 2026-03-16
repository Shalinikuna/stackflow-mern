const Question = require('../models/Question');

// @route GET /api/questions
const getQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tag } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (tag) {
      query.tags = tag.toLowerCase();
    }

    const total = await Question.countDocuments(query);
    const questions = await Question.find(query)
      .populate('author', 'username avatar reputation')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      questions,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/questions/:id
const getQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'username avatar reputation');

    if (!question) return res.status(404).json({ message: 'Question not found' });

    res.json({ question });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/questions
const createQuestion = async (req, res) => {
  try {
    const { title, body, tags } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    const normalizedTags = (tags || []).map((t) => t.toLowerCase().trim());

    const question = await Question.create({
      title,
      body,
      tags: normalizedTags,
      author: req.user._id,
    });

    await question.populate('author', 'username avatar reputation');

    res.status(201).json({ question });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/questions/:id
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this question' });
    }

    const { title, body, tags } = req.body;
    if (title) question.title = title;
    if (body) question.body = body;
    if (tags) question.tags = tags.map((t) => t.toLowerCase().trim());

    await question.save();
    await question.populate('author', 'username avatar reputation');

    res.json({ question });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/questions/:id
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this question' });
    }

    await question.deleteOne();
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getQuestions, getQuestion, createQuestion, updateQuestion, deleteQuestion };
