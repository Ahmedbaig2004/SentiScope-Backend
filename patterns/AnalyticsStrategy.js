// =============================================
// DESIGN PATTERN: Strategy
// Purpose: Each question type requires a different
// analytics algorithm. Strategy encapsulates each
// algorithm behind a common aggregate(answers)
// interface, eliminating a giant switch/if-else.
// When sentiment analysis is added later, only
// TextAggregationStrategy changes — nothing else.
// =============================================

// --- Concrete Strategies ---

class MCQAggregationStrategy {
  aggregate(question, answers) {
    const counts = {};
    (question.options || []).forEach((opt) => { counts[opt] = 0; });

    answers.forEach((a) => {
      if (a.value && counts[a.value] !== undefined) {
        counts[a.value]++;
      }
    });

    const total = answers.length;
    const data = Object.entries(counts).map(([label, count]) => ({
      label,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));

    return { type: 'mcq', total, data };
  }
}

class RatingAggregationStrategy {
  aggregate(question, answers) {
    const max = question.maxRating || 5;
    const validAnswers = answers.filter((a) => typeof a.value === 'number');
    const total = validAnswers.length;
    const sum = validAnswers.reduce((acc, a) => acc + a.value, 0);
    const average = total > 0 ? Math.round((sum / total) * 10) / 10 : 0;

    // Build distribution histogram
    const distribution = {};
    for (let i = 1; i <= max; i++) distribution[i] = 0;
    validAnswers.forEach((a) => {
      if (distribution[a.value] !== undefined) distribution[a.value]++;
    });

    const data = Object.entries(distribution).map(([rating, count]) => ({
      label: `${rating}`,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));

    return { type: 'rating', total, average, max, data };
  }
}

class NPSAggregationStrategy {
  aggregate(question, answers) {
    const validAnswers = answers.filter((a) => typeof a.value === 'number');
    const total = validAnswers.length;

    let promoters = 0, passives = 0, detractors = 0;
    validAnswers.forEach((a) => {
      if (a.value >= 9) promoters++;
      else if (a.value >= 7) passives++;
      else detractors++;
    });

    const npsScore = total > 0
      ? Math.round(((promoters - detractors) / total) * 100)
      : 0;

    const data = [
      { label: 'Promoters (9-10)', count: promoters, percentage: total > 0 ? Math.round((promoters / total) * 100) : 0 },
      { label: 'Passives (7-8)', count: passives, percentage: total > 0 ? Math.round((passives / total) * 100) : 0 },
      { label: 'Detractors (0-6)', count: detractors, percentage: total > 0 ? Math.round((detractors / total) * 100) : 0 },
    ];

    return { type: 'nps', total, npsScore, promoters, passives, detractors, data };
  }
}

class TextAggregationStrategy {
  aggregate(question, answers) {
    const texts = answers
      .map((a) => a.value)
      .filter((v) => typeof v === 'string' && v.trim().length > 0);

    // Future: plug in sentiment analysis here
    // const sentimentResults = await sentimentAnalyzer.analyzeAll(texts);

    return { type: 'text', total: texts.length, data: texts };
  }
}

// --- Context: selects the right strategy by question type ---
const strategies = {
  mcq: new MCQAggregationStrategy(),
  rating: new RatingAggregationStrategy(),
  nps: new NPSAggregationStrategy(),
  text: new TextAggregationStrategy(),
};

function aggregateQuestion(question, answers) {
  const strategy = strategies[question.type];
  if (!strategy) {
    throw new Error(`No aggregation strategy for question type: ${question.type}`);
  }
  return strategy.aggregate(question, answers);
}

module.exports = { aggregateQuestion };
