const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'text', 'rating', 'nps'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    required: true,
  },
  // MCQ-specific
  options: [{ type: String }],
  // Rating-specific
  maxRating: {
    type: Number,
    default: 5,
  },
  // NPS-specific
  npsLabels: {
    low: { type: String, default: 'Not likely' },
    high: { type: String, default: 'Extremely likely' },
  },
});

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed'],
    default: 'draft',
  },
  questions: [questionSchema],
  settings: {
    allowAnonymous: { type: Boolean, default: true },
    showProgressBar: { type: Boolean, default: true },
    welcomeMessage: { type: String, default: '' },
    endingMessage: { type: String, default: 'Thank you for your response!' },
  },
  responseCount: {
    type: Number,
    default: 0,
  },
  clonedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

surveySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Survey', surveySchema);
