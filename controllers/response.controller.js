const responseService = require('../services/response.service');

async function getPublicSurvey(req, res, next) {
  try {
    const survey = await responseService.getPublicSurvey(req.params.id);
    res.json({ survey });
  } catch (error) {
    next(error);
  }
}

async function submit(req, res, next) {
  try {
    const { surveyId, answers } = req.body;
    const meta = { userAgent: req.headers['user-agent'] };
    const response = await responseService.submitResponse(surveyId, answers, meta);
    res.status(201).json({ response });
  } catch (error) {
    next(error);
  }
}

async function listBySurvey(req, res, next) {
  try {
    const data = await responseService.getSurveyResponses(req.params.id, req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = { getPublicSurvey, submit, listBySurvey };
