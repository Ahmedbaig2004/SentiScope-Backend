const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'text', 'rating', 'nps'],
    required: true,
  },
  text: { type: String, required: true },
  required: { type: Boolean, default: false },
  order: { type: Number, required: true },
  options: [{ type: String }],
  maxRating: { type: Number, default: 5 },
  npsLabels: {
    low: { type: String, default: 'Not likely' },
    high: { type: String, default: 'Extremely likely' },
  },
});

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['customer_feedback', 'employee', 'product', 'education', 'general'],
    required: true,
  },
  icon: { type: String, default: '📋' },
  questions: [questionSchema],
  isDefault: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Template', templateSchema);
