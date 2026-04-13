const Survey = require('../models/Survey');
const Response = require('../models/Response');
const surveyEvents = require('../patterns/EventEmitter');

async function getPublicSurvey(surveyId) {
  const survey = await Survey.findById(surveyId);
  if (!survey) {
    const error = new Error('Survey not found');
    error.statusCode = 404;
    throw error;
  }
  if (survey.status !== 'active') {
    const error = new Error('This survey is not currently active');
    error.statusCode = 403;
    throw error;
  }
  return survey;
}

async function submitResponse(surveyId, answers, meta) {
  const survey = await Survey.findById(surveyId);
  if (!survey || survey.status !== 'active') {
    const error = new Error('Survey not found or not active');
    error.statusCode = 404;
    throw error;
  }

  // Validate required questions are answered
  const requiredIds = survey.questions
    .filter((q) => q.required)
    .map((q) => q._id.toString());

  const answeredIds = answers.map((a) => a.questionId);

  const missing = requiredIds.filter((id) => !answeredIds.includes(id));
  if (missing.length > 0) {
    const error = new Error('Please answer all required questions');
    error.statusCode = 400;
    throw error;
  }

  const response = await Response.create({
    surveyId,
    answers,
    meta: { ...meta, completedAt: new Date() },
    finished: true,
  });

  // Observer Pattern: emit event — listeners handle side effects independently
  surveyEvents.emit('response:submitted', response);

  return response;
}

async function getSurveyResponses(surveyId, userId) {
  const survey = await Survey.findOne({ _id: surveyId, createdBy: userId });
  if (!survey) {
    const error = new Error('Survey not found');
    error.statusCode = 404;
    throw error;
  }

  const responses = await Response.find({ surveyId }).sort({ createdAt: -1 });
  return { survey, responses };
}

module.exports = { getPublicSurvey, submitResponse, getSurveyResponses };
