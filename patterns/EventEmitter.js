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

// Future Listener 3 (placeholder for sentiment analysis):
// surveyEvents.on('response:submitted', async (response) => {
//   const textAnswers = response.answers.filter(a => a.type === 'text');
//   for (const answer of textAnswers) {
//     const score = await sentimentAnalyzer.analyze(answer.value);
//     await Response.findByIdAndUpdate(response._id, { ... });
//   }
// });

module.exports = surveyEvents;
