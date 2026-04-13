// =============================================
// DESIGN PATTERN: Chain of Responsibility
// Purpose: Validates request body against a schema
// before passing to the next handler. If validation
// fails, the chain stops here with a 400 response.
// =============================================

function validate(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value !== undefined && rules.type) {
        if (rules.type === 'string' && typeof value !== 'string') {
          errors.push(`${field} must be a string`);
        }
        if (rules.type === 'number' && typeof value !== 'number') {
          errors.push(`${field} must be a number`);
        }
        if (rules.type === 'array' && !Array.isArray(value)) {
          errors.push(`${field} must be an array`);
        }
      }

      if (value && rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }

      if (value && rules.match && !rules.match.test(value)) {
        errors.push(`${field} format is invalid`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  };
}

module.exports = validate;
