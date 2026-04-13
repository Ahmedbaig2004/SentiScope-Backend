// =============================================
// DESIGN PATTERN: Builder
// Purpose: Constructs complex Survey objects
// step-by-step using a fluent API. Avoids
// telescoping constructors and unifies the
// template-cloning and custom-creation flows
// behind the same builder interface.
// =============================================

const QuestionFactory = require('./QuestionFactory');

class SurveyBuilder {
  constructor(userId) {
    this.survey = {
      createdBy: userId,
      title: 'Untitled Survey',
      description: '',
      status: 'draft',
      questions: [],
      settings: {
        allowAnonymous: true,
        showProgressBar: true,
        welcomeMessage: '',
        endingMessage: 'Thank you for your response!',
      },
    };
  }

  setTitle(title) {
    this.survey.title = title;
    return this;
  }

  setDescription(description) {
    this.survey.description = description;
    return this;
  }

  setStatus(status) {
    this.survey.status = status;
    return this;
  }

  addQuestion(questionData) {
    const question = QuestionFactory.create(questionData.type, {
      ...questionData,
      order: questionData.order ?? this.survey.questions.length,
    });
    this.survey.questions.push(question.toObject());
    return this;
  }

  setSettings(settings) {
    this.survey.settings = { ...this.survey.settings, ...settings };
    return this;
  }

  setClonedFrom(templateId) {
    this.survey.clonedFrom = templateId;
    return this;
  }

  build() {
    if (!this.survey.title.trim()) {
      throw new Error('Survey title is required');
    }
    if (!this.survey.createdBy) {
      throw new Error('Survey must have a creator');
    }
    return { ...this.survey };
  }
}

module.exports = SurveyBuilder;
