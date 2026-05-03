// DESIGN PATTERN: Singleton
// Purpose: Ensures VaderSentiment is loaded once and reused.
// Mirrors the pattern in utils/logger.js.

const Vader = require('vader-sentiment');
const logger = require('../utils/logger');

class SentimentService {
  constructor() {
    if (SentimentService.instance) return SentimentService.instance;
    // VADER needs no initialization — intensity analyzer is stateless
    SentimentService.instance = this;
    logger.info('SentimentService initialized (VADER)');
  }

  analyze(text) {
    if (!text || typeof text !== 'string') return null;

    const result = Vader.SentimentIntensityAnalyzer.polarity_scores(text);
    // result = { neg: 0.0, neu: 0.6, pos: 0.4, compound: 0.75 }
    // compound is the key score: -1 (most negative) to +1 (most positive)

    const score = result.compound;
    const label = score >= 0.05 ? 'positive'
                : score <= -0.05 ? 'negative'
                : 'neutral';

    return { score, label, tokenCount: text.split(' ').length };
  }

  analyzeAll(texts) {
    if (!Array.isArray(texts)) return [];
    return texts.map(text => ({ text, sentiment: this.analyze(text) }));
  }
}

module.exports = new SentimentService();