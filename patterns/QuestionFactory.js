// =============================================
// DESIGN PATTERN: Factory
// Purpose: Encapsulates the creation of different
// question types (MCQ, Text, Rating, NPS). Each
// type has its own default configuration and
// validation. Adding a new question type only
// requires adding one class and one case —
// demonstrating the Open/Closed Principle.
// =============================================

class Question {
  constructor(data) {
    this.type = data.type;
    this.text = data.text || '';
    this.required = data.required || false;
    this.order = data.order ?? 0;
  }

  toObject() {
    return {
      type: this.type,
      text: this.text,
      required: this.required,
      order: this.order,
    };
  }

  validate() {
    if (!this.text.trim()) {
      throw new Error('Question text is required');
    }
  }
}

class MCQQuestion extends Question {
  constructor(data) {
    super({ ...data, type: 'mcq' });
    this.options = data.options || ['Option 1', 'Option 2'];
  }

  toObject() {
    return { ...super.toObject(), options: this.options };
  }

  validate() {
    super.validate();
    if (!this.options || this.options.length < 2) {
      throw new Error('MCQ questions require at least 2 options');
    }
  }
}

class TextQuestion extends Question {
  constructor(data) {
    super({ ...data, type: 'text' });
  }
}

class RatingQuestion extends Question {
  constructor(data) {
    super({ ...data, type: 'rating' });
    this.maxRating = data.maxRating || 5;
  }

  toObject() {
    return { ...super.toObject(), maxRating: this.maxRating };
  }

  validate() {
    super.validate();
    if (this.maxRating < 2 || this.maxRating > 10) {
      throw new Error('Max rating must be between 2 and 10');
    }
  }
}

class NPSQuestion extends Question {
  constructor(data) {
    super({ ...data, type: 'nps' });
    this.npsLabels = {
      low: data.npsLabels?.low || 'Not likely',
      high: data.npsLabels?.high || 'Extremely likely',
    };
  }

  toObject() {
    return { ...super.toObject(), npsLabels: this.npsLabels };
  }
}

// --- Factory ---
class QuestionFactory {
  static create(type, data) {
    const types = {
      mcq: MCQQuestion,
      text: TextQuestion,
      rating: RatingQuestion,
      nps: NPSQuestion,
    };

    const QuestionClass = types[type];
    if (!QuestionClass) {
      throw new Error(`Unknown question type: ${type}`);
    }

    const question = new QuestionClass(data);
    question.validate();
    return question;
  }

  static getAvailableTypes() {
    return [
      { type: 'mcq', label: 'Multiple Choice', description: 'Let respondents pick from options' },
      { type: 'text', label: 'Text', description: 'Free-form text response' },
      { type: 'rating', label: 'Rating', description: 'Star or number rating scale' },
      { type: 'nps', label: 'Net Promoter Score', description: 'How likely to recommend (0-10)' },
    ];
  }
}

module.exports = QuestionFactory;
