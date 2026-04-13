const surveyService = require('../services/survey.service');

async function create(req, res, next) {
  try {
    const survey = await surveyService.createSurvey(req.user.id, req.body);
    res.status(201).json({ survey });
  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  try {
    const surveys = await surveyService.getUserSurveys(req.user.id);
    res.json({ surveys });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const survey = await surveyService.getSurveyById(req.params.id, req.user.id);
    res.json({ survey });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const survey = await surveyService.updateSurvey(req.params.id, req.user.id, req.body);
    res.json({ survey });
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const survey = await surveyService.updateSurveyStatus(req.params.id, req.user.id, req.body.status);
    res.json({ survey });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await surveyService.deleteSurvey(req.params.id, req.user.id);
    res.json({ message: 'Survey deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { create, list, getById, update, updateStatus, remove };
