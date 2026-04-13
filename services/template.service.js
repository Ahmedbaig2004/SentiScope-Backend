const Template = require('../models/Template');
const Survey = require('../models/Survey');
const SurveyBuilder = require('../patterns/SurveyBuilder');

async function getAllTemplates() {
  return Template.find().sort({ createdAt: 1 });
}

async function getTemplateById(templateId) {
  const template = await Template.findById(templateId);
  if (!template) {
    const error = new Error('Template not found');
    error.statusCode = 404;
    throw error;
  }
  return template;
}

async function cloneTemplate(templateId, userId) {
  const template = await getTemplateById(templateId);

  // Use the Builder pattern to construct the survey from the template
  const builder = new SurveyBuilder(userId)
    .setTitle(template.name)
    .setDescription(template.description)
    .setClonedFrom(template._id);

  for (const q of template.questions) {
    builder.addQuestion(q.toObject ? q.toObject() : q);
  }

  const surveyData = builder.build();
  const survey = await Survey.create(surveyData);
  return survey;
}

module.exports = { getAllTemplates, getTemplateById, cloneTemplate };
