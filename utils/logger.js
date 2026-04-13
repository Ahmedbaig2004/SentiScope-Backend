// =============================================
// DESIGN PATTERN: Singleton
// Purpose: Ensures a single Logger instance is
// shared across the entire application, providing
// consistent logging behavior.
// =============================================

class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }
    Logger.instance = this;
  }

  _format(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  info(message) {
    console.log(this._format('INFO', message));
  }

  warn(message) {
    console.warn(this._format('WARN', message));
  }

  error(message) {
    console.error(this._format('ERROR', message));
  }

  debug(message) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(this._format('DEBUG', message));
    }
  }
}

module.exports = new Logger();
