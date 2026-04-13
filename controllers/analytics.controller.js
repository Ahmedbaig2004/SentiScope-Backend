const analyticsService = require('../services/analytics.service');

async function getSurveyAnalytics(req, res, next) {
  try {
    const data = await analyticsService.getSurveyAnalytics(req.params.id, req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = { getSurveyAnalytics };
