const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, 'Answer body is required'],
      minlength: [10, 'Answer must be at least 10 characters'],
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    upvotes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    downvotes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Virtual for vote score
answerSchema.virtual('voteScore').get(function () {
  return this.upvotes.length - this.downvotes.length;
});

answerSchema.set('toJSON', { virtuals: true });
answerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Answer', answerSchema);
