const express = require('express');
const router = express.Router();
const {
  getAnswersByQuestion,
  createAnswer,
  voteAnswer,
  acceptAnswer,
  deleteAnswer,
} = require('../controllers/answerController');
const { protect } = require('../middleware/auth');

router.get('/question/:questionId', getAnswersByQuestion);
router.post('/:questionId', protect, createAnswer);
router.post('/:id/vote', protect, voteAnswer);
router.post('/:id/accept', protect, acceptAnswer);
router.delete('/:id', protect, deleteAnswer);

module.exports = router;
