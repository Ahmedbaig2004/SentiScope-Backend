const connectDB = require('../config/db');
const Template = require('../models/Template');
const logger = require('../utils/logger');

const templates = [
  {
    name: 'Customer Satisfaction (CSAT)',
    description: 'Measure how satisfied customers are with your product or service.',
    category: 'customer_feedback',
    icon: '😊',
    questions: [
      {
        type: 'rating',
        text: 'How satisfied are you with our service overall?',
        required: true,
        order: 0,
        maxRating: 5,
      },
      {
        type: 'mcq',
        text: 'Which area needs the most improvement?',
        required: false,
        order: 1,
        options: ['Speed', 'Quality', 'Support', 'Pricing', 'Other'],
      },
      {
        type: 'text',
        text: 'Any additional comments or suggestions?',
        required: false,
        order: 2,
      },
    ],
  },
  {
    name: 'Net Promoter Score (NPS)',
    description: 'Find out how likely your customers are to recommend you.',
    category: 'customer_feedback',
    icon: '📊',
    questions: [
      {
        type: 'nps',
        text: 'How likely are you to recommend us to a friend or colleague?',
        required: true,
        order: 0,
        npsLabels: { low: 'Not at all likely', high: 'Extremely likely' },
      },
      {
        type: 'text',
        text: 'What is the main reason for your score?',
        required: false,
        order: 1,
      },
      {
        type: 'mcq',
        text: 'How long have you been a customer?',
        required: false,
        order: 2,
        options: ['Less than 1 month', '1–6 months', '6–12 months', 'Over a year'],
      },
    ],
  },
  {
    name: 'Employee Feedback',
    description: 'Collect honest feedback from your team about work environment and culture.',
    category: 'employee',
    icon: '👥',
    questions: [
      {
        type: 'rating',
        text: 'How satisfied are you with your current role?',
        required: true,
        order: 0,
        maxRating: 5,
      },
      {
        type: 'mcq',
        text: 'What best describes your team collaboration?',
        required: true,
        order: 1,
        options: ['Excellent', 'Good', 'Average', 'Needs improvement'],
      },
      {
        type: 'text',
        text: 'What is one thing we could do to improve your work experience?',
        required: false,
        order: 2,
      },
      {
        type: 'nps',
        text: 'How likely are you to recommend this company as a great place to work?',
        required: false,
        order: 3,
        npsLabels: { low: 'Not likely', high: 'Extremely likely' },
      },
    ],
  },
  {
    name: 'Course Evaluation',
    description: 'Gather student feedback to improve your course content and delivery.',
    category: 'education',
    icon: '🎓',
    questions: [
      {
        type: 'rating',
        text: 'How would you rate the overall course quality?',
        required: true,
        order: 0,
        maxRating: 5,
      },
      {
        type: 'rating',
        text: 'How clear and organized was the course material?',
        required: true,
        order: 1,
        maxRating: 5,
      },
      {
        type: 'mcq',
        text: 'How did you find the course difficulty?',
        required: false,
        order: 2,
        options: ['Too easy', 'Just right', 'Slightly challenging', 'Too difficult'],
      },
      {
        type: 'text',
        text: 'What topics would you like to see added or expanded?',
        required: false,
        order: 3,
      },
    ],
  },
  {
    name: 'Quick Poll',
    description: 'A simple single-question poll to get fast opinions from your audience.',
    category: 'general',
    icon: '⚡',
    questions: [
      {
        type: 'mcq',
        text: 'What is your preferred option?',
        required: true,
        order: 0,
        options: ['Option A', 'Option B', 'Option C', 'None of the above'],
      },
    ],
  },
];

async function seed() {
  await connectDB();
  const count = await Template.countDocuments();
  if (count > 0) {
    logger.info(`Templates already seeded (${count} found). Skipping.`);
    process.exit(0);
  }
  await Template.insertMany(templates);
  logger.info(`Seeded ${templates.length} templates successfully.`);
  process.exit(0);
}

// Auto-seed function (called from server on startup)
async function autoSeed() {
  const count = await Template.countDocuments();
  if (count === 0) {
    await Template.insertMany(templates);
    logger.info(`Auto-seeded ${templates.length} templates.`);
  }
}

module.exports = { autoSeed };

// Run directly: node seeds/templates.seed.js
if (require.main === module) {
  seed();
}
