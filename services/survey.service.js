const Survey = require('../models/Survey');
const SurveyBuilder = require('../patterns/SurveyBuilder');

async function createSurvey(userId, data) {
  const builder = new SurveyBuilder(userId)
    .setTitle(data.title)
    .setDescription(data.description || '');

  if (data.settings) {
    builder.setSettings(data.settings);
  }

  if (data.questions && data.questions.length > 0) {
    for (const q of data.questions) {
      builder.addQuestion(q);
    }
  }

  const surveyData = builder.build();
  const survey = await Survey.create(surveyData);
  return survey;
}

async function getUserSurveys(userId) {
  return Survey.find({ createdBy: userId }).sort({ updatedAt: -1 });
}

async function getSurveyById(surveyId, userId) {
  const survey = await Survey.findOne({ _id: surveyId, createdBy: userId });
  if (!survey) {
    const error = new Error('Survey not found');
    error.statusCode = 404;
    throw error;
  }
  return survey;
}

async function updateSurvey(surveyId, userId, data) {
  const survey = await Survey.findOne({ _id: surveyId, createdBy: userId });
  if (!survey) {
    const error = new Error('Survey not found');
    error.statusCode = 404;
    throw error;
  }

  if (data.title !== undefined) survey.title = data.title;
  if (data.description !== undefined) survey.description = data.description;
  if (data.questions !== undefined) survey.questions = data.questions;
  if (data.settings !== undefined) {
    Object.assign(survey.settings, data.settings);
  }

  await survey.save();
  return survey;
}

async function updateSurveyStatus(surveyId, userId, status) {
  const survey = await Survey.findOne({ _id: surveyId, createdBy: userId });
  if (!survey) {
    const error = new Error('Survey not found');
    error.statusCode = 404;
    throw error;
  }

  if (status === 'active' && survey.questions.length === 0) {
    const error = new Error('Cannot publish a survey with no questions');
    error.statusCode = 400;
    throw error;
  }

  survey.status = status;
  await survey.save();
  return survey;
}

async function deleteSurvey(surveyId, userId) {
  const survey = await Survey.findOneAndDelete({ _id: surveyId, createdBy: userId });
  if (!survey) {
    const error = new Error('Survey not found');
    error.statusCode = 404;
    throw error;
  }
  return survey;
}

module.exports = {
  createSurvey,
  getUserSurveys,
  getSurveyById,
  updateSurvey,
  updateSurveyStatus,
  deleteSurvey,
};
