const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Question title is required'],
      trim: true,
      minlength: [10, 'Title must be at least 10 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    body: {
      type: String,
      required: [true, 'Question body is required'],
      minlength: [20, 'Body must be at least 20 characters'],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags) => tags.length <= 5,
        message: 'Cannot have more than 5 tags',
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    answerCount: {
      type: Number,
      default: 0,
    },
    acceptedAnswer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
      default: null,
    },
  },
  { timestamps: true }
);

// Text index for search
questionSchema.index({ title: 'text', body: 'text', tags: 'text' });

module.exports = mongoose.model('Question', questionSchema);
