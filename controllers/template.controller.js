const templateService = require('../services/template.service');

async function list(req, res, next) {
  try {
    const templates = await templateService.getAllTemplates();
    res.json({ templates });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const template = await templateService.getTemplateById(req.params.id);
    res.json({ template });
  } catch (error) {
    next(error);
  }
}

async function clone(req, res, next) {
  try {
    const survey = await templateService.cloneTemplate(req.params.id, req.user.id);
    res.status(201).json({ survey });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, clone };
