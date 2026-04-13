const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { port, frontendUrl } = require('./config/env');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const { autoSeed } = require('./seeds/templates.seed');

const authRoutes = require('./routes/auth.routes');
const surveyRoutes = require('./routes/survey.routes');
const templateRoutes = require('./routes/template.routes');
const responseRoutes = require('./routes/response.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

// Middleware chain (Chain of Responsibility)
app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api', responseRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (final link in the chain)
app.use(errorHandler);

async function start() {
  await connectDB();
  await autoSeed();
  app.listen(port, () => {
    logger.info(`SentiScope API running on port ${port}`);
  });
}

start();
