const Survey = require('../models/Survey');
const Response = require('../models/Response');
const { aggregateQuestion } = require('../patterns/AnalyticsStrategy');

async function getSurveyAnalytics(surveyId, userId) {
  const survey = await Survey.findOne({ _id: surveyId, createdBy: userId });
  if (!survey) {
    const error = new Error('Survey not found');
    error.statusCode = 404;
    throw error;
  }

  const responses = await Response.find({ surveyId, finished: true });
  const totalResponses = responses.length;

  // For each question, extract its answers and apply the correct Strategy
  const questionAnalytics = survey.questions.map((question) => {
    const answers = responses.flatMap((r) =>
      r.answers.filter((a) => a.questionId.toString() === question._id.toString())
    );

    const result = aggregateQuestion(question, answers);

    return {
      questionId: question._id,
      questionText: question.text,
      questionType: question.type,
      ...result,
    };
  });

  return {
    surveyId,
    surveyTitle: survey.title,
    surveyStatus: survey.status,
    totalResponses,
    questions: questionAnalytics,
  };
}

module.exports = { getSurveyAnalytics };
