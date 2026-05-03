// =============================================
// DESIGN PATTERN: Observer
// Purpose: Decouples "something happened" from
// "what to do about it." When a response is
// submitted, the controller emits an event.
// Any number of listeners can react independently
// (update counts, log, future: sentiment analysis).
// Adding sentiment analysis = one new listener,
// zero changes to existing code.
// =============================================

const EventEmitter = require('events');
const logger = require('../utils/logger');
const Survey = require('../models/Survey');
const Response = require('../models/Response');
const sentimentService = require('../services/sentiment.service');

const surveyEvents = new EventEmitter();

// Listener 1: Increment survey response count
surveyEvents.on('response:submitted', async (response) => {
  try {
    await Survey.findByIdAndUpdate(response.surveyId, {
      $inc: { responseCount: 1 },
    });
    logger.info(`Response count incremented for survey ${response.surveyId}`);
  } catch (error) {
    logger.error(`Failed to increment response count: ${error.message}`);
  }
});

// Listener 2: Log the event (audit trail)
surveyEvents.on('response:submitted', (response) => {
  logger.info(`New response submitted for survey ${response.surveyId} at ${new Date().toISOString()}`);
});

// Listener 3: Sentiment analysis on text answers (Observer — zero changes to response.service.js)
surveyEvents.on('response:submitted', async (response) => {
  try {
    const textAnswers = response.answers.filter((a) => typeof a.value === 'string');

    if (textAnswers.length === 0) {
      return;
    }

    for (const answer of textAnswers) {
      const sentiment = sentimentService.analyze(answer.value);

      await Response.updateOne(
        { _id: response._id },
        { $set: { 'answers.$[elem].sentiment': sentiment } },
        { arrayFilters: [{ 'elem.questionId': answer.questionId }] }
      );
    }

    logger.info(`Sentiment analysis stored for response ${response._id}`);
  } catch (error) {
    logger.error(`Failed to analyze sentiment for response ${response._id}: ${error.message}`);
  }
});

module.exports = surveyEvents;
