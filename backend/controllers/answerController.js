const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');

// @route GET /api/answers/question/:questionId
const getAnswersByQuestion = async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate('author', 'username avatar reputation')
      .sort({ isAccepted: -1, createdAt: 1 });

    res.json({ answers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/answers/:questionId
const createAnswer = async (req, res) => {
  try {
    const { body } = req.body;
    if (!body) return res.status(400).json({ message: 'Answer body is required' });

    const question = await Question.findById(req.params.questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const answer = await Answer.create({
      body,
      question: req.params.questionId,
      author: req.user._id,
    });

    // Increment answer count on question
    await Question.findByIdAndUpdate(req.params.questionId, { $inc: { answerCount: 1 } });

    await answer.populate('author', 'username avatar reputation');

    res.status(201).json({ answer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/answers/:id/vote
const voteAnswer = async (req, res) => {
  try {
    const { type } = req.body; // 'up' or 'down'
    if (!['up', 'down'].includes(type)) {
      return res.status(400).json({ message: 'Vote type must be "up" or "down"' });
    }

    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    if (answer.author.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot vote on your own answer' });
    }

    const userId = req.user._id;
    const upField = 'upvotes';
    const downField = 'downvotes';
    const addField = type === 'up' ? upField : downField;
    const removeField = type === 'up' ? downField : upField;

    const alreadyVoted = answer[addField].some((id) => id.toString() === userId.toString());

    if (alreadyVoted) {
      // Toggle off
      await Answer.findByIdAndUpdate(req.params.id, { $pull: { [addField]: userId } });
    } else {
      // Add vote and remove opposite
      await Answer.findByIdAndUpdate(req.params.id, {
        $addToSet: { [addField]: userId },
        $pull: { [removeField]: userId },
      });

      // Update author reputation
      const repChange = type === 'up' ? 10 : -2;
      await User.findByIdAndUpdate(answer.author, { $inc: { reputation: repChange } });
    }

    const updated = await Answer.findById(req.params.id).populate(
      'author',
      'username avatar reputation'
    );

    res.json({ answer: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/answers/:id/accept
const acceptAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const question = await Question.findById(answer.question);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the question author can accept an answer' });
    }

    // Unaccept previous
    if (question.acceptedAnswer) {
      await Answer.findByIdAndUpdate(question.acceptedAnswer, { isAccepted: false });
    }

    const isTogglingOff = question.acceptedAnswer?.toString() === answer._id.toString();

    await Question.findByIdAndUpdate(answer.question, {
      acceptedAnswer: isTogglingOff ? null : answer._id,
    });

    await Answer.findByIdAndUpdate(answer._id, { isAccepted: !isTogglingOff });

    if (!isTogglingOff) {
      await User.findByIdAndUpdate(answer.author, { $inc: { reputation: 15 } });
    }

    const updated = await Answer.findById(req.params.id).populate(
      'author',
      'username avatar reputation'
    );

    res.json({ answer: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/answers/:id
const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    if (answer.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this answer' });
    }

    await Question.findByIdAndUpdate(answer.question, { $inc: { answerCount: -1 } });
    await answer.deleteOne();

    res.json({ message: 'Answer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAnswersByQuestion, createAnswer, voteAnswer, acceptAnswer, deleteAnswer };
